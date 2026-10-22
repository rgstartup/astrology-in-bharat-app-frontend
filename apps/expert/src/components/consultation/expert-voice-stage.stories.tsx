"use client";

import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ExpertVoiceStage } from "./expert-voice-stage.component";
import type { ClientIntakeProfile, ExpertConsultationMetrics } from "./types";

/** Wireframe devotee seeking career and marital astrological guidance */
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
  notes: "Devotee considering career shift from finance to technology startup.",
};

const BASE_METRICS: ExpertConsultationMetrics = {
  elapsedSeconds: 842,
  remainingSeconds: 658,
  ratePerMinute: 30,
  isFree: false,
  totalEarned: 420,
};

function noop() {
  return undefined;
}

/**
 * Stage container simulating the expert dashboard consultation viewport.
 */
function ExpertVoiceStageHarness({
  phase = "live",
  isClientSpeaking = false,
  metrics = BASE_METRICS,
}: {
  phase?: "incoming" | "connecting" | "live" | "reconnecting" | "ended";
  isClientSpeaking?: boolean;
  metrics?: ExpertConsultationMetrics;
}) {
  return (
    <div className="flex h-[740px] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[#d3cec6] bg-[#f5f1ec] shadow-xl">
      <ExpertVoiceStage
        client={MOCK_DEVOTEE}
        phase={phase}
        metrics={metrics}
        isClientSpeaking={isClientSpeaking}
        onAccept={noop}
        onDecline={noop}
        onEndCall={noop}
        onSwitchToChat={noop}
        onReturnToDashboard={noop}
      />
    </div>
  );
}

const meta: Meta<typeof ExpertVoiceStageHarness> = {
  title: "Consultation/Expert/VoiceStage",
  component: ExpertVoiceStageHarness,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ExpertVoiceStageHarness>;

/** Incoming consultation request from devotee with Accept / Decline controls. */
export const IncomingVoiceCall: Story = {
  render: () => (
    <ExpertVoiceStageHarness
      phase="incoming"
      metrics={{ ...BASE_METRICS, elapsedSeconds: 0, totalEarned: 0 }}
    />
  ),
};

/** WebRTC audio channel securing state. */
export const ConnectingAudio: Story = {
  render: () => (
    <ExpertVoiceStageHarness
      phase="connecting"
      metrics={{ ...BASE_METRICS, elapsedSeconds: 0, totalEarned: 0 }}
    />
  ),
};

/** Live voice session with active timer, per-minute billing, and speaking rings. */
export const LiveVoiceSession: Story = {
  render: () => (
    <ExpertVoiceStageHarness
      phase="live"
      isClientSpeaking={true}
      metrics={BASE_METRICS}
    />
  ),
};

/** Network instability state holding session timer and alerting expert. */
export const ReconnectingVoice: Story = {
  render: () => (
    <ExpertVoiceStageHarness
      phase="reconnecting"
      metrics={{ ...BASE_METRICS, elapsedSeconds: 842 }}
    />
  ),
};

/** Completed consultation with earnings, platform fee, and net payout summary. */
export const ConsultationEndedSummary: Story = {
  render: () => (
    <ExpertVoiceStageHarness
      phase="ended"
      metrics={{
        elapsedSeconds: 1200,
        ratePerMinute: 30,
        totalEarned: 600,
      }}
    />
  ),
};
