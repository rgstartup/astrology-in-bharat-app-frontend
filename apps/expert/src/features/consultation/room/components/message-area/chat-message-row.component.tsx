import { AlertCircle } from "lucide-react";
import { isAttachmentFallbackText } from "@repo/chat";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { ChatIntroCard } from "./chat-intro-card.component";
import { ChatAttachmentView } from "./chat-attachment-view.component";
import type { ChatMessage } from  "../../types";

interface ChatMessageRowProps {
  message: ChatMessage;
  clientName: string;
  clientAvatar: string | null;
  expertAvatar?: string | null;
  expertName?: string;
  onPreviewImage: (url: string) => void;
}

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
      <Message align="start" className="flex-col items-center">
        <Marker variant="default" className="w-auto justify-center">
          <MarkerIcon className="text-[#626260]">
            <AlertCircle className="size-4" />
          </MarkerIcon>
          <MarkerContent>
            <span className="inline-flex items-center rounded-full border border-[#d3cec6] bg-white px-3 py-1 font-sans text-[11px] font-medium text-[#626260]">
              System intervention
            </span>
          </MarkerContent>
        </Marker>
        <div className="flex w-fit max-w-full flex-col items-center rounded-xl border border-[#d3cec6] bg-white px-3 py-2 font-sans text-sm leading-relaxed text-[#626260]">
          <p>{message.content}</p>
        </div>
        <MessageFooter className="font-sans text-[11px] text-[#7b7b78]">{timeStr}</MessageFooter>
      </Message>
    );
  }

  return (
    <Message align={isExpert ? "end" : "start"} className="my-1.5">
      <MessageAvatar>
        <Avatar className="size-7 rounded-full border border-[#d3cec6] sm:size-8">
          <AvatarImage
            src={isExpert ? expertAvatar || undefined : clientAvatar || undefined}
            alt={isExpert ? expertName : clientName}
          />
          <AvatarFallback
            className={
              isExpert
                ? "bg-[#111111] text-[10px] font-semibold text-white"
                : "bg-[#ebe7e1] text-[10px] font-semibold text-[#111111]"
            }
          >
            {(isExpert ? expertName : clientName).slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </MessageAvatar>

      <MessageContent>
        {isIntroCard ? (
          <ChatIntroCard content={message.content} />
        ) : (
          <Bubble
            variant={isExpert ? "default" : "outline"}
            align={isExpert ? "end" : "start"}
          >
            <BubbleContent className="font-sans">
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
                <p className="whitespace-pre-wrap text-sm">{message.content}</p>
              )}
            </BubbleContent>
          </Bubble>
        )}

        <MessageFooter className="font-sans text-[11px] text-[#7b7b78]">{timeStr}</MessageFooter>
      </MessageContent>
    </Message>
  );
}
