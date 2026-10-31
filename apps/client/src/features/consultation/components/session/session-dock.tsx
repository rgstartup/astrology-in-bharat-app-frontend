"use client";

import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Mic,
  MicOff,
  Phone,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";
import type { SessionKind, SessionPhase } from "../../types/session-phase";
import { getSessionPhaseLabel } from "../../types/session-phase";

export type SessionDockProps = {
  kind: SessionKind;
  phase: SessionPhase;
  elapsedText: string;
  rate: number;
  /** Mute state owned by the RTC session — never a local copy. */
  muted: boolean;
  onToggleMute: () => void;
  /** Speaker state owned by the RTC session — never a local copy. */
  speakerMuted: boolean;
  onToggleSpeaker: () => void;
  /** Camera state owned by the RTC session. Video docks only. */
  cameraEnabled?: boolean;
  onToggleCamera?: () => void;
  expanded?: boolean;
  onToggleExpand?: () => void;
  onEnd: () => void;
  onCancelRequest?: () => void;
  className?: string;
};

/**
 * Dock icon for the addon kind.
 *
 * @param props - Session kind.
 * @returns Kind icon element.
 */
function DockKindIcon({ kind }: { kind: SessionKind }) {
  if (kind === "video") return <Video className="size-4" />;
  return <Phone className="size-4" />;
}

/**
 * Live dot for the dock status.
 *
 * @param props - Session phase.
 * @returns Status dot element.
 */
function DockStatusDot({ phase }: { phase: SessionPhase }) {
  if (phase === "live") {
    return (
      <span
        aria-label="Session live"
        className="size-2 shrink-0 rounded-full bg-[#0bdf50]"
      />
    );
  }
  if (phase === "reconnecting") {
    return (
      <span
        aria-label="Reconnecting"
        className="size-2 shrink-0 animate-pulse rounded-full bg-[#c13515]"
      />
    );
  }
  return (
    <span
      aria-label="Connecting"
      className="size-2 shrink-0 animate-pulse rounded-full bg-[#7b7b78]"
    />
  );
}

/**
 * Microphone toggle bound to the RTC session state.
 *
 * @param props - Muted flag and toggle handler.
 * @returns Mic toggle element.
 */
function DockMicToggle({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  if (muted) {
    return (
      <Button
        size="icon"
        aria-label="Unmute microphone"
        aria-pressed="true"
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <MicOff className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Mute microphone"
      aria-pressed="false"
      onClick={onToggle}
      className="size-9 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Mic className="size-4" />
    </Button>
  );
}

/**
 * Camera toggle bound to the RTC session state.
 *
 * @param props - Camera enabled flag and toggle handler.
 * @returns Camera toggle element.
 */
function DockCameraToggle({
  cameraEnabled,
  onToggle,
}: {
  cameraEnabled: boolean;
  onToggle: () => void;
}) {
  if (!cameraEnabled) {
    return (
      <Button
        size="icon"
        aria-label="Turn camera on"
        aria-pressed="true"
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <VideoOff className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Turn camera off"
      aria-pressed="false"
      onClick={onToggle}
      className="size-9 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Video className="size-4" />
    </Button>
  );
}

/**
 * Speaker toggle bound to the RTC session state.
 *
 * @param props - Speaker muted flag and toggle handler.
 * @returns Speaker toggle element.
 */
function DockSpeakerToggle({
  speakerMuted,
  onToggle,
}: {
  speakerMuted: boolean;
  onToggle: () => void;
}) {
  if (speakerMuted) {
    return (
      <Button
        size="icon"
        aria-label="Turn speaker on"
        aria-pressed="true"
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        <VolumeX className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label="Turn speaker off"
      aria-pressed="false"
      onClick={onToggle}
      className="size-9 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      <Volume2 className="size-4" />
    </Button>
  );
}

/**
 * Camera toggle slot rendered only for video docks that own camera state.
 *
 * @param props - Session kind and camera state.
 * @returns Camera toggle or null.
 */
function CameraSlot({
  kind,
  cameraEnabled,
  onToggleCamera,
}: {
  kind: SessionKind;
  cameraEnabled?: boolean;
  onToggleCamera?: () => void;
}) {
  if (kind !== "video") return null;
  if (cameraEnabled === undefined || !onToggleCamera) return null;
  return (
    <DockCameraToggle cameraEnabled={cameraEnabled} onToggle={onToggleCamera} />
  );
}

/**
 * Expand toggle for the addon panel.
 *
 * @param props - Expanded flag and toggle handler.
 * @returns Expand button element.
 */
function ExpandToggle({
  expanded,
  onToggle,
  kind,
}: {
  expanded: boolean;
  onToggle?: () => void;
  kind: SessionKind;
}) {
  if (!onToggle) return null;
  if (expanded) {
    return (
      <Button
        size="icon"
        variant="ghost"
        aria-label={
          kind === "voice" ? "Collapse voice panel" : "Collapse video panel"
        }
        onClick={onToggle}
        className="size-9 shrink-0 rounded-full text-[#111111] hover:bg-[#f5f1ec]"
      >
        <ChevronUp className="size-4" />
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="ghost"
      aria-label={
        kind === "voice" ? "Expand voice panel" : "Expand video panel"
      }
      onClick={onToggle}
      className="size-9 shrink-0 rounded-full text-[#111111] hover:bg-[#f5f1ec]"
    >
      <ChevronDown className="size-4" />
    </Button>
  );
}

/**
 * Requesting-phase dock actions: cancel only.
 *
 * @param props - Cancel handler.
 * @returns Cancel action element.
 */
function RequestingActions({ onCancel }: { onCancel: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onCancel}
      className="h-9 shrink-0 rounded-full border-[#d3cec6] bg-white px-4 text-[13px] font-medium text-[#111111] hover:bg-[#f5f1ec]"
    >
      Cancel
    </Button>
  );
}

/**
 * Persistent addon dock pinned above the chat message list. Chat stays fully
 * interactive underneath: the dock is a compact control strip, never a
 * replacement. Tapping expand opens the full voice/video panel below it.
 *
 * @param props - Kind, phase, timer, rate, and callbacks.
 * @returns Session dock element.
 */
export function SessionDock({
  kind,
  phase,
  elapsedText,
  rate,
  muted,
  onToggleMute,
  speakerMuted,
  onToggleSpeaker,
  cameraEnabled,
  onToggleCamera,
  expanded = false,
  onToggleExpand,
  onEnd,
  onCancelRequest,
  className,
}: SessionDockProps) {
  if (phase === "ended") {
    return null;
  }
  if (phase === "requesting" || phase === "connecting") {
    return (
      <div
        className={cn(
          "flex shrink-0 items-center justify-between gap-2 border-b border-[#d3cec6] bg-white px-3 py-2 md:px-4",
          className,
        )}
      >
        <div className="flex min-w-0 items-center gap-2">
          <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f5f1ec] text-[#111111]">
            <DockKindIcon kind={kind} />
          </span>
          <span className="flex min-w-0 items-center gap-1.5">
            <DockStatusDot phase={phase} />
            <span className="truncate text-[13px] font-medium text-[#111111]">
              {getSessionPhaseLabel(kind, phase)}
            </span>
          </span>
        </div>
        <RequestingActions onCancel={onCancelRequest ?? onEnd} />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-2 border-b border-[#d3cec6] bg-white px-3 py-2 md:px-4",
        className,
      )}
    >
      <div className="flex min-w-0 items-center gap-2">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#111111] text-white">
          <DockKindIcon kind={kind} />
        </span>
        <span className="flex min-w-0 items-center gap-1.5">
          <DockStatusDot phase={phase} />
          <span className="truncate text-[13px] font-medium text-[#111111]">
            {getSessionPhaseLabel(kind, phase)}
          </span>
          <span className="hidden shrink-0 font-mono text-[13px] font-semibold text-[#111111] tabular-nums sm:inline">
            {elapsedText}
          </span>
          <span className="hidden shrink-0 rounded-md bg-[#f5f1ec] px-1.5 py-0.5 text-[11px] font-bold text-[#111111] tabular-nums md:inline">
            Rs.{rate}/min
          </span>
        </span>
      </div>
      <div className="flex shrink-0 items-center gap-1.5">
        <DockMicToggle muted={muted} onToggle={onToggleMute} />
        <CameraSlot
          kind={kind}
          cameraEnabled={cameraEnabled}
          onToggleCamera={onToggleCamera}
        />
        <DockSpeakerToggle
          speakerMuted={speakerMuted}
          onToggle={onToggleSpeaker}
        />
        <ExpandToggle
          expanded={expanded}
          onToggle={onToggleExpand}
          kind={kind}
        />
        <Button
          size="icon"
          aria-label={kind === "voice" ? "End voice" : "End video"}
          onClick={onEnd}
          className="size-9 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
        >
          <PhoneOff className="size-4" />
        </Button>
      </div>
    </div>
  );
}
