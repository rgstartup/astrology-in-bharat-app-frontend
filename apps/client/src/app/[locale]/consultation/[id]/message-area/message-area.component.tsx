"use client";

import React from "react";
import { MessageCircle } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import type { IAuthUser } from "@/store/authStore";
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
import MessageList, { StatusCenterRow } from "./message-list.component";
import TypingIndicator from "./typing-indicator.component";
import type { TimelineItem } from "./timeline";

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
        <StatusCenterRow sessionStatus={sessionStatus} sessionTerminated={isTerminated(sessionSummary)} />
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

function buildItems(messages: ChatMessage[], timeline?: TimelineItem[]): TimelineItem[] {
  if (timeline) return timeline;
  return messages.map((m) => ({
    kind: "message" as const,
    key: `msg-${m.id}`,
    message: m,
  }));
}

function PopulatedConversation({
  sessionStatus,
  sessionSummary,
  items,
  expertData,
  typingStatus,
  user,
  mounted,
  previewImage,
  onClosePreview,
  onPreview,
}: {
  sessionStatus: string;
  sessionSummary: { status?: string } | null;
  items: TimelineItem[];
  expertData: { image?: string; name?: string } | null;
  typingStatus: { senderName: string; isTyping: boolean } | null;
  user?: IAuthUser | null;
  mounted: boolean;
  previewImage: string | null;
  onClosePreview: () => void;
  onPreview: (url: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#f5f1ec]">
      <MessageList
        sessionStatus={sessionStatus}
        sessionTerminated={isTerminated(sessionSummary)}
        items={items}
        expertData={expertData}
        typingStatus={typingStatus}
        user={user}
        mounted={mounted}
        onPreview={onPreview}
      />
      <AttachmentPreviewDialog image={previewImage} onClose={onClosePreview} />
    </div>
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
    <PopulatedConversation
      sessionStatus={sessionStatus}
      sessionSummary={sessionSummary}
      items={items}
      expertData={expertData}
      typingStatus={typingStatus}
      user={user}
      mounted={mounted}
      previewImage={previewImage}
      onClosePreview={closePreview}
      onPreview={setPreviewImage}
    />
  );
}
