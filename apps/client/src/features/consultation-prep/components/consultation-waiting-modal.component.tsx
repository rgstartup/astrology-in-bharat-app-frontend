"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Sparkles, XCircle, AlertCircle, ShieldCheck, X } from "@repo/design/lucide";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";
import type { ConsultationMode } from "@/store/consultationPrepStore";
import {
  ConsultationModeIcon,
  getConsultationModeLabel,
} from "./consultation-mode-icon";
import {
  ConsultationWaitStepper,
  type ConsultationWaitStep,
} from "./consultation-wait-stepper.component";

export interface ConsultationWaitingModalProps {
  open: boolean;
  mode?: ConsultationMode;
  expertName: string;
  expertAvatar?: string;
  step?: ConsultationWaitStep;
  micGranted?: boolean;
  onGrantMic?: () => void;
  voiceRate?: number;
  rejected?: boolean;
  timedOut?: boolean;
  micDenied?: boolean;
  onRetryMic?: () => void;
  onCancel: () => void;
  onClose: () => void;
}

/**
 * Fallback initials from full name.
 *
 * @param name - Subject display name.
 * @returns Initials uppercase letters.
 */
function getInitials(name: string): string {
  if (!name) return "EX";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0] || "E";
  const second = parts[1] || first[1] || "X";
  return `${first[0] || "E"}${second[0] || "X"}`.toUpperCase();
}

/**
 * Status icon with smooth animation, layered radial glow, and mode badge.
 */
function WaitingVisual({
  expertName,
  expertAvatar,
  mode,
}: {
  expertName: string;
  expertAvatar?: string;
  mode: ConsultationMode;
}) {
  return (
    <div className="relative flex items-center justify-center my-2">
      {/* Background ambient glow */}
      <div className="absolute size-24 rounded-full bg-orange-400/15 blur-2xl animate-pulse" />
      <div className="absolute size-20 rounded-full border border-orange-500/20 animate-ping opacity-30" />

      {/* Center avatar badge */}
      <div className="relative size-16 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-amber-400 shadow-xl shadow-orange-500/20">
        <Avatar className="size-full border-2 border-white">
          {expertAvatar && <AvatarImage src={expertAvatar} alt={expertName} />}
          <AvatarFallback className="bg-orange-50 text-orange-600 font-bold text-base">
            {getInitials(expertName)}
          </AvatarFallback>
        </Avatar>

        {/* Orbiting mode badge */}
        <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center">
          <ConsultationModeIcon mode={mode} className="size-3 text-orange-600" />
        </div>
      </div>
    </div>
  );
}

/**
 * Animated ripple dots pulse to indicate live background network polling.
 */
function WaveDots() {
  return (
    <div
      className="flex items-center justify-center gap-1.5 py-1"
      role="status"
      aria-label="Waiting for network response"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 200}ms` }}
          className="size-1.5 rounded-full bg-orange-500 animate-bounce motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

/**
 * Content state rendered when consultation request was explicitly declined.
 */
function RejectedState({
  expertName,
  onClose,
}: {
  expertName: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center my-2">
        <div className="size-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-inner">
          <XCircle className="size-8" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-3 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-[11px] font-semibold tracking-wide uppercase">
        Declined
      </div>

      <h3 className="mt-2 text-lg font-bold text-slate-900 tracking-tight">
        Expert is unavailable
      </h3>

      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-[260px]">
        <span className="font-semibold text-slate-800">{expertName}</span> cannot take new consultation requests right now. No charges were deducted from your wallet balance.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer"
      >
        Dismiss
      </button>
    </div>
  );
}

/**
 * Content state rendered when the consultation request timed out without expert action.
 */
function TimedOutState({
  expertName,
  onClose,
}: {
  expertName: string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative flex items-center justify-center my-2">
        <div className="size-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner">
          <AlertCircle className="size-8" />
        </div>
      </div>

      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-3 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-semibold tracking-wide uppercase">
        Request Expired
      </div>

      <h3 className="mt-2 text-lg font-bold text-slate-900 tracking-tight">
        No response from expert
      </h3>

      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-[260px]">
        <span className="font-semibold text-slate-800">{expertName}</span> did not accept within the waiting window. Your wallet balance remains completely untouched.
      </p>

      <button
        type="button"
        onClick={onClose}
        className="mt-6 w-full h-11 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold tracking-wide transition-all shadow-md active:scale-[0.98] cursor-pointer"
      >
        Close
      </button>
    </div>
  );
}

/**
 * Content state rendered when microphone permission was denied by user or browser.
 */
function MicPermissionDeniedState({
  expertName,
  onRetry,
  onClose,
}: {
  expertName: string;
  onRetry?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative my-2 flex items-center justify-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-rose-100 bg-rose-50 text-rose-500 shadow-inner">
          <AlertCircle className="size-8" />
        </div>
      </div>

      <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-rose-200/60 bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-rose-700">
        Microphone Blocked
      </div>

      <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
        Microphone Access Denied
      </h3>

      <p className="mt-1.5 max-w-[270px] text-xs leading-relaxed text-slate-500">
        Microphone permission is required to start a consultation with <span className="font-semibold text-slate-800">{expertName}</span>. Please allow microphone access in your browser site settings.
      </p>

      <div className="mt-6 flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={onRetry ?? onClose}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold tracking-wide text-white shadow-md transition-all hover:bg-black active:scale-[0.98]"
        >
          Try Again
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold tracking-wide text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Content state rendered when real-time media connection failed to establish.
 */
function MediaConnectionFailedState({
  expertName,
  error,
  onRetry,
  onClose,
}: {
  expertName: string;
  error?: string | null;
  onRetry?: () => void;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative my-2 flex items-center justify-center">
        <div className="flex size-16 items-center justify-center rounded-2xl border border-amber-100 bg-amber-50 text-amber-600 shadow-inner">
          <XCircle className="size-8" />
        </div>
      </div>

      <div className="mt-3 inline-flex items-center gap-1 rounded-full border border-amber-200/60 bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-amber-700">
        Connection Failed
      </div>

      <h3 className="mt-2 text-lg font-bold tracking-tight text-slate-900">
        Could Not Connect Audio
      </h3>

      <p className="mt-1.5 max-w-[270px] text-xs leading-relaxed text-slate-500">
        Unable to establish audio connection with <span className="font-semibold text-slate-800">{expertName}</span>. {error || "Please verify your network connection and retry."}
      </p>

      <div className="mt-6 flex w-full flex-col gap-2">
        <button
          type="button"
          onClick={onRetry ?? onClose}
          className="flex h-11 w-full cursor-pointer items-center justify-center rounded-xl bg-slate-900 text-xs font-semibold tracking-wide text-white shadow-md transition-all hover:bg-black active:scale-[0.98]"
        >
          Retry Connection
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-full cursor-pointer items-center justify-center rounded-xl border border-slate-200 text-xs font-semibold tracking-wide text-slate-700 transition-all hover:bg-slate-50 active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

/**
 * Single-step pending state for Chat consultations.
 */
function ChatWaitingState({
  expertName,
  expertAvatar,
  onCancel,
}: {
  expertName: string;
  expertAvatar?: string;
  onCancel: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <WaitingVisual expertName={expertName} expertAvatar={expertAvatar} mode="chat" />

      <div className="mt-2">
        <WaveDots />
      </div>

      <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-[11px] font-bold tracking-wide uppercase">
        <ConsultationModeIcon mode="chat" className="w-3 h-3" />
        <span>Chat Request</span>
      </div>

      <h3 className="mt-2 text-base font-bold text-slate-900 tracking-tight">
        Connecting with {expertName}
      </h3>

      <p className="mt-1 text-xs text-slate-500 leading-relaxed max-w-[270px]">
        Your consultation request has been notified to the expert. You will enter the chat room automatically once accepted.
      </p>

      <div className="mt-4 flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-50 border border-slate-100 text-[11px] text-slate-500 font-medium">
        <Sparkles className="size-3 text-orange-500" />
        <span>Astrologer is reviewing your chart</span>
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="mt-5 w-full h-10 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-[0.98]"
      >
        Cancel Request
      </button>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="size-3.5 text-emerald-600" />
        <span>No charges apply until consultation starts</span>
      </div>
    </div>
  );
}

/**
 * 3-Step sequential pending state for Voice and Video consultations.
 */
function MediaWaitingState({
  expertName,
  expertAvatar,
  mode,
  step = "waiting_acceptance",
  micGranted = false,
  onGrantMic,
  voiceRate,
  onCancel,
}: {
  expertName: string;
  expertAvatar?: string;
  mode: ConsultationMode;
  step?: ConsultationWaitStep;
  micGranted?: boolean;
  onGrantMic?: () => void;
  voiceRate?: number;
  onCancel: () => void;
}) {
  const modeLabel = getConsultationModeLabel(mode);

  const isConnecting =
    step === "connecting_media" || step === "ready";

  if (isConnecting) {
    const subtitle =
      "Generating secure token and connecting…";

    return (
      <div className="flex flex-col items-center text-center">
        <WaitingVisual expertName={expertName} expertAvatar={expertAvatar} mode={mode} />

        <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-[11px] font-bold tracking-wide uppercase">
          <ConsultationModeIcon mode={mode} className="w-3 h-3" />
          <span>{modeLabel} Consultation</span>
        </div>

        <h3 className="mt-2 text-base font-bold text-slate-900 tracking-tight">
          Connecting to {expertName}
        </h3>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-600">
          <span className="size-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
          <span>{subtitle}</span>
        </div>

        <button
          type="button"
          onClick={onCancel}
          className="mt-5 w-full h-10 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-[0.98]"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center text-center">
      <WaitingVisual expertName={expertName} expertAvatar={expertAvatar} mode={mode} />

      <div className="mt-1 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-[11px] font-bold tracking-wide uppercase">
        <ConsultationModeIcon mode={mode} className="w-3 h-3" />
        <span>{modeLabel} Consultation</span>
      </div>

      <h3 className="mt-1.5 text-base font-bold text-slate-900 tracking-tight">
        Connecting with {expertName}
      </h3>

      <div className="mt-3 w-full">
        <ConsultationWaitStepper
          mode={mode}
          step={step}
          expertName={expertName}
          micGranted={micGranted}
          onGrantMic={onGrantMic}
          rate={voiceRate}
        />
      </div>

      <button
        type="button"
        onClick={onCancel}
        className="mt-4 w-full h-10 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-[0.98]"
      >
        Cancel Request
      </button>

      <div className="mt-2.5 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="size-3.5 text-emerald-600" />
        <span>Timer held · No charges until both connect</span>
      </div>
    </div>
  );
}

/**
 * Modal content switcher with strict waterfall early returns (no ternaries).
 */
function WaitingModalContent(props: ConsultationWaitingModalProps) {
  if (props.rejected) {
    return <RejectedState expertName={props.expertName} onClose={props.onClose} />;
  }

  if (props.timedOut) {
    return <TimedOutState expertName={props.expertName} onClose={props.onClose} />;
  }

  if (props.micDenied) {
    return (
      <MicPermissionDeniedState
        expertName={props.expertName}
        onRetry={props.onRetryMic}
        onClose={props.onClose}
      />
    );
  }

  if (props.mode === "voice" || props.mode === "video") {
    return (
      <MediaWaitingState
        expertName={props.expertName}
        expertAvatar={props.expertAvatar}
        mode={props.mode}
        step={props.step}
        micGranted={props.micGranted}
        onGrantMic={props.onGrantMic}
        voiceRate={props.voiceRate}
        onCancel={props.onCancel}
      />
    );
  }

  return (
    <ChatWaitingState
      expertName={props.expertName}
      expertAvatar={props.expertAvatar}
      onCancel={props.onCancel}
    />
  );
}

/**
 * Consultation Request Waiting Modal supporting chat single-step and voice/video 3-step handshake.
 *
 * Follows OpenWolf Rule 4 (zero JSX ternaries; waterfall early returns).
 *
 * @param props - {@link ConsultationWaitingModalProps}
 * @returns Portal dialog element or null when closed.
 */
export function ConsultationWaitingModal(props: ConsultationWaitingModalProps) {
  const {
    open,
    expertName,
    rejected = false,
    timedOut = false,
    micDenied = false,
    onClose,
  } = props;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const autoDismiss = rejected || timedOut;
  const settled = rejected || timedOut || micDenied;

  useEffect(() => {
    if (!open) return;
    if (!autoDismiss) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [open, autoDismiss, onClose]);

  if (!open) return null;
  if (!mounted) return null;

  const handleBackdropClick = () => {
    if (settled) {
      onClose();
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={handleBackdropClick}
      />

      {/* Modal Dialog Card */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Consultation request for ${expertName}`}
        className="relative w-full max-w-[360px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200"
      >
        {settled && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="absolute top-4 right-4 size-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        )}

        <WaitingModalContent {...props} />
      </div>
    </div>,
    document.body,
  );
}

/** Legacy alias. */
export const ChatWaitingModal = ConsultationWaitingModal;

export default ConsultationWaitingModal;
