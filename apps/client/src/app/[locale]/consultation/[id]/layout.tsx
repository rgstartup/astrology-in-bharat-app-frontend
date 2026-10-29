import type { ReactNode } from "react";
import { getChatHistoryAction, getChatPrepExpertAction } from "@/actions/chat";
import type {
  ChatHistoryMessageDto,
  ChatHistorySessionDto,
} from "@/actions/chat";
import type { ChatMessage } from "@/lib/types";
import {
  RoomSeedProvider,
  type RoomSeed,
} from "@/features/consultation/room/components/room-seed-provider";

type ConsultationLayoutProps = {
  children: ReactNode;
  params: Promise<{ id: string }>;
};

const toRoomMessages = (sessions: ChatHistorySessionDto[]): ChatMessage[] =>
  sessions.flatMap((session) =>
    session.messages.map((row: ChatHistoryMessageDto) => {
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

/**
 * Fetches the authenticated consultation seed on the server and passes the
 * initial expert, sessions, and messages directly into the client room.
 * Dynamic rendering lets router.refresh() request a fresh seed after accept.
 */
export const dynamic = "force-dynamic";

export default async function ConsultationLayout({
  children,
  params,
}: ConsultationLayoutProps) {
  const { id } = await params;
  const consultationId = Number(id);
  let seed: RoomSeed | null = null;
  let seedKey: string | null = null;

  if (!Number.isSafeInteger(consultationId) || consultationId <= 0) {
    return (
      <RoomSeedProvider
        initialState={{ roomConsultationId: 0, seed, seedKey }}
      >
        {children}
      </RoomSeedProvider>
    );
  }

  const historyResult = await getChatHistoryAction(consultationId);
  if (historyResult.ok && historyResult.data) {
    const expertResult = await getChatPrepExpertAction(
      historyResult.data.expertId,
    );
    if (expertResult.ok) {
      const sessions = historyResult.data.sessions ?? [];
      const activeSession = [...sessions]
        .reverse()
        .find((session) => session.status === "active");
      seedKey = `${activeSession?.sessionId ?? "pending"}:${activeSession?.startedAt ?? ""}`;
      seed = {
        expertData: expertResult.data,
        messages: toRoomMessages(sessions),
        sessions,
      };
    }
  }

  return (
    <RoomSeedProvider
      initialState={{
        roomConsultationId: consultationId,
        seed,
        seedKey,
      }}
    >
      {children}
    </RoomSeedProvider>
  );
}
