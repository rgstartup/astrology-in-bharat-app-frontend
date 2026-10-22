import { Marker, MarkerContent } from "@/components/ui/marker";
import type { TypingStatus } from "../types";

interface ChatTypingIndicatorProps {
  typingStatus: TypingStatus | null;
}

/**
 * Peer typing affordance. Waterfall: silent unless the peer is typing.
 */
export function ChatTypingIndicator({ typingStatus }: ChatTypingIndicatorProps) {
  if (!typingStatus?.isTyping) return null;

  return (
    <Marker variant="default" className="w-auto">
      <div className="flex w-fit max-w-full items-center rounded-xl border border-[#d3cec6] bg-white px-3 py-2">
        <span className="flex items-center gap-1.5" aria-hidden>
          <span className="size-1.5 animate-bounce rounded-full bg-[#626260]" />
          <span className="size-1.5 animate-bounce rounded-full bg-[#7b7b78] [animation-delay:0.2s]" />
          <span className="size-1.5 animate-bounce rounded-full bg-[#7b7b78] [animation-delay:0.4s]" />
        </span>
      </div>
      <MarkerContent className="font-sans text-[11px] font-medium text-[#7b7b78]">
        {typingStatus.senderName} is typing
      </MarkerContent>
    </Marker>
  );
}
