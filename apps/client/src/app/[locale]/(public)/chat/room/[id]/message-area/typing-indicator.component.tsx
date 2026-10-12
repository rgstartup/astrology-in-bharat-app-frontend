"use client";

import React from "react";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent } from "@/components/ui/marker";

type TypingIndicatorProps = {
  typingStatus: { senderName: string; isTyping: boolean } | null;
};

/** Waterfall: silent unless the peer is actively typing. */
export default function TypingIndicator({ typingStatus }: TypingIndicatorProps) {
  if (!typingStatus?.isTyping) return null;

  return (
    <Marker className="animate-pulse">
      <Bubble variant="muted">
        <BubbleContent>
          <span className="flex items-center gap-1">
            <span className="size-1 animate-bounce rounded-full bg-primary" />
            <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:0.2s]" />
            <span className="size-1 animate-bounce rounded-full bg-primary [animation-delay:0.4s]" />
          </span>
        </BubbleContent>
      </Bubble>
      <MarkerContent className="text-[10px] font-bold uppercase tracking-widest">
        {typingStatus.senderName} is typing…
      </MarkerContent>
    </Marker>
  );
}
