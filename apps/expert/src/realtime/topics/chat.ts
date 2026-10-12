import { emitWithAck, realtimeSocket } from "@/realtime/socket";
import type {
  JoinChatAck,
  ChatPauseAck,
  ChatResumeAck,
  SendChatMessageAck,
} from "@/realtime/types/chat";

// Canonical backend event names (SOCKET_EVENTS.CHAT).
export const CHAT_EVENTS = {
  JOIN: "consultation:chat:join",
  LEAVE: "consultation:chat:leave",
  SEND: "consultation:chat:send",
  MESSAGE: "consultation:chat:message",
  TYPING: "consultation:chat:typing",
  END: "consultation:chat:end",
  REQUEST: "consultation:chat:request",
  INCOMING: "consultation:chat:incoming",
  ACCEPT: "consultation:chat:accept",
  REJECT: "consultation:chat:reject",
  ACCEPTED: "consultation:chat:accepted",
  REJECTED: "consultation:chat:rejected",
  CANCEL: "consultation:chat:cancel",
  ENDED: "consultation:chat:ended",
  PAUSE: "consultation:chat:pause",
  PAUSED: "consultation:chat:paused",
  RESUME: "consultation:chat:resume",
  RESUMED: "consultation:chat:resumed",
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

/** Client cancels a pending request (acked). Server settles + notifies the expert. */
export const cancelChat = (consultationId: number): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.CANCEL, { consultationId });

/** Either actor ends an active chat (acked). Server flips to COMPLETED + emits `chat:ended` to the room. */
export const endChat = (consultationId: number): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.END, { consultationId });

/** Balance-exhaustion pause / resume (acked). Only the client timer sends these; the expert only listens. */
export const pauseChat = (consultationId: number): Promise<ChatPauseAck> =>
  emitWithAck<ChatPauseAck>(CHAT_EVENTS.PAUSE, { consultationId });

export const resumeChat = (consultationId: number): Promise<ChatResumeAck> =>
  emitWithAck<ChatResumeAck>(CHAT_EVENTS.RESUME, { consultationId });
