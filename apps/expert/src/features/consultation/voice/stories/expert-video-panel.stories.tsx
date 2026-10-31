"use client";

import React from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ExpertVideoPanel } from "../components/expert-video-panel.component";
import type { ClientIntakeProfile, ExpertConsultationMetrics } from  "@/features/consultation/session";

const MOCK_DEVOTEE: ClientIntakeProfile = {
  name: "Pooja Verma",
  avatar:
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  gender: "Female",
  dateOfBirth: "28 Aug 1993",
  timeOfBirth: "11:20 AM",
  placeOfBirth: "Jaipur, Rajasthan",
  rashi: "Vrishabha (Taurus)",
  nakshatra: "Rohini",
  topic: "Kundli matching and marriage compatibility",
  notes: "Seeking detailed planetary analysis for upcoming alliance.",
};

const BASE_METRICS: ExpertConsultationMetrics = {
  elapsedSeconds: 520,
  ratePerMinute: 50,
  totalEarned: 433,
};

function noop() {
  return undefined;
}

function ExpertVideoHarness({
  phase = "live",
  cameraOff = false,
  muted = false,
}: {
  phase?: "incoming" | "connecting" | "live" | "reconnecting" | "ended";
  cameraOff?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="w-full max-w-3xl overflow-hidden rounded-2xl shadow-xl">
      <ExpertVideoPanel
        client={MOCK_DEVOTEE}
        phase={phase}
        metrics={BASE_METRICS}
        expertName="Pandit Rahul Sharma"
        expertAvatar="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80"
        cameraOff={cameraOff}
        muted={muted}
        onEndCall={noop}
      />
    </div>
  );
}

const meta: Meta<typeof ExpertVideoHarness> = {
  title: "Consultation/Expert/VideoPanel",
  component: ExpertVideoHarness,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ExpertVideoHarness>;

/** Live video consultation with devotee viewport, expert PIP, and toolbar. */
export const LiveVideoConsultation: Story = {
  render: () => <ExpertVideoHarness phase="live" cameraOff={false} />,
};

/** Video consultation with expert self-camera muted/disabled. */
export const LiveVideoCameraOff: Story = {
  render: () => <ExpertVideoHarness phase="live" cameraOff={true} />,
};

/** Connecting video track state while WebRTC negotiation settles. */
export const ConnectingVideo: Story = {
  render: () => <ExpertVideoHarness phase="connecting" cameraOff={false} />,
};
