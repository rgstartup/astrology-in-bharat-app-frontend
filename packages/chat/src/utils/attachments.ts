import type { AttachmentType, ChatMessage } from "../types";

/** MIME sniff used at file-pick time; unknown types fall back to document. */
export function attachmentTypeFromMime(mimeType?: string | null): AttachmentType {
  if (mimeType?.toLowerCase().startsWith("image/")) return "image";
  return "document";
}

/**
 * Textless attachment sends carry filler content: the backend default is
 * lowercase `sent an attachment`, the legacy socket composers used the
 * capitalized variants. Matches all so attachment-only messages render
 * just the attachment view.
 */
export function isAttachmentFallbackText(content: string): boolean {
  const trimmed = content.trim().toLowerCase();
  return trimmed === "sent an image" || trimmed === "sent an attachment";
}

/** First-attachment-wins across camelCase, snake_case, and legacy keys. */
export function resolveAttachmentUrl(message: ChatMessage): string | undefined {
  return (
    message.attachmentUrl ?? message.attachment_url ?? message.imageUrl ?? message.mediaUrl
  );
}

export function resolveAttachmentType(message: ChatMessage): AttachmentType | undefined {
  const raw = message.attachmentType ?? message.attachment_type;
  if (raw === "image" || raw === "document") return raw;
  return undefined;
}

export function hasAttachment(message: ChatMessage): boolean {
  return resolveAttachmentUrl(message) !== undefined;
}
