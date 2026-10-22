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
  enabled: boolean;
  /** Accept-time Agora voice token (voice/video). Skips the per-join token round trip when provided. */
  voiceToken?: { token: string | null; channelName: string | null; tokenExpiresAt?: string | null } | null;
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
  toggleMute: () => Promise<void>;
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
 * @param options - Consultation id, client id for RTC identity, enabled flag, and optional accept-time voice token.
 * @returns RTC phase plus voice controls bound to the current consultation.
 */
export function useDirectVoice(options: UseDirectVoiceOptions): UseDirectVoiceResult {
  const { consultationId, userId, enabled, voiceToken, onLocalReady, ended } =
    options;
  const rtc = useVoiceSession();
  const joinedRef = useRef<number | null>(null);

  // Toast on error transitions only — the room used to depend on this whole
  // hook result and re-ran the check every render.
  useEffect(() => {
    if (!rtc.error) return;
    toast.error(rtc.error);
    rtc.clearError();
  }, [rtc.error, rtc.clearError]);

  useEffect(() => {
    if (!enabled) {
      void rtc.leave().catch(() => undefined);
      joinedRef.current = null;
      return;
    }
    if (consultationId === null) return;
    if (joinedRef.current === consultationId) return;
    if (rtc.active || rtc.busy) return;
    joinedRef.current = consultationId;
    const identity =
      userId === null
        ? `client_${consultationId}`
        : `client_${userId}_consult_${consultationId}`;
    void rtc
      .join(consultationId, identity, voiceToken ?? undefined)
      .then(() => {
        onLocalReady?.();
      })
      .catch(() => undefined);
    return () => {
      void rtc.leave().catch(() => undefined);
      joinedRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enabled, consultationId, voiceToken, options.onLocalReady]);

  const endVoice = useCallback(async (): Promise<void> => {
    joinedRef.current = null;
    await rtc.leave();
    if (consultationId !== null) {
      await endConsultation(consultationId).catch(() => undefined);
    }
  }, [rtc, consultationId]);

  const cancelVoice = useCallback(async (): Promise<void> => {
    joinedRef.current = null;
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
    await rtc.leave();
    return true;
  }, [rtc, consultationId]);

  // Leave the Agora RTC session when the consultation ends (socket ENDED or
  // verdict watcher) so the SDK does not keep running after billing stops.
  useEffect(() => {
    if (!ended || joinedRef.current === null) return;
    joinedRef.current = null;
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
    toggleMute: rtc.toggleMute,
    toggleSpeaker: rtc.toggleSpeaker,
    toggleCamera: rtc.toggleCamera,
    endVoice,
    cancelVoice,
    switchToChat,
    clearError: rtc.clearError,
  };
}
