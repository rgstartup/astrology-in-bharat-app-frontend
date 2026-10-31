"use client";

import React from "react";
import {
  CheckCircle2,
  Mic,
  Phone,
  ShieldCheck,
  Sparkles,
  Video,
} from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";

export type ConsultationWaitStep =
  "mic_access" | "waiting_acceptance" | "connecting_media" | "ready";

export interface ConsultationWaitStepperProps {
  mode: ConsultationMode;
  step: ConsultationWaitStep;
  expertName: string;
  micGranted?: boolean;
  onGrantMic?: () => void;
  countdown?: number | null;
  rate?: number;
  className?: string;
}

/**
 * Step icon indicator with completed checkmark, active pulse, or upcoming dot.
 *
 * @param props - Status and active flags.
 * @returns Indicator element.
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
 * Step 1: Microphone access confirmation row.
 *
 * @param props - Status and grant handler.
 * @returns Step 1 element.
 */
function MicStepRow({
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
          <p className="text-xs font-semibold text-emerald-950">
            Microphone access
          </p>
          <p className="text-[11px] text-emerald-700">Microphone ready</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl border border-orange-200/80 bg-orange-50/40 p-3 text-left">
      <div className="flex items-center gap-3">
        <StepIndicator isCompleted={false} isActive={isActive} stepNumber={1} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">
            Microphone access
          </p>
          <p className="text-[11px] text-slate-600">
            Permission required for audio
          </p>
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
 * Step 2: Expert acceptance row.
 *
 * @param props - Status and expert name.
 * @returns Step 2 element.
 */
function AcceptStepRow({
  isCompleted,
  isActive,
  expertName,
}: {
  isCompleted: boolean;
  isActive: boolean;
  expertName: string;
}) {
  if (isCompleted) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-emerald-50/50 p-3 text-left">
        <StepIndicator isCompleted={true} isActive={false} stepNumber={2} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-emerald-950">Join request</p>
          <p className="text-[11px] text-emerald-700">{expertName} accepted</p>
        </div>
      </div>
    );
  }

  if (isActive) {
    return (
      <div className="flex items-center gap-3 rounded-xl border border-orange-200/80 bg-orange-50/40 p-3 text-left">
        <StepIndicator isCompleted={false} isActive={true} stepNumber={2} />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold text-slate-900">Join request</p>
          <p className="text-[11px] text-orange-700">
            Waiting for {expertName} to accept…
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/40 p-3 text-left opacity-60">
      <StepIndicator isCompleted={false} isActive={false} stepNumber={2} />
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-slate-700">Join request</p>
        <p className="text-[11px] text-slate-400">Waiting for acceptance</p>
      </div>
    </div>
  );
}

/**
 * 2-Step Progress Stepper for Voice and Video Consultations.
 *
 * Replaces dual waiting lobbies with a single unified, sequential checklist:
 * 1. Give mic access
 * 2. Join accepted
 * (connection is shown as a loading spinner, not a numbered step)
 *
 * Follows OpenWolf Rule 4 (zero JSX ternaries; waterfall early returns).
 *
 * @param props - {@link ConsultationWaitStepperProps}
 * @returns Stepper layout element.
 */
export function ConsultationWaitStepper({
  step,
  expertName,
  micGranted = false,
  onGrantMic,
  countdown,
  rate,
  className,
}: ConsultationWaitStepperProps) {
  const isMicDone = micGranted || step !== "mic_access";
  const isAcceptDone = step === "connecting_media" || step === "ready";
  const isConnectionDone = step === "ready";

  const isStep1Active = step === "mic_access" && !micGranted;
  const isStep2Active = isMicDone && step === "waiting_acceptance";
  const isStep3Active = isAcceptDone && step === "connecting_media";

  return (
    <div className={cn("flex flex-col gap-2.5", className)}>
      <MicStepRow
        isCompleted={isMicDone}
        isActive={isStep1Active}
        onGrantMic={onGrantMic}
      />
      <AcceptStepRow
        isCompleted={isAcceptDone}
        isActive={isStep2Active}
        expertName={expertName}
      />
      {rate !== undefined && (
        <div className="mt-1 flex items-center justify-between rounded-lg bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
          <span className="font-medium text-slate-500">Billing rate:</span>
          <span className="font-semibold text-slate-900 tabular-nums">
            Rs.{rate}/min · Timer held
          </span>
        </div>
      )}
    </div>
  );
}
