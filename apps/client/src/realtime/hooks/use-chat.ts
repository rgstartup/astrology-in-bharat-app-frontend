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
 * Join a consultation's chat room for its lifetime. Failures are silent —
 * REST history remains the source of truth.
 */
export const useChat = (consultationId?: number | string | null) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));
  const [messages, setMessages] = useState<ChatMessagePayload[]>([]);

  useEffect(() => {
    if (!isValidId) return;
    const socket = realtimeSocket();

    const handleMessage = (payload: ChatMessagePayload) => {
      if (payload && Number(payload.consultationId) === id) {
        setMessages((prev) => [...prev, payload]);
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
    socket.on("connect", handleConnect);

    return () => {
      socket.off(CHAT_EVENTS.MESSAGE, handleMessage);
      socket.off("connect", handleConnect);
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

  return { messages, send, typing };
};

export type { ChatTypingPayload };
