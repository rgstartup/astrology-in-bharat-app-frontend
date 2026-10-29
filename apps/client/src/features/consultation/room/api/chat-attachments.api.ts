"use client";

import uploadApi from "@/api/upload.api";
import { API_ROUTES } from "@/lib/api-routes";
import type { Result, UploadProgress } from "@repo/safe-fetch";
import type { ChatMessage } from "@/lib/types";

/** Mirrors backend `ChatAttachmentResponseDto` (persisted message payload). */
export interface ChatAttachmentMessage {
  id: number;
  consultationId: number;
  senderId: number;
  senderType: string;
  content: string;
  messageType: string;
  attachments: { url: string; mimeType: string | null }[];
  timestamp: string;
}

/** Mirrors backend `ALLOWED_MIME_TYPES` in the shared attachment service. */
export const CHAT_ATTACHMENT_ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
  "application/pdf",
] as const;

/** Mirrors backend `MAX_ATTACHMENT_BYTES` (50MB). */
export const CHAT_ATTACHMENT_MAX_BYTES = 50 * 1024 * 1024;

/** Client-side guard mirroring the backend allowlist. Returns an error message or null. */
export function getChatAttachmentError(file: File): string | null {
  if (
    !CHAT_ATTACHMENT_ALLOWED_MIME_TYPES.includes(
      file.type as (typeof CHAT_ATTACHMENT_ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return "Only images (JPEG, PNG, WebP, AVIF) and PDF files are allowed.";
  }
  if (file.size > CHAT_ATTACHMENT_MAX_BYTES) {
    return "File size must be less than 50MB.";
  }
  return null;
}

const toAttachmentType = (
  mimeType?: string | null,
): ChatMessage["attachmentType"] => {
  if (!mimeType) return undefined;
  if (mimeType.startsWith("image/")) return "image";
  return "document";
};

/** Flatten the attachment-send response into a room message. Same first-
 * attachment-wins rule as history seeding (`use-room-seed`).
 */
export function toChatMessageFromAttachment(
  m: ChatAttachmentMessage,
): ChatMessage {
  const first = m.attachments?.[0];
  const attachmentType = toAttachmentType(first?.mimeType);
  return {
    id: String(m.id),
    senderId: String(m.senderId),
    senderType: m.senderType === "expert" ? "expert" : "user",
    content: m.content,
    ...(first?.url ? { attachmentUrl: first.url } : {}),
    ...(attachmentType ? { attachmentType } : {}),
    createdAt: m.timestamp,
  };
}

/**
 * Sends a chat message with an attachment in a single HTTP call carrying
 * the file, the message text, and the idempotency key. The server persists
 * message + media + link in one transaction and emits `chat:message` to
 * the room — no socket `chat:send` needed. Retries must reuse the same
 * `idempotencyKey` so a retried send replays instead of duplicating.
 */
export async function sendChatAttachment(
  file: File,
  consultationId: number,
  content: string,
  idempotencyKey: string,
  onUploadProgress?: (progress: UploadProgress) => void,
): Promise<Result<ChatAttachmentMessage>> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("consultationId", String(consultationId));
  formData.append("content", content);
  formData.append("idempotencyKey", idempotencyKey);
  return uploadApi.upload<ChatAttachmentMessage>(
    API_ROUTES.CHAT.ATTACHMENTS,
    formData,
    {
      onUploadProgress,
    },
  );
}
