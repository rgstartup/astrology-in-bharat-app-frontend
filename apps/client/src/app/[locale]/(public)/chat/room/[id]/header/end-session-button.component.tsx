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

export function EndSessionButton({ handleEndChat, className }: EndSessionButtonProps) {
  const [open, setOpen] = useState(false);

  function handleConfirm() {
    setOpen(false);
    handleEndChat(true);
  }

  return (
    <>
      <Button
        variant="secondary"
        size="sm"
        className={cn("font-bold text-destructive shadow-lg", className)}
        onClick={() => setOpen(true)}
      >
        <AlertCircle data-icon="inline-start" />
        End Session
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End this session?</DialogTitle>
            <DialogDescription>
              This will close the chat and stop the timer. You can still view the summary afterwards.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setOpen(false)}>
              Keep chatting
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              <AlertCircle data-icon="inline-start" />
              End Session
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
