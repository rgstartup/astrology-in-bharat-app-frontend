"use client";

import { useEffect } from "react";
import { useVoiceSession } from "@/realtime/hooks/use-voice-session";
import { subscribeMediaControlEvents } from "@/realtime/topics/media-control";

/**
 * Syncs incoming media-control events (mic/speaker toggled by the peer or
 * the system) onto the local RTC session.
 *
 * Manual local toggles stay local and are never emitted to the server, so
 * there is no feedback loop. The expert voice session has no camera control,
 * so CAMERA_SWITCHED events are observed but not acted on here.
 */
export function useMediaControl(consultationId: number | null): void {
  const { toggleMic, toggleSpeaker, muted, speakerMuted } = useVoiceSession();

  useEffect(() => {
    if (consultationId === null) return;

    const unsubscribe = subscribeMediaControlEvents(consultationId, {
      onMicMuted: () => {
        if (!muted) toggleMic();
      },
      onMicUnmuted: () => {
        if (muted) toggleMic();
      },
      onSpeakerMuted: () => {
        if (!speakerMuted) toggleSpeaker();
      },
      onSpeakerUnmuted: () => {
        if (speakerMuted) toggleSpeaker();
      },
    });

    return unsubscribe;
  }, [consultationId, toggleMic, toggleSpeaker, muted, speakerMuted]);
}
