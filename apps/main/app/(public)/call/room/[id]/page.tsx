"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { getApiUrl } from "@/utils/api-config";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import apiClient from "@/libs/api-profile";

const { PhoneOff, Mic, MicOff, Video, VideoOff, Volume2, User, Loader2, Star, X } = LucideIcons as any;

type CallStatus = 'ringing' | 'connecting' | 'connected' | 'ended';

const SOCKET_URL = getApiUrl().replace('/api/v1', '');

export default function CallRoomPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const [status, setStatus] = useState<CallStatus>('ringing');
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [sessionData, setSessionData] = useState<any>(null);
    const [callType, setCallType] = useState<'audio' | 'video'>('audio');

    // ─── Review / Rating ──────────────────────────────────────────────────────
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [reviewRating, setReviewRating] = useState(0);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    const socketRef = useRef<Socket | null>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const deviceRef = useRef<any>(null);   // Twilio Voice Device (audio)
    const callRef = useRef<any>(null);      // Twilio Voice Call | Twilio Video Room
    const localVideoRef = useRef<HTMLVideoElement | null>(null);
    const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
    const cancelledRef = useRef(false); // Prevents StrictMode/Fast Refresh from killing video room
    const hasSetupRef = useRef(false);  // Prevents StrictMode double socket setup

    // ─── Setup Socket ──────────────────────────────────────────────────────
    useEffect(() => {
        cancelledRef.current = false;

        // On StrictMode second mount, reconnect socket and re-join room, but skip
        // disconnecting the old socket to protect an active video/audio call.
        if (!hasSetupRef.current) {
            hasSetupRef.current = true;
            socketRef.current = io(`${SOCKET_URL}/call`, {
                withCredentials: true,
                transports: ['websocket'],
            });
        }

        const socket = socketRef.current!;
        socket.emit('join_call_room', { sessionId: parseInt(sessionId) });

        const handleCallAccepted = async (data: any) => {
            if (cancelledRef.current) return; // StrictMode double-invoke guard
            console.log('[CallRoom] Expert accepted. Token:', data.token ? '✅' : '❌', '| Type:', data.session?.type);
            const type = data.session?.type || 'audio';
            setStatus('connecting');
            setSessionData(data.session);
            setCallType(type);

            try {
                if (type === 'video') {
                    await initVideoCall(data.token, data.roomName);
                } else {
                    await initAudioCall(data.token);
                }
            } catch (err) {
                if (cancelledRef.current) return;
                console.error('[CallRoom] Init failed:', err);
                toast.error('Could not connect call. Please try again.');
                setStatus('ended');
            }
        };

        const onCallEnded = () => {
            if (!cancelledRef.current) handleCallEnded();
        };

        socket.on('call_accepted', handleCallAccepted);
        socket.on('call_ended', onCallEnded);

        return () => {
            cancelledRef.current = true; // Stop any in-flight async chains
            // Remove listeners but DO NOT disconnect socket —
            // disconnecting on StrictMode cleanup causes backend to end the video session.
            socket.off('call_accepted', handleCallAccepted);
            socket.off('call_ended', onCallEnded);
            if (timerRef.current) clearInterval(timerRef.current);
            deviceRef.current?.destroy?.();
            // NOTE: Do NOT disconnect callRef — handled by handleEndCall explicitly.
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    // ─── Audio Call (Twilio Voice SDK) ────────────────────────────────────
    const initAudioCall = async (token: string) => {
        const { Device } = await import('@twilio/voice-sdk');

        const device = new Device(token, {
            logLevel: 1,
            codecPreferences: ['opus', 'pcmu'] as any,
        });
        deviceRef.current = device;

        device.on('ready', () => console.log('[UserTwilio] ✅ Device ready.'));
        device.on('disconnect', () => { console.log('[UserTwilio] 📴 device:disconnect.'); handleCallEnded(); });
        device.on('error', (err: any) => {
            console.error('[UserTwilio] ❌ Device error:', err);
            toast.error(`Call error: ${err.message}`);
            handleCallEnded();
        });

        console.log('[UserTwilio] 📡 Registering device...');
        await device.register();

        const call = await device.connect({ params: { sessionId } });
        callRef.current = call;
        console.log('[UserTwilio] 📞 device.connect() called. Status:', call.status());

        call.on('accept', () => {
            console.log('[UserTwilio] ✅ call:accept — media connected!');
            setStatus('connected');
            startTimer();
        });
        call.on('disconnect', () => { console.log('[UserTwilio] 📴 call:disconnect.'); handleCallEnded(); });
        call.on('cancel', () => { console.log('[UserTwilio] ❌ call:cancel.'); handleCallEnded(); });
        call.on('error', (err: any) => { console.error('[UserTwilio] ❌ call:error', err); toast.error(`Call error: ${err.message}`); handleCallEnded(); });
    };

    // ─── Video Call (Twilio Video SDK) ────────────────────────────────────
    const initVideoCall = async (token: string, roomName: string) => {
        console.log('[UserVideo] 🎥 Connecting to Twilio Video room:', roomName);
        const TwilioVideo = await import('twilio-video');

        // Request camera + mic
        const localTracks = await TwilioVideo.createLocalTracks({ audio: true, video: { width: 640 } });

        // Attach local video preview
        const localVideoTrack = localTracks.find((t: any) => t.kind === 'video') as any;
        if (localVideoTrack && localVideoRef.current) {
            localVideoRef.current.srcObject = null;
            const el = localVideoTrack.attach();
            localVideoRef.current.replaceWith(el);
            localVideoRef.current = el;
        }

        const room = await TwilioVideo.connect(token, {
            name: roomName,
            tracks: localTracks,
        });
        callRef.current = room;
        console.log('[UserVideo] ✅ Connected to room:', room.name);

        setStatus('connected');
        startTimer();

        // Attach remote participant video
        const attachRemoteParticipant = (participant: any) => {
            console.log('[UserVideo] 👤 Remote participant connected:', participant.identity);
            participant.tracks.forEach((pub: any) => {
                if (pub.isSubscribed && pub.track) attachRemoteTrack(pub.track);
            });
            participant.on('trackSubscribed', (track: any) => attachRemoteTrack(track));
        };

        const attachRemoteTrack = (track: any) => {
            if (track.kind === 'video' && remoteVideoRef.current) {
                const el = track.attach();
                el.style.width = '100%';
                el.style.height = '100%';
                el.style.objectFit = 'cover';
                remoteVideoRef.current.replaceWith(el);
                remoteVideoRef.current = el;
            }
        };

        room.participants.forEach(attachRemoteParticipant);
        room.on('participantConnected', attachRemoteParticipant);
        room.on('participantDisconnected', () => {
            console.log('[UserVideo] 👤 Remote participant left.');
            handleCallEnded();
        });
        room.on('disconnected', () => {
            console.log('[UserVideo] 📴 Room disconnected.');
            localTracks.forEach((t: any) => t.stop?.());
            handleCallEnded();
        });
    };

    // ─── Helpers ───────────────────────────────────────────────────────────
    const startTimer = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => setCallDuration(prev => prev + 1), 1000);
    };

    const handleCallEnded = () => {
        setStatus('ended');
        if (timerRef.current) clearInterval(timerRef.current);
        deviceRef.current?.destroy?.();
        if (callRef.current?.disconnect) callRef.current.disconnect();
        // Show rating modal instead of instant redirect
        setShowRatingModal(true);
    };

    const handleSubmitReview = async () => {
        if (reviewRating === 0) { toast.warning('Please select a rating'); return; }
        if (reviewSubmitting || reviewSubmitted) return;
        setReviewSubmitting(true);
        try {
            await apiClient.post('/reviews', {
                sessionId: parseInt(sessionId),
                expertId: sessionData?.expert?.id || sessionData?.expertId,
                rating: reviewRating,
                comment: reviewComment.trim(),
            });
            setReviewSubmitted(true);
            toast.success('Thank you for your feedback! ⭐');
        } catch (err) {
            console.error('[Rating] Failed:', err);
            toast.error('Could not submit review, please try again.');
            setReviewSubmitting(false);
            return;
        }
        setTimeout(() => router.push('/'), 1500);
    };

    const handleEndCall = () => {
        deviceRef.current?.disconnectAll?.();
        if (callRef.current?.disconnect) callRef.current.disconnect();
        socketRef.current?.emit('end_call', { sessionId: parseInt(sessionId) });
        handleCallEnded();
    };

    const toggleMute = () => {
        if (callType === 'video') {
            // Video room — mute local audio track
            callRef.current?.localParticipant?.audioTracks?.forEach((pub: any) => {
                isMuted ? pub.track.enable() : pub.track.disable();
            });
        } else {
            // Voice SDK
            if (callRef.current) callRef.current.mute(!isMuted);
        }
        setIsMuted(!isMuted);
        console.log('[CallRoom] 🎤 Mute toggled:', !isMuted ? 'MUTED' : 'UNMUTED');
    };

    const toggleCamera = () => {
        if (callType === 'video') {
            callRef.current?.localParticipant?.videoTracks?.forEach((pub: any) => {
                isCameraOff ? pub.track.enable() : pub.track.disable();
            });
            setIsCameraOff(!isCameraOff);
        }
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

            <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-6">

                {/* ── VIDEO LAYOUT ─────────────────────────────────────── */}
                {callType === 'video' && status !== 'ringing' ? (
                    <div className="w-full relative">
                        {/* Remote video (large) */}
                        <div className="w-full h-[60vh] max-h-[500px] bg-neutral-800 rounded-3xl overflow-hidden flex items-center justify-center relative">
                            <video
                                ref={remoteVideoRef as any}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            {status === 'connecting' && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                                    <Loader2 className="w-10 h-10 animate-spin text-primary" />
                                    <p className="text-white/60 font-bold uppercase tracking-widest text-sm">Connecting video...</p>
                                </div>
                            )}
                            {/* Expert name overlay */}
                            <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
                                <span className="text-white text-xs font-bold">{sessionData?.expert?.user?.name || 'Expert'}</span>
                            </div>
                        </div>

                        {/* Local video (pip - bottom right) */}
                        <div className="absolute bottom-4 right-4 w-32 h-40 bg-neutral-700 rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl">
                            <video
                                ref={localVideoRef as any}
                                autoPlay
                                playsInline
                                muted
                                className="w-full h-full object-cover"
                            />
                            {isCameraOff && (
                                <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                                    <User className="w-8 h-8 text-neutral-400" />
                                </div>
                            )}
                            <div className="absolute bottom-1 left-0 right-0 text-center">
                                <span className="text-white/60 text-[9px] font-bold">You</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    /* ── AUDIO LAYOUT ─────────────────────────────────── */
                    <div className="flex flex-col items-center gap-8">
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

                        <div className="text-center">
                            <h2 className="text-2xl font-black">{sessionData?.expert?.user?.name || 'Expert Astrologer'}</h2>
                            <div className="flex items-center justify-center gap-2 mt-2 text-primary text-sm font-bold">
                                {(status === 'ringing' || status === 'connecting') && <Loader2 className="w-4 h-4 animate-spin" />}
                                {status === 'connected' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                                <span className="uppercase tracking-widest text-[11px]">{statusLabel[status]}</span>
                            </div>
                        </div>
                    </div>
                )}

                {/* Status for video */}
                {callType === 'video' && (
                    <div className="flex items-center gap-2">
                        {status === 'connected' && <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />}
                        <span className="text-white/60 font-bold text-sm uppercase tracking-widest">{statusLabel[status]}</span>
                    </div>
                )}

                {/* ── CONTROLS ──────────────────────────────────────────── */}
                {status !== 'ended' && (
                    <div className="flex items-center gap-6 mt-2">
                        {/* Mute */}
                        <button
                            onClick={toggleMute}
                            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                        >
                            {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                        </button>

                        {/* End Call */}
                        <button
                            onClick={handleEndCall}
                            className="w-20 h-20 rounded-full bg-red-500 shadow-2xl shadow-red-500/30 flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                        >
                            <PhoneOff className="w-10 h-10" />
                        </button>

                        {/* Camera toggle (video only) */}
                        {callType === 'video' && (
                            <button
                                onClick={toggleCamera}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                            >
                                {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                            </button>
                        )}

                        {/* Speaker icon (audio only) */}
                        {callType === 'audio' && (
                            <button disabled className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center opacity-30 cursor-not-allowed">
                                <Volume2 className="w-6 h-6" />
                            </button>
                        )}
                    </div>
                )}

                {status === 'ended' && !showRatingModal && (
                    <p className="text-neutral-400 text-sm font-bold animate-pulse">Call ended...</p>
                )}
            </div>

            <div className="absolute bottom-8 text-[9px] text-white/20 font-black uppercase tracking-[0.5em]">
                🔒 256-Bit Encrypted Session
            </div>

            {/* ── Rating Modal ──────────────────────────────────────────── */}
            {showRatingModal && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-md">
                    <div className="w-full max-w-md bg-neutral-900 border border-white/10 rounded-t-3xl p-8 flex flex-col gap-6 animate-in slide-in-from-bottom duration-300">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Call Ended</p>
                                <h2 className="text-xl font-black text-white">Rate your Experience</h2>
                            </div>
                            <button
                                onClick={() => { setShowRatingModal(false); router.push('/'); }}
                                className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                            >
                                <X className="w-4 h-4 text-white/50" />
                            </button>
                        </div>

                        {/* Astrologer name */}
                        {sessionData?.expert?.user?.name && (
                            <p className="text-sm text-white/50 -mt-3">
                                Your consultation with <span className="text-primary font-bold">{sessionData.expert.user.name}</span>
                            </p>
                        )}

                        {/* Stars */}
                        <div className="flex justify-center gap-3">
                            {[1, 2, 3, 4, 5].map(star => (
                                <button
                                    key={star}
                                    onClick={() => setReviewRating(star)}
                                    className="transition-all hover:scale-110 active:scale-95"
                                >
                                    <Star
                                        className={`w-10 h-10 transition-colors ${star <= reviewRating
                                                ? 'fill-yellow-400 text-yellow-400'
                                                : 'text-white/20 fill-transparent'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>

                        {/* Comment */}
                        <textarea
                            value={reviewComment}
                            onChange={e => setReviewComment(e.target.value)}
                            placeholder="Share your experience (optional)..."
                            rows={3}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm placeholder:text-white/20 resize-none outline-none focus:border-primary/50 transition-colors"
                        />

                        {/* Buttons */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => { setShowRatingModal(false); router.push('/'); }}
                                className="flex-1 py-3 rounded-xl border border-white/10 text-white/40 text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                            >
                                Skip
                            </button>
                            <button
                                onClick={handleSubmitReview}
                                disabled={reviewSubmitting || reviewSubmitted || reviewRating === 0}
                                className="flex-1 py-3 rounded-xl bg-primary text-white font-black text-sm uppercase tracking-widest disabled:opacity-50 hover:bg-primary/90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                            >
                                {reviewSubmitted ? '✅ Submitted!' : reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
