import type { ChatHistorySessionDto } from "@/actions/chat";
import type { ChatMessage } from "@/lib/types";
import type { ChatMessagePayload } from "@/realtime/types/chat";

type KeyedMessage = {
  id?: number | string;
  content: string;
  senderId: string | number;
  timestamp?: string;
  createdAt?: string;
};

/**
 * Flatten the nested history contract (sessions → messages) into the room's
 * chronological message list. Sessions arrive oldest-first with messages
 * oldest-first, so session-by-session flattening preserves order. The room UI
 * renders a single attachment per message — the first attachment wins.
 */
export const toRoomMessages = (
  sessions: ChatHistorySessionDto[],
): ChatMessage[] =>
  sessions.flatMap((session) =>
    session.messages.map((row) => {
      const attachment = row.attachments?.[0];
      let attachmentType: ChatMessage["attachmentType"];
      if (attachment?.mimeType) {
        attachmentType = attachment.mimeType.startsWith("image/")
          ? "image"
          : "document";
      }
      return {
        id: String(row.id),
        senderId: String(row.senderId),
        senderType:
          row.senderType === "expert"
            ? "expert"
            : row.senderType === "admin"
              ? "admin"
              : "user",
        content: row.content,
        ...(row.sessionId != null ? { sessionId: String(row.sessionId) } : {}),
        ...(attachment?.url ? { attachmentUrl: attachment.url } : {}),
        ...(attachmentType ? { attachmentType } : {}),
        createdAt: row.timestamp,
      } satisfies ChatMessage;
    }),
  );

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
