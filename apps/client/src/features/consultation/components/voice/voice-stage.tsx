"use client";

import React from "react";
import { Phone } from "@repo/design/lucide";
import { cn } from "@repo/design/cn";
import type { ChatMessage } from "@/lib/types";
import type { VoicePhase } from "../../types/voice-phase";
import { VoiceHero } from "./voice-hero";
import { VoiceControls } from "./voice-controls";
import { VoiceTranscriptStrip } from "./voice-transcript-strip";
import { VoiceRateNote } from "./voice-rate-note";
import { formatTime } from "../../utils/format-time";
import { useRoomIdentity } from "../../providers/room-lifecycle";
import { useRoomSession } from "../../providers/room-lifecycle";
import { useRoomBilling } from "../../providers/room-lifecycle";
import { useRoomChat } from "../../providers/room-chat.provider";
import { useSwitchToVoiceContext } from "../../providers/switch-to-voice.provider";
import { useDirectVoiceContext } from "../../providers/direct-voice.provider";

export type VoiceStageProps = {
  phase: VoicePhase;
  expertName: string;
  expertAvatar?: string | null;
  elapsedText: string;
  chatRate: number;
  voiceRate: number;
  messages: ChatMessage[];
  /** Upgrade preserves chat history; direct starts voice-first with chat as fallback. */
  entry?: "upgrade" | "direct";
  onBackToChat: () => void;
  onEndVoice: () => void;
  onCancelRequest: () => void;
  onExpandChat: () => void;
  /** Mute state owned by the RTC session. */
  muted: boolean;
  onToggleMute: () => void;
  /** Speaker state owned by the RTC session. */
  speakerMuted: boolean;
  onToggleSpeaker: () => void;
  className?: string;
};

/**
 * Secure-strip line shown above the voice stage.
 *
 * @returns Secure strip element.
 */
function VoiceSecureStrip() {
  return (
    <div className="flex items-center justify-center gap-1.5 border-b border-[#d3cec6] bg-white px-4 py-2">
      <span className="size-2 rounded-full bg-[#0bdf50]" />
      <Phone className="size-3 text-[#7b7b78]" />
      <span className="text-xs font-medium text-[#626260]">
        Voice secured end to end
      </span>
    </div>
  );
}

/**
 * Ended-phase panel shown after voice finishes.
 *
 * @param props - Back-to-chat handler.
 * @returns Ended panel element.
 */
function VoiceEndedPanel({ onBackToChat }: { onBackToChat: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-6 text-center">
      <p className="font-sans text-base font-medium text-[#111111]">
        Voice session ended
      </p>
      <p className="max-w-sm text-[13px] text-[#626260]">
        Your chat history and remaining time are intact. Continue in chat
        whenever ready.
      </p>
      <button
        type="button"
        onClick={onBackToChat}
        className="mt-1 h-12 rounded-full bg-[#111111] px-7 text-base font-medium text-white hover:bg-black"
      >
        Return to chat
      </button>
    </div>
  );
}

/**
 * Requesting-phase body: hero plus cancel-oriented controls.
 *
 * @param props - Full stage props.
 * @returns Requesting body element.
 */
function RequestingBody(props: VoiceStageProps) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceHero
        expertName={props.expertName}
        expertAvatar={props.expertAvatar}
        phase={props.phase}
        elapsedText={props.elapsedText}
        voiceRate={props.voiceRate}
      />
      <VoiceControls
        isRequesting
        onBackToChat={props.onBackToChat}
        onEndVoice={props.onEndVoice}
        onCancelRequest={props.onCancelRequest}
        muted={props.muted}
        onToggleMute={props.onToggleMute}
        speakerMuted={props.speakerMuted}
        onToggleSpeaker={props.onToggleSpeaker}
      />
      <div className="px-4 pb-4 md:px-8">
        <VoiceRateNote chatRate={props.chatRate} voiceRate={props.voiceRate} />
      </div>
    </div>
  );
}

/**
 * Live-phase body: hero, controls, rate note, and transcript strip.
 *
 * @param props - Full stage props.
 * @returns Live body element.
 */
function LiveBody(props: VoiceStageProps) {
  const entry = props.entry ?? "upgrade";
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceHero
        expertName={props.expertName}
        expertAvatar={props.expertAvatar}
        phase={props.phase}
        elapsedText={props.elapsedText}
        voiceRate={props.voiceRate}
      />
      <VoiceControls
        onBackToChat={props.onBackToChat}
        onEndVoice={props.onEndVoice}
        muted={props.muted}
        onToggleMute={props.onToggleMute}
        speakerMuted={props.speakerMuted}
        onToggleSpeaker={props.onToggleSpeaker}
      />
      <div className="px-4 pb-3 md:px-8">
        <VoiceRateNote
          chatRate={props.chatRate}
          voiceRate={props.voiceRate}
          entry={entry}
        />
      </div>
      <VoiceTranscriptStrip
        messages={props.messages}
        onExpandChat={props.onExpandChat}
        entry={entry}
      />
    </div>
  );
}

/**
 * Ended-phase body: summary panel plus transcript strip.
 *
 * @param props - Full stage props.
 * @returns Ended body element.
 */
function EndedBody(props: VoiceStageProps) {
  const entry = props.entry ?? "upgrade";
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceEndedPanel onBackToChat={props.onBackToChat} />
      <VoiceTranscriptStrip
        messages={props.messages}
        onExpandChat={props.onExpandChat}
        entry={entry}
      />
    </div>
  );
}

/**
 * Voice upgrade stage. Occupies the 75% major column in place of the
 * message list once the user confirms "Upgrade to voice".
 *
 * Layout contract:
 * - Hero (orb + timer + rate pill) replaces the scrollable message area.
 * - Controls stay thumb-reachable in a fixed cluster under the hero.
 * - Chat survives as a collapsed transcript strip, never unmounted.
 * - Right sidebar (timers, expert card, end action) is untouched; only
 *   its mode + upgrade sections flip to voice-active variants.
 *
 * @returns Voice stage element (all values read from context).
 */
export function VoiceStage({ className }: { className?: string } = {}) {
  const { expertData } = useRoomIdentity();
  const { elapsedTime } = useRoomSession();
  const { chatRate } = useRoomBilling();
  const { messages } = useRoomChat();

  // Detect which voice mode we're in and use the appropriate context
  let isDirectVoice = false;
  let directVoice: ReturnType<typeof import("../../hooks/use-direct-voice").useDirectVoice> | null = null;
  let openVoiceCancel: (() => void) | undefined;

  try {
    const ctx = useDirectVoiceContext();
    isDirectVoice = ctx.isDirectVoice;
    directVoice = ctx.directVoice;
    openVoiceCancel = ctx.openVoiceCancel;
  } catch {
    // Direct voice provider not active — switch-to-voice mode.
  }

  const { voice, displayVoiceRate } = useSwitchToVoiceContext();

  // Use direct-voice context props when in direct voice mode, otherwise switch-to-voice
  const phase = isDirectVoice && directVoice ? directVoice.phase : voice.voicePhase;
  const active = isDirectVoice && directVoice ? directVoice.active : voice.voiceActive;
  const backToChat = isDirectVoice && directVoice
    ? () => void directVoice.switchToChat()
    : voice.backToChat;
  const cancelVoice = isDirectVoice && directVoice ? directVoice.cancelVoice : voice.cancelVoice;
  const endVoice = openVoiceCancel ?? cancelVoice;
  const muted = isDirectVoice && directVoice ? directVoice.muted : voice.muted;
  const speakerMuted = isDirectVoice && directVoice ? directVoice.speakerMuted : voice.speakerMuted;
  const toggleMute = isDirectVoice && directVoice
    ? () => void directVoice.toggleMic()
    : () => void voice.toggleMic();
  const toggleSpeaker = isDirectVoice && directVoice
    ? () => void directVoice.toggleSpeaker()
    : () => void voice.toggleSpeaker();
  const voiceRate = isDirectVoice && directVoice
    ? displayVoiceRate // direct voice uses the same display rate from switch-to-voice context
    : displayVoiceRate;

  const props: VoiceStageProps = {
    phase,
    expertName: expertData?.name ?? "Expert",
    expertAvatar: expertData?.avatar ?? null,
    elapsedText: formatTime(elapsedTime),
    chatRate,
    voiceRate,
    messages,
    entry: isDirectVoice ? "direct" : "upgrade",
    onBackToChat: backToChat,
    onEndVoice: endVoice,
    onCancelRequest: cancelVoice,
    onExpandChat: backToChat,
    muted,
    onToggleMute: toggleMute,
    speakerMuted,
    onToggleSpeaker: toggleSpeaker,
    className,
  };

  if (props.phase === "requesting" || props.phase === "connecting") {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-[#f5f1ec]",
          props.className,
        )}
      >
        <VoiceSecureStrip />
        <RequestingBody {...props} />
      </div>
    );
  }
  if (props.phase === "ended") {
    return (
      <div
        className={cn(
          "flex min-h-0 flex-1 flex-col bg-[#f5f1ec]",
          props.className,
        )}
      >
        <VoiceSecureStrip />
        <EndedBody {...props} />
      </div>
    );
  }
  return (
    <div
      className={cn(
        "flex min-h-0 flex-1 flex-col bg-[#f5f1ec]",
        props.className,
      )}
    >
      <VoiceSecureStrip />
      <LiveBody {...props} />
    </div>
  );
}
