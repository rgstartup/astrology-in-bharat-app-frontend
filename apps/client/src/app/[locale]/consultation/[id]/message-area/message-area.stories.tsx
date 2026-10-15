"use client";

import { useRef, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import type { ChatMessage } from "@/lib/types";
import MessageArea from "./message-area.component";
import ChatFooter from "../chat-footer.component";
import type { TimelineItem } from "./timeline";

function userMessage(id: string, content: string, createdAt: string): ChatMessage {
  return {
    id,
    senderId: "user-1",
    senderType: "user",
    content,
    createdAt,
  };
}

function expertMessage(id: string, content: string, createdAt: string): ChatMessage {
  return {
    id,
    senderId: "expert-7",
    senderType: "expert",
    content,
    createdAt,
  };
}

const EXPERT = { image: undefined, name: "Acharya Meera" };

const ACTIVE_MESSAGES: ChatMessage[] = [
  expertMessage("m1", "Namaste! Welcome to your consultation.", "2026-10-13T09:01:00.000Z"),
  userMessage("m2", "Thank you! I wanted guidance on my career move.", "2026-10-13T09:02:00.000Z"),
  {
    id: "m3",
    senderId: "expert-7",
    senderType: "expert",
    content: "Here is the chart I pulled for your review.",
    attachmentUrl: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800",
    attachmentType: "image",
    createdAt: "2026-10-13T09:03:00.000Z",
  },
  userMessage("m4", "That matches what I have been feeling lately.", "2026-10-13T09:05:00.000Z"),
];

const ACTIVE_TIMELINE: TimelineItem[] = [
  { kind: "date", key: "date-today", label: "Today" },
  { kind: "message", key: "msg-m1", message: ACTIVE_MESSAGES[0] as ChatMessage },
  { kind: "message", key: "msg-m2", message: ACTIVE_MESSAGES[1] as ChatMessage },
  {
    kind: "session",
    key: "session-resumed",
    sessionId: "s2",
    label: "Connection resumed",
    startedAt: "2026-10-13T09:03:00.000Z",
  },
  { kind: "message", key: "msg-m3", message: ACTIVE_MESSAGES[2] as ChatMessage },
  { kind: "message", key: "msg-m4", message: ACTIVE_MESSAGES[3] as ChatMessage },
];

const SESSION_A: ChatMessage[] = [
  expertMessage("a1", "Welcome to your first session.", "2026-10-12T10:00:00.000Z"),
  userMessage("a2", "Happy to be here.", "2026-10-12T10:01:00.000Z"),
];

const SESSION_B: ChatMessage[] = [
  expertMessage("b1", "Welcome back, let us continue.", "2026-10-13T08:00:00.000Z"),
  userMessage("b2", "I have new questions about timing.", "2026-10-13T08:02:00.000Z"),
];

const MULTI_SESSION_TIMELINE: TimelineItem[] = [
  { kind: "date", key: "date-oct12", label: "12 Oct" },
  { kind: "message", key: "msg-a1", message: SESSION_A[0] as ChatMessage },
  { kind: "message", key: "msg-a2", message: SESSION_A[1] as ChatMessage },
  {
    kind: "session",
    key: "session-s2",
    sessionId: "s2",
    label: "Connection resumed",
    startedAt: "2026-10-13T08:00:00.000Z",
  },
  { kind: "date", key: "date-today-2", label: "Today" },
  { kind: "message", key: "msg-b1", message: SESSION_B[0] as ChatMessage },
  { kind: "message", key: "msg-b2", message: SESSION_B[1] as ChatMessage },
];

const meta: Meta<typeof MessageArea> = {
  title: "Chat/Room/MessageArea",
  component: MessageArea,
  parameters: { layout: "fullscreen", backgrounds: { default: "Intercom canvas" } },
  decorators: [
    (Story) => (
      <div className="h-[560px] w-full bg-[#f5f1ec]">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MessageArea>;

export const ActiveConversation: Story = {
  args: {
    sessionStatus: "active",
    sessionSummary: null,
    messages: ACTIVE_MESSAGES,
    timeline: ACTIVE_TIMELINE,
    expertData: EXPERT,
    typingStatus: { senderName: "Acharya Meera", isTyping: true },
  },
};

export const EmptyState: Story = {
  args: {
    sessionStatus: "active",
    sessionSummary: null,
    messages: [],
    timeline: [],
    expertData: EXPERT,
    typingStatus: null,
  },
};

export const SessionDividers: Story = {
  args: {
    sessionStatus: "active",
    sessionSummary: null,
    messages: [...SESSION_A, ...SESSION_B],
    timeline: MULTI_SESSION_TIMELINE,
    expertData: EXPERT,
    typingStatus: null,
  },
};

function ConversationWithComposer() {
  const [inputValue, setInputValue] = useState("Blessings for the new venture…");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex h-[560px] w-full min-h-0 flex-col overflow-hidden bg-[#f5f1ec]">
      <div className="min-h-0 min-w-0 flex-1">
        <MessageArea
          sessionStatus="active"
          sessionSummary={null}
          messages={ACTIVE_MESSAGES}
          timeline={ACTIVE_TIMELINE}
          expertData={EXPERT}
          typingStatus={{ senderName: "Acharya Meera", isTyping: true }}
        />
      </div>
      <ChatFooter
        sessionStatus="active"
        pendingAttachment={null}
        removePendingAttachment={() => undefined}
        handleFileUpload={() => undefined}
        fileInputRef={fileInputRef}
        uploading={false}
        uploadProgress={null}
        inputValue={inputValue}
        setInputValue={setInputValue}
        handleSendMessage={() => undefined}
      />
    </div>
  );
}

export const WithComposer: Story = {
  parameters: { layout: "fullscreen", backgrounds: { default: "Intercom canvas" } },
  render: () => <ConversationWithComposer />,
};
