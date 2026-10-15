"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { getChatHistoryAction, getChatPrepExpertAction } from "@/actions/chat";
import type { ChatHistoryMessageDto, ChatHistorySessionDto } from "@/actions/chat";
import { toast } from "@/hooks/use-toast";
import { getErrorMessage } from "@repo/lib";
import type { ChatMessage } from "@/lib/types";
import type { IExpert } from "@repo/lib";

export type RoomSeed = {
  expertData: IExpert;
  messages: ChatMessage[];
  sessions: ChatHistorySessionDto[];
};

const toSenderType = (senderType: string): ChatMessage["senderType"] => {
  if (senderType === "expert") return "expert";
  if (senderType === "admin") return "admin";
  return "user";
};

const toAttachmentType = (
  mimeType?: string | null,
): ChatMessage["attachmentType"] => {
  if (!mimeType) return undefined;
  if (mimeType.startsWith("image/")) return "image";
  return "document";
};

/**
 * Flatten the nested history contract (sessions → messages) into the room's
 * chronological message list. Sessions arrive oldest-first with messages
 * oldest-first, so session-by-session flattening preserves order. The room UI
 * renders a single attachment per message — the first attachment wins.
 */
const toRoomMessages = (
  sessions: { messages: ChatHistoryMessageDto[] }[],
): ChatMessage[] =>
  sessions.flatMap((session) =>
    session.messages.map((row) => {
      const first = row.attachments?.[0];
      const attachmentType = toAttachmentType(first?.mimeType);
      return {
        id: String(row.id),
        senderId: String(row.senderId),
        senderType: toSenderType(row.senderType),
        content: row.content,
        ...(row.sessionId != null ? { sessionId: String(row.sessionId) } : {}),
        ...(first?.url ? { attachmentUrl: first.url } : {}),
        ...(attachmentType ? { attachmentType } : {}),
        createdAt: row.timestamp,
      } satisfies ChatMessage;
    }),
  );

/**
 * Seeds the room from canonical REST: expert profile + persisted history.
 * Resolves once — both payloads are set together so consumers can mount
 * with complete initial props. Redirects home when `consultationId` or
 * `expertId` is missing (no consultation-detail endpoint exists to resolve
 * expert-from-consultation, so callers carry `expertId` as a query param).
 */
export const useRoomSeed = (
  expertId: string | null,
  roomConsultationId: number | null,
  isAuthenticated: boolean,
) => {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [seed, setSeed] = useState<RoomSeed | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !mounted) return;
    if (!roomConsultationId || !expertId || expertId === "undefined") {
      toast.error("Missing consultation. Returning home.");
      router.push("/");
      return;
    }

    const fetchData = async () => {
      const expertRes = await getChatPrepExpertAction(expertId);
      if (!expertRes.ok) {
        toast.error(getErrorMessage(expertRes.error) || "Failed to load expert");
        return;
      }

      const history = await getChatHistoryAction(roomConsultationId);
      const sessions: ChatHistorySessionDto[] =
        history.ok && history.data ? (history.data.sessions ?? []) : [];
      const messages: ChatMessage[] = toRoomMessages(sessions);

      setSeed({ expertData: expertRes.data, messages, sessions });
    };

    fetchData();
  }, [expertId, roomConsultationId, isAuthenticated, mounted, router]);

  return { seed };
};
