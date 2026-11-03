"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceSession } from "./use-voice-session";
import type { VoicePhase } from "../types/voice-phase";
import {
  cancelConsultation,
  endConsultation,
  switchConsultationToChat,
} from "@/realtime/topics/consultation";
import { toast } from "@repo/design/shadcn";
import { useConsultationRoomStore } from "@/features/consultation/stores/consultation-room.store";
import { useVoiceSessionStore } from "@/features/consultation/stores/voice-session.store";

type UseDirectVoiceOptions = {
  consultationId: number | null;
  userId: number | string | null;
  /** Only join when consultation is verified active or accepted — never when status is completed or unverified. */
  sessionStatus?: string | null;
  decision?: string | null;
  /** Caller-side gate (room mode, mic confirmation). Defaults to true. */
  enabled?: boolean;
  /** Accept-time Agora voice token (voice/video). Skips the per-join token round trip when provided. */
  voiceToken?: {
    token: string | null;
    channelName: string | null;
    tokenExpiresAt?: string | null;
  } | null;
  /** Fired after the local Agora join succeeds and `mediaReady()` has been emitted. */
  onLocalReady?: () => void;
  /** Consultation ended (socket ENDED / verdict watcher) — tears down the RTC session. */
  ended?: boolean;
};

type UseDirectVoiceResult = {
  active: boolean;
  phase: VoicePhase;
  muted: boolean;
  speakerMuted: boolean;
  cameraEnabled: boolean;
  busy: boolean;
  error: string | null;
  toggleMic: () => Promise<void>;
  toggleSpeaker: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  endVoice: () => Promise<void>;
  cancelVoice: () => Promise<void>;
  /**
   * Continues the same consultation over chat. The backend closes the call
   * session and opens a new chat session; the local RTC is left afterwards.
   *
   * @returns True when the switch was accepted by the backend.
   */
  switchToChat: () => Promise<boolean>;
  clearError: () => void;
};

/**
 * Drives the voice-first room: joins the existing consultation's RTC channel
 * once (no new consultation is created) and ends/cancels that same row.
 * Upgrade flow (`useSwitchToVoice`) stays untouched for chat -> voice.
 *
 * Only joins Agora when consultation is verified active or accepted —
 * never when status is completed or unverified.
 *
 * @param options - Consultation id, client id for RTC identity, session status, decision, and optional accept-time voice token.
 * @returns RTC phase plus voice controls bound to the current consultation.
 */
export function useDirectVoice(
  options: UseDirectVoiceOptions,
): UseDirectVoiceResult {
  const {
    consultationId,
    userId,
    sessionStatus,
    decision,
    enabled: callerEnabled = true,
    voiceToken,
    onLocalReady,
    ended,
  } = options;
  const rtc = useVoiceSession();
  const clearConsultationRoom = useConsultationRoomStore((s) => s.clear);
  const resetVoiceSession = useVoiceSessionStore((s) => s.reset);
  const clearVoiceSession = useVoiceSessionStore((s) => s.setSession);
  const joinedRef = useRef<number | null>(null);
  const joinAbortedRef = useRef(false);
  /** Locally set to true when endVoice() is called, so the timer and phase
   *  transition to ended immediately without waiting for the server ENDED
   *  event. The server event will also set ended=true via the `ended` prop,
   *  but we must not block the UI on it. */
  const [localEnded, setLocalEnded] = useState(false);

  // Latest values for effects that must not re-run on object identity changes.
  // `useVoiceSession()` returns a fresh object every render, so depending on it
  // (or on the token object) would tear the call down on every render.
  const rtcRef = useRef(rtc);
  rtcRef.current = rtc;
  const onLocalReadyRef = useRef(onLocalReady);
  onLocalReadyRef.current = onLocalReady;

  // Read the latest accept-time token without restarting an in-flight join.
  // If it is absent, useVoiceSession.join() requests one through joinCall().
  const voiceTokenRef = useRef(voiceToken);
  voiceTokenRef.current = voiceToken;
  const enabled = Boolean(
    callerEnabled &&
    consultationId !== null &&
    !ended &&
    (sessionStatus === "active" || decision === "accepted"),
  );

  // Track previous enabled value to only trigger join on false → true transition.
  // Prevents re-running join logic on every re-render where enabled stays true
  // (e.g., budget timer updates elapsedTime every second).
  const prevEnabledRef = useRef(false);

  // Toast on error transitions only
  useEffect(() => {
    if (!rtc.error) return;
    toast.error(rtc.error);
    rtc.clearError();
  }, [rtc.error, rtc.clearError]);

  // Join effect: only fires when `enabled` transitions from false → true.
  // No cleanup returned → RTC connection is NOT torn down when enabled
  // toggles (billing hold, pause). Separate cleanup effect handles leave()
  // on navigation (consultationId change) and ended effect handles leave()
  // on consultation termination.
  useEffect(() => {
    const wasEnabled = prevEnabledRef.current;
    prevEnabledRef.current = enabled;

    // Only trigger join on false → true transition
    if (wasEnabled || !enabled) return;
    if (consultationId === null) return;
    if (joinedRef.current === consultationId) return;

    joinAbortedRef.current = false;
    joinedRef.current = consultationId;
    const identity =
      userId === null
        ? `client_${consultationId}`
        : `client_${userId}_consult_${consultationId}`;
    const acceptTimeToken = voiceTokenRef.current;
    const fastToken =
      acceptTimeToken?.token && acceptTimeToken.channelName
        ? acceptTimeToken
        : undefined;

    void rtcRef.current
      .join(consultationId, identity)
      .then(() => {
        if (joinAbortedRef.current) {
          void rtcRef.current.leave().catch(() => undefined);
          return;
        }
        onLocalReadyRef.current?.();
      })
      .catch((err) => {
        // Error already handled by toast effect
      });
  }, [enabled, consultationId, userId]);

  // Cleanup effect: only leaves RTC when consultationId changes (navigation away).
  // Does NOT run on enabled/sessionStatus/decision/ended changes, so temporary
  // pauses (billing hold) and the consultation-end flow (handled by ended effect)
  // don't tear down the connection prematurely.
  useEffect(() => {
    return () => {
      if (joinedRef.current === null) return;
      joinAbortedRef.current = true;
      joinedRef.current = null;
      void rtcRef.current.leave().catch(() => undefined);
    };
  }, [consultationId]);

  const endVoice = useCallback(async (): Promise<void> => {
    setLocalEnded(true);
    joinedRef.current = null;
    joinAbortedRef.current = true;
    await rtc.leave();
    void clearConsultationRoom();
    void resetVoiceSession();
    if (consultationId !== null) {
      await endConsultation(consultationId).catch(() => undefined);
    }
  }, [rtc, consultationId, clearConsultationRoom, resetVoiceSession, setLocalEnded]);

  const cancelVoice = useCallback(async (): Promise<void> => {
    joinedRef.current = null;
    joinAbortedRef.current = true;
    await rtc.leave();
    void clearConsultationRoom();
    void resetVoiceSession();
    if (consultationId !== null) {
      await cancelConsultation(consultationId).catch(() => undefined);
    }
  }, [rtc, consultationId, clearConsultationRoom, resetVoiceSession]);

  const switchToChat = useCallback(async (): Promise<boolean> => {
    if (consultationId === null) return false;
    try {
      await switchConsultationToChat(consultationId);
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Could not continue over chat: ${reason}`);
      return false;
    }
    joinedRef.current = null;
    joinAbortedRef.current = true;
    await rtc.leave();
    void clearConsultationRoom();
    void resetVoiceSession();
    return true;
  }, [rtc, consultationId, clearConsultationRoom, resetVoiceSession]);

  // Leave the Agora RTC session when the consultation ends
  useEffect(() => {
    const isEnded = ended || localEnded;
    if (!isEnded) return;
    const shouldLeave = joinedRef.current !== null || !joinAbortedRef.current;
    joinedRef.current = null;
    joinAbortedRef.current = true;
    // Clear the persisted rejoin intent so a hard refresh doesn't try to
    // rejoin a consultation that has already ended.
    void clearVoiceSession(null, null, null);
    if (!shouldLeave) return;
    void rtcRef.current.leave().catch(() => undefined);
  }, [ended, localEnded]);

  const phase: VoicePhase = (ended || localEnded) ? "ended" : (rtc.voicePhase ?? "requesting");

  return {
    active: (ended || localEnded) ? false : rtc.active,
    phase,
    muted: rtc.muted,
    speakerMuted: rtc.speakerMuted,
    cameraEnabled: rtc.cameraEnabled,
    busy: rtc.busy,
    error: rtc.error,
    toggleMic: rtc.toggleMic,
    toggleSpeaker: rtc.toggleSpeaker,
    toggleCamera: rtc.toggleCamera,
    endVoice,
    cancelVoice,
    switchToChat,
    clearError: rtc.clearError,
  };
}
