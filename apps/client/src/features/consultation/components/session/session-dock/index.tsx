"use client";

import React, { useState } from "react";
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
import { useDirectVoiceContext } from "../../../providers/direct-voice.provider";
import { useSwitchToVoiceContext } from "../../../providers/switch-to-voice.provider";
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
  // Local expand state (UI-only, not synced to RTC)
  const [expanded, setExpanded] = useState(false);

  // Context hooks - only one will be active based on session mode
  const directVoice = useDirectVoiceContext();
  const switchToVoice = useSwitchToVoiceContext();

  // Determine which context is active
  const isDirectVoice = directVoice.isDirectVoice;

  // Select state and callbacks based on active mode
  const dv = directVoice.directVoice;
  const sv = switchToVoice.voice;

  const muted = isDirectVoice ? dv.muted : sv.muted;
  const speakerMuted = isDirectVoice ? dv.speakerMuted : sv.speakerMuted;
  const cameraEnabled = isDirectVoice ? dv.cameraEnabled : sv.cameraEnabled;
  const currentPhase = isDirectVoice ? dv.phase : sv.voicePhase;
  const active = isDirectVoice ? dv.active : sv.voiceActive;
  const elapsedText = isDirectVoice ? directVoice.elapsedText : switchToVoice.elapsedText;
  const rate = isDirectVoice ? directVoice.rate : switchToVoice.rate;

  // Select callbacks based on active mode
  const toggleMic = isDirectVoice
    ? directVoice.toggleMic
    : switchToVoice.toggleMic;
  const toggleSpeaker = isDirectVoice
    ? directVoice.toggleSpeaker
    : switchToVoice.toggleSpeaker;
  const toggleCamera = isDirectVoice
    ? directVoice.toggleCamera
    : switchToVoice.toggleCamera;
  const endVoice = isDirectVoice
    ? directVoice.endVoice
    : switchToVoice.endVoice;
  const cancelVoice = isDirectVoice
    ? directVoice.cancelVoice
    : switchToVoice.cancelVoice;
  const switchToChat = isDirectVoice
    ? directVoice.switchToChat
    : switchToVoice.minimizeVoice;

  const toggleExpand = () => setExpanded((prev) => !prev);

  // For direct voice mode, PhoneOff / end action opens the voice cancel dialog
  // which pauses billing timer and allows user to continue over chat or end session.
  // For switch-to-voice mode, endVoice properly ends the voice consultation
  // while keeping chat alive. backToChat just minimizes the voice stage.
  const onEnd = isDirectVoice
    ? directVoice.openVoiceCancel
    : () => void switchToVoice.endVoice();
  const onCancelRequest = isDirectVoice
    ? directVoice.openVoiceCancel
    : () => void switchToVoice.endVoice();

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
        <SessionModeDropdown
          kind={kind}
          onSwitchToChat={switchToChat}
          onUpgradeToVideo={kind === "voice" ? undefined : undefined}
          onSwitchToVoice={kind === "video" ? undefined : undefined}
        />
        <ExpandToggle expanded={expanded} onToggle={toggleExpand} kind={kind} />
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
