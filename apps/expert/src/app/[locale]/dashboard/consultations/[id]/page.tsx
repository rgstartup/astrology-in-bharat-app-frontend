"use client";

import { Suspense, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { Loading } from "@repo/ui";
import { ChatRoomContent } from "@/features/consultation/room";

function ExpertChatRoomBootstrap() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = (params.id || params.sessionId) as string;

  useEffect(() => {
    if (id === "history") {
      router.replace("/dashboard/consultations");
    }
  }, [id, router]);

  if (id === "history") {
    return <Loading fullScreen />;
  }

  const consultationIdParam = searchParams.get("consultationId");
  const modeParam = searchParams.get("mode");
  const parsedId = Number(id);
  const newFlowId = !isNaN(parsedId)
    ? parsedId
    : (consultationIdParam && !isNaN(Number(consultationIdParam))
        ? Number(consultationIdParam)
        : null);

  return <ChatRoomContent sessionId={id} newFlowId={newFlowId} mode={modeParam as "chat" | "voice" | "video" | undefined} />;
}

export default function ExpertChatRoomPage() {
  return (
    <Suspense fallback={<Loading fullScreen />}>
      <ExpertChatRoomBootstrap />
    </Suspense>
  );
}
