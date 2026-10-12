"use client";

import { Suspense } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Loading } from "@repo/ui";
import { ChatRoomContent } from "./chat-room";

function ExpertChatRoomBootstrap() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = params.sessionId as string;
  const consultationIdParam = searchParams.get("consultationId");
  const newFlowId =
    consultationIdParam && !isNaN(Number(consultationIdParam))
      ? Number(consultationIdParam)
      : null;

  return <ChatRoomContent sessionId={sessionId} newFlowId={newFlowId} />;
}

export default function ExpertChatRoomPage() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ExpertChatRoomBootstrap />
    </Suspense>
  );
}
