"use client";

import React from "react";
import { AlertCircle, PhoneOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type EndConsultationActionProps = {
  handleEndChat: (force?: boolean) => void;
  className?: string;
};

/**
 * End consultation button pinned to the bottom of the consultation sidebar.
 * Opens confirmation dialog before terminating active session.
 *
 * @param props - Callback to terminate consultation and optional styling class.
 * @returns End consultation action element.
 */
export function EndConsultationAction({ handleEndChat, className }: EndConsultationActionProps) {
  function handleConfirm() {
    handleEndChat(true);
  }

  return (
    <>
      <Dialog>
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
        ></DialogTrigger>
        <DialogContent className="rounded-xl bg-white">
          <DialogHeader>
            <DialogTitle className="font-sans text-[#111111]">End this consultation?</DialogTitle>
            <DialogDescription className="font-sans text-[#626260]">
              This will stop the timer and conclude the active chat session. You can review your
              conversation summary afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  className="rounded-lg text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
                >
                  Keep chatting
                </Button>
              }
            />
            <Button className="rounded-lg font-medium" onClick={handleConfirm}>
              <AlertCircle data-icon="inline-start" />
              End consultation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
