"use client";

import React from "react";
import { Empty, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export default function RoomLoadingState({ text }: { text?: string }) {
  return (
    <div className="flex h-screen items-center justify-center bg-[#f5f1ec] p-6">
      <Empty className="w-full max-w-sm rounded-xl border border-[#d3cec6] bg-[#ffffff] p-10 shadow-none">
        <Spinner />
        <EmptyTitle className="font-sans text-[#111111]">Loading consultation…</EmptyTitle>
        <EmptyDescription className="font-sans text-[#626260]">{text || "Connecting to chat..."}</EmptyDescription>
      </Empty>
    </div>
  );
}
