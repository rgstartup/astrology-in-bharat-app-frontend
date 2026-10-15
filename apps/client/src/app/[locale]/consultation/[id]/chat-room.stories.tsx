"use client";

import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import type { useRouter } from "@/i18n/navigation";
import type { ChatMessage } from "@/lib/types";
import { ConsultationSidebar, MobileSidebarDrawer } from "./sidebar";
import { ChatColumnHeader } from "./chat-column-header.component";
import RoomBody from "./chat-room/room-body.component";
import type { TimelineItem } from "./message-area/timeline";

type Router = ReturnType<typeof useRouter>;

function stubRouter(): Router {
  const router = {
    back: () => undefined,
    push: () => undefined,
  };
  return router as unknown as Router;
}

/** Wireframe expert: Pandit Rahul Sharma, Vedic Astrologer. */
const rahulSharmaExpert = {
  id: 101,
  name: "Pandit Rahul Sharma",
  avatar:
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
  rating: 4.9,
  languages: "Hindi, English, Sanskrit",
  professions: [
    {
      is_primary: true,
      profession: {
        id: 1,
        title: "Vedic Astrologer",
      },
    },
  ],
  pricing: {
    chat_price: 25,
    call_price: 30,
    video_call_price: 50,
  },
} as unknown as IExpert;

/** Initial wireframe conversation messages. */
const WIREFRAME_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "expert-101",
    senderType: "expert",
    content: "Namaste! What would you like guidance on today?",
    createdAt: "2026-10-14T10:32:00.000Z",
  },
  {
    id: "msg-2",
    senderId: "user-current",
    senderType: "user",
    content: "I'd like to understand my career prospects for the coming year.",
    createdAt: "2026-10-14T10:33:00.000Z",
  },
  {
    id: "msg-3",
    senderId: "expert-101",
    senderType: "expert",
    content: "Certainly. Let's begin with your current career situation.",
    createdAt: "2026-10-14T10:33:30.000Z",
  },
];

const WIREFRAME_TIMELINE: TimelineItem[] = [
  { kind: "date", key: "date-today", label: "Today · 4:02 PM" },
  { kind: "message", key: "m1", message: WIREFRAME_MESSAGES[0] as ChatMessage },
  { kind: "message", key: "m2", message: WIREFRAME_MESSAGES[1] as ChatMessage },
  { kind: "message", key: "m3", message: WIREFRAME_MESSAGES[2] as ChatMessage },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

type WholeChatRoomProps = {
  expertData: IExpert;
  sessionStatus?: string;
  elapsedTime: number;
  timeLeft: number;
  isWarning?: boolean;
};

/**
 * Interactive test harness rendering the complete two-column consultation room.
 *
 * @param props - WholeChatRoomProps
 * @returns Fully composed chat room element.
 */
function WholeChatRoomStage({
  expertData,
  sessionStatus = "active",
  elapsedTime,
  timeLeft,
  isWarning = false,
}: WholeChatRoomProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(WIREFRAME_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const timeline: TimelineItem[] = [
    { kind: "date", key: "date-today", label: "Today · 4:02 PM" },
    ...messages.map((m) => ({ kind: "message" as const, key: m.id, message: m })),
  ];

  function handleSendMessage() {
    if (!inputValue.trim()) return;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user-current",
      senderType: "user",
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setInputValue("");
  }

  return (
    <div className="relative flex h-[760px] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-2xl">
      {/* 75% Primary Chat Area */}
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <ChatColumnHeader
          router={stubRouter()}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          handleEndChat={() => undefined}
        />

        <RoomBody
          sessionStatus={sessionStatus}
          sessionSummary={null}
          messages={messages}
          timeline={timeline}
          expertData={expertData}
          typingStatus={null}
          user={{
            id: 1,
            name: "Devotee",
            email: "client@astrologyinbharat.com",
            phone: "+919876543210",
            role: "client",
          } as any}
          pendingAttachment={null}
          removePendingAttachment={() => undefined}
          handleFileUpload={async () => undefined}
          fileInputRef={fileInputRef}
          uploading={false}
          uploadProgress={null}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleInputTyping={() => undefined}
        />
      </div>

      {/* 25% Persistent Desktop Sidebar on Right */}
      <ConsultationSidebar
        expertData={expertData}
        sessionStatus={sessionStatus}
        formatTime={formatTime}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft}
        handleEndChat={() => undefined}
        isWarning={isWarning}
        router={stubRouter()}
      />

      {/* Mobile Drawer */}
      <MobileSidebarDrawer
        open={mobileSidebarOpen}
        onOpenChange={setMobileSidebarOpen}
        expertData={expertData}
        sessionStatus={sessionStatus}
        formatTime={formatTime}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft}
        handleEndChat={() => undefined}
        isWarning={isWarning}
        router={stubRouter()}
      />
    </div>
  );
}

const meta: Meta<typeof WholeChatRoomStage> = {
  title: "Chat/Room/WholeChatRoom",
  component: WholeChatRoomStage,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof WholeChatRoomStage>;

/**
 * Complete Two-Column Consultation Room matching exact wireframe:
 * - 25% Sidebar: Pandit Rahul Sharma, Vedic Astrologer, timers (12:34 / 08:42), upgrades, end button
 * - 75% Chat: Real conversation history, timeline, secure indicator, composer
 */
export const TwoColumnActiveSession: Story = {
  render: () => (
    <WholeChatRoomStage
      expertData={rahulSharmaExpert}
      sessionStatus="active"
      elapsedTime={754} // 12:34
      timeLeft={522} // 08:42
      isWarning={false}
    />
  ),
};

/** Low balance warning threshold with urgent red timer state. */
export const LowBalanceAlert: Story = {
  render: () => (
    <WholeChatRoomStage
      expertData={rahulSharmaExpert}
      sessionStatus="active"
      elapsedTime={1320} // 22:00
      timeLeft={45} // 00:45 (urgent)
      isWarning={true}
    />
  ),
};

/** Mobile viewport simulation showing collapsed header and slide-over drawer affordance. */
export const MobileView: Story = {
  render: () => (
    <div className="w-[375px] max-w-full">
      <WholeChatRoomStage
        expertData={rahulSharmaExpert}
        sessionStatus="active"
        elapsedTime={754}
        timeLeft={522}
        isWarning={false}
      />
    </div>
  ),
};
