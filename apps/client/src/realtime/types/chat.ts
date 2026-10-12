/** Persisted attachment shape emitted by the backend on `chat:message` (HTTP sends). */
export interface ChatAttachmentPayload {
  url: string;
  mimeType: string | null;
}

export interface ChatMessagePayload {
  id?: number | string;
  consultationId: number;
  senderId: number | string;
  senderType: string;
  content: string;
  /** First-attachment-wins flattened view; absent on HTTP sends (see `attachments`). */
  attachmentUrl?: string;
  attachmentType?: string;
  /** Raw persisted attachments (HTTP attachment sends carry only this). */
  attachments?: ChatAttachmentPayload[];
  timestamp: string;
}

export interface ChatTypingPayload {
  consultationId: number;
  senderId: number | string;
  senderType: string;
  isTyping: boolean;
}

export interface JoinChatAck {
  status: ChatStatus;
  consultationId: number;
  /** Authoritative parent-consultation status at join time (requested/accepted/active/completed/…); absent on older servers. */
  consultationStatus?: string | null;
  /** Live display budget (affordable minutes), absent when unresolvable. */
  maxMinutes?: number;
  /** Countdown anchor (resume anchor or session start), null before start. */
  startedAt?: string | null;
}

export interface SendChatMessageAck {
  status: ChatStatus;
  message: ChatMessagePayload;
}

/** Mirror of backend CHAT_ACK_STATUS (socket wire values). */
export const CHAT_STATUS = {
  JOINED: "joined",
  LEFT: "left",
  SENT: "sent",
  REQUESTED: "requested",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
  ENDED: "ended",
  IGNORED: "ignored",
  PAUSED: "paused",
  RESUMED: "resumed",
} as const;

export type ChatStatus = (typeof CHAT_STATUS)[keyof typeof CHAT_STATUS];

export interface ChatIncomingPayload {
  consultationId: number;
  expertId: number;
  clientId: number | string;
  senderType: string;
  sessionId: number | null;
  timestamp: string;
}

export interface ChatDecisionPayload {
  consultationId: number;
  expertId: number | string;
  timestamp: string;
  /** Live display budget on accept, absent on older servers. */
  maxMinutes?: number;
  /** Countdown anchor on accept, null before start. */
  startedAt?: string | null;
}

export interface ChatEndedPayload {
  consultationId: number;
  endedBy: string;
  /** Display-only end reason (e.g. `balance_exhausted`); absent on older servers. */
  reason?: string;
  timestamp: string;
}

export interface ChatPausedPayload {
  consultationId: number;
  elapsedSeconds: number;
  consumedAmount: number;
  maxMinutes: number;
  pauseExpiresInSec: number;
  timestamp: string;
}

export interface ChatResumedPayload {
  consultationId: number;
  maxMinutes: number;
  startedAt: string;
  timestamp: string;
}

export interface ChatPauseAck {
  status: ChatStatus;
  consultationId: number;
  elapsedSeconds?: number;
  consumedAmount?: number;
  maxMinutes?: number;
}

export interface ChatResumeAck {
  status: ChatStatus;
  consultationId: number;
  maxMinutes?: number;
  startedAt?: string | null;
}
