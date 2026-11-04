"use client";

import React from "react";
import { cn } from "@repo/design/cn";
import { useVoiceContext } from "@/features/consultation/providers";
import { MicToggle } from "./toggle-mic";
import { SpeakerToggle } from "./toggle-speaker";
import { CancelRequest } from "./button-cancel";
import { LiveActions } from "./button-live-action";

type VoiceControlsProps = {
  isRequesting?: boolean;
  /** Mute state owned by the RTC session — never a local copy. */
  muted: boolean;
  /** Speaker state owned by the RTC session — never a local copy. */
  speakerMuted: boolean;
  className?: string;
};

/**
 * Voice control cluster: mute, speaker, and phase-appropriate primary actions.
 * All targets are 48px per the Intercom-Airbnb touch-target rule.
 *
 * Consumes callbacks from context based on session mode:
 * - Direct voice (voice-first): uses `useDirectVoiceContext`
 * - Switch-to-voice (chat upgrade): uses `useSwitchToVoiceContext`
 *
 * @param props - State flags (no callbacks).
 * @returns Voice controls element.
 */
export function VoiceControls({
  isRequesting = false,
  muted,
  speakerMuted,
  className,
}: VoiceControlsProps) {
  const voice = useVoiceContext();

  // Select callbacks based on active mode
  const toggleMic = voice.toggleMic;
  const toggleSpeaker = voice.toggleSpeaker;
  const cancelVoice = voice.cancelVoice;
  const endVoice = voice.pauseVoice;

  if (isRequesting) {
    return (
      <div
        className={cn(
          "flex items-center justify-center gap-3 px-6 py-4",
          className,
        )}
      >
        <MicToggle muted={muted} onToggleMute={toggleMic} />
        <SpeakerToggle
          speakerMuted={speakerMuted}
          onToggleSpeaker={toggleSpeaker}
        />
        <CancelRequest onCancel={cancelVoice} />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex items-center justify-center gap-4 px-6 py-4",
        className,
      )}
    >
      <MicToggle muted={muted} onToggleMute={toggleMic} />
      <SpeakerToggle
        speakerMuted={speakerMuted}
        onToggleSpeaker={toggleSpeaker}
      />
      <LiveActions onEndVoice={endVoice} />
    </div>
  );
}
