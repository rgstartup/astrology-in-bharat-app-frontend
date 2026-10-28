"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useVoiceSession } from "../../voice/use-voice-session.hook";
import type { VoicePhase } from "../../voice/voice-phase";
import {
  cancelConsultation,
  endConsultation,
  switchConsultationToChat,
  voiceToken as fetchVoiceToken,
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

  // Determined token: accept-time prop first, then self-healed local token.
  // The local token is persisted in sessionStorage so it survives
  // content.component.tsx remounts (which would otherwise reset useState and
  // keep `enabled` false forever, blocking the Agora join).
  const [localVoiceToken, setLocalVoiceToken] = useState<{
    token: string;
    tokenExpiresAt: string;
    channelName: string;
  } | null>(() => {
    if (typeof sessionStorage === "undefined" || !consultationId) return null;
    try {
      const stored = sessionStorage.getItem(`voiceToken:${consultationId}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const voiceTokenResolved = voiceToken ?? localVoiceToken;
  const enabled = Boolean(
    consultationId !== null &&
    !ended &&
    (sessionStatus === "active" || decision === "accepted") &&
    (voiceTokenResolved?.token && voiceTokenResolved?.channelName)
  );

  console.log("[VoiceConsultation] useDirectVoice enabled check", {
    consultationId,
    sessionStatus,
    decision,
    hasToken: Boolean(voiceTokenResolved?.token),
    hasChannelName: Boolean(voiceTokenResolved?.channelName),
    enabled,
  });

  // Token self-heal: when the consultation is accepted/active but the
  // accept-time token never reached this client (e.g. targeted emit missed
  // after a reconnect), fetch a fresh token via the voice_token command so
  // the voice stage can still come up live without a page refresh.
  useEffect(() => {
    if (!consultationId) return;
    if (voiceToken?.token && voiceToken?.channelName) return;
    if (sessionStatus !== "active" && decision !== "accepted") return;
    console.log("[VoiceConsultation] fetching voice token (self-heal)", {
      consultationId,
      sessionStatus,
      decision,
    });
    void fetchVoiceToken(consultationId)
      .then((issued) => {
        console.log("[VoiceConsultation] voice token fetched", {
          consultationId,
          hasToken: Boolean(issued.token),
          hasChannelName: Boolean(issued.channelName),
        });
        setLocalVoiceToken(issued);
        try {
          sessionStorage.setItem(
            `voiceToken:${consultationId}`,
            JSON.stringify(issued),
          );
        } catch {
          // sessionStorage may be unavailable in some environments; non-fatal.
        }
      })
      .catch(() => {
        console.log("[VoiceConsultation] voice token fetch failed", {
          consultationId,
        });
      });
  }, [consultationId, sessionStatus, decision, voiceToken?.token, voiceToken?.channelName]);

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
    
    console.log("[VoiceConsultation] joining Agora", {
      consultationId,
      identity,
      hasToken: Boolean(voiceTokenResolved?.token),
      channelName: voiceTokenResolved?.channelName ?? null,
    });
    
    const joinPromise = rtc
      .join(consultationId, identity, voiceTokenResolved ?? undefined)
      .then(() => {
        console.log("[VoiceConsultation] Agora join succeeded", {
          consultationId,
        });
        if (!joinAbortedRef.current) {
          onLocalReady?.();
        }
      })
      .catch((err) => {
        console.log("[VoiceConsultation] Agora join failed", {
          consultationId,
          error: err instanceof Error ? err.message : String(err),
        });
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
    if (consultationId !== null) {
      try {
        sessionStorage.removeItem(`voiceToken:${consultationId}`);
      } catch {
        // non-fatal
      }
    }
  }, [ended, rtc, consultationId]);

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
