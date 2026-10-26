import type { ConsultationMode } from "./consultation";

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
  /** Owning session id — buckets live messages for timeline dividers. */
  sessionId?: number | null;
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
  /** Room mode the join was metered under (echoes the requested mode). */
  mode?: ConsultationMode;
  /** Authoritative parent-consultation status at join time (requested/accepted/active/completed/…); absent on older servers. */
  consultationStatus?: string | null;
  /** Live display budget (affordable minutes), absent when unresolvable. */
  maxMinutes?: number;
  /** Countdown anchor (resume anchor or session start), null before start. */
  startedAt?: string | null;
  /** Consumed seconds at ack time (pre-resume base + anchor drift); absent on older servers. */
  elapsedSeconds?: number;
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

export interface ConsultationDecisionPayload {
  consultationId: number;
  expertId: number | string;
  timestamp: string;
  /** Live display budget on accept, absent on older servers. */
  maxMinutes?: number;
  /** Countdown anchor on accept, null before start. */
  startedAt?: string | null;
  /** Accept-time Agora voice token (voice/video only), targeted to this client. */
  token?: string;
  tokenExpiresAt?: string;
  channelName?: string;
}

export interface ChatEndedPayload {
  consultationId: number;
  /** Room mode the consultation ended under. */
  mode?: ConsultationMode;
  endedBy: string;
  /** Total billable seconds accumulated in the consultation. */
  totalDurationSeconds?: number;
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
  /** Pause origin (`billing_hold` freezes the clock only); absent on older servers. */
  reason?: string;
  timestamp: string;
}

export interface ChatResumedPayload {
  consultationId: number;
  maxMinutes: number;
  startedAt: string;
  /** Consumed seconds carried forward as the resume base; absent on older servers. */
  elapsedSeconds?: number;
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
  /** Consumed seconds carried forward as the resume base; absent on older servers. */
  elapsedSeconds?: number;
}
