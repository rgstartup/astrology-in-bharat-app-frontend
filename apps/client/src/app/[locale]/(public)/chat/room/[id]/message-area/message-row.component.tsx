"use client";

import { AlertCircle } from "lucide-react";
import type { ChatMessage } from "@/lib/types";
import {
  Message,
  MessageAvatar as MessageAvatarSlot,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message";
import { Bubble, BubbleContent } from "@/components/ui/bubble";
import { Marker, MarkerContent, MarkerIcon } from "@/components/ui/marker";
import MessageAvatar from "./message-avatar.component";
import MessageAttachment from "./message-attachment.component";
import IntroCard from "./intro-card.component";

type MessageRowProps = {
  msg: ChatMessage;
  isDarkMode: boolean;
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

const normalize = (msg: ChatMessage): NormalizedMessage => {
  const raw = msg as ChatMessage & Record<string, unknown>;
  const str = (v: unknown) => (typeof v === "string" ? v : undefined);
  return {
    id: String(msg.id),
    senderType: msg.senderType || str(raw.sender_type) || "user",
    content: msg.content || "",
    attachmentUrl: msg.attachmentUrl || str(raw.attachment_url),
    attachmentType: msg.attachmentType || str(raw.attachment_type),
    createdAt: msg.createdAt || str(raw.created_at),
  };
};

const formatTime = (mounted: boolean, createdAt?: string): string => {
  if (!mounted || !createdAt) return "--:--";
  return new Date(createdAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

type RowProps = MessageRowProps & { m: NormalizedMessage };

function SystemMarker({ m, mounted }: { m: NormalizedMessage; mounted: boolean }) {
  return (
    <Message align="start" className="flex-col items-center">
      <Marker variant="separator" className="w-full">
        <MarkerIcon>
          <AlertCircle className="size-4" />
        </MarkerIcon>
        <MarkerContent>System Intervention</MarkerContent>
      </Marker>
      <Bubble variant="destructive">
        <BubbleContent>
          <p>{m.content}</p>
        </BubbleContent>
      </Bubble>
      <MessageFooter className="justify-center">{formatTime(mounted, m.createdAt)}</MessageFooter>
    </Message>
  );
}

function IntroCardMessage({ m, mounted, expertImage, expertName, userAvatar, userName }: RowProps) {
  const isUser = m.senderType === "user";
  return (
    <Message align={isUser ? "end" : "start"}>
      <MessageAvatarSlot>
        <MessageAvatar senderType={m.senderType} userAvatar={userAvatar} userName={userName} expertImage={expertImage} expertName={expertName} />
      </MessageAvatarSlot>
      <MessageContent>
        <IntroCard rawContent={m.content} />
        <MessageFooter>{formatTime(mounted, m.createdAt)}</MessageFooter>
      </MessageContent>
    </Message>
  );
}

function StandardMessage({ m, mounted, onPreview, expertImage, expertName, userAvatar, userName, isOnlyAttachment }: RowProps & { isOnlyAttachment: boolean }) {
  const isUser = m.senderType === "user";
  return (
    <Message align={isUser ? "end" : "start"}>
      <MessageAvatarSlot>
        <MessageAvatar senderType={m.senderType} userAvatar={userAvatar} userName={userName} expertImage={expertImage} expertName={expertName} />
      </MessageAvatarSlot>
      <MessageContent>
        <MessageAttachment attachmentUrl={m.attachmentUrl} attachmentType={m.attachmentType} isUser={isUser} isOnlyAttachment={isOnlyAttachment} onPreview={onPreview} />
        {isOnlyAttachment ? null : (
          <Bubble variant={isUser ? "default" : "secondary"}>
            <BubbleContent>
              <p>{m.content}</p>
            </BubbleContent>
          </Bubble>
        )}
        <MessageFooter>{formatTime(mounted, m.createdAt)}</MessageFooter>
      </MessageContent>
    </Message>
  );
}

/** Waterfall: admin marker → intro-card → standard bubble. One branch, one return. */
export default function MessageRow(props: MessageRowProps) {
  const m = normalize(props.msg);
  const trimmed = m.content.trim().toLowerCase();
  const isOnlyAttachment =
    Boolean(m.attachmentUrl) &&
    (trimmed === "" || trimmed === "sent an image" || trimmed === "sent an attachment");
  const isIntroCard = m.content.startsWith("[INTRO_CARD]");
  const full: RowProps = { ...props, m };

  if (m.senderType === "admin") return <SystemMarker m={m} mounted={props.mounted} />;
  if (isIntroCard) return <IntroCardMessage {...full} />;
  return <StandardMessage {...full} isOnlyAttachment={isOnlyAttachment} />;
}
