import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import { CONSULTATION_EVENTS } from "@/realtime/topics/consultation";
import type { ConsultationMode } from "@/realtime/types/consultation";
import type {
  JoinChatAck,
  SendChatMessageAck,
} from "@/realtime/types/chat";

// Canonical backend event names: membership rides on consultation:join/leave,
// transport stays on SOCKET_EVENTS.CHAT.
export const CHAT_EVENTS = {
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
  mode: ConsultationMode = "chat",
): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CONSULTATION_EVENTS.COMMANDS.JOIN, {
    consultationId,
    mode,
  });

export const leaveChat = (
  consultationId: number,
): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CONSULTATION_EVENTS.COMMANDS.LEAVE, {
    consultationId,
  });

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
