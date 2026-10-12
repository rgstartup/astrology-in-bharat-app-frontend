import type { TypingStatus } from "../types";

interface ChatTypingIndicatorProps {
  typingStatus: TypingStatus | null;
}

export function ChatTypingIndicator({ typingStatus }: ChatTypingIndicatorProps) {
  if (!typingStatus?.isTyping) return null;

  return (
    <div className="flex items-center gap-2 py-1 px-3 text-slate-500 animate-pulse">
      <div className="flex items-center gap-1 bg-slate-100 rounded-full px-2.5 py-1 border border-slate-200">
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
      <span className="text-[11px] font-medium tracking-wide text-slate-500">
        {typingStatus.senderName} is typing...
      </span>
    </div>
  );
}
