"use client";

import { useState, useRef, useCallback } from "react";
import type { ConsultationSessionStatus } from "../application/consultation-verdict";
import type { useDirectVoice } from "../hooks/use-direct-voice";

interface UseVoiceCancelActionsParams {
  sessionStatus: ConsultationSessionStatus;
  pauseLiveChat: (reason?: string) => Promise<unknown>;
  resumeLiveChat: (mode?: "chat" | "voice" | "video") => Promise<unknown>;
  refreshSessions: () => Promise<void>;
  directVoice: ReturnType<typeof useDirectVoice>;
  handleEndChat: (force?: boolean) => void;
}

interface UseVoiceCancelActionsReturn {
  voiceCancelOpen: boolean;
  voiceCancelBusy: boolean;
  openVoiceCancel: () => void;
  handleVoiceCancelOpenChange: (open: boolean) => void;
  handleVoiceContinueOverChat: () => Promise<void>;
  handleVoiceEndSession: () => Promise<void>;
}

/**
 * Manages voice cancellation dialog state and serialized billing-hold chain.
 *
 * @param params - Session status, pause/resume sockets, and direct voice handle
 * @returns Dialog visibility, busy state, and action handlers
 */
export function useVoiceCancelActions({
  sessionStatus,
  pauseLiveChat,
  resumeLiveChat,
  refreshSessions,
  directVoice,
  handleEndChat,
}: UseVoiceCancelActionsParams): UseVoiceCancelActionsReturn {
  const [voiceCancelOpen, setVoiceCancelOpen] = useState(false);
  const [voiceCancelBusy, setVoiceCancelBusy] = useState(false);
  const voiceHoldActive = useRef(false);
  const voiceHoldChain = useRef<Promise<unknown>>(Promise.resolve());

  const queueVoiceHold = useCallback(
    async (command: "hold" | "release") => {
      const next = voiceHoldChain.current
        .catch(() => undefined)
        .then(() =>
          command === "hold"
            ? pauseLiveChat("billing_hold")
            : resumeLiveChat("voice"),
        );
      voiceHoldChain.current = next;
      return next.catch(() => undefined);
    },
    [pauseLiveChat, resumeLiveChat],
  );

  const openVoiceCancel = useCallback(async () => {
    setVoiceCancelOpen(true);
    if (sessionStatus !== "active") return;
    voiceHoldActive.current = true;
    void queueVoiceHold("hold");
  }, [queueVoiceHold, sessionStatus]);

  const handleVoiceCancelOpenChange = useCallback(
    async (open: boolean) => {
      if (!open && voiceCancelBusy) return;
      setVoiceCancelOpen(open);
      if (open || !voiceHoldActive.current) return;
      voiceHoldActive.current = false;
      void queueVoiceHold("release");
    },
    [queueVoiceHold, voiceCancelBusy],
  );

  const handleVoiceContinueOverChat = useCallback(async () => {
    setVoiceCancelBusy(true);
    await voiceHoldChain.current.catch(() => undefined);
    voiceHoldActive.current = false;
    const switched = await directVoice.switchToChat();
    setVoiceCancelBusy(false);
    if (switched) {
      setVoiceCancelOpen(false);
      // Re-arm timer with chat mode pricing after switching to chat.
      await resumeLiveChat("chat");
      await refreshSessions();
      return;
    }
    voiceHoldActive.current = true;
  }, [directVoice, refreshSessions, resumeLiveChat]);

  const handleVoiceEndSession = useCallback(async () => {
    console.log("[VoiceConsultation] handleVoiceEndSession called", {
      voiceCancelOpen,
      voiceCancelBusy,
      voiceHoldActive: voiceHoldActive.current,
    });
    setVoiceCancelOpen(false);
    await voiceHoldChain.current.catch(() => undefined);
    voiceHoldActive.current = false;
    console.log("[VoiceConsultation] handleVoiceEndSession hold chain complete, calling directVoice.endVoice()");
    // Tear down RTC (clears sessionRef.current), clear stores, and end
    // the server session — all via directVoice.endVoice(). The server
    // ENDED event then sets sessionStatus="completed" and showModal=true.
    await directVoice.endVoice();
    console.log("[VoiceConsultation] handleVoiceEndSession directVoice.endVoice() completed");
  }, [directVoice]);

  return {
    voiceCancelOpen,
    voiceCancelBusy,
    openVoiceCancel,
    handleVoiceCancelOpenChange,
    handleVoiceContinueOverChat,
    handleVoiceEndSession,
  };
}
