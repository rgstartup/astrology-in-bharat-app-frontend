/**
 * types/chat.ts
 * Centralized TypeScript type definitions for Chat domain.
 * Single canonical interface — no more duplicate snake_case/camelCase fields.
 */

// ─── Chat Session ─────────────────────────────────────────────────────────────

export type ChatSessionStatus = "pending" | "active" | "completed";

export interface ChatSession {
  id: string;
  status: ChatSessionStatus;
  startedAt?: string;   // ISO UTC string
  expiresAt?: string;   // ISO UTC string
  remainingSeconds?: number;
  elapsedSeconds?: number;
  isFree?: boolean;
  user?: {
    id?: string;
    name?: string;
    profile_picture?: string;
    avatar?: string;
  };
}

// ─── Chat Message ─────────────────────────────────────────────────────────────

export type MessageSenderType = "user" | "expert" | "admin";
export type AttachmentType = "image" | "document";

export interface ChatMessage {
  id: string;
  senderId: string;
  senderType: MessageSenderType;
  content: string;
  type?: string;
  attachmentUrl?: string;
  attachmentType?: AttachmentType;
  // Legacy fields for compatibility
  attachment_url?: string;
  attachment_type?: string;
  imageUrl?: string;
  mediaUrl?: string;
  createdAt?: string;
}

// ─── Intro Card (special message type) ───────────────────────────────────────

export interface IntroCardData {
  name?: string;
  gender?: string;
  dob?: string;   // Date of Birth
  tob?: string;   // Time of Birth
  pob?: string;   // Place of Birth
}

// ─── Pending Attachment (before send) ────────────────────────────────────────

export interface PendingAttachment {
  url: string;
  type: AttachmentType;
  name: string;
}

// ─── Socket Payloads ─────────────────────────────────────────────────────────

export interface SendMessagePayload {
  sessionId: string;
  senderId: string;
  senderType: MessageSenderType;
  content: string;
  attachmentUrl?: string;
  attachmentType?: AttachmentType;
}

export interface SessionEndedPayload {
  sessionId: string;
  terminatedBy?: "user" | "expert" | "admin";
  interventionMessage?: string;
}
