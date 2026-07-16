"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { api as http } from "@/lib/api";
import { CallStatus, CallSession } from "@/lib/types";
import { getErrorMessage } from "@repo/lib";

export const useCallLogic = (): any => {
  const SOCKET_URL = "http://localhost:6543";
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [status, setStatus] = useState<CallStatus>("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [sessionData, setSessionData] = useState<CallSession | null>(null);
  const sessionDataRef = useRef<CallSession | null>(null);
  const [callType, setCallType] = useState<"audio" | "video">("audio");

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [showFreeEndPrompt, setShowFreeEndPrompt] = useState(false);
  const [freeLimitData, setFreeLimitData] = useState<any>(null);
  const [continuationTimer, setContinuationTimer] = useState(30);
  const [endReason, setEndReason] = useState<{ reason: string; message: string } | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const deviceRef = useRef<any>(null);
  const callRef = useRef<any>(null);
  const localVideoRef = useRef<HTMLDivElement | null>(null);
  const remoteVideoRef = useRef<HTMLDivElement | null>(null);
  const localTracksRef = useRef<any[]>([]);
  const cancelledRef = useRef(false);
  const hasSetupRef = useRef(false);
  const hasAcceptedRef = useRef(false);

  useEffect(() => {
    cancelledRef.current = false;
    
    const finalSocketUrl = typeof window !== "undefined" 
      ? (window.location.origin.includes("localhost") ? "http://localhost:6543" : window.location.origin)
      : SOCKET_URL;

    if (!hasSetupRef.current) {
      hasSetupRef.current = true;
      socketRef.current = io(`${finalSocketUrl}/call`, {
        withCredentials: true,
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current!;
    const onConnect = () => {
      console.log("🟢 [Socket] Connected to call room", sessionId);
      socket.emit("join_call_room", { sessionId });
    };

    if (socket.connected) onConnect();
    else socket.on("connect", onConnect);

    let pollTimer: NodeJS.Timeout | null = null;
    const checkSessionStatus = async () => {
      const [res, err] = await http.get<any>(`/call/session/${sessionId}`);
      if (err) {
        console.error("Failed to fetch session", err);
        return;
      }

      const session = res?.data || res;
      if (!session) return;

      setSessionData(session);
      sessionDataRef.current = session;
      setCallType(session.type);

      // 1. Transition to accepted/active
      if (!hasAcceptedRef.current && session.status === "active") {
        console.log("🔄 [Poll] Session active, connecting...");
        handleCallAccepted(session);
      } 
      // 2. Transition to ended
      else if (session.status === "completed" || session.status === "cancelled" || session.status === "rejected") {
        console.log("🔄 [Poll] Session ended on server, cleaning up...");
        if (pollTimer) {
          clearInterval(pollTimer);
          pollTimer = null;
        }
        handleCallEnded();
      }
      // 3. Local preview for video
      else if (!hasAcceptedRef.current && session.type === "video") {
        startLocalVideoPreview();
      }
    };

    checkSessionStatus();
    pollTimer = setInterval(checkSessionStatus, 3000);

    const handleCallAccepted = async (data?: any) => {
      if (cancelledRef.current || hasAcceptedRef.current) return;
      hasAcceptedRef.current = true;
      setStatus("connecting");

      const [tokenResponse, tokenError] = await http.get<any>(`/call/token/${sessionId}`);
      
      if (tokenError) {
        if (!cancelledRef.current) {
          toast.error("Could not connect call.");
          setStatus("ended");
        }
        return;
      }

      const tokenData = tokenResponse?.data || tokenResponse;
      const myToken = tokenData?.token || data?.token;
      const roomName = tokenData?.roomName || data?.roomName;
      const sessionPayload = tokenData?.session || data?.session;
      setSessionData(sessionPayload);
      sessionDataRef.current = sessionPayload;
      setCallType(sessionPayload?.type || "audio");

      try {
        if (sessionPayload?.type === "video") await initVideoCall(myToken, roomName);
        else await initAudioCall(myToken);
      } catch (err) {
        if (!cancelledRef.current) {
          toast.error("Twilio Initialization failed.");
          setStatus("ended");
        }
      }
    };

    socket.on("call_accepted", handleCallAccepted);
    socket.on("call_ended", (data?: any) => {
      console.log("☎ [Socket] call_ended received", data);
      
      if (data && !data.reason) {
          // If data is a full session object, update sessionData for the summary modal
          setSessionData(data);
      } else if (data?.reason) {
          // If it's a forced termination with a reason
          setEndReason(data);
      }
      
      if (!cancelledRef.current) handleCallEnded();
    });

    socket.on("free_time_ending_soon", (data: any) => {
      console.log("📡 [Socket] free_time_ending_soon received", data);
      setFreeLimitData(data);
      setShowFreeEndPrompt(true);
      setContinuationTimer(30);
    });

    socket.on("balance_warning", (data: any) => {
      toast.warning(data.message || "Low balance warning");
    });

    return () => {
      cancelledRef.current = true;
      if (pollTimer) clearInterval(pollTimer);
      socket.off("call_accepted", handleCallAccepted);
      socket.off("call_ended");
      if (timerRef.current) clearInterval(timerRef.current);
      deviceRef.current?.destroy?.();
    };
  }, [sessionId]);

  const startLocalVideoPreview = async () => {
    if (localTracksRef.current.length > 0) return;
    try {
      const TwilioVideo = await import("twilio-video");
      const tracks = await TwilioVideo.createLocalTracks({ audio: true, video: { width: 640 } });
      localTracksRef.current = tracks;
      attachLocalVideo();
    } catch (err) {
      console.error("Failed to start local preview", err);
    }
  };

  const attachLocalVideo = () => {
    const videoTrack = localTracksRef.current.find((t) => t.kind === "video");
    if (videoTrack && localVideoRef.current) {
      const el = videoTrack.attach();
      el.style.cssText = "width:100%; height:100%; object-fit:cover; transform:scaleX(-1);";
      localVideoRef.current.innerHTML = "";
      localVideoRef.current.appendChild(el);
    }
  };

  useEffect(() => {
    if (status === "connected" || status === "ringing") {
      // Small delay to ensure DOM is ready after status change
      const timer = setTimeout(attachLocalVideo, 100);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const initAudioCall = async (token: string) => {
    const { Device } = await import("@twilio/voice-sdk");
    const device = new Device(token, { logLevel: 1, codecPreferences: ["opus", "pcmu"] as any });
    deviceRef.current = device;
    device.on("disconnect", (call: any) => {
      console.log("Twilio device disconnected");
    });
    device.on("error", (err) => { toast.error(`Call error: ${getErrorMessage(err)}`); });
    await device.register();
    const call = await device.connect({ params: { sessionId } });
    callRef.current = call;
    
    // For audio (Conference), we might get 'accept' when connected to Twilio. 
    // Ideally we'd wait for expert, but 'accept' is the best indicator for Voice SDK.
    call.on("accept", () => { 
      setStatus("connected"); 
      startTimer(); 
    });
    call.on("disconnect", (call: any) => {
      console.log("Twilio call disconnected");
    });
  };

  const initVideoCall = async (token: string, roomName: string) => {
    const TwilioVideo = await import("twilio-video");
    let localTracks = localTracksRef.current;
    if (localTracks.length === 0) {
      localTracks = await TwilioVideo.createLocalTracks({ audio: true, video: { width: 640 } });
      localTracksRef.current = localTracks;
    }
    const room = await TwilioVideo.connect(token, { name: roomName, tracks: localTracks });
    callRef.current = room;

    const checkAndStartTimer = () => {
      if (room.participants.size > 0) {
        setStatus("connected");
        startTimer();
      }
    };

    const attachRemoteTrack = (track: any) => {
      if (track.kind === "video" && remoteVideoRef.current) {
        const el = track.attach();
        el.style.cssText = "width:100%; height:100%; object-fit:cover;";
        remoteVideoRef.current.innerHTML = "";
        remoteVideoRef.current.appendChild(el);
      } else if (track.kind === "audio") {
        document.body.appendChild(track.attach());
      }
    };

    room.participants.forEach((p) => {
      p.tracks.forEach((pub: any) => pub.isSubscribed && pub.track && attachRemoteTrack(pub.track));
      p.on("trackSubscribed", attachRemoteTrack);
    });

    room.on("participantConnected", (p) => {
      checkAndStartTimer();
      p.on("trackSubscribed", attachRemoteTrack);
    });

    checkAndStartTimer();
    room.on("participantDisconnected", (p) => {
      console.log("Participant disconnected:", p.identity);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.innerHTML = "";
      }
      toast.warning("Expert disconnected. Waiting for them to rejoin...");
    });
    room.on("reconnecting", (error) => {
      if (error.code === 53001) {
        toast.warning("Network issue detected. Reconnecting...");
      }
    });
    room.on("disconnected", (room, error) => {
      if (error) {
        toast.error("Call disconnected due to network issues.");
      }
      console.log("Room disconnected");
    });
  };

  useEffect(() => {
    if (status === "connected" && sessionData?.max_duration_seconds) {
      if (callDuration >= sessionData.max_duration_seconds && !sessionData.is_free) {
        toast.error("Low balance. Waiting for backend termination.");
      }
    }
  }, [callDuration, sessionData, status]);

  useEffect(() => {
    if (showFreeEndPrompt && continuationTimer > 0) {
      const timer = setInterval(() => setContinuationTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [showFreeEndPrompt, continuationTimer]);

  const startTimer = () => {
    if (timerRef.current) return;
    const start_time = sessionDataRef.current?.start_time;
    const startMs = start_time ? new Date(start_time).getTime() : Date.now();
    
    setCallDuration(Math.floor((Date.now() - startMs) / 1000));
    timerRef.current = setInterval(() => {
        setCallDuration(Math.floor((Date.now() - startMs) / 1000));
    }, 1000);
  };

  const handleCallEnded = () => {
    setStatus("ended");
    if (timerRef.current) clearInterval(timerRef.current);
    deviceRef.current?.destroy?.();
    if (callRef.current?.disconnect) callRef.current.disconnect();
    localTracksRef.current.forEach((t) => t.stop());
    setShowRatingModal(true);
  };

  const handleEndCall = async () => {
    deviceRef.current?.disconnectAll?.();
    if (callRef.current?.disconnect) callRef.current.disconnect();
    
    // Explicitly call end API without try-catch
    const [_, endError] = await http.post<any>(`/call/end`, { 
      sessionId,
      endedBy: 'USER',
      reason: 'User clicked end button'
    });
    if (endError) {
      console.error("Failed to end call via API:", endError);
    }
    
    socketRef.current?.emit("end_call", { sessionId });
    handleCallEnded();
  };

  const [isSpeakerOn, setIsSpeakerOn] = useState(false);

  const toggleMute = () => {
    if (callType === "video") {
      callRef.current?.localParticipant?.audioTracks?.forEach((pub: any) => {
        isMuted ? pub.track.enable() : pub.track.disable();
      });
    } else if (callRef.current) {
      callRef.current.mute(!isMuted);
    }
    setIsMuted(!isMuted);
  };

  const toggleCamera = () => {
    if (callType === "video") {
      callRef.current?.localParticipant?.videoTracks?.forEach((pub: any) => {
        isCameraOff ? pub.track.enable() : pub.track.disable();
      });
      setIsCameraOff(!isCameraOff);
    }
  };

  const toggleSpeaker = async () => {
    // Note: Manual output switching (setSinkId) is not supported on most mobile browsers.
    // On mobile, OS handles speaker routing. We just toggle UI state.
    if (callType !== "audio") {
      // For video, just toggle UI silently
      setIsSpeakerOn(!isSpeakerOn);
      return;
    }

    const device = deviceRef.current;
    if (!device) {
      // No device yet, just toggle UI
      setIsSpeakerOn(!isSpeakerOn);
      return;
    }

    try {
      if (!device.audio?.isOutputSelectionSupported) {
        // Not supported — just toggle UI silently, mobile OS handles it
        setIsSpeakerOn(!isSpeakerOn);
        return;
      }

      const availableDevices = await device.audio.getAvailableOutputDevices();
      const speakerDevice = Array.from(availableDevices.values()).find((d: any) => 
        d.label.toLowerCase().includes('speaker') || d.label.toLowerCase().includes('output')
      );

      if (speakerDevice) {
        if (!isSpeakerOn) {
          await device.audio.speakerDevices.set([(speakerDevice as any).deviceId]);
          toast.success("Speaker ON");
        } else {
          await device.audio.speakerDevices.set(['default']);
          toast.success("Speaker OFF");
        }
        setIsSpeakerOn(!isSpeakerOn);
      } else {
        // Fallback: Just toggle state if no specific speaker device identified,
        // often mobile browsers handle this internally when earpiece is not detected.
        setIsSpeakerOn(!isSpeakerOn);
        toast.info("Switching to speaker...");
      }
    } catch (err) {
      console.error("Failed to toggle speaker:", err);
      toast.error("Could not switch speaker.");
    }
  };

  const handleSubmitReview = async () => {
    if (reviewRating === 0) { toast.warning("Please select a rating"); return; }
    setReviewSubmitting(true);
    
    const expertData = (sessionData as any)?.expert;
    const expertIdVal = expertData?.id || (sessionData as any).expertId;
    
    const [res, error] = await http.post<any>("/reviews", { 
      sessionId, 
      expert_id: expertIdVal, 
      rating: reviewRating, 
      comment: reviewComment.trim() 
    });

    if (error) {
      const errMsg = getErrorMessage(error);
      if (errMsg.toLowerCase().includes('already reviewed')) {
        setReviewSubmitted(true);
        toast.success("Thank you! 💖");
        setTimeout(() => router.push("/"), 1500);
      } else {
        toast.error(errMsg || "Could not submit review.");
        setReviewSubmitting(false);
      }
    } else {
      setReviewSubmitted(true);
      toast.success("Thank you! ⭐");
      setTimeout(() => router.push("/"), 1500);
    }
  };

  return {
    status, isMuted, isCameraOff, callDuration, sessionData, callType,
    showRatingModal, setShowRatingModal, reviewRating, setReviewRating,
    reviewComment, setReviewComment, reviewSubmitting, reviewSubmitted, setReviewSubmitted,
    localVideoRef, remoteVideoRef, handleEndCall, toggleMute, toggleCamera, toggleSpeaker,
    handleSubmitReview, isSpeakerOn,
    showFreeEndPrompt, setShowFreeEndPrompt, freeLimitData, continuationTimer, endReason,
    socket: socketRef.current
  };
};
