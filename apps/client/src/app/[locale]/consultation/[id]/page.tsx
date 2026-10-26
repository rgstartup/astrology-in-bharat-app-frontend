"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Empty, EmptyTitle } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { ChatRoomContent, RoomErrorState, RoomLoadingState } from "./room";
import { useRoomSeed } from "./room/hooks/use-room-seed";

/**
 * Route shell: owns search params + the initial REST seed
 * (`getChatPrepExpertAction`, `getChatHistoryAction` via `useRoomSeed`),
 * then hands fully-loaded props to the room. Stays inside Suspense because
 * `useSearchParams` requires it.
 *
 * Route contract: `/consultation/[id]` where `id` is the consultation id
 * (set by the chat prep modal). `expertId` travels as a query param — no
 * consultation-detail endpoint exists yet to resolve expert-from-consultation.
 */
function ChatRoomBootstrap() {
  const params = useParams();
  const searchParams = useSearchParams();
  const consultationIdParam = params.id as string;
  const consultationId = consultationIdParam ? Number(consultationIdParam) : NaN;
  const roomConsultationId = consultationIdParam && !isNaN(consultationId) ? consultationId : null;
  const expertId = searchParams.get("expertId");

  const { isAuthenticated } = useAuthStore();
  const { seed } = useRoomSeed(expertId, roomConsultationId, isAuthenticated);
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
