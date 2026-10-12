"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { ChatRoomContent, RoomErrorState, RoomLoadingState } from "./chat-room";
import { useRoomSeed } from "./chat-room/hooks/use-room-seed";

/**
 * Route shell: owns search params + the initial REST seed
 * (`getChatPrepExpertAction`, `getChatHistoryAction` via `useRoomSeed`),
 * then hands fully-loaded props to the room. Stays inside Suspense because
 * `useSearchParams` requires it.
 */
function ChatRoomBootstrap() {
  const params = useParams();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const sessionId = searchParams.get("sessionId");
  const consultationIdParam = searchParams.get("consultationId");
  const consultationId = consultationIdParam ? Number(consultationIdParam) : null;
  const roomConsultationId =
    consultationId && !isNaN(consultationId) ? consultationId : null;

  const { isAuthenticated } = useAuthStore();
  const { seed } = useRoomSeed(id, roomConsultationId, isAuthenticated);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (seed) return;
    const timer = setTimeout(() => setLoadError(true), 10000); // 10 second timeout
    return () => clearTimeout(timer);
  }, [seed]);

  if (loadError) return <RoomErrorState />;

  if (!seed) return <RoomLoadingState />;

  return (
    <ChatRoomContent
      sessionId={sessionId}
      roomConsultationId={roomConsultationId}
      expertData={seed.expertData}
      initialMessages={seed.messages}
      initialSessions={seed.sessions}
    />
  );
}

export default function ChatRoom() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center bg-background p-6">
          <Empty>
            <Spinner />
            <EmptyTitle>Loading consultation…</EmptyTitle>
          </Empty>
        </div>
      }
    >
      <ChatRoomBootstrap />
    </Suspense>
  );
}
