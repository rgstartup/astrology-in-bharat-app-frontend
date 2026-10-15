import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import type {
  JoinChatAck,
  SendChatMessageAck,
} from "@/realtime/types/chat";

// Canonical backend event names (SOCKET_EVENTS.CHAT) — transport only.
// Lifecycle (request/accept/reject/cancel/end/pause/resume) goes through
// CONSULTATION_EVENTS via the orchestrator.
export const CHAT_EVENTS = {
  JOIN: "consultation:chat:join",
  LEAVE: "consultation:chat:leave",
  SEND: "consultation:chat:send",
  MESSAGE: "consultation:chat:message",
  TYPING: "consultation:chat:typing",
} as const;

export interface SendChatMessageInput {
  consultationId: number;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
}

export const joinChat = (
  consultationId: number,
): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.JOIN, { consultationId });

export const leaveChat = (
  consultationId: number,
): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.LEAVE, { consultationId });

export const sendChatMessage = (
  input: SendChatMessageInput,
): Promise<SendChatMessageAck> =>
  emitWithAck<SendChatMessageAck>(CHAT_EVENTS.SEND, { ...input });

/** Typing is a fire-and-forget relay (no ack from the backend). */
export const sendChatTyping = (
  consultationId: number,
  isTyping = true,
): void => {
  const active = realtimeSocket();
  if (!active.connected) return;
  active.emit(CHAT_EVENTS.TYPING, { consultationId, isTyping });
};
