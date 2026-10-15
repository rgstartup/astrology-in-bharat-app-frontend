"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type EndSessionButtonProps = {
  handleEndChat: (force?: boolean) => void;
  className?: string;
};

/**
 * End session affordance with confirmation dialog.
 *
 * @param props - Callback to end consultation and optional styling class.
 * @returns End session button component.
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
        <AlertCircle
          className="size-3.5 text-neutral-500"
          data-icon="inline-start"
        />
        <span>End session</span>
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="rounded-lg border border-[#d3cec6] bg-white">
          <DialogHeader>
            <DialogTitle className="text-[#111111]">
              End this session?
            </DialogTitle>
            <DialogDescription className="text-[#626260]">
              This will close the chat and stop the timer. You can still view the
              summary afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              className="rounded-lg text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
              onClick={() => setOpen(false)}
            >
              Keep chatting
            </Button>
            <Button
              className="rounded-lg bg-[#111111] text-[15px] font-medium text-white hover:bg-[#111111]/90"
              onClick={handleConfirm}
            >
              <AlertCircle data-icon="inline-start" />
              End session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
