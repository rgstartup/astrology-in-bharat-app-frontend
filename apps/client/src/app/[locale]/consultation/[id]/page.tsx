"use client";

import React, { Suspense } from "react";
import { Empty, EmptyTitle } from "@repo/design/shadcn";
import { Spinner } from "@repo/design/shadcn";
import { RoomContent, useRoomLifecycle } from "@/features/consultation";
import { toRoomMessages } from "@/features/consultation/utils/message-keys";

/**
 * Route shell: reads the server-seeded consultation data from
 * `RoomLifecycleProvider` (populated by layout.tsx) and hands it to the room.
 * Stays inside Suspense for the initial route loading fallback.
 *
 * Route contract: `/consultation/[id]` where `id` is the consultation id
 * (set by the chat prep modal).
 */
function ChatRoomBootstrap() {
  const { sessions } = useRoomLifecycle();
  const initialMessages = toRoomMessages(sessions);

  return <RoomContent initialMessages={initialMessages} />;
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
