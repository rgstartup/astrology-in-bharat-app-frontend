"use client";

import { Pause, Phone, Play, Video } from "lucide-react";
import {
  formatSessionDuration,
  formatSessionTime,
  formatSessionTimeRange,
  isCallMode,
  sessionDurationSeconds,
  type SessionMeta,
} from "./timeline";

type SessionEventTone = "live" | "success" | "warning" | "neutral";

const TONE_CLASS: Record<SessionEventTone, string> = {
  live: "text-emerald-600",
  success: "text-emerald-600",
  warning: "text-amber-600",
  neutral: "text-[#626260]",
};

function lower(value?: string | null): string {
  return (value ?? "").toLowerCase();
}

function isVideo(event: SessionMeta): boolean {
  return (event.mode ?? "").toUpperCase() === "VIDEO_CALL";
}

function callName(event: SessionMeta): string {
  if (isVideo(event)) return "Video call";
  return "Voice call";
}

/** Card name: calls keep their modality, chat sessions are generic. */
function modeName(event: SessionMeta): string {
  if (!isCallMode(event.mode)) return "Session";
  return callName(event);
}

function resolveTone(event: SessionMeta): SessionEventTone {
  const status = lower(event.status);
  if (status === "active") return "live";
  if (status === "completed") return "success";
  if (status === "resumed") return "success";
  if (status === "paused" || status === "cancelled" || status === "expired") return "warning";
  return "neutral";
}

/** Event title; every branch is a full sentence, never a ternary in JSX. */
export function sessionEventTitle(event: SessionMeta): string {
  const status = lower(event.status);
  const name = modeName(event);
  if (status === "paused") return `${name} paused`;
  if (status === "resumed") return `${name} resumed`;
  if (status === "active") {
    if (isCallMode(event.previousMode)) return `${name} reconnected`;
    return `${name} in progress`;
  }
  if (status === "completed") {
    return `${name} ended`;
  }
  if (status === "cancelled") return "Call request cancelled";
  if (status === "expired") return `${name} not answered`;
  if (status === "pending") return "Call requested";
  return `${name} ended`;
}

/** Secondary line: duration and/or clock window. Empty when nothing is known. */
export function sessionEventMeta(event: SessionMeta, mounted: boolean): string {
  if (!mounted) return "";
  const status = lower(event.status);
  const seconds = sessionDurationSeconds(event);
  const duration = seconds === null ? "" : formatSessionDuration(seconds);
  const range = formatSessionTimeRange(event.startedAt, event.endedAt);
  const parts: string[] = [];

  if (status === "paused") {
    if (duration) parts.push(duration);
    if (range) parts.push(range);
    return parts.join(" · ");
  }
  if (status === "resumed") {
    const started = formatSessionTime(event.startedAt);
    if (started) parts.push(`Resumed at ${started}`);
    return parts.join(" · ");
  }
  if (status === "active") {
    const started = formatSessionTime(event.startedAt);
    if (started) parts.push(`Started at ${started}`);
    return parts.join(" · ");
  }
  if (status === "completed") {
    if ((event.nextMode ?? "").toUpperCase() === "CHAT" && duration) {
      parts.push(`${callName(event)} lasted ${duration}`);
    } else if (duration) {
      parts.push(duration);
    }
  }
  if (range) parts.push(range);
  if (status === "pending") parts.push("Waiting for the expert");
  return parts.join(" · ");
}

function SessionEventIcon({ event, tone }: { event: SessionMeta; tone: SessionEventTone }) {
  const status = lower(event.status);
  if (status === "paused" || status === "resumed") {
    const Icon = status === "paused" ? Pause : Play;
    return (
      <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d3cec6] bg-[#ffffff]">
        <Icon className={`h-4 w-4 ${TONE_CLASS[tone]}`} aria-hidden />
      </span>
    );
  }
  const video = isVideo(event);
  if (video) {
    return (
      <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d3cec6] bg-[#ffffff]">
        <Video className={`h-4 w-4 ${TONE_CLASS[tone]}`} aria-hidden />
        <LiveDot visible={tone === "live"} />
      </span>
    );
  }
  return (
    <span className="relative inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#d3cec6] bg-[#ffffff]">
      <Phone className={`h-4 w-4 ${TONE_CLASS[tone]}`} aria-hidden />
      <LiveDot visible={tone === "live"} />
    </span>
  );
}

function LiveDot({ visible }: { visible: boolean }) {
  if (!visible) return null;
  return (
    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-emerald-500" aria-hidden />
  );
}

function SessionEventMetaLine({ event, mounted }: { event: SessionMeta; mounted: boolean }) {
  const text = sessionEventMeta(event, mounted);
  if (!text) return null;
  return <p className="font-sans text-[11px] leading-snug text-[#626260]">{text}</p>;
}

/**
 * One consultation-session lifecycle event (voice/video started, ended,
 * switched to chat, cancelled) rendered inline in the chat stream.
 */
export default function SessionEventCard({ event, mounted }: { event: SessionMeta; mounted: boolean }) {
  const tone = resolveTone(event);
  return (
    <div className="flex justify-center bg-[#f5f1ec] py-1">
      <div className="flex max-w-full items-center gap-3 rounded-xl border border-[#d3cec6] bg-[#ffffff] px-4 py-2.5 shadow-[0_1px_2px_rgba(17,17,17,0.04)]">
        <SessionEventIcon event={event} tone={tone} />
        <div className="flex min-w-0 flex-col gap-0.5">
          <p className="font-sans text-[13px] font-medium leading-snug text-[#111111]">
            {sessionEventTitle(event)}
          </p>
          <SessionEventMetaLine event={event} mounted={mounted} />
        </div>
      </div>
    </div>
  );
}
