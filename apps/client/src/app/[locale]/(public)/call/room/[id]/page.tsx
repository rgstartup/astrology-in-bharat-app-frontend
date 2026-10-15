"use client";

import React from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/navigation";
import {
  PhoneOff,
  Volume2,
  Mic,
  MicOff,
  Video,
  VideoOff,
  User,
  Loader2,
  Clock,
} from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useCallLogic } from "./useCallLogic";
import FreeEndPromptModal from "./free-end-prompt-modal.component";
import SessionSummaryModal, {
  type SessionSummary,
} from "@/app/[locale]/consultation/[id]/session-summary";

/**
 * Resolves per minute rate for audio or video calls from expert profile with waterfall fallbacks.
 */
const resolveCallRate = (
  expert: any,
  callType: "audio" | "video",
): number => {
  if (!expert) return 0;
  if (callType === "video") {
    if (typeof expert.pricing?.video_call_price === "number") return expert.pricing.video_call_price;
    if (typeof expert.video_call_price === "number") return expert.video_call_price;
  }
  if (typeof expert.pricing?.call_price === "number") return expert.pricing.call_price;
  if (typeof expert.call_price === "number") return expert.call_price;
  if (typeof expert.price === "number") return expert.price;
  return 0;
};

/**
 * Calculates session total charge from duration and call rate.
 */
const calculateCallCost = (
  isFree: boolean,
  durationSecs: number,
  ratePerMin: number,
): number => {
  if (isFree) return 0;
  if (durationSecs > 0 && ratePerMin > 0) {
    const minutes = Math.ceil(durationSecs / 60);
    return Math.round(minutes * ratePerMin);
  }
  return 0;
};

/**
 * Calculates remaining wallet balance with floor at 0.
 */
const calculateRemainingBalance = (balance: number, cost: number): number => {
  const net = balance - cost;
  if (net < 0) return 0;
  return net;
};

function CallStatusBadge({
  status,
  callDuration,
  isFree,
  maxDuration,
  statusLabel,
}: {
  status: string;
  callDuration: number;
  isFree: boolean;
  maxDuration: number;
  statusLabel: string;
}) {
  const isConnected = status === "connected";
  const badgeBorder = isConnected ? "text-primary" : "text-white/60";
  const remainingSeconds = Math.max(0, maxDuration - callDuration);

  return (
    <div className="flex items-center gap-3 bg-[#1A1A1A]/5 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-xl animate-in fade-in slide-in-from-top-4 duration-500">
      {isConnected && (
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
      )}
      <span className={`text-xs font-black uppercase tracking-[0.2em] ${badgeBorder}`}>
        {isConnected ? (
          <span className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 border-r border-white/20 pr-4">
              <span className="text-[9px] text-white/50">ELAPSED</span>
              <Clock className="w-3 h-3" />
              {statusLabel}
            </span>
            <span className="flex items-center gap-1.5">
              <span className="text-[9px] text-white/50">
                {isFree ? "FREE TIME" : "TIME LEFT"}
              </span>
              <Clock className="w-3 h-3 text-primary" />
              <span className="text-primary">
                {formatDuration(remainingSeconds)}
              </span>
            </span>
          </span>
        ) : (
          statusLabel
        )}
      </span>
    </div>
  );
}

function VideoCallStage({
  status,
  isSwapped,
  setIsSwapped,
  remoteVideoRef,
  localVideoRef,
  isCameraOff,
  expertName,
}: {
  status: string;
  isSwapped: boolean;
  setIsSwapped: (val: boolean) => void;
  remoteVideoRef: React.RefObject<HTMLDivElement | null>;
  localVideoRef: React.RefObject<HTMLDivElement | null>;
  isCameraOff: boolean;
  expertName: string;
}) {
  const isConnected = status === "connected";

  return (
    <div className="w-full relative h-[65vh] max-h-[600px] bg-neutral-900 rounded-3xl overflow-hidden">
      {/* Remote Video Container */}
      <div
        onClick={() => isSwapped && setIsSwapped(false)}
        className={`transition-all duration-500 bg-neutral-800 ${
          isSwapped
            ? "absolute bottom-4 right-4 w-32 h-40 rounded-2xl border-2 border-white/20 shadow-2xl z-40 cursor-pointer overflow-hidden hover:border-primary/50"
            : "w-full h-full z-10"
        }`}
      >
        <div ref={remoteVideoRef as any} className="w-full h-full" />

        {!isSwapped && isConnected && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-50">
            <span className="text-white text-xs font-bold">{expertName}</span>
          </div>
        )}
        {isSwapped && (
          <div className="absolute bottom-1 left-0 right-0 text-center bg-black/40 z-50">
            <span className="text-white/80 text-[7px] font-black uppercase tracking-tighter">
              {expertName}
            </span>
          </div>
        )}
      </div>

      {/* Local Video Container */}
      <div
        onClick={() => !isSwapped && isConnected && setIsSwapped(true)}
        className={`transition-all duration-500 bg-neutral-700 ${
          !isSwapped
            ? isConnected
              ? "absolute bottom-4 right-4 w-32 h-40 rounded-2xl border-2 border-white/20 shadow-2xl z-40 cursor-pointer overflow-hidden hover:border-primary/50"
              : "w-full h-full z-10"
            : "w-full h-full z-10"
        }`}
      >
        <div ref={localVideoRef as any} className="w-full h-full" />

        {isCameraOff && (
          <div className="absolute inset-0 bg-neutral-800 flex items-center justify-center z-[45]">
            <User className="w-12 h-12 text-neutral-400" />
          </div>
        )}

        {!isSwapped && !isConnected && (
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center text-center p-6 gap-4 z-50">
            {status === "ringing" && (
              <>
                <div className="w-20 h-20 rounded-full bg-primary flex items-center justify-center animate-bounce shadow-2xl shadow-primary/50">
                  <Video className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white drop-shadow-lg">
                    Waiting for expert...
                  </h3>
                  <p className="text-white/70 font-bold mt-1">
                    Please wait for the expert to pick the call
                  </p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A]/10 rounded-full border border-white/20">
                  <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  <span className="text-[10px] uppercase tracking-widest font-black">
                    Connecting Securely
                  </span>
                </div>
              </>
            )}
            {status === "connecting" && (
              <>
                <Loader2 className="w-10 h-10 animate-spin text-primary" />
                <p className="text-white font-bold uppercase tracking-widest text-sm">
                  Initializing Secure Stream...
                </p>
              </>
            )}
          </div>
        )}

        <div className="absolute bottom-1 left-0 right-0 text-center bg-black/40 z-50">
          <span className="text-white/80 text-[7px] font-black uppercase tracking-tighter">
            {!isSwapped ? (isConnected ? "You" : "") : "You"}
          </span>
        </div>
        {isSwapped && (
          <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/10 z-50">
            <span className="text-white text-xs font-bold">You</span>
          </div>
        )}
      </div>
    </div>
  );
}

function AudioCallStage({
  status,
  expertAvatar,
  expertName,
  statusLabel,
}: {
  status: string;
  expertAvatar?: string | null;
  expertName: string;
  statusLabel: string;
}) {
  const isRinging = status === "ringing";
  const isConnecting = status === "connecting";
  const isConnected = status === "connected";

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className={`relative w-36 h-36 rounded-full border-4 border-primary/30 p-1 ${isRinging ? "animate-bounce" : ""}`}
      >
        <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center overflow-hidden">
          {expertAvatar ? (
            <div className="relative w-full h-full">
              <Image
                src={expertAvatar}
                alt="Expert"
                fill
                className="object-cover"
              />
            </div>
          ) : (
            <User className="w-16 h-16 text-neutral-600" />
          )}
        </div>
        {isRinging && (
          <div className="absolute -inset-4 rounded-full border border-primary/20 animate-ping" />
        )}
      </div>

      <div className="text-center">
        <h2 className="text-2xl font-black">{expertName}</h2>
        <div className="flex items-center justify-center gap-2 mt-2 text-primary text-sm font-bold">
          {(isRinging || isConnecting) && (
            <Loader2 className="w-4 h-4 animate-spin" />
          )}
          {isConnected && (
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          )}
          <span className="uppercase tracking-widest text-[11px]">
            {statusLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

function CallControlsBar({
  isMuted,
  toggleMute,
  handleEndCall,
  callType,
  isCameraOff,
  toggleCamera,
  isSpeakerOn,
  toggleSpeaker,
}: {
  isMuted: boolean;
  toggleMute: () => void;
  handleEndCall: () => void;
  callType: "audio" | "video";
  isCameraOff: boolean;
  toggleCamera: () => void;
  isSpeakerOn: boolean;
  toggleSpeaker: () => void;
}) {
  const muteBg = isMuted ? "bg-[#1A1A1A] text-white" : "bg-[#1A1A1A]/10 hover:bg-[#1A1A1A]/20";
  const cameraBg = isCameraOff ? "bg-[#1A1A1A] text-white" : "bg-[#1A1A1A]/10 hover:bg-[#1A1A1A]/20";
  const speakerBg = isSpeakerOn ? "bg-[#1A1A1A] text-white" : "bg-[#1A1A1A]/10 hover:bg-[#1A1A1A]/20";

  return (
    <div className="flex items-center gap-6 mt-2">
      <button
        onClick={toggleMute}
        className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${muteBg}`}
      >
        {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </button>

      <button
        onClick={handleEndCall}
        className="w-20 h-20 rounded-full bg-red-500 shadow-2xl shadow-red-500/30 flex items-center justify-center hover:bg-red-600 hover:scale-105 active:scale-95 transition-all"
      >
        <PhoneOff className="w-10 h-10" />
      </button>

      {callType === "video" && (
        <button
          onClick={toggleCamera}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${cameraBg}`}
        >
          {isCameraOff ? (
            <VideoOff className="w-6 h-6" />
          ) : (
            <Video className="w-6 h-6" />
          )}
        </button>
      )}

      {callType === "audio" && (
        <button
          onClick={toggleSpeaker}
          className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${speakerBg}`}
        >
          <Volume2 className="w-6 h-6" />
        </button>
      )}
    </div>
  );
}

const formatDuration = (seconds: number) => {
  const m = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function CallRoomPage() {
  const router = useRouter();
  const params = useParams();
  const {
    status,
    isMuted,
    isCameraOff,
    callDuration,
    sessionData,
    callType,
    showRatingModal,
    reviewRating,
    setReviewRating,
    reviewComment,
    setReviewComment,
    reviewSubmitted,
    setReviewSubmitted,
    localVideoRef,
    remoteVideoRef,
    handleEndCall,
    toggleMute,
    toggleCamera,
    toggleSpeaker,
    isSpeakerOn,
    showFreeEndPrompt,
    freeLimitData,
    continuationTimer,
    endReason,
    socket,
  } = useCallLogic();

  const { balance } = useAuthStore();

  const callRate = React.useMemo(() => {
    return resolveCallRate(sessionData?.expert, callType);
  }, [sessionData?.expert, callType]);

  const callSessionSummary = React.useMemo((): SessionSummary | null => {
    if (!sessionData && !endReason) return null;

    const isFree = Boolean(sessionData?.is_free);
    const duration = callDuration > 0 ? callDuration : 0;
    const durationMinutes = duration > 0 ? duration / 60 : 0;
    const totalCost = calculateCallCost(isFree, duration, callRate);
    const remainingBalance = calculateRemainingBalance(balance, totalCost);
    const freeMinutes = Number(sessionData?.free_minutes) || 0;

    let reason: string | undefined = undefined;
    if (endReason?.reason) {
      reason = endReason.reason;
    }

    let message: string | undefined = undefined;
    if (endReason?.message) {
      message = endReason.message;
    }

    return {
      status: "completed",
      reason,
      message,
      duration_seconds: duration,
      durationMins: durationMinutes,
      pricePerMinute: callRate,
      price_per_minute: callRate,
      totalCost,
      total_cost: totalCost,
      remainingBalance,
      isFree,
      is_free: isFree,
      freeMinutes,
    };
  }, [sessionData, endReason, callDuration, callRate, balance]);

  const statusLabel: Record<string, string> = {
    ringing: "Ringing... Waiting for expert",
    connecting: "Connecting...",
    connected: formatDuration(callDuration),
    ended: "Call ended",
  };

  const [isSwapped, setIsSwapped] = React.useState(false);
  const expertName = sessionData?.expert?.user?.name || "Expert";
  const expertAvatar = sessionData?.expert?.user?.avatar;

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#fd6410,transparent_70%)] animate-pulse" />
      </div>

      <div className="z-10 w-full max-w-4xl flex flex-col items-center gap-6">
        <CallStatusBadge
          status={status}
          callDuration={callDuration}
          isFree={Boolean(sessionData?.is_free)}
          maxDuration={sessionData?.max_duration_seconds || 300}
          statusLabel={statusLabel[status]}
        />

        {callType === "video" ? (
          <VideoCallStage
            status={status}
            isSwapped={isSwapped}
            setIsSwapped={setIsSwapped}
            remoteVideoRef={remoteVideoRef}
            localVideoRef={localVideoRef}
            isCameraOff={isCameraOff}
            expertName={expertName}
          />
        ) : (
          <AudioCallStage
            status={status}
            expertAvatar={expertAvatar}
            expertName={expertName}
            statusLabel={statusLabel[status]}
          />
        )}

        {status !== "ended" && (
          <CallControlsBar
            isMuted={isMuted}
            toggleMute={toggleMute}
            handleEndCall={handleEndCall}
            callType={callType}
            isCameraOff={isCameraOff}
            toggleCamera={toggleCamera}
            isSpeakerOn={isSpeakerOn}
            toggleSpeaker={toggleSpeaker}
          />
        )}

        {status === "ended" && !showRatingModal && (
          <p className="text-neutral-400 text-sm font-bold animate-pulse">
            Call ended...
          </p>
        )}
      </div>

      <div className="absolute bottom-8 text-[9px] text-white/20 font-black uppercase tracking-[0.5em]">
        🔒 256-Bit Encrypted Session
      </div>

      <SessionSummaryModal
        showModal={showRatingModal}
        isDarkMode={false}
        sessionSummary={callSessionSummary}
        freeMinutes={sessionData?.free_minutes || 0}
        reviewRating={reviewRating}
        setReviewRating={setReviewRating}
        reviewComment={reviewComment}
        setReviewComment={setReviewComment}
        reviewSubmitted={reviewSubmitted}
        setReviewSubmitted={setReviewSubmitted}
        sessionId={sessionData?.id || null}
        expertData={sessionData?.expert}
        router={router}
      />

      <FreeEndPromptModal
        showFreeEndPrompt={showFreeEndPrompt}
        isDarkMode={true}
        continuationTimer={continuationTimer}
        freeLimitData={freeLimitData}
        expertData={sessionData?.expert}
        router={router}
        socket={socket}
        sessionId={params.id as string}
        handleEndChat={handleEndCall}
      />
    </div>
  );
}
