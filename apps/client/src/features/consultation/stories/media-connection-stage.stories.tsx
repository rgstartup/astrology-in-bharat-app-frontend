"use client";

import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import type { IExpert } from "@repo/lib";
import { ConsultationSidebar } from "@/features/consultation/components/sidebar";
import { MediaConnectionStage } from "@/features/consultation/components/media-staging";
import type {
  MediaConnectionStep,
  MediaKind,
} from "@/features/consultation/components/media-staging/types/media-connection-types";

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

type MediaStagingHarnessProps = {
  kind: MediaKind;
  step: MediaConnectionStep;
  rate?: number;
};

/**
 * Single-stage harness rendering media connection staging inside a desktop frame.
 *
 * @param props - Media kind and connection step.
 * @returns Stage harness element.
 */
function MediaStagingHarness({
  kind,
  step,
  rate = 30,
}: MediaStagingHarnessProps) {
  return (
    <div className="flex h-[720px] w-full max-w-lg flex-col overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-xl">
      <MediaConnectionStage
        kind={kind}
        step={step}
        expertName={rahulSharmaExpert.name}
        expertAvatar={rahulSharmaExpert.avatar}
        rate={rate}
        onCancel={noop}
        onRetry={noop}
      />
    </div>
  );
}

type WholeRoomMediaStagingProps = {
  kind: MediaKind;
  step: MediaConnectionStep;
};

/**
 * Whole-room view with media staging occupying the major column and consultation sidebar on the right.
 * Proves layout parity and ensures billing timer remains held.
 *
 * @param props - Media kind and connection step.
 * @returns Whole-room media staging harness.
 */
function WholeRoomMediaStaging({ kind, step }: WholeRoomMediaStagingProps) {
  const rate = kind === "video" ? 50 : 30;
  const headerTitle =
    kind === "video" ? "Video consultation" : "Voice consultation";

  return (
    <div className="relative flex h-[760px] w-full max-w-6xl overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-2xl">
      <div className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-[#d3cec6] bg-white px-4">
          <p className="text-sm font-semibold text-[#111111]">{headerTitle}</p>
          <span className="rounded-full bg-[#f5f1ec] px-3 py-1 text-xs font-medium text-[#626260]">
            Timer held
          </span>
        </div>
        <MediaConnectionStage
          kind={kind}
          step={step}
          expertName={rahulSharmaExpert.name}
          expertAvatar={rahulSharmaExpert.avatar}
          rate={rate}
          onCancel={noop}
          onRetry={noop}
        />
      </div>
      <ConsultationSidebar
        expertData={rahulSharmaExpert}
        sessionStatus="active"
        formatTime={formatTime}
        elapsedTime={0}
        timeLeft={900}
        handleEndChat={noop}
        isWarning={false}
        consultationId={null}
      />
    </div>
  );
}

const meta: Meta<typeof MediaStagingHarness> = {
  title: "Chat/Room/MediaStaging",
  component: MediaStagingHarness,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof MediaStagingHarness>;

/** Voice: Token authenticating with edge service. */
export const VoiceTokenConnecting: Story = {
  render: () => (
    <MediaStagingHarness kind="voice" step="token_connecting" rate={30} />
  ),
};

/** Voice: Client audio connected, waiting for expert to connect. */
export const VoiceWaitingForExpert: Story = {
  render: () => (
    <MediaStagingHarness kind="voice" step="peer_waiting" rate={30} />
  ),
};

/** Video: Token authenticating with edge service, local camera ready. */
export const VideoTokenConnecting: Story = {
  render: () => (
    <MediaStagingHarness kind="video" step="token_connecting" rate={50} />
  ),
};

/** Video: Local camera and mic streaming, waiting for expert video track. */
export const VideoWaitingForExpert: Story = {
  render: () => (
    <MediaStagingHarness kind="video" step="peer_waiting" rate={50} />
  ),
};

/** Timeout state when media handshake takes longer than normal (>20s). */
export const ConnectionTimeout: Story = {
  render: () => <MediaStagingHarness kind="voice" step="timeout" rate={30} />,
};

type RoomStory = StoryObj<typeof WholeRoomMediaStaging>;

/** Complete consultation room while waiting for voice connection. */
export const WholeRoomVoiceWaiting: RoomStory = {
  render: () => <WholeRoomMediaStaging kind="voice" step="peer_waiting" />,
};

/** Complete consultation room while waiting for video connection. */
export const WholeRoomVideoWaiting: RoomStory = {
  render: () => <WholeRoomMediaStaging kind="video" step="peer_waiting" />,
};
