"use client";

import { ArrowDown } from "lucide-react";

interface ChatScrollButtonProps {
  visible: boolean;
  onScrollToBottom: () => void;
}

/**
 * Floating scroll-to-bottom button for the expert timeline.
 * Waterfall: silent unless the user has scrolled up.
 */
export function ChatScrollButton({ visible, onScrollToBottom }: ChatScrollButtonProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      onClick={onScrollToBottom}
      aria-label="Scroll to latest messages"
      className="absolute bottom-4 left-1/2 z-10 flex size-9 -translate-x-1/2 items-center justify-center rounded-full border border-[#d3cec6] bg-white text-[#111111] shadow-md transition-colors hover:bg-[#f5f1ec]"
    >
      <ArrowDown className="size-4" />
    </button>
  );
}
