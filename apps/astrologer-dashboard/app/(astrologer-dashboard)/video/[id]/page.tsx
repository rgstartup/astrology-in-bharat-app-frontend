"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { callSocket } from "@/lib/socket";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";

const { PhoneOff, Mic, MicOff, Video, VideoOff, Clock, User } = LucideIcons as any;

type VideoStatus = 'accepting' | 'connecting' | 'connected' | 'ended';

export default function ExpertVideoCallPage() {
    const params = useParams();
    const router = useRouter();
    const sessionId = params.id as string;

    const [status, setStatus] = useState<VideoStatus>('accepting');
    const [isMuted, setIsMuted] = useState(false);
    const [isCameraOff, setIsCameraOff] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [sessionData, setSessionData] = useState<any>(null);
    const [hasRemoteTrack, setHasRemoteTrack] = useState(false);

    const roomRef = useRef<any>(null);       // Twilio Video Room
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const localVideoRef = useRef<HTMLDivElement | null>(null);
    const remoteVideoRef = useRef<HTMLDivElement | null>(null);
    const hasConnectedRef = useRef(false); // Prevents StrictMode double-invoke of acceptAndConnect

    useEffect(() => {
        // StrictMode guard: skip the second invoke (mount → cleanup → remount)
        if (hasConnectedRef.current) return;
        hasConnectedRef.current = true;

        const acceptAndConnect = async () => {
            console.log('[ExpertVideo] 🚀 Starting video call for sessionId:', sessionId);

            console.log('[ExpertVideo] 📡 Calling /call/accept...');
            const [data, error] = await api.post<any>('/call/accept', { sessionId: parseInt(sessionId) });
            
            if (error) {
                console.error('[ExpertVideo] ❌ Error:', error);
                toast.error(error.message || 'Failed to connect video call');
                setTimeout(() => router.push('/dashboard'), 2000);
                return;
            }

            console.log('[ExpertVideo] ✅ /call/accept response:', { hasToken: !!data?.token, roomName: data?.roomName });

            setSessionData(data?.session);
            callSocket.emit('join_call_room', { sessionId: parseInt(sessionId) });

            setStatus('connecting');
            await initVideoRoom(data?.token, data?.roomName);
        };

        acceptAndConnect();

        // Listen for call_ended from the other side (user ending the call)
        const onCallEnded = () => {
            console.log('[ExpertVideo] 📴 call_ended received from socket');
            handleCallEnded();
        };
        callSocket.on('call_ended', onCallEnded);

        return () => {
            callSocket.off('call_ended', onCallEnded);
            if (timerRef.current) clearInterval(timerRef.current);
            // NOTE: Do NOT disconnect roomRef here — handled by handleEndCall explicitly.
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);
    const localTracksRef = useRef<any[]>([]);

    const initVideoRoom = async (token: string, roomName: string) => {
        console.log('[ExpertVideo] 🎥 Connecting to Twilio Video room:', roomName);
        const TwilioVideo = await import('twilio-video');

        // Create local audio + video tracks
        const localTracks = await TwilioVideo.createLocalTracks({ audio: true, video: { width: 640 } });
        localTracksRef.current = localTracks;

        // Attach local video preview
        const localVideoTrack = localTracks.find((t: any) => t.kind === 'video') as any;
        if (localVideoTrack && localVideoRef.current) {
            const el = localVideoTrack.attach();
            el.setAttribute('data-track-sid', localVideoTrack.sid);
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.objectFit = 'cover';
            el.style.transform = 'scaleX(-1)'; // Mirror for local preview
            if (localVideoRef.current) {
                localVideoRef.current.innerHTML = '';
                localVideoRef.current.appendChild(el);
            }
        }

        const room = await TwilioVideo.connect(token, {
            name: roomName,
            tracks: localTracks,
        });
        roomRef.current = room;
        console.log('[ExpertVideo] ✅ Connected to room:', room.name);

        setStatus('connected');
        startTimer();

        // Attach remote participant (user)
        const attachRemoteParticipant = (participant: any) => {
            console.log('[ExpertVideo] 👤 Remote participant joined:', participant.identity);

            participant.tracks.forEach((pub: any) => {
                if (pub.isSubscribed && pub.track) attachRemoteTrack(pub.track);
            });

            participant.on('trackSubscribed', (track: any) => {
                console.log('[ExpertVideo] 📡 Track subscribed:', track.kind);
                attachRemoteTrack(track);
            });
        };

        const attachRemoteTrack = (track: any) => {
            console.log('[ExpertVideo] 📡 Attaching remote track:', track.kind, '| SID:', track.sid);
            if (track.kind === 'video' && remoteVideoRef.current) {
                const el = track.attach();
                el.style.width = '100%';
                el.style.height = '100%';
                el.style.objectFit = 'cover';
                
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.innerHTML = ''; // Clear existing content
                    remoteVideoRef.current.appendChild(el); // Append the new video element
                    console.log('[ExpertVideo] ✅ Remote video element ATTACHED.');
                    setHasRemoteTrack(true);
                }
            } else if (track.kind === 'audio') {
                const el = track.attach();
                document.body.appendChild(el);
                console.log('[ExpertVideo] ✅ Remote audio element ATTACHED.');
            }
        };

        room.participants.forEach(attachRemoteParticipant);
        room.on('participantConnected', attachRemoteParticipant);

        room.on('participantDisconnected', (participant: any) => {
            console.log('[ExpertVideo] 👤 Participant disconnected:', participant.identity);
            handleCallEnded();
        });

        room.on('disconnected', (room: any, error: any) => {
            if (error) console.error('[ExpertVideo] 📴 Room disconnected with error:', error);
            localTracksRef.current.forEach((t: any) => t.stop?.());
            handleCallEnded();
        });
    };

    // Re-attach local video on status change or re-mount
    useEffect(() => {
        const localVideoTrack = localTracksRef.current.find(t => t.kind === 'video');
        if (localVideoTrack && localVideoRef.current) {
            console.log('[ExpertVideo] 🔄 Re-attaching local preview to container (Status:', status, ')');
            const el = localVideoTrack.attach();
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.objectFit = 'cover';
            el.style.transform = 'scaleX(-1)';
            localVideoRef.current.innerHTML = '';
            localVideoRef.current.appendChild(el);
        }
    }, [status]);

    const startTimer = () => {
        if (timerRef.current) return;
        timerRef.current = setInterval(() => setCallDuration(d => d + 1), 1000);
    };

    const handleCallEnded = () => {
        console.log('[ExpertVideo] 📴 Call ended.');
        setStatus('ended');
        if (timerRef.current) clearInterval(timerRef.current);
        roomRef.current?.disconnect?.();
        toast.info('Video call ended');
        setTimeout(() => router.push('/dashboard'), 3000);
    };

    const handleEndCall = async () => {
        const [_, error] = await api.post(`/call/end`, { sessionId: parseInt(sessionId) });
        if (error) {
            console.error('[ExpertVideo] Failed to end call on backend', error);
        }
        callSocket.emit('end_call', { sessionId: parseInt(sessionId) });
        handleCallEnded();
    };

    const toggleMute = () => {
        roomRef.current?.localParticipant?.audioTracks?.forEach((pub: any) => {
            isMuted ? pub.track.enable() : pub.track.disable();
        });
        setIsMuted(!isMuted);
        console.log('[ExpertVideo] 🎤 Mute:', !isMuted);
    };

    const toggleCamera = () => {
        roomRef.current?.localParticipant?.videoTracks?.forEach((pub: any) => {
            isCameraOff ? pub.track.enable() : pub.track.disable();
        });
        setIsCameraOff(!isCameraOff);
        console.log('[ExpertVideo] 📹 Camera:', isCameraOff ? 'ON' : 'OFF');
    };

    const formatDuration = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/5 z-10">
                <div>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Video Call</p>
                    <h1 className="text-lg font-black">{sessionData?.user?.name || 'Client'}</h1>
                </div>
                <div className="flex items-center gap-3">
                    {status === 'connected' && (
                        <>
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full">
                                <Clock className="w-3 h-3 text-primary" />
                                <span className="text-sm font-black text-primary">{formatDuration(callDuration)}</span>
                            </div>
                        </>
                    )}
                    {(status === 'accepting' || status === 'connecting') && (
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest animate-pulse">
                            {status === 'accepting' ? 'Accepting...' : 'Connecting...'}
                        </span>
                    )}
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative bg-neutral-950">
                {/* Remote video (large — user's camera) */}
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                    <div
                        ref={remoteVideoRef as any}
                        className="w-full h-full"
                    />
                    {status !== 'connected' && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <div className="w-20 h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center animate-pulse">
                                <User className="w-10 h-10 text-white/30" />
                            </div>
                            <p className="text-white/40 font-bold text-sm uppercase tracking-widest">
                                {status === 'accepting' ? 'Accepting call...' : 'Connecting video...'}
                            </p>
                        </div>
                    )}
                    {status === 'connected' && !hasRemoteTrack && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-neutral-900 z-[5]">
                            <p className="text-white/40 font-bold text-sm uppercase tracking-widest animate-pulse">
                                Waiting for client...
                            </p>
                        </div>
                    )}
                    {/* Client name tag */}
                    {status === 'connected' && hasRemoteTrack && (
                        <div className="absolute bottom-6 left-6 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full">
                            <span className="text-sm font-bold">{sessionData?.user?.name || 'Client'}</span>
                        </div>
                    )}
                </div>

                {/* Local video (PIP — expert's camera, bottom right) */}
                <div className="absolute bottom-6 right-6 w-36 h-48 bg-neutral-800 rounded-2xl overflow-hidden border-2 border-white/10 shadow-2xl z-10">
                    <div
                        ref={localVideoRef as any}
                        className="w-full h-full"
                    />
                    {isCameraOff && (
                        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center">
                            <User className="w-10 h-10 text-neutral-500" />
                        </div>
                    )}
                    <div className="absolute bottom-1 left-0 right-0 text-center">
                        <span className="text-white/50 text-[9px] font-bold">You (Expert)</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {status !== 'ended' && (
                <div className="flex items-center justify-center gap-6 p-6 bg-black/60 backdrop-blur-md border-t border-white/5">
                    {/* Mute */}
                    <button
                        onClick={toggleMute}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                        title={isMuted ? 'Unmute' : 'Mute'}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    {/* End Call */}
                    <button
                        onClick={handleEndCall}
                        className="w-20 h-20 rounded-full bg-red-500 shadow-2xl shadow-red-500/40 flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                        title="End Call"
                    >
                        <PhoneOff className="w-10 h-10" />
                    </button>

                    {/* Camera Toggle */}
                    <button
                        onClick={toggleCamera}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                        title={isCameraOff ? 'Turn Camera On' : 'Turn Camera Off'}
                    >
                        {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </button>
                </div>
            )}

            {status === 'ended' && (
                <div className="flex items-center justify-center p-6 bg-black/60">
                    <p className="text-white/40 text-sm font-bold animate-pulse uppercase tracking-widest">Returning to dashboard...</p>
                </div>
            )}

            <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-[9px] text-white/10 font-black uppercase tracking-[0.5em]">🔒 Secure Encrypted Session</span>
            </div>
        </div>
    );
}
