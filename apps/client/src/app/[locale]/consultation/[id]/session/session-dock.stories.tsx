"use client";

import React, { useRef, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import type { ChatMessage } from "@/lib/types";
import type { IAuthUser } from "@/store/authStore";
import { ChatColumnHeader } from "../chat-column-header.component";
import RoomBody from "../room/room-body.component";
import type { TimelineItem } from "../message-area/timeline";
import { ExpertProfileSection } from "../sidebar/expert-profile-section.component";
import { SessionTimersSection } from "../sidebar/session-timers-section.component";
import { VoiceSessionSection } from "../sidebar/voice-session-section.component";
import { EndConsultationAction } from "../sidebar/end-consultation-action.component";
import { VoiceControls, VoiceHero } from "../voice";
import { SessionDock } from "./session-dock.component";
import { VideoPanel } from "./video-panel.component";
import { getRoomModeLabel } from "./session-phase";
import type { SessionKind, SessionPhase } from "./session-phase";

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

const PREVIEW_MESSAGES: ChatMessage[] = [
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
    content: "I would like to understand my career prospects for the coming year.",
    createdAt: "2026-10-14T10:33:00.000Z",
  },
  {
    id: "msg-3",
    senderId: "expert-101",
    senderType: "expert",
    content: "I can hear you clearly. Let us look at your chart together.",
    createdAt: "2026-10-14T10:34:00.000Z",
  },
];

function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function noop() {
  return undefined;
}

/**
 * Storybook client user. Only identity fields are read by the message area;
 * the remainder of the auth contract is stubbed at the boundary.
 */
const storyUser = {
  id: "1",
  name: "Devotee",
  email: "client@astrologyinbharat.com",
  phone: "+919876543210",
  role: "client",
} as unknown as IAuthUser;

function rateFor(kind: SessionKind): number {
  if (kind === "video") return 50;
  return 30;
}

type DockHarnessProps = {
  kind: SessionKind;
  phase: SessionPhase;
};

/**
 * Compact dock harness in a narrow frame.
 *
 * @param props - Addon kind and phase.
 * @returns Dock harness element.
 */
function DockHarness({ kind, phase }: DockHarnessProps) {
  const [expanded, setExpanded] = useState(false);
  function toggle() {
    setExpanded((prev) => !prev);
  }
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec]">
      <SessionDock
        kind={kind}
        phase={phase}
        elapsedText="14:02"
        rate={rateFor(kind)}
        muted={false}
        onToggleMute={noop}
        speakerMuted={false}
        onToggleSpeaker={noop}
        cameraEnabled={true}
        onToggleCamera={noop}
        expanded={expanded}
        onToggleExpand={toggle}
        onEnd={noop}
        onCancelRequest={noop}
      />
    </div>
  );
}

/**
 * Expanded video panel harness.
 *
 * @returns Video panel harness element.
 */
function PanelHarness() {
  return (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec]">
      <VideoPanel
        phase="live"
        expertName={rahulSharmaExpert.name}
        expertAvatar={rahulSharmaExpert.avatar}
        elapsedText="06:18"
        videoRate={50}
        muted={false}
        onToggleMute={noop}
        cameraEnabled={true}
        onToggleCamera={noop}
        speakerMuted={false}
        onToggleSpeaker={noop}
        onEnd={noop}
      />
    </div>
  );
}

type AddonSidebarProps = {
  kind: SessionKind;
  elapsedTime: number;
  timeLeft: number;
};

/**
 * Sidebar composition for addon rooms: expert card, timers, addon
 * switch block, and end action. Chat upgrade block is omitted.
 *
 * @param props - Addon kind and timer values.
 * @returns Addon sidebar element.
 */
function AddonSidebar({ kind, elapsedTime, timeLeft }: AddonSidebarProps) {
  return (
    <aside className="hidden w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-[#d3cec6] bg-white p-5 md:flex">
      <ExpertProfileSection expertData={rahulSharmaExpert} />
      <SessionTimersSection
        formatTime={formatTime}
        elapsedTime={elapsedTime}
        timeLeft={timeLeft}
        isWarning={false}
      />
      <VoiceSessionSection
        kind={kind}
        voiceRate={30}
        chatRate={25}
        videoRate={50}
        onSwitchToChat={noop}
        onUpgradeToVideo={noop}
        onSwitchToVoice={noop}
      />
      <div className="mt-auto border-t border-[#f0ebe3] pt-4">
        <EndConsultationAction handleEndChat={noop} />
      </div>
    </aside>
  );
}

type WholeRoomAddonProps = {
  kind: SessionKind;
  phase: SessionPhase;
  expanded?: boolean;
};

/**
 * Whole room harness proving the invariant: chat stays fully interactive
 * while voice/video docks above it. Composer, history, and footer untouched.
 *
 * @param props - Addon kind, phase, and expanded flag.
 * @returns Whole-room addon element.
 */
function WholeRoomAddon({ kind, phase, expanded = false }: WholeRoomAddonProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(PREVIEW_MESSAGES);
  const [inputValue, setInputValue] = useState("");
  const [isExpanded, setIsExpanded] = useState(expanded);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const timeline: TimelineItem[] = [
    { kind: "date", key: "date-today", label: "Today" },
    ...messages.map((m) => ({ kind: "message" as const, key: m.id, message: m })),
  ];

  function handleSendMessage() {
    if (!inputValue.trim()) return;
    const next: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: "user-current",
      senderType: "user",
      content: inputValue.trim(),
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, next]);
    setInputValue("");
  }

  function toggleExpand() {
    setIsExpanded((prev) => !prev);
  }

  return (
    <div className="relative flex h-[760px] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-2xl">
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <div className="flex h-14 shrink-0 items-center border-b border-[#d3cec6] bg-white px-4">
          <p className="text-sm font-semibold text-[#111111]">{getRoomModeLabel(kind)}</p>
        </div>
        <SessionDock
          kind={kind}
          phase={phase}
          elapsedText={formatTime(842)}
          rate={rateFor(kind)}
          muted={false}
          onToggleMute={noop}
          speakerMuted={false}
          onToggleSpeaker={noop}
          cameraEnabled={true}
          onToggleCamera={noop}
          expanded={isExpanded}
          onToggleExpand={toggleExpand}
          onEnd={noop}
          onCancelRequest={noop}
        />
        <WholeRoomExpandedPanel kind={kind} phase={phase} expanded={isExpanded} />
        <RoomBody
          sessionStatus="active"
          sessionSummary={null}
          messages={messages}
          timeline={timeline}
          expertData={rahulSharmaExpert}
          typingStatus={null}
          user={storyUser}
          pendingAttachment={null}
          removePendingAttachment={noop}
          handleFileUpload={async () => undefined}
          fileInputRef={fileInputRef}
          uploading={false}
          uploadProgress={null}
          inputValue={inputValue}
          setInputValue={setInputValue}
          handleSendMessage={handleSendMessage}
          handleInputTyping={noop}
        />
      </div>
      <AddonSidebar kind={kind} elapsedTime={842} timeLeft={1018} />
    </div>
  );
}

/**
 * Expanded addon panel between dock and chat. Voice expands to the hero;
 * video expands to the video stage. Collapsed renders nothing.
 *
 * @param props - Addon kind, phase, expanded flag.
 * @returns Expanded panel element.
 */
function WholeRoomExpandedPanel({
  kind,
  phase,
  expanded,
}: {
  kind: SessionKind;
  phase: SessionPhase;
  expanded: boolean;
}) {
  if (!expanded) return null;
  if (kind === "video") {
    return (
      <VideoPanel
        phase={phase}
        expertName={rahulSharmaExpert.name}
        expertAvatar={rahulSharmaExpert.avatar}
        elapsedText={formatTime(842)}
        videoRate={50}
        muted={false}
        onToggleMute={noop}
        cameraEnabled={true}
        onToggleCamera={noop}
        speakerMuted={false}
        onToggleSpeaker={noop}
        onEnd={noop}
      />
    );
  }
  return (
    <div className="shrink-0 border-b border-[#d3cec6] bg-[#f5f1ec]">
      <VoiceHero
        expertName={rahulSharmaExpert.name}
        expertAvatar={rahulSharmaExpert.avatar}
        phase={phase}
        elapsedText={formatTime(842)}
        voiceRate={30}
      />
      <VoiceControls
        onBackToChat={noop}
        onEndVoice={noop}
        muted={false}
        onToggleMute={noop}
        speakerMuted={false}
        onToggleSpeaker={noop}
      />
    </div>
  );
}

const meta: Meta<typeof DockHarness> = {
  title: "Chat/Room/ChatPlusSession",
  component: DockHarness,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof DockHarness>;

/** Voice dialing dock: compact strip with cancel, chat untouched below. */
export const DockVoiceRequesting: Story = {
  render: () => <DockHarness kind="voice" phase="requesting" />,
};

/** Live voice dock: orb, timer, rate, mic/speaker/expand/end. */
export const DockVoiceLive: Story = {
  render: () => <DockHarness kind="voice" phase="live" />,
};

/** Voice drop: red pulsing dot, timer held. */
export const DockVoiceReconnecting: Story = {
  render: () => <DockHarness kind="voice" phase="reconnecting" />,
};

/** Live video dock with camera toggle. */
export const DockVideoLive: Story = {
  render: () => <DockHarness kind="video" phase="live" />,
};

/** Expanded video stage: remote surface, local preview, 48px controls. */
export const VideoPanelLive: Story = {
  render: () => <PanelHarness />,
};

type RoomStory = StoryObj<typeof WholeRoomAddon>;

/** Chat + voice: dock live above a fully working chat column. */
export const WholeRoomChatVoice: RoomStory = {
  render: () => <WholeRoomAddon kind="voice" phase="live" expanded={false} />,
};

/** Chat + voice expanded: hero panel open, chat still scrollable below. */
export const WholeRoomChatVoiceExpanded: RoomStory = {
  render: () => <WholeRoomAddon kind="voice" phase="live" expanded />,
};

/** Chat + video: video stage docked above a fully working chat column. */
export const WholeRoomChatVideo: RoomStory = {
  render: () => <WholeRoomAddon kind="video" phase="live" expanded />,
};

/** Chat column header reference kept for header parity checks. */
export const HeaderReference: RoomStory = {
  render: () => (
    <div className="w-full max-w-2xl overflow-hidden rounded-2xl border border-[#d3cec6]">
      <ChatColumnHeader
        router={{ back: noop, push: noop } as never}
        onOpenMobileSidebar={noop}
        handleEndChat={noop}
      />
    </div>
  ),
};
