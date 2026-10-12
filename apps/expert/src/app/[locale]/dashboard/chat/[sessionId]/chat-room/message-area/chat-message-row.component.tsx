import { AlertCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
  MessageHeader,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerIcon, MarkerContent } from "@/components/ui/marker";
import { ChatIntroCard } from "./chat-intro-card.component";
import { ChatAttachmentView } from "./chat-attachment-view.component";
import type { ChatMessage } from "../types";

interface ChatMessageRowProps {
  message: ChatMessage;
  clientName: string;
  clientAvatar: string | null;
  expertAvatar?: string | null;
  expertName?: string;
  onPreviewImage: (url: string) => void;
}

/**
 * Textless attachment sends carry filler content: the backend default is
 * lowercase `sent an attachment`, the legacy socket composers used the
 * capitalized variants. Suppress all so attachment-only messages render
 * just the attachment view.
 */
const isAttachmentFallbackText = (content: string): boolean => {
  const trimmed = content.trim().toLowerCase();
  return trimmed === "sent an image" || trimmed === "sent an attachment";
};

export function ChatMessageRow({
  message,
  clientName,
  clientAvatar,
  expertAvatar,
  expertName = "Expert",
  onPreviewImage,
}: ChatMessageRowProps) {
  const isExpert = message.senderType === "expert";
  const isAdmin = message.senderType === "admin";
  const hasAttachment = Boolean(message.attachmentUrl || message.attachment_url || message.imageUrl || message.mediaUrl);
  const attachmentUrl = message.attachmentUrl || message.attachment_url || message.imageUrl || message.mediaUrl;
  const attachmentType = message.attachmentType || message.attachment_type;
  const isIntroCard = message.content?.startsWith("[INTRO_CARD]");
  const timeStr = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  if (isAdmin) {
    return (
      <div className="py-2">
        <Marker variant="separator" className="text-red-600">
          <MarkerIcon>
            <AlertCircle className="size-3.5 text-red-500" />
          </MarkerIcon>
          <MarkerContent>
            <span className="font-semibold">{message.content}</span>
            <span className="ml-1.5 text-[10px] text-slate-400 font-normal">({timeStr})</span>
          </MarkerContent>
        </Marker>
      </div>
    );
  }

  return (
    <Message align={isExpert ? "end" : "start"} className="my-1.5">
      <MessageAvatar>
        <Avatar className="size-7 sm:size-8 border border-slate-200">
          <AvatarImage
            src={isExpert ? expertAvatar || undefined : clientAvatar || undefined}
            alt={isExpert ? expertName : clientName}
          />
          <AvatarFallback className="text-[10px] font-bold bg-slate-100 text-slate-700">
            {(isExpert ? expertName : clientName).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </MessageAvatar>

      <MessageContent>
        <MessageHeader className={isExpert ? "justify-end" : "justify-start"}>
          {isExpert ? "You" : clientName}
        </MessageHeader>

        {isIntroCard ? (
          <ChatIntroCard content={message.content} />
        ) : (
          <Bubble
            variant={isExpert ? "default" : "secondary"}
            align={isExpert ? "end" : "start"}
          >
            <BubbleContent className={isExpert ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-900 border-slate-200"}>
              {hasAttachment && attachmentUrl && (
                <div className="mb-2">
                  <ChatAttachmentView
                    url={attachmentUrl}
                    type={attachmentType}
                    onPreviewImage={onPreviewImage}
                  />
                </div>
              )}
              {message.content && !isAttachmentFallbackText(message.content) && (
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
              )}
            </BubbleContent>
          </Bubble>
        )}

        <MessageFooter>{timeStr}</MessageFooter>
      </MessageContent>
    </Message>
  );
}
