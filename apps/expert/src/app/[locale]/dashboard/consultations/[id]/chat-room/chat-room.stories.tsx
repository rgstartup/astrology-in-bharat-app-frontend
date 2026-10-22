"use client";

import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ChatRoomHeader } from "./header/chat-room-header.component";
import { ChatMessageArea } from "./message-area/chat-message-area.component";
import { ChatComposer } from "./composer/chat-composer.component";
import { ChatImagePreviewDialog } from "./modals/chat-image-preview-dialog.component";
import type { ChatMessage, ChatSessionStatus } from "./types";

/** Wireframe client: Devotee seeking career guidance. */
const CLIENT_NAME = "Aarav Mehta";
const EXPERT_NAME = "Pandit Rahul Sharma";

/** Seed conversation: client question, expert answer, client follow-up. */
const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "client-7",
    senderType: "user",
    content: "Namaste! I wanted guidance on my career for the coming year.",
    createdAt: "2026-10-14T10:32:00.000Z",
  },
  {
    id: "msg-2",
    senderId: "expert-101",
    senderType: "expert",
    content:
      "Namaste Aarav. I can see Saturn is currently transiting your tenth house, which brings steady but slow progress at work.",
    createdAt: "2026-10-14T10:33:00.000Z",
  },
  {
    id: "msg-3",
    senderId: "client-7",
    senderType: "user",
    content: "Should I consider the job offer I received last week, or wait?",
    createdAt: "2026-10-14T10:34:00.000Z",
  },
];

type WholeExpertRoomProps = {
  sessionStatus: ChatSessionStatus;
  elapsedTime: number;
  timeLeft: number;
  seedMessages?: ChatMessage[];
  typingName?: string | null;
};

/**
 * Interactive harness composing the expert chat room from its presentational
 * parts: header, message timeline, composer, and image lightbox.
 *
 * @param props - WholeExpertRoomProps
 * @returns Fully composed expert chat room element.
 */
function WholeExpertRoomStage({
  sessionStatus,
  elapsedTime,
  timeLeft,
  seedMessages = SEED_MESSAGES,
  typingName = null,
}: WholeExpertRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(seedMessages);
  const [inputValue, setInputValue] = useState("");
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  function handleSendMessage() {
    if (!inputValue.trim()) return;
    const outgoing: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "expert-101",
      senderType: "expert",
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, outgoing]);
    setInputValue("");
  }

  async function handleFileUpload() {
    return undefined;
  }

  return (
    <div className="flex h-[760px] w-full max-w-3xl flex-col overflow-hidden rounded-xl border border-[#d3cec6] bg-[#f5f1ec] font-sans text-[#111111]">
      <ChatRoomHeader
        clientName={CLIENT_NAME}
        clientAvatar={null}
        sessionStatus={sessionStatus}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft}
        isActivating={false}
        onActivate={async () => undefined}
        onEndChat={async () => undefined}
      />

      <ChatMessageArea
        messages={messages}
        sessionStatus={sessionStatus}
        clientName={CLIENT_NAME}
        clientAvatar={null}
        expertAvatar={null}
        expertName={EXPERT_NAME}
        typingStatus={typingName ? { senderName: typingName, isTyping: true } : null}
        messagesEndRef={messagesEndRef}
        onPreviewImage={(url) => setPreviewImageUrl(url)}
      />

      <ChatComposer
        inputValue={inputValue}
        onInputChange={setInputValue}
        onInputTyping={() => undefined}
        onSendMessage={handleSendMessage}
        onFileUpload={handleFileUpload}
        fileInputRef={fileInputRef}
        uploading={false}
        uploadProgress={null}
        pendingAttachment={null}
        onRemoveAttachment={() => undefined}
      />

      <ChatImagePreviewDialog
        previewImageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />
    </div>
  );
}

const meta: Meta<typeof WholeExpertRoomStage> = {
  title: "Chat/Room/ExpertChatRoom",
  component: WholeExpertRoomStage,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof WholeExpertRoomStage>;

/** Live session with history: charcoal expert bubbles, white client bubbles. */
export const ActiveSession: Story = {
  render: () => (
    <WholeExpertRoomStage sessionStatus="active" elapsedTime={754} timeLeft={522} />
  ),
};

/** Pending session: start-session pill plus the pending notice card. */
export const PendingSession: Story = {
  render: () => (
    <WholeExpertRoomStage sessionStatus="pending" elapsedTime={0} timeLeft={600} />
  ),
};

/** Fresh room with no messages: empty-state card and working composer. */
export const EmptyConversation: Story = {
  render: () => (
    <WholeExpertRoomStage
      sessionStatus="active"
      elapsedTime={12}
      timeLeft={588}
      seedMessages={[]}
    />
  ),
};

/** Ended session: ended pill in the header, history frozen. */
export const CompletedSession: Story = {
  render: () => (
    <WholeExpertRoomStage sessionStatus="completed" elapsedTime={1200} timeLeft={0} />
  ),
};

/** Client typing indicator live above the composer. */
export const ClientTyping: Story = {
  render: () => (
    <WholeExpertRoomStage
      sessionStatus="active"
      elapsedTime={300}
      timeLeft={300}
      typingName={CLIENT_NAME}
    />
  ),
};
