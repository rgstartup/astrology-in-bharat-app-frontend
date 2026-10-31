"use client";

import React, { useState } from "react";
import { PhoneOff } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";

type EndConsultationActionProps = {
  handleEndChat: (force?: boolean) => void;
  className?: string;
};

/**
 * End consultation button pinned to the bottom of the consultation sidebar.
 * Opens a confirmation dialog before terminating the active session.
 * The dialog closes itself on confirm so the review modal opens cleanly
 * on top — closing the review never reveals a stale confirm behind it.
 */
export function EndConsultationAction({ handleEndChat, className }: EndConsultationActionProps) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    handleEndChat(true);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            variant="outline"
            className={cn(
              "w-full justify-center gap-2 rounded-xl border-2 bg-white py-2.5 text-xs font-semibold shadow-none transition-colors",
              className,
            )}
          >
            <PhoneOff className="size-3.5" />
            <span>End consultation</span>
          </Button>
        }
      />
      <DialogContent className="max-w-sm rounded-2xl border border-[#d3cec6] bg-white p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
          <PhoneOff className="size-5" />
        </div>
        <DialogTitle className="mt-4 font-sans text-base font-semibold text-[#111111]">
          End this consultation?
        </DialogTitle>
        <DialogDescription className="mt-1.5 font-sans text-sm text-[#626260]">
          This will stop the timer and conclude the active chat session. You can
          review your conversation summary afterwards.
        </DialogDescription>
        <div className="mt-5 flex flex-col gap-2">
          <Button
            className="w-full rounded-full bg-[#111111] font-sans text-sm font-medium text-white hover:bg-black"
            onClick={handleConfirm}
          >
            End consultation
          </Button>
          <Button
            variant="ghost"
            className="w-full rounded-full font-sans text-sm text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
            onClick={() => setOpen(false)}
          >
            Keep chatting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
