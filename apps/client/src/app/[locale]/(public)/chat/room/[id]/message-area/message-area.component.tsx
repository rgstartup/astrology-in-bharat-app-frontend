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
import type { TimelineItem } from "./timeline";
import TypingIndicator from "./typing-indicator.component";

type MessageAreaProps = {
  isDarkMode: boolean;
  sessionStatus: string;
  sessionSummary: { status?: string } | null;
  messages: ChatMessage[];
  timeline?: TimelineItem[];
  expertData: { image?: string; name?: string } | null;
  typingStatus: { senderName: string; isTyping: boolean } | null;
  user?: IAuthUser | null;
};

const isUserMessage = (msg: ChatMessage): boolean => {
  const raw = msg as ChatMessage & Record<string, unknown>;
  const senderType =
    msg.senderType || (typeof raw.sender_type === "string" ? raw.sender_type : undefined);
  return senderType === "user";
};

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
      <DialogContent className="max-w-4xl border-0 bg-transparent p-4 shadow-none">
        <DialogTitle className="sr-only">Attachment preview</DialogTitle>
        <DialogDescription className="sr-only">
          Full-size preview of the selected attachment.
        </DialogDescription>
        {image ? (
          <img
            src={image}
            alt="Attachment preview"
            className="max-h-[85vh] w-full rounded-xl border border-white/20 object-contain shadow-2xl"
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
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
  const [mounted, setMounted] = React.useState(false);
  const [previewImage, setPreviewImage] = React.useState<string | null>(null);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const closePreview = () => setPreviewImage(null);
  const items: TimelineItem[] =
    timeline ??
    messages.map((m) => ({
      kind: "message" as const,
      key: `msg-${m.id}`,
      message: m,
    }));

  if (items.length === 0) {
    return (
      <>
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-8 p-4 md:p-8">
          <div className="flex justify-center">
            <StatusPill
              sessionStatus={sessionStatus}
              sessionTerminated={sessionSummary?.status === "terminated"}
              isDarkMode={isDarkMode}
            />
          </div>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <MessageCircle />
              </EmptyMedia>
              <EmptyTitle>Start your celestial journey</EmptyTitle>
              <EmptyDescription>
                Send a message to begin your consultation with the expert.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
          <TypingIndicator typingStatus={typingStatus} />
        </div>
        <AttachmentPreviewDialog image={previewImage} onClose={closePreview} />
      </>
    );
  }

  return (
    <>
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="flex-1" data-lenis-prevent>
          <MessageScrollerViewport>
            <MessageScrollerContent className="mx-auto max-w-4xl gap-8 p-4 md:p-8">
              <MessageScrollerItem messageId="session-status">
                <div className="flex justify-center">
                  <StatusPill
                    sessionStatus={sessionStatus}
                    sessionTerminated={sessionSummary?.status === "terminated"}
                    isDarkMode={isDarkMode}
                  />
                </div>
              </MessageScrollerItem>
              {items.map((item) => {
                if (item.kind === "date") {
                  return (
                    <MessageScrollerItem key={item.key} messageId={item.key}>
                      <DateMarker label={item.label} />
                    </MessageScrollerItem>
                  );
                }
                if (item.kind === "session") {
                  return (
                    <MessageScrollerItem key={item.key} messageId={item.key}>
                      <SessionMarker
                        label={item.label}
                        startedAt={item.startedAt}
                      />
                    </MessageScrollerItem>
                  );
                }
                const msg = item.message;
                return (
                  <MessageScrollerItem
                    key={item.key}
                    messageId={String(msg.id)}
                    scrollAnchor={isUserMessage(msg)}
                  >
                    <MessageRow
                      msg={msg}
                      isDarkMode={isDarkMode}
                      expertImage={expertData?.image}
                      expertName={expertData?.name}
                      userAvatar={user?.avatar || user?.profile_picture}
                      userName={user?.name}
                      mounted={mounted}
                      onPreview={setPreviewImage}
                    />
                  </MessageScrollerItem>
                );
              })}
              {typingStatus?.isTyping ? (
                <MessageScrollerItem messageId="typing-status">
                  <TypingIndicator typingStatus={typingStatus} />
                </MessageScrollerItem>
              ) : null}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton />
        </MessageScroller>
      </MessageScrollerProvider>
      <AttachmentPreviewDialog image={previewImage} onClose={closePreview} />
    </>
  );
}
