"use client";

import { useState } from "react";
import type { Meta, StoryObj } from "@repo/storybook";
import { ConsultationWaitingModal } from "./consultation-waiting-modal.component";
import type { ConsultationMode } from "@/store/consultationPrepStore";
import type { ConsultationWaitStep } from "./consultation-wait-stepper.component";

interface WaitingModalDemoProps {
  expertName: string;
  expertAvatar?: string;
  mode?: ConsultationMode;
  step?: ConsultationWaitStep;
  micGranted?: boolean;
  countdown?: number | null;
  voiceRate?: number;
  rejected?: boolean;
  timedOut?: boolean;
  micDenied?: boolean;
  mediaFailed?: boolean;
  mediaError?: string | null;
}

/**
 * Story demonstration wrapper controlling modal open/closed and mic grant states.
 */
function WaitingModalDemo({
  expertName,
  expertAvatar,
  mode = "chat",
  step = "waiting_acceptance",
  micGranted = false,
  countdown = null,
  voiceRate = 25,
  rejected = false,
  timedOut = false,
  micDenied = false,
  mediaFailed = false,
  mediaError = null,
}: WaitingModalDemoProps) {
  const [open, setOpen] = useState(true);
  const [isMicGranted, setIsMicGranted] = useState(micGranted);

  if (!open) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-sm font-medium text-slate-500">Modal dismissed.</p>
        <button
          type="button"
          onClick={() => {
            setOpen(true);
            setIsMicGranted(micGranted);
          }}
          className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black transition-all cursor-pointer"
        >
          Re-open Modal
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center bg-slate-100/60 p-4">
      <ConsultationWaitingModal
        open={open}
        mode={mode}
        step={step}
        micGranted={isMicGranted}
        onGrantMic={() => setIsMicGranted(true)}
        countdown={countdown}
        voiceRate={voiceRate}
        expertName={expertName}
        expertAvatar={expertAvatar}
        rejected={rejected}
        timedOut={timedOut}
        micDenied={micDenied}
        onRetryMic={() => {
          setIsMicGranted(true);
        }}
        mediaFailed={mediaFailed}
        mediaError={mediaError}
        onRetryMedia={() => {
          setOpen(false);
        }}
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

/**
 * Interactive full simulator executing the entire lifecycle:
 * Step 1 (allow mic) -> Step 2 (waiting acceptance) -> connecting (loading)
 * -> 3s countdown (3->2->1s) -> Room entry.
 */
function InteractiveFullSimulatorDemo() {
  const [open, setOpen] = useState(true);
  const [step, setStep] = useState<ConsultationWaitStep>("mic_access");
  const [micGranted, setMicGranted] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [roomEntered, setRoomEntered] = useState(false);

  function handleGrantMic() {
    setMicGranted(true);
    setTimeout(() => {
      setStep("waiting_acceptance");
      setTimeout(() => {
        setStep("connecting_media");
        setTimeout(() => {
          setStep("ready");
          setCountdown(3);
          const interval = setInterval(() => {
            setCountdown((prev) => {
              if (prev === null || prev <= 1) {
                clearInterval(interval);
                setOpen(false);
                setRoomEntered(true);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }, 1200);
      }, 1500);
    }, 600);
  }

  function handleReset() {
    setRoomEntered(false);
    setOpen(true);
    setStep("mic_access");
    setMicGranted(false);
    setCountdown(null);
  }

  if (roomEntered) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center rounded-2xl bg-white border border-emerald-200 shadow-xl max-w-sm">
        <span className="flex size-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 text-lg font-bold">
          ✓
        </span>
        <h4 className="text-base font-bold text-slate-900">Entered Consultation Room</h4>
        <p className="text-xs text-slate-500 mt-1">
          Handshake complete. Voice session pre-connected via voiceSessionStore.
        </p>
        <button
          type="button"
          onClick={handleReset}
          className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-black transition-all cursor-pointer"
        >
          Re-run Simulator
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[500px] flex items-center justify-center bg-slate-100/60 p-4">
      <ConsultationWaitingModal
        open={open}
        mode="voice"
        step={step}
        micGranted={micGranted}
        onGrantMic={handleGrantMic}
        countdown={countdown}
        voiceRate={30}
        expertName="Dr. Meenakshi Sharma"
        expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
        onCancel={() => setOpen(false)}
        onClose={() => setOpen(false)}
      />
    </div>
  );
}

const meta: Meta<typeof ConsultationWaitingModal> = {
  title: "Consultation / WaitingModal",
  component: ConsultationWaitingModal,
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj<typeof ConsultationWaitingModal>;

/** Chat consultation: single-step wait for expert to accept. */
export const ChatWaitingForAccept: Story = {
  render: () => (
    <WaitingModalDemo
      mode="chat"
      expertName="Pt. Radheshyam Shastri"
      expertAvatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
    />
  ),
};

/** Voice consultation Step 1: User prompted to grant microphone access. */
export const VoiceStep1MicPending: Story = {
  render: () => (
    <WaitingModalDemo
      mode="voice"
      step="mic_access"
      micGranted={false}
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      voiceRate={30}
    />
  ),
};

/** Voice consultation Step 2: Microphone granted, waiting for expert to accept call. */
export const VoiceStep2WaitingExpert: Story = {
  render: () => (
    <WaitingModalDemo
      mode="voice"
      step="waiting_acceptance"
      micGranted={true}
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      voiceRate={30}
    />
  ),
};

/** Voice consultation: Expert accepted call, connecting (loading spinner). */
export const VoiceStep3EstablishingConnection: Story = {
  render: () => (
    <WaitingModalDemo
      mode="voice"
      step="connecting_media"
      micGranted={true}
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      voiceRate={30}
    />
  ),
};

/** Voice consultation: Connection ready, redirecting to room with countdown. */
export const VoiceStep3ConnectionReady: Story = {
  render: () => (
    <WaitingModalDemo
      mode="voice"
      step="ready"
      micGranted={true}
      countdown={3}
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      voiceRate={30}
    />
  ),
};

/** Interactive full simulator: step 1 -> step 2 -> step 3 -> countdown -> room entry. */
export const InteractiveFullSimulator: Story = {
  render: () => <InteractiveFullSimulatorDemo />,
};

/** Failure State: Microphone permission denied by user or browser. */
export const FailureMicPermissionDenied: Story = {
  render: () => (
    <WaitingModalDemo
      mode="voice"
      step="mic_access"
      micDenied={true}
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      voiceRate={30}
    />
  ),
};

/** Failure State: Real-time media connection failed to establish. */
export const FailureMediaConnectionFailed: Story = {
  render: () => (
    <WaitingModalDemo
      mode="voice"
      step="connecting_media"
      mediaFailed={true}
      mediaError="WebRTC peer connection timeout (ICE disconnected)"
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      voiceRate={30}
    />
  ),
};

/** Video consultation Step 1: User prompted to grant microphone & camera. */
export const VideoStep1MicPending: Story = {
  render: () => (
    <WaitingModalDemo
      mode="video"
      step="mic_access"
      micGranted={false}
      expertName="Acharya Devrat"
      expertAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      voiceRate={45}
    />
  ),
};

/** Video consultation Step 2: Waiting for expert to accept video call. */
export const VideoStep2WaitingExpert: Story = {
  render: () => (
    <WaitingModalDemo
      mode="video"
      step="waiting_acceptance"
      micGranted={true}
      expertName="Acharya Devrat"
      expertAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      voiceRate={45}
    />
  ),
};

/** Video consultation Step 3: Expert accepted, establishing video media connection. */
export const VideoStep3EstablishingConnection: Story = {
  render: () => (
    <WaitingModalDemo
      mode="video"
      step="connecting_media"
      micGranted={true}
      expertName="Acharya Devrat"
      expertAvatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
      voiceRate={45}
    />
  ),
};

/** Request explicitly declined by the expert. */
export const ExpertDeclined: Story = {
  render: () => (
    <WaitingModalDemo
      mode="voice"
      expertName="Pt. Radheshyam Shastri"
      expertAvatar="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
      rejected={true}
    />
  ),
};

/** Request timed out with no response from expert. */
export const RequestTimedOut: Story = {
  render: () => (
    <WaitingModalDemo
      mode="video"
      expertName="Dr. Meenakshi Sharma"
      expertAvatar="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80"
      timedOut={true}
    />
  ),
};
