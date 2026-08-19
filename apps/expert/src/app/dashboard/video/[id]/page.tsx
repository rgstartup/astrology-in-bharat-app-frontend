"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { callSocket } from "@/lib/socket";
import * as LucideIcons from "lucide-react";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { SummaryModal } from "@/components/common/SummaryModal";
import { getErrorMessage } from "@repo/lib/utils/error";

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
    const sessionDataRef = useRef<any>(null);
    const [showSummary, setShowSummary] = useState(false);
    const [summaryData, setSummaryData] = useState<any>(null);
    const [hasRemoteTrack, setHasRemoteTrack] = useState(false);

    const roomRef = useRef<any>(null);       // Twilio Video Room
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const localVideoRef = useRef<HTMLDivElement | null>(null);
    const remoteVideoRef = useRef<HTMLDivElement | null>(null);
    const hasConnectedRef = useRef(false); // Prevents StrictMode double-invoke of acceptAndConnect

    useEffect(() => {
        if (hasConnectedRef.current) return;
        hasConnectedRef.current = true;

        const acceptAndConnect = async () => {
            const [data, error] = await api.post<any>('/call/accept', { sessionId });
            
            if (error) {
                console.error('[ExpertVideo] ❌ Error:', error);
                toast.error(getErrorMessage(error) || 'Failed to connect video call');
                setTimeout(() => router.push('/dashboard'), 2000);
                return;
            }

            setSessionData(data?.session);
            sessionDataRef.current = data?.session;
            callSocket.emit('join_call_room', { sessionId });

            setStatus('connecting');
            await initVideoRoom(data?.token, data?.roomName);
        };

        acceptAndConnect();

        const onCallEnded = (data: any) => {
            handleCallEnded(data);
        };
        callSocket.on('call_ended', onCallEnded);

        return () => {
            callSocket.off('call_ended', onCallEnded);
            if (timerRef.current) clearInterval(timerRef.current);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sessionId]);

    const localTracksRef = useRef<any[]>([]);

    const initVideoRoom = async (token: string, roomName: string) => {
        const TwilioVideo = await import('twilio-video');
        const localTracks = await TwilioVideo.createLocalTracks({ audio: true, video: { width: 640 } });
        localTracksRef.current = localTracks;

        const localVideoTrack = localTracks.find((t: any) => t.kind === 'video') as any;
        if (localVideoTrack && localVideoRef.current) {
            const el = localVideoTrack.attach();
            el.setAttribute('data-track-sid', localVideoTrack.sid);
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.objectFit = 'cover';
            el.style.transform = 'scaleX(-1)';
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

        setStatus('connected');
        startTimer();

        const attachRemoteParticipant = (participant: any) => {
            participant.tracks.forEach((pub: any) => {
                if (pub.isSubscribed && pub.track) attachRemoteTrack(pub.track);
            });
            participant.on('trackSubscribed', (track: any) => {
                attachRemoteTrack(track);
            });
        };

        const attachRemoteTrack = (track: any) => {
            if (track.kind === 'video' && remoteVideoRef.current) {
                const el = track.attach();
                el.style.width = '100%';
                el.style.height = '100%';
                el.style.objectFit = 'cover';
                
                if (remoteVideoRef.current) {
                    remoteVideoRef.current.innerHTML = '';
                    remoteVideoRef.current.appendChild(el);
                    setHasRemoteTrack(true);
                }
            } else if (track.kind === 'audio') {
                const el = track.attach();
                document.body.appendChild(el);
            }
        };

        room.participants.forEach(attachRemoteParticipant);
        room.on('participantConnected', attachRemoteParticipant);

        room.on('reconnecting', (error) => {
            if (error.code === 53001) {
                toast.warning("Network issue detected. Reconnecting...");
            }
        });

        room.on('participantDisconnected', (participant: any) => {
            if (remoteVideoRef.current) {
                remoteVideoRef.current.innerHTML = '';
            }
            toast.warning("Client disconnected. Waiting for them to rejoin...");
            setHasRemoteTrack(false);
        });

        room.on('disconnected', (room: any, error: any) => {
            localTracksRef.current.forEach((t: any) => t.stop?.());
            if (error) {
                console.error('[ExpertVideo] Room disconnected with error:', error);
            }
        });
    };

    useEffect(() => {
        const localVideoTrack = localTracksRef.current?.find(t => t.kind === 'video');
        if (localVideoTrack && localVideoRef.current) {
            const el = localVideoTrack.attach();
            el.style.width = '100%';
            el.style.height = '100%';
            el.style.objectFit = 'cover';
            el.style.transform = 'scaleX(-1)';
            
            const container = localVideoRef.current;
            while (container.firstChild) {
                container.removeChild(container.firstChild);
            }
            container.appendChild(el);
        }
    }, [status]);

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
        roomRef.current?.disconnect?.();
        
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
            toast.info('Video call ended');
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
            console.error('[ExpertVideo] Failed to end call on backend', getErrorMessage(error));
        }
        callSocket.emit('end_call', { sessionId });
        handleCallEnded(data);
    };

    const toggleMute = () => {
        roomRef.current?.localParticipant?.audioTracks?.forEach((pub: any) => {
            isMuted ? pub.track.enable() : pub.track.disable();
        });
        setIsMuted(!isMuted);
    };

    const toggleCamera = () => {
        roomRef.current?.localParticipant?.videoTracks?.forEach((pub: any) => {
            isCameraOff ? pub.track.enable() : pub.track.disable();
        });
        setIsCameraOff(!isCameraOff);
    };

    const formatDuration = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    const [isSwapped, setIsSwapped] = useState(false);

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 bg-black/40 backdrop-blur-md border-b border-white/5 z-10">
                <div>
                    <p className="text-[10px] text-white/30 font-black uppercase tracking-widest">Video Call</p>
                    <h1 className="text-lg font-black">{sessionData?.client?.user?.name || sessionData?.user?.name || 'Client'}</h1>
                </div>
                <div className="flex items-center gap-6">
                    {(status === 'accepting' || status === 'connecting') && (
                        <span className="text-xs font-bold text-white/40 uppercase tracking-widest animate-pulse">
                            {status === 'accepting' ? 'Accepting...' : 'Connecting...'}
                        </span>
                    )}
                    {status === 'connected' && (
                        <div className="flex items-center gap-4 bg-black/30 px-4 py-2 rounded-full border border-white/10">
                            <div className="flex items-center gap-2 border-r border-white/20 pr-4">
                                <Clock className="w-4 h-4 text-white/50" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-white/50 font-black uppercase tracking-widest">Elapsed</span>
                                    <span className="text-sm font-black">{formatDuration(callDuration)}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4 text-primary" />
                                <div className="flex flex-col">
                                    <span className="text-[8px] text-primary/70 font-black uppercase tracking-widest">{sessionData?.is_free ? 'Free Time' : 'Time Left'}</span>
                                    <span className="text-sm font-black text-primary">{formatDuration(Math.max(0, (sessionData?.max_duration_seconds || 300) - callDuration))}</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Video Area */}
            <div className="flex-1 relative bg-neutral-950 overflow-hidden">
                <div 
                    onClick={() => isSwapped && setIsSwapped(false)}
                    className={`transition-all duration-500 bg-neutral-900 ${
                        isSwapped 
                            ? "absolute bottom-6 right-6 w-36 h-48 rounded-2xl border-2 border-white/10 shadow-2xl z-40 cursor-pointer overflow-hidden hover:border-primary/50" 
                            : "absolute inset-0 z-10"
                    }`}
                >
                    <div ref={remoteVideoRef as any} className="w-full h-full" />
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-50">
                        <span className="text-white text-xs font-bold">
                            {sessionData?.client?.user?.name || sessionData?.user?.name || 'Client'}
                        </span>
                    </div>
                </div>

                <div 
                    onClick={() => !isSwapped && status === 'connected' && setIsSwapped(true)}
                    className={`transition-all duration-500 bg-neutral-800 ${
                        !isSwapped 
                            ? "absolute bottom-6 right-6 w-36 h-48 rounded-2xl border-2 border-white/10 shadow-2xl z-40 cursor-pointer overflow-hidden hover:border-primary/50" 
                            : "absolute inset-0 z-10"
                    }`}
                >
                    <div ref={localVideoRef as any} className="w-full h-full" />
                    {isCameraOff && (
                        <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center z-[45]">
                            <User className="w-12 h-12 text-neutral-500" />
                        </div>
                    )}
                    <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-50">
                        <span className="text-white text-xs font-bold">You (Expert)</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            {status !== 'ended' && (
                <div className="flex items-center justify-center gap-6 p-6 bg-black/60 backdrop-blur-md border-t border-white/5">
                    <button
                        onClick={toggleMute}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                    </button>

                    <button
                        onClick={handleEndCall}
                        className="w-20 h-20 rounded-full bg-red-500 shadow-2xl shadow-red-500/40 flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
                    >
                        <PhoneOff className="w-10 h-10" />
                    </button>

                    <button
                        onClick={toggleCamera}
                        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-white text-black' : 'bg-white/10 hover:bg-white/20'}`}
                    >
                        {isCameraOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
                    </button>
                </div>
            )}

            <div className="absolute bottom-24 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-[9px] text-white/10 font-black uppercase tracking-[0.5em]">🔒 Secure Encrypted Session</span>
            </div>

            <SummaryModal 
                isOpen={showSummary && !!summaryData} 
                data={(() => {
                    if (summaryData && typeof summaryData === 'object') {
                        return {
                            totalAmount: summaryData.split?.totalCost || 0,
                            platformFee: summaryData.split?.platformFee || 0,
                            expertShare: summaryData.split?.expertShare || 0,
                            terminatedBy: summaryData.terminatedBy || 'N/A'
                        };
                    }
                    const [totalAmount, platformFee, expertShare, terminatedBy] = (summaryData || "").split(':');
                    return { totalAmount, platformFee, expertShare, terminatedBy };
                })()} 
                title="Video Session Ended"
            />
        </div>
    );
}
