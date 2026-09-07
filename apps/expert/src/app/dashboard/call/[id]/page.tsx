"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { callSocket } from "@/lib/socket";
import { api } from "@/lib/api";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";
import { SummaryModal } from "@/components/common/SummaryModal";
import { getErrorMessage } from "@repo/lib/utils/error";

const { PhoneOff, Mic, MicOff, Video, VideoOff, User, Clock, Volume2 } = LucideIcons as any;

type CallStatus = 'connecting' | 'connected' | 'ended';

export default function ExpertCallRoom() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const [status, setStatus] = useState<CallStatus>('connecting');
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [sessionData, setSessionData] = useState<any>(null);
    const sessionDataRef = useRef<any>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [errorInfo, setErrorInfo] = useState<string | null>(null);
    const [debugLogs, setDebugLogs] = useState<string[]>([]);

    const addLog = (msg: string) => {
        const ts = new Date().toLocaleTimeString('en-IN');
        const entry = `[${ts}] ${msg}`;
        console.log(entry);
        setDebugLogs(prev => [...prev.slice(-20), entry]);
    };

    const setError = (msg: string) => {
        addLog('❌ ERROR: ' + msg);
        setErrorInfo(msg);
    };

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const deviceRef = useRef<any>(null);
    const callRef = useRef<any>(null); // Store active call object for mute/unmute

    const checkHardwareAndNetwork = async () => {
        if (!navigator.onLine) {
            throw new Error("No internet connection. Please check your network.");
        }
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasMic = devices.some(device => device.kind === 'audioinput');
            if (!hasMic) {
                throw new Error("No microphone detected. Please connect a mic to continue.");
            }
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                throw new Error("Microphone permission denied. Access is required for calls.");
            }
            throw new Error(getErrorMessage(err) || "Microphone access failed.");
        }
    };

    useEffect(() => {
        let cancelled = false;

        const acceptAndConnect = async () => {
            addLog('🚀 Starting call accept flow for sessionId: ' + sessionId);
            
            // Pre-check hardware
            try {
                addLog('🔍 Checking hardware & network...');
                await checkHardwareAndNetwork();
                addLog('✅ Hardware check passed');
            } catch (hwErr: any) {
                if (cancelled) return;
                const msg = getErrorMessage(hwErr) || 'Hardware check failed';
                setError('Hardware check failed: ' + msg);
                toast.error(msg);
                return;
            }
            
            if (cancelled) { return; }

            // Step 1: Accept call via REST API → get Twilio token for expert
            addLog('📡 Calling /call/accept API...');
            let data: any, error: any;
            try {
                [data, error] = await api.post<any>('/call/accept', {
                    sessionId,
                });
            } catch (apiEx: any) {
                const msg = getErrorMessage(apiEx) || 'API call threw exception';
                setError('API exception: ' + msg);
                return;
            }

            if (error) {
                if (cancelled) return;
                const msg = getErrorMessage(error) || 'Failed to join call';
                setError('/call/accept failed: ' + msg + ' | raw: ' + JSON.stringify(error));
                toast.error(msg);
                return;
            }

            addLog('✅ /call/accept OK. data keys: ' + Object.keys(data || {}).join(', '));

            if (cancelled) { return; }

            if (!data?.token) {
                const msg = 'No Twilio token received. data=' + JSON.stringify(data);
                setError(msg);
                toast.error('No token received from server');
                return;
            }

            setSessionData(data.session);
            sessionDataRef.current = data.session;
            addLog('✅ Session data set. Joining socket room...');

            // Step 2: Join socket room so user gets notified
            callSocket.emit('join_call_room', { sessionId });
            addLog('📡 Socket room joined. Initializing Twilio device...');

            // Step 3: Init Twilio Device
            try {
                await initTwilioDevice(data.token);
                addLog('✅ Twilio device initialized');
            } catch (twilioErr: any) {
                const msg = getErrorMessage(twilioErr) || 'Twilio init failed';
                setError('Twilio init error: ' + msg);
            }
        };

        acceptAndConnect();

        callSocket.on('call_ended', (data: any) => handleCallEnded(data));

        return () => {
            cancelled = true;
            if (timerRef.current) clearInterval(timerRef.current);
            if (deviceRef.current) {
                deviceRef.current.destroy();
                deviceRef.current = null;
            }
            callSocket.off('call_ended');
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const initTwilioDevice = async (token: string) => {
        // Safety guard — don't create a second device if one already exists
        if (deviceRef.current) {
            addLog('⚠️ Device already initialized, skipping.');
            return;
        }

        addLog('📦 Importing @twilio/voice-sdk...');
        const { Device } = await import('@twilio/voice-sdk');
        addLog('✅ SDK imported. Creating Device...');

        const device = new Device(token, {
            logLevel: 1,
            codecPreferences: ['opus', 'pcmu'] as any,
        });

        deviceRef.current = device;

        device.on('connect', (call: any) => {
            addLog('✅ Device connected!');
            toast.success('Connected! Call is live.');
            setStatus('connected');
            startTimer();
        });

        device.on('disconnect', (call: any) => {
            addLog('📴 Device disconnected');
        });

        device.on('error', (err: any) => {
            const msg = `code=${err.code} msg=${err.message}`;
            addLog('❌ Device error: ' + msg);
            setError('Twilio Device error: ' + msg);
            toast.error(`Call error: ${getErrorMessage(err)}`);
        });

        addLog('📡 Registering device...');
        await device.register();
        addLog('✅ Device registered. Connecting to call...');

        const call = await device.connect({ params: { sessionId } });
        callRef.current = call;
        addLog('✅ device.connect() called successfully');

        call.on('accept', (call: any) => {
            addLog('✅ call:accept fired!');
            toast.success('Connected! Call is live.');
            setStatus('connected');
            startTimer();
        });
        call.on('disconnect', () => { addLog('📴 call:disconnect'); handleCallEnded(); });
        call.on('cancel', () => { addLog('🚫 call:cancel'); handleCallEnded(); });
        call.on('error', (err: any) => {
            const msg = getErrorMessage(err);
            addLog('❌ call:error: ' + msg);
            setError('Call error: ' + msg);
            toast.error(`Call error: ${msg}`);
            handleCallEnded();
        });
    };

    const startTimer = () => {
        if (timerRef.current) return;
        const start_time = sessionDataRef.current?.start_time;
        const startMs = start_time ? new Date(start_time).getTime() : Date.now();
        
        setCallDuration(Math.floor((Date.now() - startMs) / 1000));
        timerRef.current = setInterval(() => {
            setCallDuration(Math.floor((Date.now() - startMs) / 1000));
        }, 1000);
    };

    const handleCallEnded = (data?: any) => {
        setStatus('ended');
        if (timerRef.current) clearInterval(timerRef.current);
        if (deviceRef.current) {
            deviceRef.current.destroy();
            deviceRef.current = null;
        }

        // Handle standardized V2.1 object or legacy summary string
        if (data && typeof data === 'object' && (data.terminatedBy || data.split)) {
            setSummaryData(data);
            setShowSummary(true);
        } else if (data?.summary) {
            setSummaryData(data.summary);
            setShowSummary(true);
        } else if (typeof data === 'string' && data.split(':').length >= 3) {
            setSummaryData(data);
            setShowSummary(true);
        } else {
            toast.info('Session ended');
            setTimeout(() => router.push('/dashboard'), 3000);
        }
    };

    const handleEndCall = async () => {
        const [data, error] = await api.post<any>(`/call/end`, { 
            sessionId,
            endedBy: 'EXPERT',
            reason: 'Expert clicked end button'
        });
        if (error) {
            console.error('[ExpertCallRoom] Failed to end call on backend', getErrorMessage(error));
        }
        deviceRef.current?.disconnectAll?.();
        callSocket.emit('end_call', { sessionId });
        handleCallEnded(data);
    };

    const toggleMute = () => {
        if (callRef.current) {
            callRef.current.mute(!isMuted);
        } else {
            console.warn('[ExpertCallRoom] ⚠️ No active call to mute.');
        }
        setIsMuted(!isMuted);
    };

    const formatDuration = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    // ── ERROR SCREEN (shows instead of white screen) ──
    if (errorInfo) {
        return (
            <div className="min-h-[calc(100vh-150px)] bg-neutral-900 rounded-[3rem] text-white flex flex-col p-6 gap-4 overflow-auto">
                <div className="bg-red-500/20 border border-red-500/50 rounded-2xl p-4">
                    <h2 className="text-red-400 font-black text-lg mb-2">❌ Error Occurred</h2>
                    <p className="text-white/80 text-sm font-mono break-all">{errorInfo}</p>
                </div>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-4 flex-1">
                    <h3 className="text-white/50 font-black text-xs uppercase tracking-widest mb-3">Debug Logs</h3>
                    <div className="flex flex-col gap-1">
                        {debugLogs.map((log, i) => (
                            <p key={i} className="text-white/60 text-xs font-mono break-all">{log}</p>
                        ))}
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => { setErrorInfo(null); setDebugLogs([]); setStatus('connecting'); }}
                        className="flex-1 bg-orange-500 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
                    >
                        Retry
                    </button>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="flex-1 bg-white/10 text-white py-3 rounded-2xl font-black text-xs uppercase tracking-widest"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-150px)] bg-neutral-900 rounded-[3rem] text-white flex flex-col items-center justify-center p-8 relative overflow-hidden shadow-2xl">
            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#fd6410,transparent_70%)] animate-pulse" />
            </div>

            <div className="z-10 w-full max-w-2xl flex flex-col items-center gap-10">
                {/* Caller Info */}
                <div className="flex flex-col items-center gap-3">
                    <div className="w-24 h-24 rounded-full bg-neutral-800 border-4 border-primary/20 flex items-center justify-center overflow-hidden">
                        {(sessionData?.client?.user?.avatar || sessionData?.user?.avatar || sessionData?.user?.image || sessionData?.client?.profile_picture)
                            ? <img src={sessionData?.client?.user?.avatar || sessionData?.user?.avatar || sessionData?.user?.image || sessionData?.client?.profile_picture} alt="Client" className="w-full h-full object-cover" />
                            : <User className="w-10 h-10 text-neutral-600" />
                        }
                    </div>
                    <h2 className="text-3xl font-black">{sessionData?.client?.user?.name || sessionData?.user?.name || 'Client User'}</h2>
                    <div className="flex items-center gap-2 text-primary text-xs font-black uppercase tracking-widest">
                        {status === 'connecting' && <span className="animate-pulse">Connecting...</span>}
                        {status === 'connected' && (
                            <>
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span>Live · {formatDuration(callDuration)}</span>
                            </>
                        )}
                        {status === 'ended' && <span className="text-red-400">Session ended</span>}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 w-full max-w-md">
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col items-center gap-1">
                        <Clock className="w-4 h-4 text-white/50" />
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Elapsed</span>
                        <span className="text-lg font-black">{formatDuration(callDuration)}</span>
                    </div>
                    <div className="bg-primary/10 border border-primary/20 rounded-[2rem] p-4 flex flex-col items-center gap-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-[9px] text-primary/70 font-black uppercase tracking-widest">{sessionData?.is_free ? 'Free Time' : 'Time Left'}</span>
                        <span className="text-lg font-black text-primary">{formatDuration(Math.max(0, (sessionData?.max_duration_seconds || 300) - callDuration))}</span>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col items-center gap-1">
                        <Volume2 className="w-4 h-4 text-green-400" />
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Rate</span>
                        <span className="text-lg font-black">₹{sessionData?.price_per_minute || 0}/min</span>
                    </div>
                </div>

                {/* Controls */}
                {status !== 'ended' && (
                    <div className="flex items-center gap-8">
                        <button
                            onClick={toggleMute}
                            className={`w-16 h-16 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            {isMuted ? <MicOff className="w-7 h-7" /> : <Mic className="w-7 h-7" />}
                        </button>

                        <button
                            onClick={handleEndCall}
                            className="w-24 h-24 rounded-full bg-red-500 shadow-2xl shadow-red-500/40 flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                        >
                            <PhoneOff className="w-12 h-12" />
                        </button>

                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center opacity-30 cursor-not-allowed">
                            <Video className="w-7 h-7" />
                        </div>
                    </div>
                )}

                {status === 'ended' && (
                    <p className="text-neutral-500 animate-pulse font-bold uppercase text-xs tracking-widest">Returning to dashboard...</p>
                )}
            </div>

            <div className="absolute bottom-6 text-[9px] text-white/15 font-black uppercase tracking-[0.5em]">🔒 Secure Encrypted Session</div>

            <SummaryModal 
                isOpen={showSummary && !!summaryData} 
                data={(() => {
                    if (summaryData && typeof summaryData === 'object') {
                        return {
                            totalAmount: (summaryData as any).split?.totalCost || 0,
                            platformFee: (summaryData as any).split?.platformFee || 0,
                            expertShare: (summaryData as any).split?.expertShare || 0,
                            terminatedBy: (summaryData as any).terminatedBy || 'N/A'
                        };
                    }
                    const [totalAmount, platformFee, expertShare, terminatedBy] = (summaryData || "").toString().split(':');
                    return { totalAmount, platformFee, expertShare, terminatedBy };
                })()} 
                title="Call Session Ended"
            />
        </div>
    );
}
