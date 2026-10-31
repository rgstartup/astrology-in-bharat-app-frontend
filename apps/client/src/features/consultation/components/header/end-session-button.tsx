"use client";

import { useState } from "react";
import { PhoneOff } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@repo/design/shadcn";
import { cn } from "@repo/design/cn";

type EndSessionButtonProps = {
  handleEndChat: (force?: boolean) => void;
  className?: string;
};

/**
 * End session affordance with confirmation dialog. Same visual language as
 * the sidebar end-consultation confirm: icon, title, copy, stacked actions —
 * no header/footer hairlines. Closes itself on confirm so the review modal
 * opens cleanly on top.
 */
export function EndSessionButton({
  handleEndChat,
  className,
}: EndSessionButtonProps) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    handleEndChat(true);
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={cn(
          "h-8 rounded-lg border border-[#d3cec6] bg-white px-2.5 text-xs font-medium text-[#111111] hover:border-neutral-300 hover:bg-neutral-50 hover:text-red-600 md:h-9 md:px-3 md:text-sm",
          className,
        )}
        onClick={() => setOpen(true)}
      >
        <PhoneOff
          className="size-3.5 text-neutral-500"
          data-icon="inline-start"
        />
        <span>End session</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm rounded-2xl border border-[#d3cec6] bg-white p-6 text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-red-100 bg-red-50 text-red-600">
            <PhoneOff className="size-5" />
          </div>
          <DialogTitle className="mt-4 font-sans text-base font-semibold text-[#111111]">
            End this session?
          </DialogTitle>
          <DialogDescription className="mt-1.5 font-sans text-sm text-[#626260]">
            This will close the chat and stop the timer. You can still view the
            summary afterwards.
          </DialogDescription>
          <div className="mt-5 flex flex-col gap-2">
            <Button
              className="w-full rounded-full bg-[#111111] font-sans text-sm font-medium text-white hover:bg-black"
              onClick={handleConfirm}
            >
              End session
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
    </>
  );
}
