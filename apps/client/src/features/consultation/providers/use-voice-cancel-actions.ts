"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { pauseTimer, resumeTimer } from "@/realtime/topics/media-control";
import type { MediaControlAck } from "@/realtime/types/media-control";
import type { ConsultationSessionStatus } from "../application/consultation-verdict";
import type { useDirectVoice } from "../hooks/use-direct-voice";

interface UseVoiceCancelActionsParams {
  /** Active consultation id; null disables the media-control hold chain. */
  consultationId: number | null;
  sessionStatus: ConsultationSessionStatus;
  resumeLiveChat: (mode?: "chat" | "voice" | "video") => Promise<unknown>;
  refreshSessions: () => Promise<void>;
  directVoice: ReturnType<typeof useDirectVoice>;
  handleEndChat: (force?: boolean) => void;
}

interface UseVoiceCancelActionsReturn {
  voiceCancelOpen: boolean;
  voiceCancelBusy: boolean;
  /** Grace countdown shown while the dialog is open; null when not counting. */
  voiceGraceSeconds: number | null;
  openVoiceCancel: () => void;
  handleVoiceCancelOpenChange: (open: boolean) => void;
  handleVoiceContinueOverChat: () => Promise<void>;
  handleVoiceEndSession: () => Promise<void>;
}

/**
 * Manages voice cancellation dialog state and serialized billing-hold chain.
 *
 * Hold/release go through the media-control PAUSE_TIMER/RESUME_TIMER commands
 * so the backend pauses billing AND broadcasts mic-off/speaker-off (open) and
 * mic-on/speaker-on (release) to both participants.
 *
 * @param params - Consultation id, session status, chat resume socket, and direct voice handle
 * @returns Dialog visibility, busy state, and action handlers
 */
export function useVoiceCancelActions({
  consultationId,
  sessionStatus,
  resumeLiveChat,
  refreshSessions,
  directVoice,
  handleEndChat,
}: UseVoiceCancelActionsParams): UseVoiceCancelActionsReturn {
  const [voiceCancelOpen, setVoiceCancelOpen] = useState(false);
  const [voiceCancelBusy, setVoiceCancelBusy] = useState(false);
  const [voiceGraceSeconds, setVoiceGraceSeconds] = useState<number | null>(
    null,
  );
  const voiceHoldActive = useRef(false);
  const voiceHoldChain = useRef<Promise<unknown>>(Promise.resolve());
  /** Server-granted epoch-ms deadline; drives the countdown while the dialog is open. */
  const voiceGraceDeadline = useRef<number | null>(null);

  const clearVoiceGrace = useCallback(() => {
    voiceGraceDeadline.current = null;
    setVoiceGraceSeconds(null);
  }, []);

  const queueVoiceHold = useCallback(
    async (command: "hold" | "release") => {
      if (consultationId === null) return undefined;
      const next = voiceHoldChain.current
        .catch(() => undefined)
        .then(() =>
          command === "hold"
            ? pauseTimer(consultationId, "cancel_dialog")
            : resumeTimer(consultationId),
        );
      voiceHoldChain.current = next;
      return next.catch(() => undefined);
    },
    [consultationId],
  ) satisfies (command: "hold" | "release") => Promise<MediaControlAck | undefined>;

  const openVoiceCancel = useCallback(async () => {
    setVoiceCancelOpen(true);
    if (sessionStatus !== "active") return;
    voiceHoldActive.current = true;
    const ack = await queueVoiceHold("hold");
    // The server arms the grace timer and returns its absolute deadline on
    // the pause ack; the countdown is derived from that timestamp.
    const deadlineMs = ack?.graceDeadline ? Date.parse(ack.graceDeadline) : NaN;
    if (!Number.isFinite(deadlineMs)) return;
    voiceGraceDeadline.current = deadlineMs;
    setVoiceGraceSeconds(
      Math.max(0, Math.ceil((deadlineMs - Date.now()) / 1000)),
    );
  }, [queueVoiceHold, sessionStatus]);

  const handleVoiceCancelOpenChange = useCallback(
    async (open: boolean) => {
      if (!open && voiceCancelBusy) return;
      setVoiceCancelOpen(open);
      if (open || !voiceHoldActive.current) return;
      voiceHoldActive.current = false;
      // Closing cancels the server grace timer via resume; countdown resets.
      clearVoiceGrace();
      void queueVoiceHold("release");
    },
    [queueVoiceHold, voiceCancelBusy, clearVoiceGrace],
  );

  const handleVoiceContinueOverChat = useCallback(async () => {
    setVoiceCancelBusy(true);
    await voiceHoldChain.current.catch(() => undefined);
    voiceHoldActive.current = false;
    const switched = await directVoice.switchToChat();
    setVoiceCancelBusy(false);
    if (switched) {
      setVoiceCancelOpen(false);
      clearVoiceGrace();
      // Re-arm timer with chat mode pricing after switching to chat.
      await resumeLiveChat("chat");
      await refreshSessions();
      return;
    }
    voiceHoldActive.current = true;
  }, [directVoice, refreshSessions, resumeLiveChat, clearVoiceGrace]);

  const handleVoiceEndSession = useCallback(async () => {
    setVoiceCancelOpen(false);
    clearVoiceGrace();
    await voiceHoldChain.current.catch(() => undefined);
    voiceHoldActive.current = false;
    console.log("[VoiceConsultation] handleVoiceEndSession hold chain complete, calling directVoice.endVoice()");
    // Tear down RTC (clears sessionRef.current), clear stores, and end
    // the server session — all via directVoice.endVoice(). The server
    // ENDED event then sets sessionStatus="completed" and showModal=true.
    await directVoice.endVoice();
    console.log("[VoiceConsultation] handleVoiceEndSession directVoice.endVoice() completed");
  }, [directVoice, clearVoiceGrace]);

  // Grace countdown: recomputed from the server-granted deadline while the
  // dialog is open (frozen while busy or closed). When it hits zero the
  // consultation ends automatically — the client can't keep the cancel
  // dialog open indefinitely; the server expires its own timer in parallel.
  const graceRunning = voiceGraceSeconds !== null;
  useEffect(() => {
    if (!voiceCancelOpen || voiceCancelBusy || !graceRunning) return;
    const id = setInterval(() => {
      const deadline = voiceGraceDeadline.current;
      if (deadline === null) return;
      setVoiceGraceSeconds(
        Math.max(0, Math.ceil((deadline - Date.now()) / 1000)),
      );
    }, 500);
    return () => clearInterval(id);
  }, [voiceCancelOpen, voiceCancelBusy, graceRunning]);

  useEffect(() => {
    if (!voiceCancelOpen || voiceGraceSeconds !== 0) return;
    void handleVoiceEndSession();
  }, [voiceCancelOpen, voiceGraceSeconds, handleVoiceEndSession]);

  return {
    voiceCancelOpen,
    voiceCancelBusy,
    voiceGraceSeconds,
    openVoiceCancel,
    handleVoiceCancelOpenChange,
    handleVoiceContinueOverChat,
    handleVoiceEndSession,
  };
}
