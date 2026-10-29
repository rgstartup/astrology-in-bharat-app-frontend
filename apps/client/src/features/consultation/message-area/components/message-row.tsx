"use client";

import { AlertCircle } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import { isAttachmentFallbackText } from "@repo/chat";
import {
  Message,
  MessageAvatar as MessageAvatarSlot,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import { cn } from "@/lib/utils";
import MessageAvatar from "./message-avatar";
import MessageAttachment from "./message-attachment";
import IntroCard from "./intro-card";

type MessageRowProps = {
  msg: ChatMessage;
  /** Light-only canvas. Accepted for orchestrator compatibility, never used for styling. */
  isDarkMode?: boolean;
  expertImage?: string;
  expertName?: string;
  userAvatar?: string;
  userName?: string;
  mounted: boolean;
  onPreview: (url: string) => void;
};

type NormalizedMessage = {
  id: string;
  senderType: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  createdAt?: string;
};

function str(value: unknown): string | undefined {
  if (typeof value === "string") return value;
  return undefined;
}

function normalize(msg: ChatMessage): NormalizedMessage {
  const raw = msg as ChatMessage & Record<string, unknown>;
  const senderType = msg.senderType || str(raw.sender_type) || "user";
  const attachmentUrl = msg.attachmentUrl || str(raw.attachment_url);
  const attachmentType = msg.attachmentType || str(raw.attachment_type);
  const createdAt = msg.createdAt || str(raw.created_at);
  const normalized: NormalizedMessage = {
    id: String(msg.id),
    senderType,
    content: msg.content || "",
  };
  if (attachmentUrl) normalized.attachmentUrl = attachmentUrl;
  if (attachmentType) normalized.attachmentType = attachmentType;
  if (createdAt) normalized.createdAt = createdAt;
  return normalized;
}

function formatTime(mounted: boolean, createdAt?: string): string {
  if (!mounted) return "--:--";
  if (!createdAt) return "--:--";
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function alignFor(senderType: string): "start" | "end" {
  if (senderType === "user") return "end";
  return "start";
}

function isOutgoing(senderType: string): boolean {
  if (senderType === "user") return true;
  return false;
}

function bubbleFillClass(outgoing: boolean): string {
  if (outgoing) return "rounded-xl border border-[#111111] bg-[#111111] font-sans text-white";
  return "rounded-xl border border-[#d3cec6] bg-[#ffffff] font-sans text-[#111111]";
}

function bubbleAlignClass(outgoing: boolean): string {
  if (outgoing) return "self-end";
  return "self-start";
}

type RowProps = Omit<MessageRowProps, "isDarkMode" | "msg"> & { m: NormalizedMessage };

function SystemMarker({ m, mounted }: { m: NormalizedMessage; mounted: boolean }) {
  return (
    <Message align="start" className="flex-col items-center">
      <Marker variant="default" className="w-auto justify-center">
        <MarkerIcon className="text-[#626260]">
          <AlertCircle className="size-4" />
        </MarkerIcon>
        <MarkerContent>
          <span className="inline-flex items-center rounded-full border border-[#d3cec6] bg-[#ffffff] px-3 py-1 font-sans text-[11px] font-medium text-[#626260]">
            System intervention
          </span>
        </MarkerContent>
      </Marker>
      <div
        className={cn(
          "flex w-fit max-w-full flex-col items-center rounded-xl border border-[#d3cec6] bg-[#ffffff] px-3 py-2 font-sans text-sm leading-relaxed text-[#626260]",
        )}
      >
        <p>{m.content}</p>
      </div>
      <MessageFooter className="font-sans text-[11px] text-[#7b7b78]">
        {formatTime(mounted, m.createdAt)}
      </MessageFooter>
    </Message>
  );
}

function IntroCardMessage({ m, mounted, expertImage, expertName, userAvatar, userName }: RowProps) {
  return (
    <Message align={alignFor(m.senderType)}>
      <MessageAvatarSlot>
        <MessageAvatar
          senderType={m.senderType}
          userAvatar={userAvatar}
          userName={userName}
          expertImage={expertImage}
          expertName={expertName}
        />
      </MessageAvatarSlot>
      <MessageContent>
        <IntroCard rawContent={m.content} />
        <MessageFooter className="font-sans text-[11px] text-[#7b7b78]">
          {formatTime(mounted, m.createdAt)}
        </MessageFooter>
      </MessageContent>
    </Message>
  );
}

function TextBubble({ m, outgoing }: { m: NormalizedMessage; outgoing: boolean }) {
  if (!m.content) return null;
  return (
    <div
      className={cn(
        "w-fit max-w-[80%] min-w-0 px-3 py-2 text-sm leading-relaxed wrap-break-word",
        bubbleFillClass(outgoing),
        bubbleAlignClass(outgoing),
      )}
    >
      <p>{m.content}</p>
    </div>
  );
}

function AttachmentOnlyTextGuard({ m, outgoing }: { m: NormalizedMessage; outgoing: boolean }) {
  if (!m.attachmentUrl) return <TextBubble m={m} outgoing={outgoing} />;
  const trimmed = m.content.trim().toLowerCase();
  if (trimmed === "") return null;
  if (isAttachmentFallbackText(m.content)) return null;
  return <TextBubble m={m} outgoing={outgoing} />;
}

function StandardMessage({
  m,
  mounted,
  onPreview,
  expertImage,
  expertName,
  userAvatar,
  userName,
  isOnlyAttachment,
}: RowProps & { isOnlyAttachment: boolean }) {
  const outgoing = isOutgoing(m.senderType);
  return (
    <Message align={alignFor(m.senderType)}>
      <MessageAvatarSlot>
        <MessageAvatar
          senderType={m.senderType}
          userAvatar={userAvatar}
          userName={userName}
          expertImage={expertImage}
          expertName={expertName}
        />
      </MessageAvatarSlot>
      <MessageContent>
        {m.attachmentUrl ? (
          <MessageAttachment
            attachmentUrl={m.attachmentUrl}
            attachmentType={m.attachmentType}
            isUser={outgoing}
            isOnlyAttachment={isOnlyAttachment}
            content={m.content}
            onPreview={onPreview}
          />
        ) : (
          <AttachmentOnlyTextGuard m={m} outgoing={outgoing} />
        )}
        <MessageFooter className="font-sans text-[11px] text-[#7b7b78]">
          {formatTime(mounted, m.createdAt)}
        </MessageFooter>
      </MessageContent>
    </Message>
  );
}

function isAttachmentOnly(m: NormalizedMessage): boolean {
  if (!m.attachmentUrl) return false;
  const trimmed = m.content.trim().toLowerCase();
  if (trimmed === "") return true;
  return isAttachmentFallbackText(m.content);
}

/** Waterfall: admin marker → intro-card → standard bubble. One branch, one return. */
export default function MessageRow(props: MessageRowProps) {
  const { msg, isDarkMode, ...rest } = props;
  void isDarkMode;
  const m = normalize(msg);
  const full: RowProps = { ...rest, m };

  if (m.senderType === "admin") return <SystemMarker m={m} mounted={props.mounted} />;
  if (m.content.startsWith("[INTRO_CARD]")) return <IntroCardMessage {...full} />;
  return <StandardMessage {...full} isOnlyAttachment={isAttachmentOnly(m)} />;
}
