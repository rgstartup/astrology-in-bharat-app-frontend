import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import type {
  JoinChatAck,
  SendChatMessageAck,
} from "@/realtime/types/chat";

// Canonical backend event names (SOCKET_EVENTS.CHAT).
export const CHAT_EVENTS = {
  JOIN: "chat:join",
  LEAVE: "chat:leave",
  SEND: "chat:send",
  MESSAGE: "chat:message",
  TYPING: "chat:typing",
  END: "chat:end",
  REQUEST: "chat:request",
  INCOMING: "chat:incoming",
  ACCEPT: "chat:accept",
  REJECT: "chat:reject",
  ACCEPTED: "chat:accepted",
  REJECTED: "chat:rejected",
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

/** Expert decision (acked). Server joins the armed room on accept, notifies client either way. */
export const acceptChat = (consultationId: number): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.ACCEPT, { consultationId });

export const rejectChat = (consultationId: number): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.REJECT, { consultationId });
