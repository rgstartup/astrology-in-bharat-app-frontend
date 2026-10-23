"use client";

import type { RefObject } from "react";
import { useRef } from "react";
import { Info } from "lucide-react";
import { ChatMessageRow } from "./chat-message-row.component";
import { ChatTypingIndicator } from "./chat-typing-indicator.component";
import { ChatEmptyState } from "./chat-empty-state.component";
import { ChatDateMarker } from "./chat-date-marker.component";
import { ChatSessionBadge } from "./chat-session-marker.component";
import { ChatScrollButton } from "./chat-scroll-button.component";
import { useChatScrollBottom, useChatTimeline } from "@repo/chat";
import type { TimelineItem } from "@repo/chat";
import type { ChatMessage, ChatSessionStatus, TypingStatus } from "../types";

interface ChatMessageAreaProps {
  messages: ChatMessage[];
  sessionStatus: ChatSessionStatus;
  /** New-flow rooms never show the legacy pending-start notice. */
  isNewFlow?: boolean;
  clientName: string;
  clientAvatar: string | null;
  expertAvatar?: string | null;
  expertName?: string;
  typingStatus: TypingStatus | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onPreviewImage: (url: string) => void;
}

/**
 * Pending-session notice: white hairline card, charcoal text, sentence case.
 */
function PendingNotice() {
  return (
    <div className="my-2 flex justify-center">
      <div className="flex items-center gap-2 rounded-xl border border-[#d3cec6] bg-white px-4 py-2.5 font-sans text-xs font-medium text-[#626260]">
        <Info className="size-4 shrink-0 text-[#111111]" />
        <span>Consultation is pending. Select start session to begin.</span>
      </div>
    </div>
  );
}

function PendingSlot({ sessionStatus, isNewFlow }: Pick<ChatMessageAreaProps, "sessionStatus" | "isNewFlow">) {
  if (isNewFlow) return null;
  if (sessionStatus !== "pending") return null;
  return <PendingNotice />;
}

interface TimelineListProps {
  timeline: TimelineItem[];
  clientName: string;
  clientAvatar: string | null;
  expertAvatar?: string | null;
  expertName?: string;
  typingStatus: TypingStatus | null;
  messagesEndRef: RefObject<HTMLDivElement | null>;
  onPreviewImage: (url: string) => void;
}

/**
 * Timeline column with its own scroll container and scroll-to-bottom button.
 */
function TimelineList({
  timeline,
  clientName,
  clientAvatar,
  expertAvatar,
  expertName,
  messagesEndRef,
  typingStatus,
  onPreviewImage,
}: TimelineListProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const { showButton, scrollToBottom } = useChatScrollBottom({
    scrollRef,
    anchorRef: messagesEndRef,
    followKey: timeline.length,
    typingActive: Boolean(typingStatus?.isTyping),
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col">
      <div
        ref={scrollRef}
        data-chat-scroll
        className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#f5f1ec] px-4 py-4 sm:px-6"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-3">
          {timeline.map((item) => {
            if (item.kind === "date") {
              return <ChatDateMarker key={item.key} label={item.label} />;
            }
            if (item.kind === "session") {
              return <ChatSessionBadge key={item.key} label={item.label} />;
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

        <div className="mx-auto w-full max-w-4xl">
          <ChatTypingIndicator typingStatus={typingStatus} />
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      <ChatScrollButton visible={showButton} onScrollToBottom={scrollToBottom} />
    </div>
  );
}

function EmptyTimeline({ typingStatus, messagesEndRef }: Pick<ChatMessageAreaProps, "typingStatus" | "messagesEndRef">) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-y-auto bg-[#f5f1ec] px-4 py-4 sm:px-6">
      <ChatEmptyState />
      <div className="mx-auto w-full max-w-4xl">
        <ChatTypingIndicator typingStatus={typingStatus} />
        <div ref={messagesEndRef} className="h-1" />
      </div>
    </div>
  );
}

/**
 * Scrollable message timeline on the cream canvas with a centered column.
 */
export function ChatMessageArea({
  messages,
  sessionStatus,
  isNewFlow,
  clientName,
  clientAvatar,
  expertAvatar,
  expertName,
  typingStatus,
  messagesEndRef,
  onPreviewImage,
}: ChatMessageAreaProps) {
  const timeline = useChatTimeline(messages);

  if (timeline.length === 0) {
    return (
      <div className="flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
        <PendingSlot sessionStatus={sessionStatus} isNewFlow={isNewFlow} />
        <EmptyTimeline typingStatus={typingStatus} messagesEndRef={messagesEndRef} />
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
      <PendingSlot sessionStatus={sessionStatus} isNewFlow={isNewFlow} />
      <TimelineList
        timeline={timeline}
        clientName={clientName}
        clientAvatar={clientAvatar}
        expertAvatar={expertAvatar}
        expertName={expertName}
        messagesEndRef={messagesEndRef}
        typingStatus={typingStatus}
        onPreviewImage={onPreviewImage}
      />
    </div>
  );
}
