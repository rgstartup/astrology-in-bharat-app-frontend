"use client";

import React from "react";
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Compass,
  MapPin,
  MessageSquare,
  Mic,
  Moon,
  Phone,
  ShieldCheck,
  Sparkles,
  User,
  Video,
  X,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ClientIntakeProfile, ExpertSessionKind } from  "../types";

export type ExpertWaitStep = "mic_access" | "accept_pending" | "connecting_media" | "ready";

export interface ExpertCallWaitingModalProps {
  client: ClientIntakeProfile;
  kind?: ExpertSessionKind;
  step?: ExpertWaitStep;
  micGranted?: boolean;
  onGrantMic?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  countdown?: number | null;
  ratePerMinute?: number;
  timedOut?: boolean;
  cancelled?: boolean;
  onClose?: () => void;
  className?: string;
}

/**
 * Step status indicator dot or completed checkmark.
 */
function StepIndicator({
  isCompleted,
  isActive,
  stepNumber,
}: {
  isCompleted: boolean;
  isActive: boolean;
  stepNumber: number;
}) {
  if (isCompleted) {
    return (
      <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-white shadow-xs">
        <CheckCircle2 className="size-4" />
      </span>
    );
  }

  if (isActive) {
    return (
      <span className="relative flex size-6 shrink-0 items-center justify-center">
        <span className="absolute size-6 animate-ping rounded-full bg-orange-400/30" />
        <span className="flex size-6 items-center justify-center rounded-full border-2 border-orange-500 bg-white text-xs font-bold text-orange-600">
          {stepNumber}
        </span>
      </span>
    );
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-xs font-medium text-slate-400">
      {stepNumber}
    </span>
  );
}

/**
 * Avatar corner mode indicator icon.
 */
function ModeBadgeIcon({ kind }: { kind: ExpertSessionKind }) {
  if (kind === "video") {
    return <Video className="size-3 text-purple-600" />;
  }
  if (kind === "chat") {
    return <MessageSquare className="size-3 text-amber-600" />;
  }
  return <Phone className="size-3 text-emerald-600" />;
}

/**
 * Accept button icon based on session kind.
 */
function AcceptButtonIcon({ kind }: { kind: ExpertSessionKind }) {
  if (kind === "video") {
    return <Video className="size-3.5" />;
  }
  if (kind === "chat") {
    return <MessageSquare className="size-3.5" />;
  }
  return <Phone className="size-3.5" />;
}

/**
 * Accept button label based on session kind.
 */
function getAcceptButtonLabel(kind: ExpertSessionKind): string {
  if (kind === "video") return "Accept Video";
  if (kind === "chat") return "Accept Chat";
  return "Accept Call";
}

/**
 * Header tag based on session kind.
 */
function getModalHeaderBadge(kind: ExpertSessionKind): string {
  if (kind === "video") return "Incoming Video Call";
  if (kind === "chat") return "Incoming Chat Consultation";
  return "Incoming Voice Call";
}

/**
 * Step: Microphone access row for expert (voice/video only).
 */
function ExpertMicStepRow({
  isCompleted,
  isActive,
  onGrantMic,
}: {
  isCompleted: boolean;
  isActive: boolean;
  onGrantMic?: () => void;
}) {
  if (isCompleted) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left">
        <StepIndicator isCompleted={true} isActive={false} stepNumber={1} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-emerald-950">Microphone access</p>
          <p className="text-[11px] text-emerald-700">Microphone verified</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-orange-200/80 bg-orange-50/40 p-3 text-left">
      <div className="flex items-center gap-3">
        <StepIndicator isCompleted={false} isActive={isActive} stepNumber={1} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">Microphone access</p>
          <p className="text-[11px] text-slate-600">Verify microphone access to take calls</p>
        </div>
      </div>
      <Button
        type="button"
        onClick={onGrantMic}
        className="mt-1 h-9 w-full gap-2 rounded-lg bg-slate-900 text-xs font-semibold text-white hover:bg-black"
      >
        <Mic className="size-3.5" />
        <span>Allow microphone</span>
      </Button>
    </div>
  );
}

/**
 * Step: Accept consultation request row for expert.
 */
function ExpertAcceptStepRow({
  isCompleted,
  isActive,
  stepNumber,
  kind,
  clientName,
  onAccept,
  onDecline,
}: {
  isCompleted: boolean;
  isActive: boolean;
  stepNumber: number;
  kind: ExpertSessionKind;
  clientName: string;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  const acceptLabel = getAcceptButtonLabel(kind);
  const completedText = kind === "chat" ? "Chat accepted" : "Call accepted";
  const activePromptText = kind === "chat" ? `${clientName} is requesting a chat…` : `${clientName} is calling…`;

  if (isCompleted) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left">
        <StepIndicator isCompleted={true} isActive={false} stepNumber={stepNumber} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-emerald-950">Accept consultation</p>
          <p className="text-[11px] text-emerald-700">{completedText}</p>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="flex flex-col gap-2 rounded-xl border border-orange-200/80 bg-orange-50/40 p-3 text-left">
        <div className="flex items-center gap-3">
          <StepIndicator isCompleted={false} isActive={true} stepNumber={stepNumber} />
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-900">Accept consultation</p>
            <p className="text-[11px] text-orange-700">{activePromptText}</p>
          </div>
        </div>
        <div className="mt-1 flex gap-2">
          <Button
            type="button"
            onClick={onAccept}
            className="h-9 flex-1 gap-1.5 rounded-lg bg-emerald-600 text-xs font-semibold text-white hover:bg-emerald-700"
          >
            <AcceptButtonIcon kind={kind} />
            <span>{acceptLabel}</span>
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onDecline}
            className="h-9 rounded-lg border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Decline
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-left opacity-60">
      <StepIndicator isCompleted={false} isActive={false} stepNumber={stepNumber} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-700">Accept consultation</p>
        <p className="text-[11px] text-slate-400">Awaiting mic verification</p>
      </div>
    </div>
  );
}

/**
 * Step: Secure connection row for expert with redirect countdown.
 */
function ExpertConnectionStepRow({
  isCompleted,
  isActive,
  stepNumber,
  kind,
  countdown,
}: {
  isCompleted: boolean;
  isActive: boolean;
  stepNumber: number;
  kind: ExpertSessionKind;
  countdown?: number | null;
}) {
  if (isCompleted) {
    let subtitle = "Redirecting to consultation room…";
    if (typeof countdown === "number" && countdown > 0) {
      subtitle = `Redirecting to consultation room in ${countdown}s…`;
    }

    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left">
        <StepIndicator isCompleted={true} isActive={false} stepNumber={stepNumber} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-emerald-950">Secure connection</p>
          <p className="text-[11px] font-medium text-emerald-700 tabular-nums">{subtitle}</p>
        </div>
      </div>
    );
  }

  if (isActive) {
    let activeConnectingText = "Connecting audio stream with client…";
    if (kind === "chat") {
      activeConnectingText = "Preparing live chat room…";
    } else if (kind === "video") {
      activeConnectingText = "Connecting video stream with client…";
    }

    return (
      <div className="flex items-center gap-3 rounded-xl border border-orange-200/80 bg-orange-50/40 p-3 text-left">
        <StepIndicator isCompleted={false} isActive={true} stepNumber={stepNumber} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">Secure connection</p>
          <p className="text-[11px] text-orange-700">{activeConnectingText}</p>
        </div>
      </div>
    );
  }

  let handshakeLabel = "Audio handshake";
  if (kind === "chat") {
    handshakeLabel = "Chat handshake";
  } else if (kind === "video") {
    handshakeLabel = "Video handshake";
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-left opacity-60">
      <StepIndicator isCompleted={false} isActive={false} stepNumber={stepNumber} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-700">Secure connection</p>
        <p className="text-[11px] text-slate-400">{handshakeLabel}</p>
      </div>
    </div>
  );
}

/**
 * Devotee Vedic birth chart and astro parameters review card.
 */
function DevoteeChartDetails({ client }: { client: ClientIntakeProfile }) {
  const hasAstroDetails = Boolean(
    client.dateOfBirth ||
      client.timeOfBirth ||
      client.placeOfBirth ||
      client.rashi ||
      client.nakshatra,
  );

  if (!hasAstroDetails) return null;

  return (
    <div className="mt-3.5 w-full rounded-2xl border border-orange-100 bg-orange-50/40 p-3 text-left">
      <div className="flex items-center justify-between mb-2">
        <span className="flex items-center gap-1.5 text-[11px] font-bold text-orange-950 uppercase tracking-wide">
          <Sparkles className="size-3 text-orange-500" />
          <span>Devotee Kundli Details</span>
        </span>
        <span className="text-[10px] text-orange-800 font-medium">Vedic Chart</span>
      </div>

      <div className="grid grid-cols-2 gap-1.5 text-[11px]">
        <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-orange-100/60 p-2">
          <Calendar className="size-3 text-slate-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">DOB</p>
            <p className="font-semibold text-slate-900 truncate">
              {client.dateOfBirth || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-orange-100/60 p-2">
          <Clock className="size-3 text-slate-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">TOB</p>
            <p className="font-semibold text-slate-900 truncate">
              {client.timeOfBirth || "Not provided"}
            </p>
          </div>
        </div>

        <div className="col-span-2 flex items-center gap-1.5 rounded-lg bg-white/90 border border-orange-100/60 p-2">
          <MapPin className="size-3 text-slate-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">POB</p>
            <p className="font-semibold text-slate-900 truncate">
              {client.placeOfBirth || "Not provided"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-orange-100/60 p-2">
          <Moon className="size-3 text-slate-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">Moon Rashi</p>
            <p className="font-semibold text-orange-900 truncate">
              {client.rashi || "Calculating..."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-lg bg-white/90 border border-orange-100/60 p-2">
          <Compass className="size-3 text-slate-500 shrink-0" />
          <div className="min-w-0 flex-1">
            <p className="text-[10px] text-slate-500">Nakshatra</p>
            <p className="font-semibold text-orange-900 truncate">
              {client.nakshatra || "Calculating..."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Content state rendered when consultation request timed out.
 */
function TimedOutState({
  clientName,
  onClose,
  className,
}: {
  clientName: string;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full max-w-[380px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl font-sans text-[#111111] text-center",
        className,
      )}
    >
      <div className="size-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shadow-inner mx-auto my-2">
        <AlertCircle className="size-8" />
      </div>

      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-3 rounded-full bg-amber-50 border border-amber-200/60 text-amber-700 text-[11px] font-semibold tracking-wide uppercase">
        Request Expired
      </div>

      <h3 className="mt-2 text-base font-bold text-slate-900 tracking-tight">
        Consultation Timed Out
      </h3>

      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-[270px] mx-auto">
        The consultation request from{" "}
        <span className="font-semibold text-slate-800">{clientName}</span> timed out
        without response.
      </p>

      <Button
        type="button"
        onClick={onClose}
        className="mt-6 w-full h-10 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
      >
        Dismiss
      </Button>
    </div>
  );
}

/**
 * Content state rendered when consultation request was cancelled by client.
 */
function CancelledState({
  clientName,
  onClose,
  className,
}: {
  clientName: string;
  onClose?: () => void;
  className?: string;
}) {
  return (
    <div
      role="alert"
      className={cn(
        "relative w-full max-w-[380px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl font-sans text-[#111111] text-center",
        className,
      )}
    >
      <div className="size-16 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-500 shadow-inner mx-auto my-2">
        <XCircle className="size-8" />
      </div>

      <div className="inline-flex items-center gap-1 px-2.5 py-0.5 mt-3 rounded-full bg-rose-50 border border-rose-200/60 text-rose-700 text-[11px] font-semibold tracking-wide uppercase">
        Cancelled by Devotee
      </div>

      <h3 className="mt-2 text-base font-bold text-slate-900 tracking-tight">
        Consultation Cancelled
      </h3>

      <p className="mt-1.5 text-xs text-slate-500 leading-relaxed max-w-[270px] mx-auto">
        <span className="font-semibold text-slate-800">{clientName}</span> cancelled this
        consultation request before acceptance.
      </p>

      <Button
        type="button"
        onClick={onClose}
        className="mt-6 w-full h-10 rounded-xl bg-slate-900 hover:bg-black text-white text-xs font-semibold cursor-pointer"
      >
        Dismiss
      </Button>
    </div>
  );
}

/**
 * Expert Consultation Waiting Modal.
 *
 * Implements the pre-room connection flow for experts across chat, voice, and video:
 * - For Voice/Video:
 *   1. Give mic access
 *   2. Review devotee Kundli details and accept the join
 *   3. Establish connection (with redirect countdown)
 * - For Chat:
 *   1. Review devotee Kundli details and accept the join
 *   2. Establish connection (with redirect countdown)
 *
 * Once the final step completes, immediately redirects into the live consultation room.
 */
export function ExpertCallWaitingModal({
  client,
  kind = "voice",
  step = "accept_pending",
  micGranted = true,
  onGrantMic,
  onAccept,
  onDecline,
  countdown,
  ratePerMinute = 30,
  timedOut = false,
  cancelled = false,
  onClose,
  className,
}: ExpertCallWaitingModalProps) {
  if (timedOut) {
    return (
      <TimedOutState
        clientName={client.name}
        onClose={onClose ?? onDecline}
        className={className}
      />
    );
  }

  if (cancelled) {
    return (
      <CancelledState
        clientName={client.name}
        onClose={onClose ?? onDecline}
        className={className}
      />
    );
  }

  const isChat = kind === "chat";
  const isMicDone = isChat || micGranted || step !== "mic_access";
  const isAcceptDone = step === "connecting_media" || step === "ready";
  const isConnectionDone = step === "ready";

  const isStep1Active = !isChat && step === "mic_access" && !micGranted;
  const isStep2Active = isMicDone && step === "accept_pending";
  const isStep3Active = isAcceptDone && step === "connecting_media";

  let acceptStepNum = 2;
  let connectionStepNum = 3;
  if (isChat) {
    acceptStepNum = 1;
    connectionStepNum = 2;
  }

  const headerBadge = getModalHeaderBadge(kind);

  return (
    <div
      className={cn(
        "relative w-full max-w-[380px] rounded-3xl border border-slate-100 bg-white p-6 shadow-2xl font-sans text-[#111111]",
        className,
      )}
    >
      {/* Devotee Header Snapshot */}
      <div className="flex flex-col items-center text-center">
        <div className="relative flex items-center justify-center my-2">
          <div className="relative size-16 rounded-full p-1 bg-gradient-to-tr from-orange-500 to-amber-400 shadow-xl shadow-orange-500/20">
            <Avatar className="size-full border-2 border-white">
              {client.avatar && <AvatarImage src={client.avatar} alt={client.name} />}
              <AvatarFallback className="bg-orange-50 text-orange-600 font-bold text-base">
                <User className="size-6" />
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 size-6 rounded-full bg-white shadow-md border border-slate-100 flex items-center justify-center">
              <ModeBadgeIcon kind={kind} />
            </div>
          </div>
        </div>

        <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/60 text-orange-700 text-[11px] font-bold tracking-wide uppercase">
          <span>{headerBadge}</span>
        </div>

        <h3 className="mt-1.5 text-base font-bold text-slate-900 tracking-tight">
          {client.name}
        </h3>

        {client.topic && (
          <p className="mt-0.5 text-xs text-slate-500 line-clamp-1 max-w-[270px]">
            {client.topic}
          </p>
        )}
      </div>

      {/* Devotee Kundli Chart Review */}
      <DevoteeChartDetails client={client} />

      {/* Checklist (Voice/Video: 3 steps; Chat: 2 steps) */}
      <div className="mt-4 flex flex-col gap-2.5">
        {!isChat && (
          <ExpertMicStepRow
            isCompleted={isMicDone}
            isActive={isStep1Active}
            onGrantMic={onGrantMic}
          />
        )}
        <ExpertAcceptStepRow
          isCompleted={isAcceptDone}
          isActive={isStep2Active}
          stepNumber={acceptStepNum}
          kind={kind}
          clientName={client.name}
          onAccept={onAccept}
          onDecline={onDecline}
        />
        <ExpertConnectionStepRow
          isCompleted={isConnectionDone}
          isActive={isStep3Active}
          stepNumber={connectionStepNum}
          kind={kind}
          countdown={countdown}
        />
      </div>

      {/* Held Rate Note & Zero-Charge Guarantee */}
      <div className="mt-3 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
        <span className="font-medium text-slate-500">Earnings rate:</span>
        <span className="font-semibold text-slate-900 tabular-nums">
          Rs.{ratePerMinute}/min · Timer held
        </span>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] text-slate-400">
        <ShieldCheck className="size-3.5 text-emerald-600" />
        <span>Billing starts only when both parties connect</span>
      </div>
    </div>
  );
}

export default ExpertCallWaitingModal;
