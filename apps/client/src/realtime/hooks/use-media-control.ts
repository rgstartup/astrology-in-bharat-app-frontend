"use client";

import { useEffect } from "react";
import { useVoiceSession } from "@/features/consultation/hooks/use-voice-session";
import { subscribeMediaControlEvents } from "@/realtime/topics/media-control";

/**
 * Syncs incoming media-control events (mic/speaker/camera toggled by the peer
 * or the system) onto the local RTC session.
 *
 * Manual local toggles (VoiceControls → useVoiceSession.toggleMic etc.) stay
 * local and are never emitted to the server, so there is no feedback loop: a
 * local toggle only updates the local snapshot. The server broadcast comes
 * only from system actions (pause/resume) or the peer's own session, both of
 * which arrive here as MEDIA_CONTROL events and are reflected locally.
 */
export function useMediaControl(consultationId: number | null): void {
  const { toggleMic, toggleSpeaker, toggleCamera, muted, speakerMuted } =
    useVoiceSession(consultationId);

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
      onCameraSwitched: () => {
        toggleCamera();
      },
    });

    return unsubscribe;
  }, [consultationId, toggleMic, toggleSpeaker, toggleCamera, muted, speakerMuted]);
}
