"use client";

import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import type { ChatMessage } from "@/lib/types";
import { ConsultationSidebar } from "@/features/consultation/sidebar";
import { VoiceStage } from "@/features/consultation/voice";
import type { VoicePhase } from "@/features/consultation/voice/types/voice-phase";

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
];

function formatTime(seconds: number): string {
  const mins = Math.floor(Math.abs(seconds) / 60);
  const secs = Math.abs(seconds) % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
}

type StageHarnessProps = {
  phase: VoicePhase;
  elapsedText?: string;
};

function noop() {
  return undefined;
}

/**
 * Single-phase harness rendering the voice stage in a room-sized frame.
 *
 * @param props - Phase and timer text.
 * @returns Stage harness element.
 */
function StageHarness({ phase, elapsedText = "12:34" }: StageHarnessProps) {
  return (
    <div className="flex h-[720px] w-full max-w-md flex-col overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec]">
      <VoiceStage
        phase={phase}
        expertName={rahulSharmaExpert.name}
        expertAvatar={rahulSharmaExpert.avatar}
        elapsedText={elapsedText}
        chatRate={25}
        voiceRate={30}
        messages={PREVIEW_MESSAGES}
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

type WholeRoomVoiceProps = {
  phase: VoicePhase;
};

/**
 * Full two-column room with the voice stage in the major column and the
 * existing sidebar untouched in the minor column.
 *
 * @param props - Voice phase.
 * @returns Whole-room voice element.
 */
function WholeRoomVoice({ phase }: WholeRoomVoiceProps) {
  return (
    <div className="relative flex h-[760px] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-2xl">
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <div className="flex h-14 shrink-0 items-center border-b border-[#d3cec6] bg-white px-4">
          <p className="text-sm font-semibold text-[#111111]">Voice consultation</p>
        </div>
        <VoiceStage
          phase={phase}
          expertName={rahulSharmaExpert.name}
          expertAvatar={rahulSharmaExpert.avatar}
          elapsedText={formatTime(754)}
          chatRate={25}
          voiceRate={30}
          messages={PREVIEW_MESSAGES}
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
      <ConsultationSidebar
        expertData={rahulSharmaExpert}
        sessionStatus="active"
        formatTime={formatTime}
        elapsedTime={754}
        timeLeft={522}
        handleEndChat={noop}
        isWarning={false}
        consultationId={null}
      />
    </div>
  );
}

const meta: Meta<typeof StageHarness> = {
  title: "Chat/Room/VoiceUpgrade",
  component: StageHarness,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof StageHarness>;

/** Dialing state right after confirming the upgrade. Chat is dimmed behind. */
export const Requesting: Story = {
  render: () => <StageHarness phase="requesting" elapsedText="12:34" />,
};

/** Audio channel securing state. */
export const Connecting: Story = {
  render: () => <StageHarness phase="connecting" elapsedText="12:36" />,
};

/** Live voice: orb ripple, timer, controls, rate note, transcript strip. */
export const Live: Story = {
  render: () => <StageHarness phase="live" elapsedText="14:02" />,
};

/** Network drop: timer held, expert avatar dimmed, reconnect affordance. */
export const Reconnecting: Story = {
  render: () => <StageHarness phase="reconnecting" elapsedText="14:20" />,
};

/** Voice ended: return-to-chat panel with transcript intact. */
export const Ended: Story = {
  render: () => <StageHarness phase="ended" elapsedText="16:45" />,
};

type RoomStory = StoryObj<typeof WholeRoomVoice>;

/** Complete room: voice stage left, existing details sidebar right. */
export const WholeRoomVoiceLive: RoomStory = {
  render: () => <WholeRoomVoice phase="live" />,
};

/** Complete room during dialing: cancel path visible, sidebar untouched. */
export const WholeRoomVoiceRequesting: RoomStory = {
  render: () => <WholeRoomVoice phase="requesting" />,
};
