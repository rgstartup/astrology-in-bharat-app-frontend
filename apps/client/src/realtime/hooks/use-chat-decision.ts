"use client";

import { useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { CHAT_EVENTS } from "@/realtime/topics/chat";
import { CHAT_STATUS } from "@/realtime/types/chat";
import type { ChatDecisionPayload } from "@/realtime/types/chat";

export interface ChatBudget {
  maxMinutes: number | null;
  startedAt: string | null;
}

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
  const [budget, setBudget] = useState<ChatBudget>({ maxMinutes: null, startedAt: null });

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();
    const match = (p: ChatDecisionPayload) => Number(p.consultationId) === id;
    const onAccepted = (p: ChatDecisionPayload) => {
      if (match(p)) {
        setDecision(CHAT_DECISION.ACCEPTED);
        setBudget({
          maxMinutes: typeof p.maxMinutes === "number" ? p.maxMinutes : null,
          startedAt: typeof p.startedAt === "string" ? p.startedAt : null,
        });
      }
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

  return { decision, budget };
};
