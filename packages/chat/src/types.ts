/**
 * Shared chat domain types. Transport-only: nothing here answers "is this
 * session live" or "how much time is left" — that belongs to the
 * consultation lifecycle. Field-for-field compatible with the per-app
 * `ChatMessage` contracts so apps can adopt these without migration.
 */

export type ChatSenderType = "user" | "expert" | "admin";

export type AttachmentType = "image" | "document";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: ChatSenderType;
  content: string;
  /** Owning session from the nested history contract (present for REST seeds). */
  sessionId?: string;
  type?: string;
  attachmentUrl?: string;
  attachmentType?: AttachmentType;
  /** Legacy snake_case / alternate keys kept for backend compatibility. */
  attachment_url?: string;
  attachment_type?: string;
  imageUrl?: string;
  mediaUrl?: string;
  createdAt?: string;
}

export interface PendingAttachment {
  url: string;
  type: AttachmentType;
  name: string;
  /** Local file staged for the single-call attachment send. Absent for remote-URL stages. */
  file?: File;
  /** Generated at pick time; reused across send retries so retries replay. */
  idempotencyKey?: string;
}

export interface TypingStatus {
  senderName: string;
  isTyping: boolean;
}

/** Minimal session bucket for timeline grouping (maps from history DTOs). */
export interface SessionMeta {
  sessionId: string | number;
  mode?: string | null;
  startedAt?: string | null;
}

export type TimelineDateItem = {
  kind: "date";
  key: string;
  label: string;
};

export type TimelineSessionItem = {
  kind: "session";
  key: string;
  sessionId: string;
  label: string;
  startedAt?: string;
};

export type TimelineMessageItem = {
  kind: "message";
  key: string;
  message: ChatMessage;
};

export type TimelineItem = TimelineDateItem | TimelineSessionItem | TimelineMessageItem;
