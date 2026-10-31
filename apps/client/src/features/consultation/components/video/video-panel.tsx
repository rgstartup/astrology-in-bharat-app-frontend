"use client";

import React from "react";
import {
  Mic,
  MicOff,
  PhoneOff,
  User,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";
import type { SessionPhase } from "../../types/session-phase";

type VideoPanelProps = {
  phase: SessionPhase;
  expertName: string;
  expertAvatar?: string | null;
  elapsedText: string;
  videoRate: number;
  /** Mute state owned by the RTC session — never a local copy. */
  muted: boolean;
  onToggleMute: () => void;
  /** Camera state owned by the RTC session — never a local copy. */
  cameraEnabled: boolean;
  onToggleCamera: () => void;
  /** Speaker state owned by the RTC session — never a local copy. */
  speakerMuted: boolean;
  onToggleSpeaker: () => void;
  onEnd: () => void;
  className?: string;
};

/**
 * Circular 48px panel control with pressed styling.
 *
 * @param props - Pressed flag, label, handler, and icon.
 * @returns Panel control element.
 */
function PanelControl({
  pressed,
  label,
  onToggle,
  children,
}: {
  pressed: boolean;
  label: string;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  if (pressed) {
    return (
      <Button
        size="icon"
        aria-label={label}
        aria-pressed="true"
        onClick={onToggle}
        className="size-12 shrink-0 rounded-full bg-[#111111] text-white hover:bg-black"
      >
        {children}
      </Button>
    );
  }
  return (
    <Button
      size="icon"
      variant="outline"
      aria-label={label}
      aria-pressed="false"
      onClick={onToggle}
      className="size-12 shrink-0 rounded-full border-[#d3cec6] bg-white text-[#111111] hover:bg-[#f5f1ec]"
    >
      {children}
    </Button>
  );
}

/**
 * Microphone toggle bound to the RTC session state.
 *
 * @param props - Muted flag and toggle handler.
 * @returns Mic toggle element.
 */
function PanelMicToggle({
  muted,
  onToggle,
}: {
  muted: boolean;
  onToggle: () => void;
}) {
  if (muted) {
    return (
      <PanelControl pressed label="Unmute microphone" onToggle={onToggle}>
        <MicOff className="size-5" />
      </PanelControl>
    );
  }
  return (
    <PanelControl pressed={false} label="Mute microphone" onToggle={onToggle}>
      <Mic className="size-5" />
    </PanelControl>
  );
}

/**
 * Camera toggle bound to the RTC session state.
 *
 * @param props - Camera enabled flag and toggle handler.
 * @returns Camera toggle element.
 */
function PanelCameraToggle({
  cameraEnabled,
  onToggle,
}: {
  cameraEnabled: boolean;
  onToggle: () => void;
}) {
  if (!cameraEnabled) {
    return (
      <PanelControl pressed label="Turn camera on" onToggle={onToggle}>
        <VideoOff className="size-5" />
      </PanelControl>
    );
  }
  return (
    <PanelControl pressed={false} label="Turn camera off" onToggle={onToggle}>
      <Video className="size-5" />
    </PanelControl>
  );
}

/**
 * Speaker toggle bound to the RTC session state.
 *
 * @param props - Speaker muted flag and toggle handler.
 * @returns Speaker toggle element.
 */
function PanelSpeakerToggle({
  speakerMuted,
  onToggle,
}: {
  speakerMuted: boolean;
  onToggle: () => void;
}) {
  if (speakerMuted) {
    return (
      <PanelControl pressed label="Turn speaker on" onToggle={onToggle}>
        <VolumeX className="size-5" />
      </PanelControl>
    );
  }
  return (
    <PanelControl pressed={false} label="Turn speaker off" onToggle={onToggle}>
      <Volume2 className="size-5" />
    </PanelControl>
  );
}

/**
 * Remote video surface. Shows the expert avatar plate until the video
 * track attaches; the chat below keeps working in every state.
 *
 * @param props - Phase, expert identity.
 * @returns Remote surface element.
 */
function RemoteSurface({
  phase,
  expertName,
  expertAvatar,
}: Pick<VideoPanelProps, "phase" | "expertName" | "expertAvatar">) {
  if (phase === "live") {
    return (
      <div className="relative flex h-56 w-full items-center justify-center overflow-hidden rounded-xl border border-[#d3cec6] bg-[#ebe7e1] md:h-64">
        <Avatar className="size-20 rounded-full border border-[#d3cec6] bg-white">
          <AvatarImage src={expertAvatar ?? undefined} alt={expertName} />
          <AvatarFallback className="bg-white text-[#626260]">
            <User className="size-9" />
          </AvatarFallback>
        </Avatar>
        <span className="absolute top-2.5 left-2.5 flex items-center gap-1.5 rounded-full border border-[#d3cec6] bg-white px-2 py-0.5 text-[11px] font-medium text-[#111111]">
          <span className="size-1.5 rounded-full bg-[#0bdf50]" />
          <span>{expertName}</span>
        </span>
        <span className="absolute right-2.5 bottom-2.5 rounded-full border border-[#d3cec6] bg-white px-2 py-0.5 text-[11px] font-medium text-[#7b7b78]">
          Camera preview unavailable in preview
        </span>
      </div>
    );
  }
  return (
    <div className="flex h-56 w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#d3cec6] bg-[#ebe7e1] md:h-64">
      <Avatar className="size-20 animate-pulse rounded-full border border-[#d3cec6] bg-white">
        <AvatarImage src={expertAvatar ?? undefined} alt={expertName} />
        <AvatarFallback className="bg-white text-[#626260]">
          <User className="size-9" />
        </AvatarFallback>
      </Avatar>
      <p className="text-[13px] font-medium text-[#626260]">Joining video</p>
    </div>
  );
}

/**
 * Expanded video panel docked between the session dock and the chat list.
 * Fixed height so the chat keeps a usable scroll region underneath.
 *
 * @param props - Phase, expert identity, timer, rate, and end handler.
 * @returns Video panel element.
 */
export function VideoPanel({
  phase,
  expertName,
  expertAvatar,
  elapsedText,
  videoRate,
  muted,
  onToggleMute,
  cameraEnabled,
  onToggleCamera,
  speakerMuted,
  onToggleSpeaker,
  onEnd,
  className,
}: VideoPanelProps) {
  return (
    <div
      className={cn(
        "shrink-0 border-b border-[#d3cec6] bg-[#f5f1ec] px-4 py-3",
        className,
      )}
    >
      <div className="relative mx-auto w-full max-w-2xl">
        <RemoteSurface
          phase={phase}
          expertName={expertName}
          expertAvatar={expertAvatar}
        />
        <div className="absolute right-3 bottom-12 flex size-20 items-center justify-center overflow-hidden rounded-[14px] border border-white bg-[#111111] text-white shadow-none">
          <User className="size-8" />
        </div>
        <div className="flex items-center justify-between pt-3">
          <div className="flex items-center gap-2">
            <p className="font-mono text-xl font-bold text-[#111111] tabular-nums">
              {elapsedText}
            </p>
            <p className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-[#111111] tabular-nums">
              Rs.{videoRate}/min
            </p>
          </div>
          <div className="flex items-center gap-2.5">
            <PanelMicToggle muted={muted} onToggle={onToggleMute} />
            <PanelCameraToggle
              cameraEnabled={cameraEnabled}
              onToggle={onToggleCamera}
            />
            <PanelSpeakerToggle
              speakerMuted={speakerMuted}
              onToggle={onToggleSpeaker}
            />
            <Button
              onClick={onEnd}
              aria-label="End video"
              className="h-12 gap-2 rounded-full bg-[#111111] px-6 text-sm font-medium text-white hover:bg-black"
            >
              <PhoneOff className="size-4" />
              <span>End video</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
