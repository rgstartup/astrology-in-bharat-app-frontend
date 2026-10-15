"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { MessageSquare, Sparkles, XCircle, AlertCircle, ShieldCheck, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export type ChatWaitingModalProps = {
  open: boolean;
  expertName: string;
  expertAvatar?: string;
  rejected: boolean;
  timedOut: boolean;
  onCancel: () => void;
  onClose: () => void;
};

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
 * Status icon with smooth animation and layered radial glow.
 */
function WaitingVisual({
  expertName,
  expertAvatar,
}: {
  expertName: string;
  expertAvatar?: string;
}) {
  return (
    <div className="relative flex items-center justify-center my-3">
      {/* Background ambient glow */}
      <div className="absolute size-28 rounded-full bg-orange-400/15 blur-2xl animate-pulse" />
      <div className="absolute size-24 rounded-full border border-orange-500/20 animate-ping opacity-30" />

      {/* Center avatar badge */}
      <div className="relative size-20 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-amber-400 shadow-xl shadow-orange-500/20">
        <Avatar className="size-full border-2 border-white">
          {expertAvatar && <AvatarImage src={expertAvatar} alt={expertName} />}
          <AvatarFallback className="bg-orange-50 text-orange-600 font-bold text-lg">
            {getInitials(expertName)}
          </AvatarFallback>
        </Avatar>

        {/* Orbiting badge */}
        <div className="absolute -bottom-1 -right-1 size-7 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center">
          <MessageSquare className="size-3.5 text-orange-600 fill-orange-50" />
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
      aria-label="Waiting for expert response"
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          style={{ animationDelay: `${i * 200}ms` }}
          className="size-2 rounded-full bg-orange-500 animate-bounce motion-reduce:animate-none"
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
 * Active pending waiting state: animated visual, wave dots, client reassurance note, and cancel CTA.
 */
function ActiveWaitingState({
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
      <WaitingVisual expertName={expertName} expertAvatar={expertAvatar} />

      <div className="mt-3">
        <WaveDots />
      </div>

      <h3 className="mt-3 text-lg font-bold text-slate-900 tracking-tight">
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
        className="mt-6 w-full h-11 rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold tracking-wide transition-all cursor-pointer active:scale-[0.98]"
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
 * Modal content switcher with strict waterfall early returns (no ternaries).
 */
function WaitingModalContent({
  rejected,
  timedOut,
  expertName,
  expertAvatar,
  onCancel,
  onClose,
}: {
  rejected: boolean;
  timedOut: boolean;
  expertName: string;
  expertAvatar?: string;
  onCancel: () => void;
  onClose: () => void;
}) {
  if (rejected) {
    return <RejectedState expertName={expertName} onClose={onClose} />;
  }

  if (timedOut) {
    return <TimedOutState expertName={expertName} onClose={onClose} />;
  }

  return (
    <ActiveWaitingState
      expertName={expertName}
      expertAvatar={expertAvatar}
      onCancel={onCancel}
    />
  );
}

/**
 * Redesigned Consultation Chat Request Waiting Modal.
 *
 * Clean modern aesthetics:
 * - Removed countdown timer display and progress bar for calm, reassuring UX.
 * - Gentle ambient ring glow + expert avatar chip + animated ripple dots.
 * - Clear messaging that user will enter chat room immediately on accept.
 * - Safe cancellation action and zero-charge guarantee note.
 *
 * @param props - Component properties.
 * @returns Portal dialog element or null when closed.
 */
export function ChatWaitingModal({
  open,
  expertName,
  expertAvatar,
  rejected,
  timedOut,
  onCancel,
  onClose,
}: ChatWaitingModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const settled = rejected || timedOut;

  useEffect(() => {
    if (!open) return;
    if (!settled) return;
    const timer = setTimeout(onClose, 3500);
    return () => clearTimeout(timer);
  }, [open, settled, onClose]);

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
        className="relative w-full max-w-[340px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl transition-all animate-in fade-in zoom-in-95 duration-200"
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

        <WaitingModalContent
          rejected={rejected}
          timedOut={timedOut}
          expertName={expertName}
          expertAvatar={expertAvatar}
          onCancel={onCancel}
          onClose={onClose}
        />
      </div>
    </div>,
    document.body,
  );
}

export default ChatWaitingModal;
