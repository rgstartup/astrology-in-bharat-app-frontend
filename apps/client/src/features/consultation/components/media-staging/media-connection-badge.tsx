import React from "react";
import { Check, Loader2 } from "@repo/design/lucide";
import { cn } from "@repo/design/cn";
import type { MediaConnectionStep, MediaKind } from "../types/media-connection-types";

type MediaConnectionBadgeProps = {
  kind: MediaKind;
  step: MediaConnectionStep;
  expertName: string;
  className?: string;
};

/**
 * Spinner indicator for active asynchronous connection steps.
 *
 * @returns Animated loader icon element.
 */
function StepSpinner() {
  return <Loader2 className="size-3.5 animate-spin text-[#111111]" />;
}

/**
 * Green checkmark indicator for completed connection steps.
 *
 * @returns Confirmed check icon element.
 */
function StepCheck() {
  return (
    <span className="flex size-4 items-center justify-center rounded-full bg-[#111111] text-white">
      <Check className="size-2.5 stroke-[3]" />
    </span>
  );
}

/**
 * Indicator icon slot for local participant step.
 *
 * @param props - Current connection step.
 * @returns Resolved icon element.
 */
function LocalStatusIcon({ step }: { step: MediaConnectionStep }) {
  if (step === "token_connecting") {
    return <StepSpinner />;
  }
  return <StepCheck />;
}

/**
 * Label for the local participant status.
 *
 * @param props - Current media kind and step.
 * @returns Status label text.
 */
function LocalStatusLabel({
  kind,
  step,
}: {
  kind: MediaKind;
  step: MediaConnectionStep;
}) {
  if (step === "token_connecting") {
    return <span>Securing your connection…</span>;
  }
  if (kind === "video") {
    return <span>Your camera & mic are ready</span>;
  }
  return <span>Your audio is ready</span>;
}

/**
 * Indicator icon slot for remote peer step.
 *
 * @param props - Current connection step.
 * @returns Resolved icon element.
 */
function RemoteStatusIcon({ step }: { step: MediaConnectionStep }) {
  if (step === "ready") {
    return <StepCheck />;
  }
  return <StepSpinner />;
}

/**
 * Label for remote peer status.
 *
 * @param props - Expert name and connection step.
 * @returns Status label text.
 */
function RemoteStatusLabel({
  expertName,
  step,
}: {
  expertName: string;
  step: MediaConnectionStep;
}) {
  if (step === "ready") {
    return <span>{expertName} connected</span>;
  }
  if (step === "token_connecting") {
    return <span>Waiting for token handshake…</span>;
  }
  return <span>Waiting for {expertName} to connect…</span>;
}

/**
 * Dual checklist showing connection progress for both the client device and the expert.
 *
 * @param props - Media kind, connection step, expert name, styling.
 * @returns Dual connection checklist element.
 */
export function MediaConnectionBadge({
  kind,
  step,
  expertName,
  className,
}: MediaConnectionBadgeProps) {
  return (
    <div
      className={cn(
        "flex w-full max-w-sm flex-col gap-2 rounded-xl border border-[#d3cec6] bg-white p-3.5 shadow-none",
        className,
      )}
    >
      <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#111111]">
        <LocalStatusIcon step={step} />
        <LocalStatusLabel kind={kind} step={step} />
      </div>
      <div className="h-px w-full bg-[#f0ebe3]" />
      <div className="flex items-center gap-2.5 text-[13px] font-medium text-[#626260]">
        <RemoteStatusIcon step={step} />
        <RemoteStatusLabel expertName={expertName} step={step} />
      </div>
    </div>
  );
}
