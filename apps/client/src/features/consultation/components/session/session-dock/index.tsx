"use client";

import React from "react";
import {
  ChevronDown,
  ChevronUp,
  Menu,
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
import { DockCameraToggle } from "./dock-camera-toggle";
import type { SessionKind, SessionPhase } from "../../../types/session-phase";
import { getSessionPhaseLabel } from "../../../types/session-phase";
import { useVoiceContext } from "../../../providers/voice.provider";
import DockKindIcon from "./dock-kind-icon";
import { DockStatusDot } from "./dock-status-dot";
import { DockMicToggle } from "./dock-mic-toggle";
import { DockSpeakerToggle } from "./dock-speaker-toggle";
import { SessionModeDropdown } from "./dock-session-mode-dropdown";
import { ExpandToggle } from "./dock-expand-toggle";

export type SessionDockProps = {
  kind: SessionKind;
  /** Optional className for styling overrides. */
  className?: string;
};

/**
 * Camera toggle slot rendered only for video docks that own camera state.
 *
 * @param props - Session kind, camera state, and toggle handler.
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
 * Consumes callbacks from context based on session mode:
 * - Direct voice (voice-first): uses `useDirectVoiceContext`
 * - Switch-to-voice (chat upgrade): uses `useSwitchToVoiceContext` + `useRoomActions`
 *
 * @param props - Kind, phase, timer, rate, and state (no callbacks).
 * @returns Session dock element.
 */
export function SessionDock({ className, kind }: SessionDockProps) {
  const voice = useVoiceContext();

  // Select state and callbacks based on active mode
  const muted = voice.muted;
  const speakerMuted = voice.speakerMuted;
  const cameraEnabled = voice.cameraEnabled;
  const currentPhase = voice.phase as SessionPhase;
  const active = voice.active;
  const elapsedText = voice.elapsedText;
  const rate = voice.rate;
  const isPanelExpanded = voice.isPanelExpanded;

  // Callbacks from unified voice context
  const toggleMic = voice.toggleMic;
  const toggleSpeaker = voice.toggleSpeaker;
  const toggleCamera = voice.toggleCamera;
  const switchToChat = voice.switchToChat;
  const toggleExpand = voice.togglePanelExpanded;

  // PhoneOff opens the voice cancel dialog (continue-over-chat or end) and
  // pauses billing while the dialog is open — it never ends the call directly.
  const onEnd = voice.openVoiceCancel;
  const onCancelRequest = voice.cancelVoice;

  if (currentPhase === "ended") {
    return null;
  }
  if (currentPhase === "requesting" || currentPhase === "connecting") {
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
            <DockStatusDot phase={currentPhase} />
            <span className="truncate text-[13px] font-medium text-[#111111]">
              {getSessionPhaseLabel(kind, currentPhase)}
            </span>
          </span>
        </div>
        <RequestingActions onCancel={onCancelRequest} />
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
          <DockStatusDot phase={currentPhase} />
          <span className="truncate text-[13px] font-medium text-[#111111]">
            {getSessionPhaseLabel(kind, currentPhase)}
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
        <DockMicToggle muted={muted} onToggle={toggleMic} />
        <CameraSlot
          kind={kind}
          cameraEnabled={cameraEnabled}
          onToggleCamera={toggleCamera}
        />
        <DockSpeakerToggle
          speakerMuted={speakerMuted}
          onToggle={toggleSpeaker}
        />
        <ExpandToggle
          expanded={isPanelExpanded}
          onToggle={toggleExpand}
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
