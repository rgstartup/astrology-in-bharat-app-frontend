"use client";

import React, { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ChatIncomingCard } from "./chat-incoming-card";
import { ExpertCallWaitingModal, type ExpertWaitStep } from "@/components/consultation/expert-call-waiting-modal.component";
import type { ChatIncomingPayload } from "@/realtime/types/chat";
import type { ClientIntakeProfile, ExpertSessionKind } from "@/components/consultation/types";

const MOCK_CHAT_REQUEST: ChatIncomingPayload = {
  consultationId: 401,
  expertId: 99,
  clientId: 1042,
  senderType: "client",
  clientName: "Priya Sharma",
  topic: "Career progression and Rahu Mahadasha analysis",
  mode: "chat",
  sessionId: 1,
  timestamp: new Date().toISOString(),
};

const MOCK_VOICE_REQUEST: ChatIncomingPayload = {
  consultationId: 402,
  expertId: 99,
  clientId: 1088,
  senderType: "client",
  clientName: "Rohan Kapoor",
  topic: "Kundli match making & marriage compatibility",
  mode: "voice",
  channelName: "voice-consultation-402",
  token: "mock-voice-token",
  sessionId: 2,
  timestamp: new Date().toISOString(),
};

const MOCK_VIDEO_REQUEST: ChatIncomingPayload = {
  consultationId: 403,
  expertId: 99,
  clientId: 1105,
  senderType: "client",
  clientName: "Ananya Deshmukh",
  topic: "Health transit predictions & gemstone remedy",
  mode: "video",
  channelName: "video-consultation-403",
  token: "mock-video-token",
  sessionId: 3,
  timestamp: new Date().toISOString(),
};

const MOCK_URGENT_REQUEST: ChatIncomingPayload = {
  consultationId: 404,
  expertId: 99,
  clientId: 1099,
  senderType: "client",
  clientName: "Vikram Malhotra",
  topic: "Urgent business partnership decision",
  mode: "voice",
  channelName: "voice-consultation-404",
  token: "mock-voice-token",
  sessionId: 4,
  // 10 seconds remaining on a 120s TTL
  timestamp: new Date(Date.now() - 110 * 1000).toISOString(),
};

const meta: Meta<typeof ChatIncomingCard> = {
  title: "Expert/Realtime/ChatIncomingCard",
  component: ChatIncomingCard,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ChatIncomingCard>;

/**
 * Chat Mode: Compact incoming popup card with message icon and amber styling.
 */
export const ChatRequest: Story = {
  args: {
    request: MOCK_CHAT_REQUEST,
    ttlSec: 120,
    onOpenModal: (id) => console.log("Open modal for consultation:", id),
    onReject: (id) => console.log("Reject consultation:", id),
  },
  render: (args) => (
    <div className="p-8">
      <ChatIncomingCard {...args} />
    </div>
  ),
};

/**
 * Voice Call Mode: Compact incoming popup card with phone icon and emerald styling.
 */
export const VoiceCallRequest: Story = {
  args: {
    request: MOCK_VOICE_REQUEST,
    ttlSec: 120,
    onOpenModal: (id) => console.log("Open modal for consultation:", id),
    onReject: (id) => console.log("Reject consultation:", id),
  },
  render: (args) => (
    <div className="p-8">
      <ChatIncomingCard {...args} />
    </div>
  ),
};

/**
 * Video Call Mode: Compact incoming popup card with video icon and purple styling.
 */
export const VideoCallRequest: Story = {
  args: {
    request: MOCK_VIDEO_REQUEST,
    ttlSec: 120,
    onOpenModal: (id) => console.log("Open modal for consultation:", id),
    onReject: (id) => console.log("Reject consultation:", id),
  },
  render: (args) => (
    <div className="p-8">
      <ChatIncomingCard {...args} />
    </div>
  ),
};

/**
 * Urgent Countdown: Less than 15s remaining, highlighting red pulsing indicator.
 */
export const UrgentCountdown: Story = {
  args: {
    request: MOCK_URGENT_REQUEST,
    ttlSec: 120,
    onOpenModal: (id) => console.log("Open modal for consultation:", id),
    onReject: (id) => console.log("Reject consultation:", id),
  },
  render: (args) => (
    <div className="p-8">
      <ChatIncomingCard {...args} />
    </div>
  ),
};

/**
 * Interactive Full Flow:
 * Shows floating popup cards. Clicking a popup opens ExpertCallWaitingModal.
 * Clicking Accept performs connection countdown and redirects.
 */
export const InteractiveCardToModalFlow: Story = {
  render: () => <InteractiveFlowPreview />,
};

function InteractiveFlowPreview() {
  const [activeModalId, setActiveModalId] = useState<number | null>(null);
  const [requests, setRequests] = useState([
    MOCK_CHAT_REQUEST,
    MOCK_VOICE_REQUEST,
  ]);
  const [step, setStep] = useState<ExpertWaitStep>("mic_access");
  const [micGranted, setMicGranted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const activeRequest = requests.find((r) => r.consultationId === activeModalId);

  const handleOpenModal = (consultationId: number) => {
    setActiveModalId(consultationId);
    const req = requests.find((r) => r.consultationId === consultationId);
    if (req?.mode === "chat") {
      setStep("accept_pending");
    } else {
      setStep(micGranted ? "accept_pending" : "mic_access");
    }
  };

  const handleGrantMic = () => {
    setMicGranted(true);
    setStep("accept_pending");
  };

  const handleAccept = () => {
    setStep("connecting_media");
    setTimeout(() => {
      setStep("ready");
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            setStatusMessage(`Redirected to /dashboard/consultations/${activeModalId}`);
            setActiveModalId(null);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
    }, 1200);
  };

  const handleReject = (id: number) => {
    setRequests((prev) => prev.filter((r) => r.consultationId !== id));
    if (activeModalId === id) {
      setActiveModalId(null);
    }
  };

  const activeKind: ExpertSessionKind = activeRequest?.mode ?? "voice";
  const clientProfile: ClientIntakeProfile = {
    name: activeRequest?.clientName ?? "Devotee",
    topic: activeRequest?.topic ?? undefined,
  };

  return (
    <div className="relative min-h-[500px] w-full max-w-xl rounded-2xl border border-slate-200 bg-slate-50/50 p-6 flex flex-col items-center justify-center">
      {statusMessage && (
        <div className="mb-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs font-semibold text-emerald-800">
          {statusMessage}
        </div>
      )}

      <p className="text-xs font-medium text-slate-500 mb-6">
        Simulated expert workspace: click any incoming popup to review details in the waiting modal.
      </p>

      {/* Floating cards */}
      <div className="flex flex-col gap-3">
        {requests.map((req) => (
          <ChatIncomingCard
            key={req.consultationId}
            request={req}
            onOpenModal={handleOpenModal}
            onReject={handleReject}
          />
        ))}
        {requests.length === 0 && (
          <button
            type="button"
            onClick={() => setRequests([MOCK_CHAT_REQUEST, MOCK_VOICE_REQUEST])}
            className="rounded-xl bg-slate-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-black"
          >
            Reset Requests
          </button>
        )}
      </div>

      {/* Active Modal */}
      {activeRequest && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs"
          onClick={() => setActiveModalId(null)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <ExpertCallWaitingModal
              client={clientProfile}
              kind={activeKind}
              step={step}
              micGranted={micGranted}
              countdown={countdown}
              onGrantMic={handleGrantMic}
              onAccept={handleAccept}
              onDecline={() => handleReject(activeRequest.consultationId)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
