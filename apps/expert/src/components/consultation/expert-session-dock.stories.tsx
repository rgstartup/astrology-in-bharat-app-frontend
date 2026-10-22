"use client";

import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ExpertSessionDock } from "./expert-session-dock.component";
import { ExpertVideoPanel } from "./expert-video-panel.component";
import { ExpertVoiceHero } from "./expert-voice-hero.component";
import { ExpertVoiceControls } from "./expert-voice-controls.component";
import { ChatRoomHeader } from "../../app/[locale]/dashboard/consultations/[id]/chat-room/header/chat-room-header.component";
import { ChatMessageArea } from "../../app/[locale]/dashboard/consultations/[id]/chat-room/message-area/chat-message-area.component";
import { ChatComposer } from "../../app/[locale]/dashboard/consultations/[id]/chat-room/composer/chat-composer.component";
import type { ChatMessage } from "@/types/chat";
import type { ClientIntakeProfile, ExpertConsultationMetrics, ExpertSessionKind } from "./types";

const MOCK_DEVOTEE: ClientIntakeProfile = {
  name: "Aarav Mehta",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  gender: "Male",
  dateOfBirth: "14 Oct 1996",
  timeOfBirth: "06:45 AM",
  placeOfBirth: "New Delhi, India",
  rashi: "Tula (Libra)",
  nakshatra: "Swati",
  topic: "Career transit & Saturn Mahadasha guidance",
};

const BASE_METRICS: ExpertConsultationMetrics = {
  elapsedSeconds: 754,
  ratePerMinute: 30,
  totalEarned: 377,
};

const SEED_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    senderId: "client-7",
    senderType: "user",
    content: "Pranam Guruji! I am sharing my birth chart details for review.",
    createdAt: "2026-10-14T10:32:00.000Z",
  },
  {
    id: "msg-2",
    senderId: "expert-101",
    senderType: "expert",
    content:
      "Namaste Aarav. I have opened your chart. Let's start the voice session so I can explain the Sade Sati remedies in detail.",
    createdAt: "2026-10-14T10:33:00.000Z",
  },
  {
    id: "msg-3",
    senderId: "client-7",
    senderType: "user",
    content: "Yes Guruji, I can hear you clearly now.",
    createdAt: "2026-10-14T10:34:00.000Z",
  },
];

function noop() {
  return undefined;
}

/**
 * Harness rendering the expert session dock above an interactive chat room.
 */
function WholeRoomExpertAddon({
  kind,
  initialExpanded = false,
}: {
  kind: ExpertSessionKind;
  initialExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [messages, setMessages] = useState<ChatMessage[]>(SEED_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  function handleSendMessage() {
    if (!inputValue.trim()) return;
    const msg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "expert-101",
      senderType: "expert",
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, msg]);
    setInputValue("");
  }

  return (
    <div className="flex h-[760px] w-full max-w-3xl flex-col overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-2xl font-sans text-[#111111]">
      <ChatRoomHeader
        clientName={MOCK_DEVOTEE.name}
        clientAvatar={MOCK_DEVOTEE.avatar || null}
        sessionStatus="active"
        elapsedTime={BASE_METRICS.elapsedSeconds}
        timeLeft={600}
        isActivating={false}
        onActivate={async () => undefined}
        onEndChat={async () => undefined}
      />

      {/* Pinned Expert Consultation Dock */}
      <ExpertSessionDock
        client={MOCK_DEVOTEE}
        kind={kind}
        phase="live"
        metrics={BASE_METRICS}
        expanded={expanded}
        onToggleExpand={() => setExpanded((prev) => !prev)}
        onEndCall={noop}
      />

      {/* Expandable Voice/Video Area */}
      {expanded && (
        <div className="shrink-0 border-b border-[#d3cec6] bg-white">
          {kind === "video" ? (
            <ExpertVideoPanel
              client={MOCK_DEVOTEE}
              phase="live"
              metrics={BASE_METRICS}
              expertName="Pandit Rahul Sharma"
              onEndCall={noop}
            />
          ) : (
            <div className="flex flex-col items-center py-4 bg-[#f5f1ec]">
              <ExpertVoiceHero
                client={MOCK_DEVOTEE}
                phase="live"
                metrics={BASE_METRICS}
                isClientSpeaking
              />
              <ExpertVoiceControls
                phase="live"
                onEndCall={noop}
                onSwitchToChat={() => setExpanded(false)}
              />
            </div>
          )}
        </div>
      )}

      {/* Underlying Interactive Chat Area */}
      <ChatMessageArea
        messages={messages}
        sessionStatus="active"
        clientName={MOCK_DEVOTEE.name}
        clientAvatar={MOCK_DEVOTEE.avatar || null}
        expertAvatar={null}
        expertName="Pandit Rahul Sharma"
        typingStatus={null}
        messagesEndRef={messagesEndRef}
        onPreviewImage={noop}
      />

      <ChatComposer
        inputValue={inputValue}
        onInputChange={setInputValue}
        onInputTyping={noop}
        onSendMessage={handleSendMessage}
        onFileUpload={async () => undefined}
        fileInputRef={fileInputRef}
        uploading={false}
        uploadProgress={null}
        pendingAttachment={null}
        onRemoveAttachment={noop}
      />
    </div>
  );
}

const meta: Meta<typeof WholeRoomExpertAddon> = {
  title: "Consultation/Expert/SessionDock",
  component: WholeRoomExpertAddon,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof WholeRoomExpertAddon>;

/** Standalone compact voice dock pinned above chat. */
export const VoiceDockLive: Story = {
  render: () => (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#d3cec6] shadow-sm">
      <ExpertSessionDock
        client={MOCK_DEVOTEE}
        kind="voice"
        phase="live"
        metrics={BASE_METRICS}
        onEndCall={noop}
      />
    </div>
  ),
};

/** Standalone compact video dock pinned above chat with camera toggle. */
export const VideoDockLive: Story = {
  render: () => (
    <div className="w-full max-w-2xl overflow-hidden rounded-xl border border-[#d3cec6] shadow-sm">
      <ExpertSessionDock
        client={MOCK_DEVOTEE}
        kind="video"
        phase="live"
        metrics={BASE_METRICS}
        onEndCall={noop}
      />
    </div>
  ),
};

/** Full Expert Room: Voice dock pinned above live chat. */
export const WholeRoomChatPlusVoice: Story = {
  render: () => <WholeRoomExpertAddon kind="voice" initialExpanded={false} />,
};

/** Full Expert Room: Video panel docked above live chat. */
export const WholeRoomChatPlusVideo: Story = {
  render: () => <WholeRoomExpertAddon kind="video" initialExpanded={true} />,
};
