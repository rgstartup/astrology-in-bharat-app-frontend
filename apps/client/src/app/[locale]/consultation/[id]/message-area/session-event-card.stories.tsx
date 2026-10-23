"use client";

import type { Meta, StoryObj } from "@repo/storybook";
import SessionEventCard from "./session-event-card.component";
import type { SessionMeta } from "./timeline";

const meta: Meta<typeof SessionEventCard> = {
  title: "Chat/Room/SessionEventCard",
  component: SessionEventCard,
  parameters: { layout: "centered", backgrounds: { default: "Intercom canvas" } },
  decorators: [
    (Story) => (
      <div className="w-[460px] bg-[#f5f1ec] p-6">
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SessionEventCard>;

function event(overrides: Partial<SessionMeta>): SessionMeta {
  return {
    sessionId: "1",
    mode: "AUDIO_CALL",
    status: "completed",
    startedAt: "2026-10-13T10:00:00.000Z",
    endedAt: "2026-10-13T10:14:20.000Z",
    ...overrides,
  };
}

export const VoiceCallCompleted: Story = {
  args: { event: event({}), mounted: true },
};

export const VideoCallCompleted: Story = {
  args: {
    event: event({
      mode: "VIDEO_CALL",
      startedAt: "2026-10-13T10:30:00.000Z",
      endedAt: "2026-10-13T10:55:00.000Z",
    }),
    mounted: true,
  },
};

export const VoiceSwitchedToChat: Story = {
  args: {
    event: event({
      endedAt: "2026-10-13T10:08:00.000Z",
      nextMode: "CHAT",
    }),
    mounted: true,
  },
};

export const VideoSwitchedToChat: Story = {
  args: {
    event: event({
      mode: "VIDEO_CALL",
      startedAt: "2026-10-13T11:00:00.000Z",
      endedAt: "2026-10-13T11:15:00.000Z",
      nextMode: "CHAT",
    }),
    mounted: true,
  },
};

export const CallDisconnectedUnexpectedly: Story = {
  args: {
    event: event({
      startedAt: "2026-10-13T10:00:00.000Z",
      endedAt: "2026-10-13T10:00:45.000Z",
    }),
    mounted: true,
  },
};

export const CallReconnected: Story = {
  args: {
    event: event({
      status: "active",
      previousMode: "AUDIO_CALL",
      endedAt: null,
    }),
    mounted: true,
  },
};

export const CallNotAnswered: Story = {
  args: {
    event: event({
      status: "expired",
      startedAt: null,
      endedAt: "2026-10-13T10:02:00.000Z",
    }),
    mounted: true,
  },
};

export const CallCancelled: Story = {
  args: {
    event: event({
      status: "cancelled",
      startedAt: null,
      endedAt: "2026-10-13T09:58:00.000Z",
    }),
    mounted: true,
  },
};

export const ActiveCallInProgress: Story = {
  args: {
    event: event({
      status: "active",
      endedAt: null,
    }),
    mounted: true,
  },
};
