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
import type { ChatMessagePayload, ChatTypingPayload } from "@/realtime/types/chat";

/**
 * Chat-only hook: joins the consultation's chat room and streams chat
 * messages + typing. Consultation lifecycle (end/pause/resume/decision)
 * is owned by useConsultation.
 */
export const useChat = (
  consultationId?: number | string | null,
  sessionId?: number | string | null,
) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const sessionIdNum = sessionId != null ? Number(sessionId) : null;
  const isValidSessionId = sessionIdNum != null && !isNaN(sessionIdNum);
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);
  const [remoteTyping, setRemoteTyping] = useState(false);

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();

    const handleMessage = (payload: ChatMessagePayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setMessages((prev) => [...prev, payload]);
      }
    };

    const handleTyping = (payload: ChatTypingPayload) => {
      if (
        payload &&
        Number(payload.consultationId) === id &&
        !(isValidSessionId && payload.sessionId != null && Number(payload.sessionId) !== sessionIdNum)
      ) {
        setRemoteTyping(Boolean(payload.isTyping));
      }
    };

    const handleConnect = () => {
      joinChat(id).catch(() => undefined);
    };

    if (!socket.connected) {
      socket.connect();
    } else {
      handleConnect();
    }

    socket.on(CHAT_EVENTS.MESSAGE, handleMessage);
    socket.on(CHAT_EVENTS.TYPING, handleTyping);
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CHAT_EVENTS.MESSAGE, handleMessage);
      socket.off(CHAT_EVENTS.TYPING, handleTyping);
      socket.off("connect", handleConnect);
      leaveChat(id).catch(() => undefined);
    };
  }, [id, isValidId, sessionId, sessionIdNum]);

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

  return {
    messages,
    send,
    typing,
    remoteTyping,
  };
};

export type { ChatTypingPayload };
