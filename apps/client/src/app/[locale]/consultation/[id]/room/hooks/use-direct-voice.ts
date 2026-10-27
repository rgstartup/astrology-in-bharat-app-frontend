"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVoiceSession } from "../../voice/use-voice-session.hook";
import type { VoicePhase } from "../../voice/voice-phase";
import {
  cancelConsultation,
  endConsultation,
  switchConsultationToChat,
} from "@/realtime/topics/consultation";
import { toast } from "@/hooks/use-toast";

type UseDirectVoiceOptions = {
  consultationId: number | null;
  userId: number | string | null;
  /** Only join when consultation is verified active or accepted — never when status is completed or unverified. */
  sessionStatus?: string | null;
  decision?: string | null;
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
 * Upgrade flow (`useVoiceUpgrade`) stays untouched for chat -> voice.
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
  const { consultationId, userId, sessionStatus, decision, voiceToken, onLocalReady, ended } =
    options;
  const rtc = useVoiceSession();
  const joinedRef = useRef<number | null>(null);
  const joinAbortedRef = useRef(false);

  // Determine if we should join Agora: only when session is active or accepted
  const enabled = Boolean(
    consultationId !== null &&
    !ended &&
    (sessionStatus === "active" || decision === "accepted") &&
    (voiceToken?.token && voiceToken?.channelName)
  );

  // Toast on error transitions only
  useEffect(() => {
    if (!rtc.error) return;
    toast.error(rtc.error);
    rtc.clearError();
  }, [rtc.error, rtc.clearError]);

  useEffect(() => {
    if (!enabled) {
      // Cancel any in-flight join
      joinAbortedRef.current = true;
      void rtc.leave().catch(() => undefined);
      joinedRef.current = null;
      return;
    }
    if (consultationId === null) return;
    if (joinedRef.current === consultationId) return;
    if (rtc.active || rtc.busy) return;
    
    joinAbortedRef.current = false;
    joinedRef.current = consultationId;
    const identity =
      userId === null
        ? `client_${consultationId}`
        : `client_${userId}_consult_${consultationId}`;
    
    const joinPromise = rtc
      .join(consultationId, identity, voiceToken ?? undefined)
      .then(() => {
        if (!joinAbortedRef.current) {
          onLocalReady?.();
        }
      })
      .catch(() => {
        if (!joinAbortedRef.current) {
          // Error already handled by toast effect
        }
      });
    
    return () => {
      joinAbortedRef.current = true;
      void rtc.leave().catch(() => undefined);
      joinedRef.current = null;
    };
  }, [enabled, consultationId, voiceToken, onLocalReady, rtc]);

  const endVoice = useCallback(async (): Promise<void> => {
    joinedRef.current = null;
    joinAbortedRef.current = true;
    await rtc.leave();
    if (consultationId !== null) {
      await endConsultation(consultationId).catch(() => undefined);
    }
  }, [rtc, consultationId]);

  const cancelVoice = useCallback(async (): Promise<void> => {
    joinedRef.current = null;
    joinAbortedRef.current = true;
    await rtc.leave();
    if (consultationId !== null) {
      await cancelConsultation(consultationId).catch(() => undefined);
    }
  }, [rtc, consultationId]);

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
    return true;
  }, [rtc, consultationId]);

  // Leave the Agora RTC session when the consultation ends
  useEffect(() => {
    if (!ended || joinedRef.current === null) return;
    joinedRef.current = null;
    joinAbortedRef.current = true;
    void rtc.leave().catch(() => undefined);
  }, [ended, rtc]);

  const phase: VoicePhase = ended ? "ended" : (rtc.voicePhase ?? "requesting");

  return {
    active: ended ? false : rtc.active,
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
