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
  PAUSED: "consultation:paused",
  RESUME: "consultation:chat:resume",
  RESUMED: "consultation:resumed",
} as const;

export interface SendChatMessageInput {
  consultationId: number;
  content: string;
  /** Canonical attachment reference (persisted, FK to media row). */
  attachmentMediaId?: number;
  /** @deprecated — legacy raw-URL passthrough, never persisted. Use `attachmentMediaId`. */
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

/** Client → server chat request (acked). Server forwards `chat:incoming` to the expert. */
export const requestChat = (
  consultationId: number,
  expertId: number,
): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.REQUEST, { consultationId, expertId });

/** Client cancels a pending request (acked). Server settles + notifies the expert. */
export const cancelChat = (consultationId: number): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.CANCEL, { consultationId });

/** Either actor ends an active chat (acked). Server flips to COMPLETED + emits `chat:ended` to the room. */
export const endChat = (consultationId: number): Promise<JoinChatAck> =>
  emitWithAck<JoinChatAck>(CHAT_EVENTS.END, { consultationId });

/** Client timer hit zero (acked). Server validates the live budget, gates messaging, emits `consultation:paused`. */
export const pauseChat = (consultationId: number): Promise<ChatPauseAck> =>
  emitWithAck<ChatPauseAck>(CHAT_EVENTS.PAUSE, { consultationId });

/** Client recharged (acked). Server checks paid budget, re-anchors, emits `consultation:resumed`. */
export const resumeChat = (consultationId: number): Promise<ChatResumeAck> =>
  emitWithAck<ChatResumeAck>(CHAT_EVENTS.RESUME, { consultationId });
