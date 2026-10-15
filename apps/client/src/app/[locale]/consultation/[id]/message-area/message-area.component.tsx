"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import type { IAuthUser } from "@/store/authStore";
import {
  MessageScroller,
  MessageScrollerProvider,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty";
import StatusPill from "./status-pill.component";
import MessageRow from "./message-row.component";
import DateMarker from "./date-marker.component";
import SessionMarker from "./session-marker.component";
import type { TimelineDateItem, TimelineItem, TimelineMessageItem, TimelineSessionItem } from "./timeline";
import TypingIndicator from "./typing-indicator.component";

type MessageAreaProps = {
  /** Light-only canvas. Accepted for orchestrator compatibility, never used for styling. */
  isDarkMode?: boolean;
  sessionStatus: string;
  sessionSummary: { status?: string } | null;
  messages: ChatMessage[];
  timeline?: TimelineItem[];
  expertData: { image?: string; name?: string } | null;
  typingStatus: { senderName: string; isTyping: boolean } | null;
  user?: IAuthUser | null;
};

function rawSenderType(msg: ChatMessage): string | undefined {
  const raw = msg as ChatMessage & Record<string, unknown>;
  if (msg.senderType) return msg.senderType;
  const fallback = raw.sender_type;
  if (typeof fallback === "string") return fallback;
  return undefined;
}

function isUserMessage(msg: ChatMessage): boolean {
  if (rawSenderType(msg) === "user") return true;
  return false;
}

function isTerminated(sessionSummary: { status?: string } | null): boolean {
  if (!sessionSummary) return false;
  if (sessionSummary.status === "terminated") return true;
  return false;
}

/**
 * Renders full size preview image inside dialog with early return.
 */
function PreviewImageContent({ image }: { image: string | null }) {
  if (!image) return null;
  return (
    <img
      src={image}
      alt="Attachment preview"
      className="max-h-[85vh] w-full rounded-xl border border-[#d3cec6] bg-[#ffffff] object-contain"
    />
  );
}

function AttachmentPreviewDialog({
  image,
  onClose,
}: {
  image: string | null;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={!!image}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="max-w-4xl rounded-xl border border-[#d3cec6] bg-[#ffffff] p-4">
        <DialogTitle className="sr-only">Attachment preview</DialogTitle>
        <DialogDescription className="sr-only">
          Full-size preview of the selected attachment.
        </DialogDescription>
        <PreviewImageContent image={image} />
      </DialogContent>
    </Dialog>
  );
}

/**
 * Renders typing status item inside message scroller with early return.
 */
function TypingScrollerItem({
  typingStatus,
}: {
  typingStatus: { senderName: string; isTyping: boolean } | null;
}) {
  if (!typingStatus) return null;
  if (!typingStatus.isTyping) return null;
  return (
    <MessageScrollerItem messageId="typing-status">
      <TypingIndicator typingStatus={typingStatus} />
    </MessageScrollerItem>
  );
}

function StatusCenterRow({
  sessionStatus,
  sessionSummary,
}: {
  sessionStatus: string;
  sessionSummary: { status?: string } | null;
}) {
  return (
    <div className="flex justify-center">
      <StatusPill sessionStatus={sessionStatus} sessionTerminated={isTerminated(sessionSummary)} />
    </div>
  );
}

function EmptyConversation({
  sessionStatus,
  sessionSummary,
  typingStatus,
  previewImage,
  onClosePreview,
}: {
  sessionStatus: string;
  sessionSummary: { status?: string } | null;
  typingStatus: { senderName: string; isTyping: boolean } | null;
  previewImage: string | null;
  onClosePreview: () => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-[#f5f1ec]">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 p-4 md:p-8">
        <StatusCenterRow sessionStatus={sessionStatus} sessionSummary={sessionSummary} />
        <Empty className="rounded-xl border border-[#d3cec6] bg-[#ffffff]">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="rounded-full border border-[#d3cec6] bg-[#ffffff] text-[#626260]"
            >
              <MessageCircle />
            </EmptyMedia>
            <EmptyTitle className="font-sans text-[#111111]">Start your consultation</EmptyTitle>
            <EmptyDescription className="font-sans text-[#626260]">
              Send a message to begin your consultation with the expert.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
        <TypingIndicator typingStatus={typingStatus} />
      </div>
      <AttachmentPreviewDialog image={previewImage} onClose={onClosePreview} />
    </div>
  );
}

function DateTimelineEntry({ item }: { item: TimelineDateItem }) {
  return (
    <MessageScrollerItem messageId={item.key}>
      <DateMarker label={item.label} />
    </MessageScrollerItem>
  );
}

function SessionTimelineEntry({ item }: { item: TimelineSessionItem }) {
  return (
    <MessageScrollerItem messageId={item.key}>
      <SessionMarker label={item.label} startedAt={item.startedAt} />
    </MessageScrollerItem>
  );
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
    <MessageScrollerItem messageId={String(msg.id)} scrollAnchor={isUserMessage(msg)}>
      <MessageRow
        msg={msg}
        expertImage={expertData?.image}
        expertName={expertData?.name}
        userAvatar={user?.avatar || user?.profile_picture}
        userName={user?.name}
        mounted={mounted}
        onPreview={onPreview}
      />
    </MessageScrollerItem>
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

function buildItems(messages: ChatMessage[], timeline?: TimelineItem[]): TimelineItem[] {
  if (timeline) return timeline;
  return messages.map((m) => ({
    kind: "message" as const,
    key: `msg-${m.id}`,
    message: m,
  }));
}

export default function MessageArea({
  isDarkMode,
  sessionStatus,
  sessionSummary,
  messages,
  timeline,
  expertData,
  typingStatus,
  user,
}: MessageAreaProps) {
  void isDarkMode;
  const [mounted, setMounted] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const closePreview = () => setPreviewImage(null);
  const items: TimelineItem[] = buildItems(messages, timeline);

  if (items.length === 0) {
    return (
      <EmptyConversation
        sessionStatus={sessionStatus}
        sessionSummary={sessionSummary}
        typingStatus={typingStatus}
        previewImage={previewImage}
        onClosePreview={closePreview}
      />
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="min-h-0 flex-1 bg-[#f5f1ec]" data-lenis-prevent>
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto max-w-4xl gap-6 bg-[#f5f1ec] p-4 md:p-8">
              <MessageScrollerItem messageId="session-status">
                <StatusCenterRow sessionStatus={sessionStatus} sessionSummary={sessionSummary} />
              </MessageScrollerItem>
              {items.map((item) => (
                <TimelineEntry
                  key={item.key}
                  item={item}
                  expertData={expertData}
                  user={user}
                  mounted={mounted}
                  onPreview={setPreviewImage}
                />
              ))}
              <TypingScrollerItem typingStatus={typingStatus} />
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <AttachmentPreviewDialog image={previewImage} onClose={closePreview} />
    </div>
  );
}
