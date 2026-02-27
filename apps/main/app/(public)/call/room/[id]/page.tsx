"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getApiUrl } from "@/utils/api-config";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "@/libs/api-profile";

const { Phone, PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, User, Loader2 } = LucideIcons as any;

type CallStatus = 'ringing' | 'connecting' | 'connected' | 'ended';

const SOCKET_URL = getApiUrl().replace('/api/v1', '');

export default function CallRoomPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const [status, setStatus] = useState<CallStatus>('ringing');
    const [isMuted, setIsMuted] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [sessionData, setSessionData] = useState<any>(null);
    const [callType, setCallType] = useState<'audio' | 'video'>('audio');

    const socketRef = useRef<Socket | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const deviceRef = useRef<any>(null);
    const callRef = useRef<any>(null); // Store active call for mute/unmute

    // ─── Setup Socket ──────────────────────────────────────────────────────
    useEffect(() => {
        socketRef.current = io(`${SOCKET_URL}/call`, {
            withCredentials: true,
            transports: ['websocket'],
        });

        socketRef.current.emit('join_call_room', { sessionId: parseInt(sessionId) });

        // Expert accepted the call – now init Twilio Device
        socketRef.current.on('call_accepted', async (data: any) => {
            console.log('[CallRoom] Expert accepted. Token received:', data.token ? '✅' : '❌');
            setStatus('connecting');
            setSessionData(data.session);
            setCallType(data.session?.type || 'audio');

            try {
                await initTwilioDevice(data.token);
            } catch (err) {
                console.error('[CallRoom] Twilio init failed:', err);
                toast.error('Could not connect call. Please try again.');
                setStatus('ended');
            }
        });

        socketRef.current.on('call_ended', () => {
            handleCallEnded();
        });

        return () => {
            socketRef.current?.disconnect();
            if (timerRef.current) clearInterval(timerRef.current);
            deviceRef.current?.destroy();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    // ─── Twilio Voice SDK ──────────────────────────────────────────────────
    const initTwilioDevice = async (token: string) => {
        // Dynamic import to avoid SSR issues
        const { Device } = await import('@twilio/voice-sdk');

        const device = new Device(token, {
            logLevel: 1,
            codecPreferences: ['opus', 'pcmu'] as any,
        });

        deviceRef.current = device;

        device.on('ready', () => {
            console.log('[UserTwilio] ✅ Device ready. Placing call into conference...');
        });

        device.on('disconnect', () => {
            console.log('[UserTwilio] 📴 device:disconnect fired.');
            handleCallEnded();
        });

        device.on('error', (err: any) => {
            console.error('[UserTwilio] ❌ Device error:', { code: err.code, message: err.message });
            toast.error(`Call error: ${err.message}`);
            handleCallEnded();
        });

        console.log('[UserTwilio] 📡 Registering device...');
        await device.register();
        console.log('[UserTwilio] ✅ Device registered. Connecting to conference...');

        // Both user & expert call TwiML App → placed in same conference room
        const call = await device.connect({ params: { sessionId } });
        callRef.current = call; // Store for mute/unmute
        console.log('[UserTwilio] 📞 device.connect() called. Status:', call.status());

        // Twilio SDK v2.x — use call.on('accept') not device.on('connect')
        call.on('accept', () => {
            console.log('[UserTwilio] ✅ call:accept — media connected! Starting timer.');
            setStatus('connected');
            startTimer();
        });
        call.on('disconnect', () => { console.log('[UserTwilio] 📴 call:disconnect.'); handleCallEnded(); });
        call.on('cancel', () => { console.log('[UserTwilio] ❌ call:cancel.'); handleCallEnded(); });
        call.on('error', (err: any) => { console.error('[UserTwilio] ❌ call:error', err); toast.error(`Call error: ${err.message}`); handleCallEnded(); });
    };

    // ─── Helpers ───────────────────────────────────────────────────────────
    const startTimer = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => {
            setCallDuration(prev => prev + 1);
        }, 1000);
    };

    const handleCallEnded = () => {
        setStatus('ended');
        if (timerRef.current) clearInterval(timerRef.current);
        deviceRef.current?.destroy();
        toast.info('Call has ended');
        setTimeout(() => router.push('/'), 3000);
    };

    const handleEndCall = () => {
        // Disconnect Twilio call
        deviceRef.current?.disconnectAll?.();
        socketRef.current?.emit('end_call', { sessionId: parseInt(sessionId) });
        handleCallEnded();
    };

    const toggleMute = () => {
        if (callRef.current) {
            callRef.current.mute(!isMuted);
            console.log('[UserCallRoom] 🎤 Mute toggled:', !isMuted ? 'MUTED' : 'UNMUTED');
        } else {
            console.warn('[UserCallRoom] ⚠️ No active call to mute.');
        }
        setIsMuted(!isMuted);
    };

    const formatDuration = (seconds: number) => {
        const m = Math.floor(seconds / 60).toString().padStart(2, '0');
        const s = (seconds % 60).toString().padStart(2, '0');
        return `${m}:${s}`;
    };

    // ─── UI ────────────────────────────────────────────────────────────────
    const statusLabel: Record<CallStatus, string> = {
        ringing: 'Ringing... Waiting for expert',
        connecting: 'Connecting...',
        connected: formatDuration(callDuration),
        ended: 'Call ended',
    };

    return (
        <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Glow */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#fd6410,transparent_70%)] animate-pulse" />
            </div>

            <div className="z-10 w-full max-w-sm flex flex-col items-center gap-8">
                {/* Expert Avatar */}
                <div className={`relative w-36 h-36 rounded-full border-4 border-primary/30 p-1 ${status === 'ringing' ? 'animate-bounce' : ''}`}>
                    <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
                        {sessionData?.expert?.user?.avatar ? (
                            <img src={sessionData.expert.user.avatar} alt="Expert" className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-16 h-16 text-neutral-600" />
                        )}
                    </div>
                    {status === 'ringing' && (
                        <div className="absolute -inset-4 rounded-full border border-primary/20 animate-ping" />
                    )}
                </div>

                {/* Name + Status */}
                <div className="text-center">
                    <h2 className="text-2xl font-black">{sessionData?.expert?.user?.name || 'Expert Astrologer'}</h2>
                    <div className="flex items-center justify-center gap-2 mt-2 text-primary text-sm font-bold">
                        {(status === 'ringing' || status === 'connecting') && <Loader2 className="w-4 h-4 animate-spin" />}
                        {status === 'connected' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                        <span className="uppercase tracking-widest text-[11px]">{statusLabel[status]}</span>
                    </div>
                </div>

                {/* Controls */}
                {status !== 'ended' && (
                    <div className="flex items-center gap-8 mt-6">
                        <button
                            onClick={toggleMute}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>

                        <button
                            onClick={handleEndCall}
                            className="w-20 h-20 rounded-full bg-red-500 shadow-2xl shadow-red-500/30 flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                        >
                            <PhoneOff className="w-10 h-10" />
                        </button>

                        <button
                            disabled
                            className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center opacity-30 cursor-not-allowed"
                            title="Video available in video call mode"
                        >
                            <Volume2 className="w-6 h-6" />
                        </button>
                    </div>
                )}

                {status === 'ended' && (
                    <p className="text-neutral-400 text-sm font-bold animate-pulse">Redirecting to home...</p>
                )}
            </div>

            <div className="absolute bottom-8 text-[9px] text-white/20 font-black uppercase tracking-[0.5em]">
                🔒 256-Bit Encrypted Session
            </div>
        </div>
    );
}
