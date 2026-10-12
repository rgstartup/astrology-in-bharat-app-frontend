import type { RefObject } from "react";
import { useMemo } from "react";
import { Info } from "lucide-react";
import { ChatMessageRow } from "./chat-message-row.component";
import { ChatTypingIndicator } from "./chat-typing-indicator.component";
import { ChatEmptyState } from "./chat-empty-state.component";
import { ChatDateMarker } from "./chat-date-marker.component";
import { ChatSessionMarker } from "./chat-session-marker.component";
import { toTimeline } from "./chat-timeline";
import type { ChatMessage, ChatSessionStatus, TypingStatus } from "../types";

interface ChatMessageAreaProps {
  messages: ChatMessage[];
  sessionStatus: ChatSessionStatus;
  clientName: string;
  clientAvatar: string | null;
  expertAvatar?: string | null;
  expertName?: string;
  typingStatus: TypingStatus | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onPreviewImage: (url: string) => void;
}

export function ChatMessageArea({
  messages,
  sessionStatus,
  clientName,
  clientAvatar,
  expertAvatar,
  expertName,
  typingStatus,
  messagesEndRef,
  onPreviewImage,
}: ChatMessageAreaProps) {
  const timeline = useMemo(() => toTimeline(messages), [messages]);

  if (timeline.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-4 bg-slate-50/50">
        {sessionStatus === "pending" ? (
          <div className="flex justify-center my-2">
            <div className="bg-amber-50 text-amber-800 px-4 py-2.5 rounded-xl text-xs font-semibold border border-amber-200 flex items-center gap-2 shadow-xs">
              <Info className="size-4 shrink-0 text-amber-600" />
              <span>Consultation is pending. Click &quot;Start Session&quot; to begin.</span>
            </div>
          </div>
        ) : null}
        <ChatEmptyState />
        <div className="max-w-4xl mx-auto">
          <ChatTypingIndicator typingStatus={typingStatus} />
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 flex flex-col gap-4 bg-slate-50/50">
      {sessionStatus === "pending" ? (
        <div className="flex justify-center my-2">
          <div className="bg-amber-50 text-amber-800 px-4 py-2.5 rounded-xl text-xs font-semibold border border-amber-200 flex items-center gap-2 shadow-xs">
            <Info className="size-4 shrink-0 text-amber-600" />
            <span>Consultation is pending. Click &quot;Start Session&quot; to begin.</span>
          </div>
        </div>
      ) : null}

      <div className="flex flex-col gap-3 max-w-4xl mx-auto w-full">
        {timeline.map((item) => {
          if (item.kind === "date") {
            return <ChatDateMarker key={item.key} label={item.label} />;
          }
          if (item.kind === "session") {
            return <ChatSessionMarker key={item.key} label={item.label} />;
          }
          const msg = item.message;
          return (
            <ChatMessageRow
              key={item.key}
              message={msg}
              clientName={clientName}
              clientAvatar={clientAvatar}
              expertAvatar={expertAvatar}
              expertName={expertName}
              onPreviewImage={onPreviewImage}
            />
          );
        })}
      </div>

      <div className="max-w-4xl mx-auto">
        <ChatTypingIndicator typingStatus={typingStatus} />
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
}
