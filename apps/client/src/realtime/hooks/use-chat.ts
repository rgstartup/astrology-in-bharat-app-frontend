"use client";

import { useCallback, useEffect, useState } from "react";
import { realtimeSocket } from "@/realtime/socket";
import {
  CHAT_EVENTS,
  joinChat,
  leaveChat,
  sendChatMessage,
  sendChatTyping,
  type SendChatMessageInput,
} from "@/realtime/topics/chat";
import {
  CONSULTATION_EVENTS,
  endConsultation,
  pauseConsultation,
  resumeConsultation,
} from "@/realtime/topics/consultation";
import type {
  ChatEndedPayload,
  ChatMessagePayload,
  ChatPausedPayload,
  ChatResumedPayload,
  ChatTypingPayload,
  JoinChatAck,
} from "@/realtime/types/chat";

export interface ChatBudget {
  maxMinutes: number | null;
  startedAt: string | null;
}

/**
 * Join a consultation's chat room for its lifetime. Failures are silent —
 * REST history remains the source of truth.
 */
export const useChat = (consultationId?: number | string | null) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [remoteTyping, setRemoteTyping] = useState(false);
  const [ended, setEnded] = useState<ChatEndedPayload | null>(null);
  const [paused, setPaused] = useState<ChatPausedPayload | null>(null);
  const [consultationStatus, setConsultationStatus] = useState<string | null>(null);
  const [budget, setBudget] = useState<ChatBudget>({ maxMinutes: null, startedAt: null });

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();
    const applyBudget = (ack?: JoinChatAck | ChatResumedPayload | null) => {
      if (!ack) return;
      setBudget((prev) => ({
        maxMinutes:
          typeof ack.maxMinutes === "number" ? ack.maxMinutes : prev.maxMinutes,
        startedAt:
          typeof ack.startedAt === "string" ? ack.startedAt : prev.startedAt,
      }));
    };

    const handleMessage = (payload: ChatMessagePayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setMessages((prev) => [...prev, payload]);
      }
    };

    const handleTyping = (payload: ChatTypingPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setRemoteTyping(Boolean(payload.isTyping));
      }
    };

    const handleEnded = (payload: ChatEndedPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setEnded(payload);
        setPaused(null);
      }
    };

    const handlePaused = (payload: any) => {
      if (payload && Number(payload.consultationId) === id) {
        setPaused({
          ...payload,
          pauseExpiresInSec:
            typeof payload.pauseExpiresInSec === "number" && !isNaN(payload.pauseExpiresInSec)
              ? payload.pauseExpiresInSec
              : typeof payload.graceDurationSeconds === "number" && !isNaN(payload.graceDurationSeconds)
                ? payload.graceDurationSeconds
                : 300,
          consumedAmount: Number(payload.consumedAmount) || 0,
        });
        if (typeof payload.maxMinutes === "number") {
          setBudget((prev) => ({ ...prev, maxMinutes: payload.maxMinutes }));
        }
      }
    };

    const handleResumed = (payload: ChatResumedPayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setPaused(null);
        applyBudget(payload);
      }
    };

    const handleBudgetTick = (payload: any) => {
      if (payload && Number(payload.consultationId) === id) {
        setBudget((prev) => ({
          maxMinutes: typeof payload.maxMinutes === "number" ? payload.maxMinutes : prev.maxMinutes,
          startedAt: prev.startedAt,
        }));
      }
    };

    const handleBudgetRestored = (payload: any) => {
      if (payload && Number(payload.consultationId) === id) {
        setPaused(null);
        applyBudget(payload);
      }
    };

    const handleConnect = () => {
      joinChat(id)
        .then((ack) => {
          applyBudget(ack);
          if (ack?.consultationStatus) setConsultationStatus(ack.consultationStatus);
        })
        .catch(() => undefined);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    socket.on(CHAT_EVENTS.MESSAGE, handleMessage);
    socket.on(CHAT_EVENTS.TYPING, handleTyping);
    socket.on(CHAT_EVENTS.ENDED, handleEnded);
    socket.on(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
    socket.on(CHAT_EVENTS.PAUSED, handlePaused);
    socket.on(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
    socket.on(CHAT_EVENTS.RESUMED, handleResumed);
    socket.on(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
    socket.on(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
    socket.on(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CHAT_EVENTS.MESSAGE, handleMessage);
      socket.off(CHAT_EVENTS.TYPING, handleTyping);
      socket.off(CHAT_EVENTS.ENDED, handleEnded);
      socket.off(CONSULTATION_EVENTS.EVENTS.ENDED, handleEnded);
      socket.off(CHAT_EVENTS.PAUSED, handlePaused);
      socket.off(CONSULTATION_EVENTS.EVENTS.PAUSED, handlePaused);
      socket.off(CHAT_EVENTS.RESUMED, handleResumed);
      socket.off(CONSULTATION_EVENTS.EVENTS.RESUMED, handleResumed);
      socket.off(CONSULTATION_EVENTS.BUDGET.TICK, handleBudgetTick);
      socket.off(CONSULTATION_EVENTS.BUDGET.RESTORED, handleBudgetRestored);
      socket.off("connect", handleConnect);
      setConsultationStatus(null);
      leaveChat(id).catch(() => undefined);
    };
  }, [id, isValidId]);

  const send = useCallback(
    (input: Omit<SendChatMessageInput, "consultationId">) => {
      if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
      return sendChatMessage({ ...input, consultationId: id });
    },
    [id, isValidId],
  );

  const typing = useCallback(
    (isTyping = true) => {
      if (isValidId) sendChatTyping(id, isTyping);
    },
    [id, isValidId],
  );

  const end = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return endConsultation(id, "manual");
  }, [id, isValidId]);

  const pause = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return pauseConsultation(id);
  }, [id, isValidId]);

  const resume = useCallback(() => {
    if (!isValidId) return Promise.reject(new Error("Missing consultationId"));
    return resumeConsultation(id);
  }, [id, isValidId]);

  return {
    messages,
    send,
    typing,
    remoteTyping,
    ended,
    end,
    consultationStatus,
    budget,
    paused,
    pause,
    resume,
  };
};

export type { ChatTypingPayload };
