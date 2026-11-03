"use client";

import React from "react";
import { ArrowLeft, Menu, MessageSquare, ShieldCheck } from "@repo/design/lucide";
import { useRouter } from "@/i18n/navigation";
import { Button } from "@repo/design/shadcn";
import { Separator } from "@repo/design/shadcn";
import { EndSessionButton } from "../header/end-session-button";
import { useRoomIdentity } from "../../providers/room-lifecycle";
import { useRoomSession } from "../../providers/room-lifecycle";
import { useRoomActions } from "../../providers/room-lifecycle";

/**
 * Top bar for the 75% chat area.
 * Displays back button, chat icon with title, and secure connection indicator.
 *
 * @param props - Mobile toggle handler.
 * @returns Chat column header element.
 */
export function ChatColumnHeader({
  onOpenMobileSidebar,
}: {
  onOpenMobileSidebar: () => void;
}) {
  const { router } = useRoomIdentity();
  const { isSessionEnded } = useRoomSession();
  const { handleEndChat } = useRoomActions();

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-[#d3cec6] bg-white px-3 md:px-6">
      <div className="flex items-center gap-2 md:gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="size-8 rounded-lg text-[#111111] hover:bg-[#f5f1ec]"
          aria-label="Back to consultations"
        >
          <ArrowLeft className="size-4" />
        </Button>

        <Separator orientation="vertical" className="h-5 bg-[#d3cec6]" />

        <div
          className="flex size-8 items-center justify-center rounded-lg bg-[#f5f1ec] text-[#111111]"
          aria-label="Chat channel active"
        >
          <MessageSquare className="size-4" />
        </div>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden items-center gap-1.5 text-xs font-medium text-emerald-700 sm:flex">
          <span className="size-2 rounded-full bg-emerald-500" />
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>Connected securely</span>
        </div>

        {!isSessionEnded && (
          <div className="md:hidden">
            <EndSessionButton />
          </div>
        )}

        <Button
          variant="outline"
          size="icon"
          onClick={onOpenMobileSidebar}
          className="size-8 rounded-lg border-[#d3cec6] text-[#111111] md:hidden"
          aria-label="Open consultation controls"
        >
          <Menu className="size-4" />
        </Button>
      </div>
    </header>
  );
}
