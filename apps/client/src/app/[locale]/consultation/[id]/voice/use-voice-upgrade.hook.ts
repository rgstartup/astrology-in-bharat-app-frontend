"use client";

import { useCallback, useEffect, useState } from "react";
import type { VoicePhase } from "./voice-phase";
import { useVoiceSession } from "./use-voice-session.hook";
import { toast } from "@/hooks/use-toast";
import { checkVoiceEligibilityAction } from "@/actions/voice";
import { initiateConsultationAction } from "@/actions/chat";
import {
  cancelConsultation,
  endConsultation,
  requestConsultation,
} from "@/realtime/topics/consultation";

export interface VoiceUpgradeOptions {
  expertId: number | string;
  userId: number | string | null;
}

export interface VoiceUpgradeControls {
  voiceActive: boolean;
  minimized: boolean;
  voicePhase: VoicePhase;
  voiceConsultationId: number | null;
  /** Per-minute voice price quoted by the backend at upgrade time. */
  voicePrice: number | null;
  muted: boolean;
  speakerMuted: boolean;
  cameraEnabled: boolean;
  busy: boolean;
  error: string | null;
  startVoice: () => Promise<void>;
  endVoice: () => Promise<void>;
  cancelVoice: () => Promise<void>;
  backToChat: () => void;
  returnToVoice: () => void;
  toggleMic: () => Promise<void>;
  toggleSpeaker: () => Promise<void>;
  toggleCamera: () => Promise<void>;
  clearError: () => void;
}

/**
 * Orchestrates chat-to-voice upgrade: eligibility gate, voice
 * consultation initiation, then RTC join. Chat history stays mounted
 * underneath while the voice stage takes the main column.
 */
export function useVoiceUpgrade(options: VoiceUpgradeOptions): VoiceUpgradeControls {
  const { expertId, userId } = options;
  const rtc = useVoiceSession();
  const [voiceConsultationId, setVoiceConsultationId] = useState<number | null>(null);
  const [voicePrice, setVoicePrice] = useState<number | null>(null);
  const [starting, setStarting] = useState(false);
  const [startError, setStartError] = useState<string | null>(null);
  const [ended, setEnded] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const startVoice = useCallback(async (): Promise<void> => {
    if (starting || rtc.active || voiceConsultationId !== null) return;
    setStarting(true);
    setStartError(null);
    try {
      const eligibility = await checkVoiceEligibilityAction(expertId);
      if (!eligibility.ok) throw new Error(eligibility.message);
      if (!eligibility.data.expertIsAvailable) {
        throw new Error("The expert is offline right now. Please try again shortly.");
      }
      if (!eligibility.data.hasBalance && !eligibility.data.isEligibleForFree) {
        throw new Error("Insufficient balance for a voice call. Please recharge.");
      }
      setVoicePrice(eligibility.data.voicePrice);
      const initiated = await initiateConsultationAction(expertId, "voice");
      if (!initiated.ok) throw new Error(initiated.message);
      const consultationId = initiated.data.consultationId;
      // Notify the expert: REST initiate only writes rows, the socket request
      // is what broadcasts `consultation:incoming` (same as chat prep).
      const requested = await requestConsultation(consultationId, Number(expertId));
      if (requested.status !== "requested") {
        await cancelConsultation(consultationId).catch(() => undefined);
        throw new Error("The expert did not receive your voice request. Please try again.");
      }
      setVoiceConsultationId(consultationId);
      setEnded(false);
      setMinimized(false);
      const identity =
        userId === null
          ? `client_${consultationId}`
          : `client_${userId}_consult_${consultationId}`;
      await rtc.join(consultationId, identity);
    } catch (err) {
      setStartError(err instanceof Error ? err.message : "Could not start voice.");
      setVoiceConsultationId(null);
      setVoicePrice(null);
    } finally {
      setStarting(false);
    }
  }, [starting, rtc, voiceConsultationId, expertId, userId]);

  const cancelVoice = useCallback(async (): Promise<void> => {
    const id = voiceConsultationId;
    await rtc.leave();
    setVoiceConsultationId(null);
    setVoicePrice(null);
    setEnded(false);
    if (id !== null) {
      await cancelConsultation(id).catch(() => undefined);
    }
  }, [rtc, voiceConsultationId]);

  const endVoice = useCallback(async (): Promise<void> => {
    const id = voiceConsultationId;
    await rtc.leave();
    setEnded(true);
    // Leaving the Agora channel never ends billing — the orchestrator owns
    // the lifecycle, so an explicit end is required to stop the meter.
    if (id !== null) {
      await endConsultation(id).catch(() => undefined);
    }
  }, [rtc, voiceConsultationId]);

  const backToChat = useCallback(() => setMinimized(true), []);
  const returnToVoice = useCallback(() => setMinimized(false), []);
  const clearError = useCallback(() => {
    setStartError(null);
    rtc.clearError();
  }, [rtc]);

  const error = startError ?? rtc.error;
  // Toast on error transitions only — the room used to depend on this whole
  // hook result and re-ran the check every render.
  useEffect(() => {
    if (!error) return;
    toast.error(error);
    clearError();
  }, [error, clearError]);

  const voiceActive = voiceConsultationId !== null;
  const voicePhase: VoicePhase = ended ? "ended" : (rtc.voicePhase ?? "requesting");

  return {
    voiceActive,
    minimized,
    voicePhase,
    voiceConsultationId,
    voicePrice,
    muted: rtc.muted,
    speakerMuted: rtc.speakerMuted,
    cameraEnabled: rtc.cameraEnabled,
    busy: starting || rtc.busy,
    error,
    startVoice,
    endVoice,
    cancelVoice,
    backToChat,
    returnToVoice,
    toggleMic: rtc.toggleMic,
    toggleSpeaker: rtc.toggleSpeaker,
    toggleCamera: rtc.toggleCamera,
    clearError,
  };
}
