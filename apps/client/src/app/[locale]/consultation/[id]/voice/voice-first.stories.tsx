"use client";

import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import { VoiceLobby } from "./voice-lobby.component";
import { VoiceStage } from "./voice-stage.root";
import { ExpertProfileSection } from "../sidebar/expert-profile-section.component";
import { SessionTimersSection } from "../sidebar/session-timers-section.component";
import { VoiceSessionSection } from "../sidebar/voice-session-section.component";
import { EndConsultationAction } from "../sidebar/end-consultation-action.component";

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

function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

function noop() {
  return undefined;
}

type LobbyHarnessProps = {
  elapsedTime?: number;
  timeLeft?: number;
};

function lobbyTimersText(props: LobbyHarnessProps): { elapsedTime: number; timeLeft: number } {
  return { elapsedTime: props.elapsedTime ?? 0, timeLeft: props.timeLeft ?? 0 };
}

/**
 * Sidebar composition for voice-first rooms: expert card, timers,
 * voice-session switch block, and end action. Upgrade block is omitted.
 *
 * @param props - Timer values.
 * @returns Voice-first sidebar element.
 */
function VoiceFirstSidebar({ elapsedTime = 0, timeLeft = 0 }: LobbyHarnessProps) {
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
        voiceRate={30}
        chatRate={25}
        videoRate={50}
        onSwitchToChat={noop}
        onUpgradeToVideo={noop}
      />
      <div className="mt-auto border-t border-[#f0ebe3] pt-4">
        <EndConsultationAction handleEndChat={noop} />
      </div>
    </aside>
  );
}

/**
 * Voice-first lobby harness: client booked voice directly, expert joining.
 *
 * @returns Lobby harness element.
 */
function LobbyHarness() {
  return (
    <div className="flex h-[720px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec]">
      <VoiceLobby expertData={rahulSharmaExpert} voiceRate={30} onCancel={noop} />
    </div>
  );
}

/**
 * Voice-first live harness: direct entry, empty chat fallback strip.
 *
 * @returns Direct live harness element.
 */
function DirectLiveHarness() {
  return (
    <div className="flex h-[720px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec]">
      <VoiceStage
        phase="live"
        entry="direct"
        expertName={rahulSharmaExpert.name}
        expertAvatar={rahulSharmaExpert.avatar}
        elapsedText="03:12"
        chatRate={25}
        voiceRate={30}
        messages={[]}
        onBackToChat={noop}
        onEndVoice={noop}
        onCancelRequest={noop}
        onExpandChat={noop}
        muted={false}
        onToggleMute={noop}
        speakerMuted={false}
        onToggleSpeaker={noop}
      />
    </div>
  );
}

/**
 * Whole voice-first waiting room: lobby left, voice sidebar right.
 *
 * @returns Whole-room lobby element.
 */
function WholeRoomLobby() {
  const timers = lobbyTimersText({});
  return (
    <div className="relative flex h-[760px] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-2xl">
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <div className="flex h-14 shrink-0 items-center border-b border-[#d3cec6] bg-white px-4">
          <p className="text-sm font-semibold text-[#111111]">Voice consultation</p>
        </div>
        <VoiceLobby expertData={rahulSharmaExpert} voiceRate={30} onCancel={noop} />
      </div>
      <VoiceFirstSidebar elapsedTime={timers.elapsedTime} timeLeft={timers.timeLeft} />
    </div>
  );
}

/**
 * Whole voice-first live room: direct-entry stage left, voice sidebar right.
 *
 * @returns Whole-room direct live element.
 */
function WholeRoomDirectLive() {
  return (
    <div className="relative flex h-[760px] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-2xl">
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <div className="flex h-14 shrink-0 items-center border-b border-[#d3cec6] bg-white px-4">
          <p className="text-sm font-semibold text-[#111111]">Voice consultation</p>
        </div>
        <VoiceStage
          phase="live"
          entry="direct"
          expertName={rahulSharmaExpert.name}
          expertAvatar={rahulSharmaExpert.avatar}
          elapsedText={formatTime(192)}
          chatRate={25}
          voiceRate={30}
          messages={[]}
          onBackToChat={noop}
          onEndVoice={noop}
          onCancelRequest={noop}
          onExpandChat={noop}
          muted={false}
          onToggleMute={noop}
          speakerMuted={false}
          onToggleSpeaker={noop}
        />
      </div>
      <VoiceFirstSidebar elapsedTime={192} timeLeft={1108} />
    </div>
  );
}

const meta: Meta<typeof LobbyHarness> = {
  title: "Chat/Room/VoiceFirst",
  component: LobbyHarness,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof LobbyHarness>;

/** Voice booked directly: waiting room before the expert joins, no chat history. */
export const Lobby: Story = {
  render: () => <LobbyHarness />,
};

/** Expert joined a direct voice booking: voice billing from connection, chat as fallback. */
export const DirectLive: Story = {
  render: () => <DirectLiveHarness />,
};

type RoomStory = StoryObj<typeof WholeRoomLobby>;

/** Full waiting room: lobby plus voice-first sidebar (no upgrade block). */
export const WholeRoomWaiting: RoomStory = {
  render: () => <WholeRoomLobby />,
};

/** Full live room: direct-entry stage plus voice-first sidebar. */
export const WholeRoomLive: RoomStory = {
  render: () => <WholeRoomDirectLive />,
};
