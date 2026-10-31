"use client";

import React, { createContext, useContext, useMemo, useCallback } from "react";
import type { ChatMessage } from "@/lib/types";
import { useChatMessages, useChatTypingDisplay, useChatTimeline, type TypingStatus } from "@repo/chat";
import { useRoomComposer } from "../hooks/use-room-composer";
import { liveMessageKey, toChatMessage } from "../utils/message-keys";
import { useRoomLifecycle } from "./room-lifecycle.provider";

export interface RoomChatContextValue {
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  timeline: ReturnType<typeof useChatTimeline>;
  typingStatus: TypingStatus | null;
  composer: ReturnType<typeof useRoomComposer>;
}

const RoomChatContext = createContext<RoomChatContextValue | null>(null);

export interface RoomChatProviderProps {
  initialMessages: ChatMessage[];
  children: React.ReactNode;
}

/**
 * Provider managing chat conversation state in the room:
 * message history and live traffic deduping, timeline calculation,
 * remote typing display, and composer/attachment handling.
 *
 * @param props - Initial seed messages and provider children
 */
export function RoomChatProvider({ initialMessages, children }: RoomChatProviderProps) {
  const {
    roomConsultationId,
    user,
    expertData,
    sessions,
    sessionId,
    liveMessages,
    sendLiveMessage,
    sendLiveTyping,
    remoteTyping,
  } = useRoomLifecycle();

  const { messages, setMessages } = useChatMessages({
    initial: initialMessages,
    live: liveMessages,
    liveKey: (m) => liveMessageKey(m),
    baseKeys: (m) => [liveMessageKey(m)],
    toMessage: toChatMessage,
  });

  const timeline = useChatTimeline(messages, sessions);

  const typingStatus = useChatTypingDisplay(
    remoteTyping,
    (expertData as { name?: string } | null)?.name ?? "Expert",
  );

  const handleAttachmentSent = useCallback(
    (message: ChatMessage) => {
      setMessages((prev: ChatMessage[]) => {
        const known = new Set(prev.map((m) => liveMessageKey(m)));
        return known.has(liveMessageKey(message)) ? prev : [...prev, message];
      });
    },
    [setMessages],
  );

  const composer = useRoomComposer({
    roomConsultationId,
    user,
    sessionId,
    sendLiveMessage,
    sendLiveTyping,
    onAttachmentSent: handleAttachmentSent,
  });

  const contextValue = useMemo<RoomChatContextValue>(
    () => ({
      messages,
      setMessages,
      timeline,
      typingStatus,
      composer,
    }),
    [messages, setMessages, timeline, typingStatus, composer],
  );

  return (
    <RoomChatContext.Provider value={contextValue}>
      {children}
    </RoomChatContext.Provider>
  );
}

/**
 * Hook to access room chat context (messages, timeline, typing, composer).
 *
 * @returns RoomChatContextValue
 * @throws Error if used outside RoomChatProvider
 */
export function useRoomChat(): RoomChatContextValue {
  const context = useContext(RoomChatContext);
  if (!context) {
    throw new Error("useRoomChat must be used within a RoomChatProvider");
  }
  return context;
}
