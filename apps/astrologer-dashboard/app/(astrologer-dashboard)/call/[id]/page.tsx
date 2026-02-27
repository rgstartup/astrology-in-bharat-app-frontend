"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { callSocket } from "@/lib/socket";
import { apiClient } from "@/lib/apiClient";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";

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

    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const deviceRef = useRef<any>(null);

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
            throw new Error(err.message || "Microphone access failed.");
        }
    };

    useEffect(() => {
        // `cancelled` acts as a guard against React StrictMode double-invocation.
        // When StrictMode unmounts the component immediately after first mount,
        // the cleanup sets `cancelled = true`, aborting any in-flight async work.
        // The second (real) mount creates a fresh closure with `cancelled = false`.
        let cancelled = false;

        const acceptAndConnect = async () => {
            console.log('[ExpertCallRoom] 🚀 Starting acceptAndConnect for sessionId:', sessionId);
            try {
                // Pre-check hardware
                console.log('[ExpertCallRoom] 🎤 Checking hardware & network...');
                await checkHardwareAndNetwork();
                if (cancelled) { console.log('[ExpertCallRoom] ⚠️ Cancelled after hardware check (StrictMode cleanup).'); return; }
                console.log('[ExpertCallRoom] ✅ Hardware check passed.');

                // Step 1: Accept call via REST API → get Twilio token for expert
                console.log('[ExpertCallRoom] 📡 Calling /call/accept API...');
                const response: any = await apiClient.post('/call/accept', {
                    sessionId: parseInt(sessionId),
                });
                if (cancelled) { console.log('[ExpertCallRoom] ⚠️ Cancelled after API call (StrictMode cleanup).'); return; }
                console.log('[ExpertCallRoom] 📡 /call/accept response:', { hasToken: !!response?.token, session: response?.session });

                if (!response?.token) {
                    throw new Error('No token received from accept endpoint');
                }

                setSessionData(response.session);

                // Step 2: Join socket room so user gets notified
                console.log('[ExpertCallRoom] 🔌 Emitting join_call_room for sessionId:', sessionId);
                callSocket.emit('join_call_room', { sessionId: parseInt(sessionId) });

                // Step 3: Init Twilio Device
                console.log('[ExpertCallRoom] 📞 Initializing Twilio Device...');
                await initTwilioDevice(response.token);

            } catch (err: any) {
                if (cancelled) return;
                console.error('[ExpertCallRoom] ❌ Failed to accept call:', err);
                toast.error(err?.message || 'Failed to join call');
                setTimeout(() => router.push('/dashboard'), 3000);
            }
        };

        acceptAndConnect();

        callSocket.on('call_ended', () => handleCallEnded());

        return () => {
            console.log('[ExpertCallRoom] 🧹 Cleanup running (sessionId:', sessionId, '). Setting cancelled=true.');
            cancelled = true;
            if (timerRef.current) clearInterval(timerRef.current);
            if (deviceRef.current) {
                console.log('[ExpertCallRoom] 🗑️ Destroying Twilio Device on cleanup.');
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
            console.warn('[ExpertTwilio] Device already initialized, skipping.');
            return;
        }

        const { Device } = await import('@twilio/voice-sdk');

        const device = new Device(token, {
            logLevel: 1,
            codecPreferences: ['opus', 'pcmu'] as any,
        });

        deviceRef.current = device;

        device.on('ready', () => {
            console.log('[ExpertTwilio] ✅ Device ready. Connecting to TwiML conference...');
        });

        // Listen for when a call we made is connected (conference joined)
        device.on('connect', (call: any) => {
            console.log('[ExpertTwilio] � device:connect — expert joined conference room.', {
                callSid: call?.parameters?.CallSid,
            });
            toast.success('Connected! Call is live.');
            setStatus('connected');
            startTimer();
        });

        device.on('disconnect', (call: any) => {
            console.log('[ExpertTwilio] 📴 device:disconnect fired.', { callSid: call?.parameters?.CallSid });
            handleCallEnded();
        });

        device.on('error', (err: any) => {
            console.error('[ExpertTwilio] ❌ Device error:', { code: err.code, message: err.message, twilioError: err.twilioError });
            toast.error(`Call error: ${err.message}`);
            handleCallEnded();
        });

        console.log('[ExpertTwilio] 📡 Registering device with Twilio...');
        await device.register();
        console.log('[ExpertTwilio] ✅ Device registered. Connecting to conference room:', `call_room_${sessionId}`);

        // Both user & expert call the TwiML App with sessionId.
        // TwiML App uses <Dial><Conference>call_room_{sessionId}</Conference></Dial>
        // to put both into the same conference room.
        const call = await device.connect({ params: { sessionId } });
        console.log('[ExpertTwilio] � device.connect() called. Waiting for conference to start...');

        // Per-call event handlers
        call.on('accept', () => console.log('[ExpertTwilio] ✅ call:accept — media negotiation complete.'));
        call.on('disconnect', () => { console.log('[ExpertTwilio] 📴 call:disconnect fired.'); handleCallEnded(); });
        call.on('cancel', () => { console.log('[ExpertTwilio] ❌ call:cancel — call cancelled.'); handleCallEnded(); });
        call.on('error', (err: any) => { console.error('[ExpertTwilio] ❌ call:error', err); toast.error(`Call error: ${err.message}`); handleCallEnded(); });
    };

    const startTimer = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    };

    const handleCallEnded = () => {
        console.log('[ExpertCallRoom] 📴 handleCallEnded called. Cleaning up device and redirecting...');
        setStatus('ended');
        if (timerRef.current) clearInterval(timerRef.current);
        if (deviceRef.current) {
            deviceRef.current.destroy();
            deviceRef.current = null;
        }
        toast.info('Session ended');
        setTimeout(() => router.push('/dashboard'), 3000);
    };

    const handleEndCall = () => {
        deviceRef.current?.disconnectAll?.();
        callSocket.emit('end_call', { sessionId: parseInt(sessionId) });
        handleCallEnded();
    };

    const toggleMute = () => {
        const calls = deviceRef.current?.calls || [];
        calls.forEach((c: any) => c.mute(!isMuted));
        setIsMuted(!isMuted);
    };

    const formatDuration = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

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
                        {sessionData?.user?.avatar
                            ? <img src={sessionData.user.avatar} alt="Client" className="w-full h-full object-cover" />
                            : <User className="w-10 h-10 text-neutral-600" />
                        }
                    </div>
                    <h2 className="text-3xl font-black">{sessionData?.user?.name || 'Client User'}</h2>
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
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                    <div className="bg-white/5 border border-white/10 rounded-[2rem] p-4 flex flex-col items-center gap-1">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-[9px] text-white/30 font-black uppercase tracking-widest">Duration</span>
                        <span className="text-lg font-black">{formatDuration(callDuration)}</span>
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
        </div>
    );
}
