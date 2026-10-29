import type { ChatMessage } from "@/lib/types";
import type { ChatMessagePayload } from "@/realtime/types/chat";

type KeyedMessage = {
  id?: number | string;
  content: string;
  senderId: string | number;
  timestamp?: string;
  createdAt?: string;
};

export const liveMessageKey = (m: KeyedMessage): string =>
  m.id != null
    ? `id:${m.id}`
    : `${m.timestamp ?? m.createdAt ?? ""}|${m.senderId}|${m.content}`;

const attachmentMimeToType = (
  mimeType?: string | null,
): "image" | "document" | undefined => {
  if (!mimeType) return undefined;
  if (mimeType.toLowerCase().startsWith("image/")) return "image";
  return "document";
};

export const toChatMessage = (m: ChatMessagePayload): ChatMessage => {
  // HTTP attachment sends arrive as `attachments: [{ url, mimeType }]` with
  // no flat `attachmentUrl` — unwrap first-attachment-wins (same rule as
  // history seeding), falling back to the legacy flat socket fields.
  const first = m.attachments?.[0];
  const attachmentUrl = first?.url || m.attachmentUrl;
  const attachmentType =
    attachmentMimeToType(first?.mimeType) ??
    (m.attachmentType as "image" | "document" | undefined);
  return {
    id: m.id != null ? String(m.id) : liveMessageKey(m),
    senderId: String(m.senderId),
    senderType: m.senderType === "expert" ? "expert" : "user",
    content: m.content,
    ...(m.sessionId != null ? { sessionId: String(m.sessionId) } : {}),
    ...(attachmentUrl ? { attachmentUrl } : {}),
    ...(attachmentType ? { attachmentType } : {}),
    createdAt: m.timestamp,
  };
};
