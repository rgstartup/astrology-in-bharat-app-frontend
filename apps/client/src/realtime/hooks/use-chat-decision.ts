"use client";

import { useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { CHAT_EVENTS } from "@/realtime/topics/chat";
import { CHAT_STATUS } from "@/realtime/types/chat";
import type { ChatDecisionPayload } from "@/realtime/types/chat";

export const CHAT_DECISION = {
  WAITING: "waiting",
  ACCEPTED: CHAT_STATUS.ACCEPTED,
  REJECTED: CHAT_STATUS.REJECTED,
} as const;

export type ChatDecision = (typeof CHAT_DECISION)[keyof typeof CHAT_DECISION];

/** Listen for expert accept/reject on a consultation's chat room. */
export const useChatDecision = (consultationId?: number | string | null) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const [decision, setDecision] = useState<ChatDecision>(CHAT_DECISION.WAITING);

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();
    const match = (p: ChatDecisionPayload) => Number(p.consultationId) === id;
    const onAccepted = (p: ChatDecisionPayload) => {
      if (match(p)) setDecision(CHAT_DECISION.ACCEPTED);
    };
    const onRejected = (p: ChatDecisionPayload) => {
      if (match(p)) setDecision(CHAT_DECISION.REJECTED);
    };
    socket.on(CHAT_EVENTS.ACCEPTED, onAccepted);
    socket.on(CHAT_EVENTS.REJECTED, onRejected);
    return () => {
      socket.off(CHAT_EVENTS.ACCEPTED, onAccepted);
      socket.off(CHAT_EVENTS.REJECTED, onRejected);
    };
  }, [id, isValidId]);

  return { decision };
};
