"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { api as http } from "@/lib/api";
import { CallStatus, CallSession } from "@/lib/types";

export const useCallLogic = () => {
  const SOCKET_URL = "http://localhost:6543";
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [status, setStatus] = useState<CallStatus>("ringing");
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [sessionData, setSessionData] = useState<CallSession | null>(null);
  const [callType, setCallType] = useState<"audio" | "video">("audio");

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

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
    if (!hasSetupRef.current) {
      hasSetupRef.current = true;
      socketRef.current = io(`${SOCKET_URL}/call`, {
        withCredentials: true,
        transports: ["websocket"],
      });
    }

    const socket = socketRef.current!;
    const onConnect = () => {
      socket.emit("join_call_room", { sessionId: parseInt(sessionId) });
      checkAndStartLocalVideo();
    };

    if (socket.connected) onConnect();
    else socket.on("connect", onConnect);

    let pollTimer: NodeJS.Timeout | null = null;
    const checkAndStartLocalVideo = async () => {
      if (hasAcceptedRef.current) return;
      const [res, err] = await http.get<any>(`/call/session/${sessionId}`);
      if (err) {
        console.error("Failed to pre-fetch session", err);
        return;
      }

      const session = res?.data || res;
      if (session) {
        setCallType(session.type);
        setSessionData(session);
        if (session.type === "video") startLocalVideoPreview();
        if (session.status === "active" || session.status === "ongoing") {
          if (pollTimer) clearInterval(pollTimer);
          handleCallAccepted(session);
        }
      }
    };

    checkAndStartLocalVideo();
    pollTimer = setInterval(checkAndStartLocalVideo, 3000);

    const handleCallAccepted = async (data?: any) => {
      if (cancelledRef.current || hasAcceptedRef.current) return;
      hasAcceptedRef.current = true;
      if (pollTimer) clearInterval(pollTimer);
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
    socket.on("call_ended", () => !cancelledRef.current && handleCallEnded());

    return () => {
      cancelledRef.current = true;
      if (pollTimer) clearInterval(pollTimer);
      socket.off("call_accepted", handleCallAccepted);
      socket.off("call_ended");
      if (timerRef.current) clearInterval(timerRef.current);
      deviceRef.current?.destroy?.();
    };
  }, [sessionId, SOCKET_URL]);

  const startLocalVideoPreview = async () => {
    try {
      const TwilioVideo = await import("twilio-video");
      const tracks = await TwilioVideo.createLocalTracks({ audio: true, video: { width: 640 } });
      localTracksRef.current = tracks;
      const videoTrack = tracks.find((t) => t.kind === "video");
      if (videoTrack && localVideoRef.current) {
        const el = videoTrack.attach();
        el.style.cssText = "width:100%; height:100%; object-fit:cover; transform:scaleX(-1);";
        localVideoRef.current.innerHTML = "";
        localVideoRef.current.appendChild(el);
      }
    } catch (err) {
      console.error("Failed to start local preview", err);
    }
  };

  const initAudioCall = async (token: string) => {
    const { Device } = await import("@twilio/voice-sdk");
    const device = new Device(token, { logLevel: 1, codecPreferences: ["opus", "pcmu"] as any });
    deviceRef.current = device;
    device.on("disconnect", handleCallEnded);
    device.on("error", (err) => { toast.error(`Call error: ${err.message}`); handleCallEnded(); });
    await device.register();
    const call = await device.connect({ params: { sessionId } });
    callRef.current = call;
    call.on("accept", () => { setStatus("connected"); startTimer(); });
    call.on("disconnect", handleCallEnded);
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
    setStatus("connected");
    startTimer();

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
      p.on("trackSubscribed", attachRemoteTrack);
    });
    room.on("participantDisconnected", handleCallEnded);
    room.on("disconnected", handleCallEnded);
  };

  const startTimer = () => {
    if (timerRef.current) return;
    timerRef.current = setInterval(() => setCallDuration((prev) => prev + 1), 1000);
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
    const [_, endError] = await http.post<any>(`/call/end`, { sessionId: parseInt(sessionId) });
    if (endError) {
      console.error("Failed to end call via API:", endError);
    }
    
    socketRef.current?.emit("end_call", { sessionId: parseInt(sessionId) });
    handleCallEnded();
  };

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

  const handleSubmitReview = async () => {
    if (reviewRating === 0) { toast.warning("Please select a rating"); return; }
    setReviewSubmitting(true);
    
    const expertData = (sessionData as any)?.expert;
    const expertIdVal = expertData?.id || (sessionData as any).expertId;
    
    const [res, error] = await http.post<any>("/reviews", { 
      sessionId: parseInt(sessionId), 
      expertId: expertIdVal, 
      rating: reviewRating, 
      comment: reviewComment.trim() 
    });

    if (error) {
      toast.error(error.message || "Could not submit review.");
      setReviewSubmitting(false);
    } else {
      setReviewSubmitted(true);
      toast.success("Thank you! ⭐");
      setTimeout(() => router.push("/"), 1500);
    }
  };

  return {
    status, isMuted, isCameraOff, callDuration, sessionData, callType,
    showRatingModal, setShowRatingModal, reviewRating, setReviewRating,
    reviewComment, setReviewComment, reviewSubmitting, reviewSubmitted,
    localVideoRef, remoteVideoRef, handleEndCall, toggleMute, toggleCamera,
    handleSubmitReview
  };
};
