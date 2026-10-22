"use client";

import React from "react";
import { MessageSquareText, Mic, MicOff, PhoneOff, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type VoiceControlsProps = {
  onBackToChat: () => void;
  onEndVoice: () => void;
  onCancelRequest?: () => void;
  isRequesting?: boolean;
  /** Mute state owned by the RTC session — never a local copy. */
  muted: boolean;
  onToggleMute: () => void;
  /** Speaker state owned by the RTC session — never a local copy. */
  speakerMuted: boolean;
  onToggleSpeaker: () => void;
  className?: string;
};

/**
 * Circular 48px control button with pressed-state styling.
 *
 * @param props - Pressed flag, label, click handler, and icon node.
 * @returns Control button element.
 */
function ControlButton({
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
function MicToggle({
  muted,
  onToggleMute,
}: {
  muted: boolean;
  onToggleMute: () => void;
}) {
  if (muted) {
    return (
      <ControlButton pressed label="Unmute microphone" onToggle={onToggleMute}>
        <MicOff className="size-5" />
      </ControlButton>
    );
  }
  return (
    <ControlButton pressed={false} label="Mute microphone" onToggle={onToggleMute}>
      <Mic className="size-5" />
    </ControlButton>
  );
}

/**
 * Speaker toggle bound to the RTC session state.
 *
 * @param props - Speaker muted flag and toggle handler.
 * @returns Speaker toggle element.
 */
function SpeakerToggle({
  speakerMuted,
  onToggleSpeaker,
}: {
  speakerMuted: boolean;
  onToggleSpeaker: () => void;
}) {
  if (speakerMuted) {
    return (
      <ControlButton pressed label="Turn speaker on" onToggle={onToggleSpeaker}>
        <VolumeX className="size-5" />
      </ControlButton>
    );
  }
  return (
    <ControlButton pressed={false} label="Turn speaker off" onToggle={onToggleSpeaker}>
      <Volume2 className="size-5" />
    </ControlButton>
  );
}

/**
 * Cancel action shown while the expert has not answered yet.
 *
 * @param props - Cancel handler.
 * @returns Cancel request element.
 */
function CancelRequest({ onCancel }: { onCancel: () => void }) {
  return (
    <Button
      variant="outline"
      onClick={onCancel}
      className="h-12 rounded-full border-[#d3cec6] bg-white px-7 text-base font-medium text-[#111111] hover:bg-[#f5f1ec]"
    >
      Cancel request
    </Button>
  );
}

/**
 * Live-session actions: back to chat plus end voice.
 *
 * @param props - Navigation and end handlers.
 * @returns Live actions element.
 */
function LiveActions({ onBackToChat, onEndVoice }: Pick<VoiceControlsProps, "onBackToChat" | "onEndVoice">) {
  return (
    <div className="flex items-center justify-center gap-3">
      <Button
        variant="outline"
        onClick={onBackToChat}
        className="h-12 gap-2 rounded-full border-[#d3cec6] bg-white px-5 text-sm font-medium text-[#111111] hover:bg-[#f5f1ec]"
      >
        <MessageSquareText className="size-4" />
        <span>Back to chat</span>
      </Button>
      <Button
        onClick={onEndVoice}
        className="h-12 gap-2 rounded-full bg-[#111111] px-7 text-base font-medium text-white hover:bg-black"
      >
        <PhoneOff className="size-4" />
        <span>End voice</span>
      </Button>
    </div>
  );
}

/**
 * Voice control cluster: mute, speaker, and phase-appropriate primary actions.
 * All targets are 48px per the Intercom-Airbnb touch-target rule.
 *
 * @param props - Callbacks and requesting flag.
 * @returns Voice controls element.
 */
export function VoiceControls({
  onBackToChat,
  onEndVoice,
  onCancelRequest,
  isRequesting = false,
  muted,
  onToggleMute,
  speakerMuted,
  onToggleSpeaker,
  className,
}: VoiceControlsProps) {
  if (isRequesting) {
    return (
      <div className={cn("flex items-center justify-center gap-3 px-6 py-4", className)}>
        <MicToggle muted={muted} onToggleMute={onToggleMute} />
        <SpeakerToggle speakerMuted={speakerMuted} onToggleSpeaker={onToggleSpeaker} />
        <CancelRequest onCancel={onCancelRequest ?? onEndVoice} />
      </div>
    );
  }
  return (
    <div className={cn("flex flex-col items-center gap-4 px-6 py-4", className)}>
      <div className="flex items-center justify-center gap-4">
        <MicToggle muted={muted} onToggleMute={onToggleMute} />
        <SpeakerToggle speakerMuted={speakerMuted} onToggleSpeaker={onToggleSpeaker} />
      </div>
      <LiveActions onBackToChat={onBackToChat} onEndVoice={onEndVoice} />
    </div>
  );
}
