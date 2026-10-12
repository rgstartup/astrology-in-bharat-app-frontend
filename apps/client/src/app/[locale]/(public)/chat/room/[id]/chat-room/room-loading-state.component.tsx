"use client";

import React from "react";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function RoomLoadingState({ text }: { text?: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-background p-6">
      <Empty>
        <Spinner />
        <EmptyTitle>Loading consultation…</EmptyTitle>
        <EmptyDescription>{text || "Connecting to chat..."}</EmptyDescription>
      </Empty>
    </div>
  );
}
