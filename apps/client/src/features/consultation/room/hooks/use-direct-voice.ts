"use client";

import { useCallback, useEffect, useRef } from "react";
import { useVoiceSession } from "../../voice/hooks/use-voice-session";
import type { VoicePhase } from "../../voice/types/voice-phase";
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
  const joinedRef = useRef<number | null>(null);
  const joinAbortedRef = useRef(false);

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

  console.log("[VoiceConsultation] useDirectVoice enabled check", {
    consultationId,
    sessionStatus,
    decision,
    hasAcceptTimeToken: Boolean(voiceToken?.token && voiceToken?.channelName),
    enabled,
  });

  // Toast on error transitions only
  useEffect(() => {
    if (!rtc.error) return;
    toast.error(rtc.error);
    rtc.clearError();
  }, [rtc.error, rtc.clearError]);

  // Join exactly once per enabled consultation. Dependencies are primitives:
  // `rtc` is a new object every render, so including it (or the token object)
  // re-ran this effect's cleanup and left Agora on every render.
  useEffect(() => {
    console.log("[VoiceConsultation] join effect evaluated", {
      consultationId,
      enabled,
      joinedConsultationId: joinedRef.current,
    });
    if (consultationId === null || !enabled) {
      console.log("[VoiceConsultation] join skipped", {
        reason:
          consultationId === null ? "missing consultation id" : "disabled",
        consultationId,
        enabled,
      });
      // Only tear down a session this hook started. A session created by the
      // prep modal must survive the route transition while acceptance lands.
      if (joinedRef.current !== null) {
        joinAbortedRef.current = true;
        joinedRef.current = null;
        void rtcRef.current.leave().catch(() => undefined);
      }
      return;
    }
    if (joinedRef.current === consultationId) {
      console.log("[VoiceConsultation] join skipped", {
        reason: "consultation already started by this hook",
        consultationId,
      });
      return;
    }

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

    console.log("[VoiceConsultation] joining Agora", {
      consultationId,
      identity,
      hasAcceptTimeToken: Boolean(fastToken),
      channelName: fastToken?.channelName ?? null,
    });

    void rtcRef.current
      .join(consultationId, identity, fastToken)
      .then(() => {
        console.log("[VoiceConsultation] Agora join succeeded", {
          consultationId,
        });
        if (joinAbortedRef.current) {
          console.info(
            "[VoiceConsultation] join completed after cancellation; releasing RTC session",
            {
              consultationId,
            },
          );
          void rtcRef.current.leave().catch(() => undefined);
          return;
        }
        onLocalReadyRef.current?.();
      })
      .catch((err) => {
        console.log("[VoiceConsultation] Agora join failed", {
          consultationId,
          error: err instanceof Error ? err.message : String(err),
        });
        // Error already handled by toast effect
      });

    return () => {
      joinAbortedRef.current = true;
      void rtcRef.current.leave().catch(() => undefined);
      joinedRef.current = null;
    };
  }, [enabled, consultationId, userId]);

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
    if (!ended) return;
    const shouldLeave = joinedRef.current !== null || !joinAbortedRef.current;
    joinedRef.current = null;
    joinAbortedRef.current = true;
    if (!shouldLeave) return;
    void rtcRef.current.leave().catch(() => undefined);
  }, [ended]);

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
