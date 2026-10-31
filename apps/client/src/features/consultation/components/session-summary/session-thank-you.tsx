"use client";

import React from "react";
import { CheckCircle2, ShieldCheck, Sparkles, AlertCircle, Clock } from "@repo/design/lucide";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";
import { Badge } from "@repo/design/shadcn";
import { Button } from "@repo/design/shadcn";

import type { IExpert } from "@repo/lib";

export type SessionThankYouExpert =
  | IExpert
  | {
      id?: number | string;
      name?: string;
      avatar?: string | null;
      avatar_url?: string | null;
      profession?: { name?: string } | string;
      specializations?: Array<{ name?: string }> | string[] | any[];
      rating?: number;
      [key: string]: unknown;
    }
  | null
  | undefined;

export type SessionThankYouProps = {
  status?: string;
  reason?: string;
  message?: string;
  sessionId?: string | null;
  expertData?: SessionThankYouExpert;
  onClose?: () => void;
  router: { push: (path: string) => void };
};

/**
 * Extracts display initials from expert name.
 *
 * @param name - The full name of the expert.
 * @returns 1-2 uppercase initials.
 */
export function getInitials(name?: string): string {
  if (!name) return "EX";
  const parts = name.trim().split(/\s+/);
  const first = parts[0];
  if (parts.length === 1 && first) return first.slice(0, 2).toUpperCase();
  const last = parts[parts.length - 1];
  const firstChar = first?.[0] ?? "";
  const lastChar = last?.[0] ?? "";
  return (firstChar + lastChar).toUpperCase() || "EX";
}

/**
 * Extracts the primary specialty or profession label using waterfall resolution.
 *
 * @param expert - The expert data object.
 * @returns Human-readable profession or default label.
 */
export function getProfessionLabel(expert?: SessionThankYouExpert): string {
  if (!expert) return "Verified Astrologer";

  const raw = expert as Record<string, any>;
  if (typeof raw.profession === "string") return raw.profession;
  if (raw.profession && typeof raw.profession.name === "string") {
    return raw.profession.name;
  }

  if (Array.isArray(raw.professions) && raw.professions.length > 0) {
    const firstProf = raw.professions[0];
    if (typeof firstProf === "string") return firstProf;
    if (firstProf?.profession?.name) return String(firstProf.profession.name);
    if (firstProf?.name) return String(firstProf.name);
  }

  if (Array.isArray(raw.specializations) && raw.specializations.length > 0) {
    const first = raw.specializations[0];
    if (typeof first === "string") return first;
    if (first?.specialization?.name) return String(first.specialization.name);
    if (first?.name) return String(first.name);
  }

  return "Verified Astrologer";
}

/**
 * Renders status badge in waterfall style.
 */
export function StatusBadge({ status }: { status?: string }) {
  if (status === "terminated") {
    return (
      <Badge variant="destructive" className="gap-1.5 px-3 py-1 font-medium">
        <AlertCircle className="size-3.5" />
        Session Ended by Admin
      </Badge>
    );
  }
  if (status === "expired") {
    return (
      <Badge variant="secondary" className="gap-1.5 bg-[#ebe7e1] text-[#626260] px-3 py-1 font-medium">
        <Clock className="size-3.5" />
        Request Missed
      </Badge>
    );
  }
  return (
    <Badge
      variant="outline"
      className="gap-1.5 border-[#d3cec6] bg-white text-[#111111] px-3 py-1 font-medium shadow-xs"
    >
      <CheckCircle2 className="size-3.5 text-emerald-600" />
      Consultation Complete
    </Badge>
  );
}

/**
 * Derives heading text based on session lifecycle state.
 */
export function getHeadingText(status?: string): string {
  if (status === "terminated") return "Session concluded";
  if (status === "expired") return "Session not started";
  return "Thank you for consulting!";
}

/**
 * Derives explanatory subtitle using waterfall guard clauses.
 */
export function getSubtitleText(status?: string, reason?: string, message?: string): string {
  if (status === "terminated") {
    if (message) return message;
    return "This session was ended by an administrator for policy or safety reasons.";
  }
  if (status === "expired") {
    return "The expert was unable to connect in time. Your wallet has not been charged.";
  }
  if (reason === "insufficient_balance") {
    return "Your session ended due to running out of wallet balance. Thank you for your time.";
  }
  if (reason === "free_limit_ended_no_balance") {
    return "Your introductory free consultation minutes have ended. Thank you for consulting.";
  }
  return "We hope your consultation provided insightful guidance and clarity. Here is your session summary.";
}

/**
 * Resolves label for bottom exit button.
 */
export function getFooterButtonLabel(status?: string): string {
  if (status === "terminated") return "Back to Home";
  if (status === "expired") return "Back to Home";
  return "Close";
}

/**
 * Renders the left panel of the session summary modal.
 * Presents a warm gratitude message, expert profile snapshot, and session reference details.
 *
 * @param props - Component properties for the thank you section.
 * @returns The rendered JSX element for the left column.
 */
export default function SessionThankYou({
  status,
  reason,
  message,
  sessionId,
  expertData,
  onClose,
  router,
}: SessionThankYouProps) {
  const expertName = expertData?.name || "Consultation Expert";
  const avatarSrc = expertData?.avatar || expertData?.avatar_url || undefined;
  const professionLabel = getProfessionLabel(expertData);

  const handleClose = () => {
    if (onClose) {
      onClose();
      return;
    }
    router.push("/");
  };

  return (
    <div className="flex h-full flex-col justify-between gap-6">
      <div className="flex flex-col gap-5">
        {/* Status pill */}
        <div className="flex items-center gap-2">
          <StatusBadge status={status} />
        </div>

        {/* Heading & Subtitle */}
        <div className="flex flex-col gap-1.5">
          <h2 className="text-2xl font-semibold tracking-[-0.4px] text-[#111111] sm:text-[26px]">
            {getHeadingText(status)}
          </h2>
          <p className="text-sm leading-relaxed text-[#626260]">
            {getSubtitleText(status, reason, message)}
          </p>
        </div>

        {/* Expert Profile Card */}
        {expertData && (
          <div className="flex items-center gap-3.5 rounded-xl border border-[#ece8e1] bg-white p-3.5 shadow-xs">
            <Avatar className="size-11 border border-[#ece8e1]">
              <AvatarImage src={avatarSrc} alt={expertName} />
              <AvatarFallback className="bg-[#f5f1ec] text-xs font-semibold text-[#111111]">
                {getInitials(expertName)}
              </AvatarFallback>
            </Avatar>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-[#111111]">{expertName}</span>
                {expertData.rating && (
                  <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-[#111111]">
                    <Sparkles className="size-3 text-amber-500 fill-amber-500" />
                    {expertData.rating}
                  </span>
                )}
              </div>
              <span className="truncate text-xs text-[#626260]">{professionLabel}</span>
            </div>
          </div>
        )}

        {/* Reassurance & Metadata Box */}
        <div className="flex flex-col gap-2 rounded-xl border border-[#ece8e1] bg-white/70 p-3.5 text-xs text-[#626260]">
          <div className="flex items-center gap-2 font-medium text-[#111111]">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Transcript Saved Securely</span>
          </div>
          <p className="leading-normal">
            Your chat transcript and consultation record are permanently preserved in your consultation history.
          </p>
          {sessionId && (
            <div className="mt-1 flex items-center justify-between border-t border-[#ece8e1] pt-2 font-mono text-[11px] text-[#9c9fa5]">
              <span>Session Ref</span>
              <span className="truncate max-w-[160px]">{sessionId}</span>
            </div>
          )}
        </div>
      </div>

      {/* Footer secondary action */}
      <div className="flex flex-col gap-2">
        <Button
          variant="outline"
          className="h-11 w-full rounded-xl border-[#e3ded6] bg-white text-sm font-medium text-[#111111] hover:bg-[#ebe7e1] cursor-pointer"
          onClick={handleClose}
        >
          {getFooterButtonLabel(status)}
        </Button>
      </div>
    </div>
  );
}
