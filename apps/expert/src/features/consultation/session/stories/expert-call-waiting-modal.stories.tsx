"use client";

import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import {
  ExpertCallWaitingModal,
  type ExpertWaitStep,
} from "../components/expert-call-waiting-modal.component";
import type { ClientIntakeProfile, ExpertSessionKind } from  "../types";

const MOCK_CLIENT: ClientIntakeProfile = {
  name: "Aarav Mehta",
  avatar:
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  gender: "Male",
  dateOfBirth: "14 Oct 1996",
  timeOfBirth: "06:45 AM",
  placeOfBirth: "New Delhi, India",
  rashi: "Tula (Libra)",
  nakshatra: "Swati",
  lagna: "Dhanu (Sagittarius)",
  topic: "Career transit & Saturn Mahadasha guidance",
};

interface ExpertModalStoryWrapperProps {
  initialStep?: ExpertWaitStep;
  initialMicGranted?: boolean;
  initialCountdown?: number | null;
  timedOut?: boolean;
  cancelled?: boolean;
  kind?: ExpertSessionKind;
  ratePerMinute?: number;
  client?: ClientIntakeProfile;
}

/**
 * Interactive preview wrapper simulating real expert state transitions.
 */
function ExpertModalStoryWrapper({
  initialStep = "mic_access",
  initialMicGranted = false,
  initialCountdown = null,
  timedOut = false,
  cancelled = false,
  kind = "voice",
  ratePerMinute = 30,
  client = MOCK_CLIENT,
}: ExpertModalStoryWrapperProps) {
  const [step, setStep] = useState<ExpertWaitStep>(initialStep);
  const [micGranted, setMicGranted] = useState(initialMicGranted);
  const [countdown, setCountdown] = useState<number | null>(initialCountdown);
  const [dismissed, setDismissed] = useState(false);
  const [redirectedToRoom, setRedirectedToRoom] = useState(false);

  // Handle countdown progression in interactive stories
  useEffect(() => {
    if (countdown === null || countdown === undefined) return;
    if (countdown <= 0) {
      setRedirectedToRoom(true);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((c) => (c !== null && c > 0 ? c - 1 : 0));
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleGrantMic = () => {
    setMicGranted(true);
    setStep("accept_pending");
  };

  const handleAccept = () => {
    if (kind === "chat") {
      setStep("ready");
      setCountdown(3);
      return;
    }
    setStep("connecting_media");
    setTimeout(() => {
      setStep("ready");
      setCountdown(3);
    }, 1800);
  };

  const handleDecline = () => {
    setDismissed(true);
  };

  const handleReset = () => {
    setDismissed(false);
    setRedirectedToRoom(false);
    setStep(initialStep);
    setMicGranted(initialMicGranted);
    setCountdown(initialCountdown);
  };

  if (dismissed) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-sm font-medium text-slate-500">Call request declined / modal dismissed.</p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-3 cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-black"
        >
          Reset Preview
        </button>
      </div>
    );
  }

  if (redirectedToRoom) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto rounded-3xl border border-emerald-200 bg-emerald-50/50 p-8 shadow-xl">
        <div className="size-12 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-lg mb-3">
          ✓
        </div>
        <h4 className="text-base font-bold text-slate-900">Redirected to Consultation Room</h4>
        <p className="text-xs text-slate-600 mt-1 mb-4">
          SPA navigation initiated: <code className="bg-white px-2 py-0.5 rounded border border-emerald-200 text-emerald-800 font-mono text-[11px]">/dashboard/consultations/101?mode={kind}</code>
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="cursor-pointer rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-black"
        >
          Restart Simulation
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[600px] items-center justify-center bg-slate-100/70 p-4">
      <ExpertCallWaitingModal
        client={client}
        kind={kind}
        step={step}
        micGranted={micGranted}
        countdown={countdown}
        timedOut={timedOut}
        cancelled={cancelled}
        onGrantMic={handleGrantMic}
        onAccept={handleAccept}
        onDecline={handleDecline}
        onClose={handleDecline}
        ratePerMinute={ratePerMinute}
      />
    </div>
  );
}

const meta: Meta<typeof ExpertCallWaitingModal> = {
  title: "Expert/Consultation/ExpertCallWaitingModal",
  component: ExpertCallWaitingModal,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ExpertCallWaitingModal>;

/**
 * Step 1: Expert receives incoming call alert, prompts for microphone permission before intake review.
 */
export const Step1MicAccessPending: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="mic_access"
      initialMicGranted={false}
      kind="voice"
      ratePerMinute={30}
    />
  ),
};

/**
 * Step 2: Microphone granted, astrologer reviews devotee Vedic birth chart details (DOB, TOB, POB, Rashi, Nakshatra) and can Accept or Decline.
 */
export const Step2AcceptPendingWithChart: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="accept_pending"
      initialMicGranted={true}
      kind="voice"
      ratePerMinute={30}
    />
  ),
};

/**
 * Step 3: Astrologer clicked Accept, establishing secure Agora RTC media stream and waiting for devotee media readiness.
 */
export const Step3ConnectingMediaHandshake: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="connecting_media"
      initialMicGranted={true}
      kind="voice"
      ratePerMinute={30}
    />
  ),
};

/**
 * Step 3 Complete: Bilateral Agora handshake complete, 3-second redirect countdown actively ticking.
 */
export const Step3ConnectionReadyCountdown: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="ready"
      initialMicGranted={true}
      initialCountdown={3}
      kind="voice"
      ratePerMinute={30}
    />
  ),
};

/**
 * Full Interactive Simulator: Experience the complete transition sequence from Mic Check -> Kundli Review & Accept -> Media Handshake -> 3s Countdown -> Consultation Room entrance.
 */
export const FullInteractiveHandshakeFlow: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="mic_access"
      initialMicGranted={false}
      kind="voice"
      ratePerMinute={30}
    />
  ),
};

/**
 * Request Timed Out: Devotee request window expired without astrologer action.
 */
export const RequestTimedOut: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="accept_pending"
      timedOut={true}
      kind="voice"
      ratePerMinute={30}
    />
  ),
};

/**
 * Request Cancelled: Devotee cancelled the consultation request before astrologer accepted.
 */
export const RequestCancelledByClient: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="accept_pending"
      cancelled={true}
      kind="voice"
      ratePerMinute={30}
    />
  ),
};

/**
 * Video Consultation Flow: 3-step wait process for a video session with video mode badge and controls.
 */
export const VideoCallFlow: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="accept_pending"
      initialMicGranted={true}
      kind="video"
      ratePerMinute={45}
    />
  ),
};

/**
 * Chat Consultation Flow: 2-step process (mic not required). Astrologer reviews devotee Kundli chart and accepts chat.
 */
export const ChatConsultationFlow: Story = {
  render: () => (
    <ExpertModalStoryWrapper
      initialStep="accept_pending"
      initialMicGranted={true}
      kind="chat"
      ratePerMinute={20}
    />
  ),
};
