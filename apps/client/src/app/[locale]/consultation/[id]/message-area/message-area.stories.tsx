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
    label: "Consultation resumed",
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
    label: "Consultation resumed",
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

const POST_CALL_MESSAGES: ChatMessage[] = [
  expertMessage("c1", "Picking up from the call — here is the timing summary.", "2026-10-13T09:10:00.000Z"),
  userMessage("c2", "Thank you, that answers my question.", "2026-10-13T09:12:00.000Z"),
];

const CALL_THEN_CHAT_TIMELINE: TimelineItem[] = [
  {
    kind: "session_event",
    key: "session-event-s1",
    event: {
      sessionId: "s1",
      mode: "voice",
      status: "completed",
      startedAt: "2026-10-13T09:00:00.000Z",
      endedAt: "2026-10-13T09:08:00.000Z",
      nextMode: "chat",
    },
  },
  { kind: "date", key: "date-post-call", label: "Today" },
  { kind: "message", key: "msg-c1", message: POST_CALL_MESSAGES[0] as ChatMessage },
  { kind: "message", key: "msg-c2", message: POST_CALL_MESSAGES[1] as ChatMessage },
  {
    kind: "session_event",
    key: "session-event-s2",
    event: {
      sessionId: "s2",
      mode: "video",
      status: "completed",
      startedAt: "2026-10-13T09:20:00.000Z",
      endedAt: "2026-10-13T09:45:00.000Z",
    },
  },
];

export const CallThenChat: Story = {
  args: {
    sessionStatus: "active",
    sessionSummary: null,
    messages: POST_CALL_MESSAGES,
    timeline: CALL_THEN_CHAT_TIMELINE,
    expertData: EXPERT,
    typingStatus: null,
  },
};

export const CallWithoutMessages: Story = {
  args: {
    sessionStatus: "active",
    sessionSummary: null,
    messages: [],
    timeline: [
      {
        kind: "session_event",
        key: "session-event-s1",
        event: {
          sessionId: "s1",
          mode: "video",
          status: "active",
          startedAt: "2026-10-13T09:00:00.000Z",
        },
      },
    ],
    expertData: EXPERT,
    typingStatus: null,
  },
};

function ConversationWithComposer() {
  const [inputValue, setInputValue] = useState("Blessings for the new venture…");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <div className="flex h-[560px] w-full min-h-0 flex-col overflow-hidden bg-[#f5f1ec]">
      <MessageArea
        sessionStatus="active"
        sessionSummary={null}
        messages={ACTIVE_MESSAGES}
        timeline={ACTIVE_TIMELINE}
        expertData={EXPERT}
        typingStatus={{ senderName: "Acharya Meera", isTyping: true }}
      />
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

const ATTACHMENT_SHOWCASE_MESSAGES: ChatMessage[] = [
  expertMessage("att-1", "Namaste! Please share your palm photo or chart.", "2026-10-13T09:00:00.000Z"),
  {
    id: "att-2",
    senderId: "user-1",
    senderType: "user",
    content: "sent an attachment",
    attachmentUrl: "https://images.unsplash.com/photo-1532968961962-8a0cb3a2d4f5?w=800",
    attachmentType: "image",
    createdAt: "2026-10-13T09:01:00.000Z",
  },
  {
    id: "att-3",
    senderId: "expert-7",
    senderType: "expert",
    content: "I have annotated the mounts and lines on your palm for clarity.",
    attachmentUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800",
    attachmentType: "image",
    createdAt: "2026-10-13T09:03:00.000Z",
  },
  {
    id: "att-4",
    senderId: "user-1",
    senderType: "user",
    content: "Here is also my birth chart generated from local software.",
    attachmentUrl: "https://example.com/documents/birth-chart.pdf",
    attachmentType: "document",
    createdAt: "2026-10-13T09:05:00.000Z",
  },
  {
    id: "att-5",
    senderId: "expert-7",
    senderType: "expert",
    content: "",
    attachmentUrl: "https://example.com/documents/transit-analysis.pdf",
    attachmentType: "document",
    createdAt: "2026-10-13T09:07:00.000Z",
  },
];

const ATTACHMENT_SHOWCASE_TIMELINE: TimelineItem[] = [
  { kind: "date", key: "date-today", label: "Today" },
  { kind: "message", key: "msg-att-1", message: ATTACHMENT_SHOWCASE_MESSAGES[0] as ChatMessage },
  { kind: "message", key: "msg-att-2", message: ATTACHMENT_SHOWCASE_MESSAGES[1] as ChatMessage },
  { kind: "message", key: "msg-att-3", message: ATTACHMENT_SHOWCASE_MESSAGES[2] as ChatMessage },
  { kind: "message", key: "msg-att-4", message: ATTACHMENT_SHOWCASE_MESSAGES[3] as ChatMessage },
  { kind: "message", key: "msg-att-5", message: ATTACHMENT_SHOWCASE_MESSAGES[4] as ChatMessage },
];

export const AttachmentVariants: Story = {
  args: {
    sessionStatus: "active",
    sessionSummary: null,
    messages: ATTACHMENT_SHOWCASE_MESSAGES,
    timeline: ATTACHMENT_SHOWCASE_TIMELINE,
    expertData: EXPERT,
    typingStatus: null,
  },
};
