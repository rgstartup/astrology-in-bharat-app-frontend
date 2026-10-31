"use client";

import React from "react";
import { MessageSquare, PhoneOff, TriangleAlert } from "@repo/design/lucide";
import { Button } from "@repo/design/shadcn";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@repo/design/shadcn";

export type VoiceCancelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Continue the same consultation over chat. */
  onContinueOverChat: () => void;
  /** End the consultation entirely. */
  onEndSession: () => void;
  /** True while the switch request is in flight. */
  busy?: boolean;
};

/**
 * Warning popup shown when the client leaves a voice call. The consultation
 * can either continue over chat (the backend opens a new chat session) or end
 * for good. Closing the popup keeps the voice call running.
 */
export function VoiceCancelDialog({
  open,
  onOpenChange,
  onContinueOverChat,
  onEndSession,
  busy = false,
}: VoiceCancelDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm rounded-2xl border border-[#d3cec6] bg-white p-6 text-center">
        <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-amber-100 bg-amber-50 text-amber-600">
          <TriangleAlert className="size-5" />
        </div>
        <DialogTitle className="mt-4 font-sans text-base font-semibold text-[#111111]">
          Leave the voice call?
        </DialogTitle>
        <DialogDescription className="mt-1.5 font-sans text-sm text-[#626260]">
          Continue this consultation over chat, or end the session entirely.
        </DialogDescription>
        <div className="mt-5 flex flex-col gap-2">
          <Button
            className="w-full gap-2 rounded-full bg-[#111111] font-sans text-sm font-medium text-white hover:bg-black"
            onClick={onContinueOverChat}
            disabled={busy}
          >
            <MessageSquare className="size-4" />
            <span>{busy ? "Switching…" : "Continue over chat"}</span>
          </Button>
          <Button
            variant="ghost"
            className="w-full gap-2 rounded-full font-sans text-sm text-[#626260] hover:bg-[#f5f1ec] hover:text-[#111111]"
            onClick={onEndSession}
            disabled={busy}
          >
            <PhoneOff className="size-4" />
            <span>End session</span>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
