"use client";

import React from "react";
import type { IAuthUser } from "@/store/authStore";
import { useChatScrollBottom } from "@repo/chat";
import StatusPill from "./status-pill";
import MessageRow from "./message-row";
import DateMarker from "./date-marker";
import SessionBadge from "./session-marker";
import SessionEventCard from "./session-event-card";
import TypingIndicator from "./typing-indicator";
import ScrollButton from "./scroll-button";
import type {
  TimelineDateItem,
  TimelineItem,
  TimelineMessageItem,
  TimelineSessionEventItem,
  TimelineSessionItem,
} from "../../types/timeline";

type MessageListProps = {
  sessionStatus: string;
  sessionTerminated: boolean;
  items: TimelineItem[];
  expertData: { image?: string; name?: string } | null;
  typingStatus: { senderName: string; isTyping: boolean } | null;
  user?: IAuthUser | null;
  mounted: boolean;
  onPreview: (url: string) => void;
};

export function StatusCenterRow({
  sessionStatus,
  sessionTerminated,
}: {
  sessionStatus: string;
  sessionTerminated: boolean;
}) {
  return (
    <div className="flex justify-center">
      <StatusPill
        sessionStatus={sessionStatus}
        sessionTerminated={sessionTerminated}
      />
    </div>
  );
}

function DateTimelineEntry({ item }: { item: TimelineDateItem }) {
  return <DateMarker label={item.label} />;
}

function SessionTimelineEntry({ item }: { item: TimelineSessionItem }) {
  return <SessionBadge label={item.label} startedAt={item.startedAt} />;
}

function SessionEventTimelineEntry({
  item,
  mounted,
}: {
  item: TimelineSessionEventItem;
  mounted: boolean;
}) {
  return <SessionEventCard event={item.event} mounted={mounted} />;
}

function MessageTimelineEntry({
  item,
  expertData,
  user,
  mounted,
  onPreview,
}: {
  item: TimelineMessageItem;
  expertData: { image?: string; name?: string } | null;
  user?: IAuthUser | null;
  mounted: boolean;
  onPreview: (url: string) => void;
}) {
  const msg = item.message;
  return (
    <MessageRow
      msg={msg}
      expertImage={expertData?.image}
      expertName={expertData?.name}
      userAvatar={user?.avatar || user?.profile_picture}
      userName={user?.name}
      mounted={mounted}
      onPreview={onPreview}
    />
  );
}

function TimelineEntry({
  item,
  expertData,
  user,
  mounted,
  onPreview,
}: {
  item: TimelineItem;
  expertData: { image?: string; name?: string } | null;
  user?: IAuthUser | null;
  mounted: boolean;
  onPreview: (url: string) => void;
}) {
  if (item.kind === "date") return <DateTimelineEntry item={item} />;
  if (item.kind === "session") return <SessionTimelineEntry item={item} />;
  if (item.kind === "session_event")
    return <SessionEventTimelineEntry item={item} mounted={mounted} />;
  return (
    <MessageTimelineEntry
      item={item}
      expertData={expertData}
      user={user}
      mounted={mounted}
      onPreview={onPreview}
    />
  );
}

function TypingRow({
  typingStatus,
  anchorRef,
}: {
  typingStatus: { senderName: string; isTyping: boolean } | null;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div className="mx-auto w-full max-w-4xl">
      <TypingIndicator typingStatus={typingStatus} />
      <div ref={anchorRef} className="h-px" />
    </div>
  );
}

/**
 * Plain scrollable timeline: rows in a centered column with pin-to-bottom
 * follow (only while pinned, never yanking readers) and a floating
 * scroll-to-bottom button. Same pattern as the expert room — no magic
 * spacer elements, so content height always equals rendered rows.
 */
export default function MessageList({
  sessionStatus,
  sessionTerminated,
  items,
  expertData,
  typingStatus,
  user,
  mounted,
  onPreview,
}: MessageListProps) {
  const scrollRef = React.useRef<HTMLDivElement | null>(null);
  const anchorRef = React.useRef<HTMLDivElement | null>(null);
  const { showButton, scrollToBottom } = useChatScrollBottom({
    scrollRef,
    anchorRef,
    followKey: items.length,
    typingActive: Boolean(typingStatus?.isTyping),
  });

  return (
    <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden">
      <div
        ref={scrollRef}
        data-chat-scroll
        data-lenis-prevent
        className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto bg-[#f5f1ec] p-4 md:p-8"
      >
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
          <StatusCenterRow
            sessionStatus={sessionStatus}
            sessionTerminated={sessionTerminated}
          />
          {items.map((item) => (
            <TimelineEntry
              key={item.key}
              item={item}
              expertData={expertData}
              user={user}
              mounted={mounted}
              onPreview={onPreview}
            />
          ))}
        </div>
        <TypingRow typingStatus={typingStatus} anchorRef={anchorRef} />
      </div>
      <ScrollButton visible={showButton} onScrollToBottom={scrollToBottom} />
    </div>
  );
}
