"use client";

import { useState, useRef, useCallback } from "react";
import type { RoomSessionStatus } from "../hooks/use-room-verdict";
import type { useDirectVoice } from "../hooks/use-direct-voice";

interface UseVoiceCancelActionsParams {
  sessionStatus: RoomSessionStatus;
  pauseLiveChat: (reason?: string) => Promise<unknown>;
  resumeLiveChat: (mode?: "chat" | "voice" | "video") => Promise<unknown>;
  refreshSessions: () => Promise<void>;
  directVoice: ReturnType<typeof useDirectVoice>;
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

  const openVoiceCancel = useCallback(() => {
    setVoiceCancelOpen(true);
    if (sessionStatus !== "active") return;
    voiceHoldActive.current = true;
    void queueVoiceHold("hold");
  }, [queueVoiceHold, sessionStatus]);

  const handleVoiceCancelOpenChange = useCallback(
    (open: boolean) => {
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
      await refreshSessions();
      return;
    }
    voiceHoldActive.current = true;
  }, [directVoice, refreshSessions]);

  const handleVoiceEndSession = useCallback(async () => {
    setVoiceCancelOpen(false);
    await voiceHoldChain.current.catch(() => undefined);
    voiceHoldActive.current = false;
    if (sessionStatus === "active") {
      await directVoice.endVoice();
      return;
    }
    await directVoice.cancelVoice();
  }, [directVoice, sessionStatus]);

  return {
    voiceCancelOpen,
    voiceCancelBusy,
    openVoiceCancel,
    handleVoiceCancelOpenChange,
    handleVoiceContinueOverChat,
    handleVoiceEndSession,
  };
}
