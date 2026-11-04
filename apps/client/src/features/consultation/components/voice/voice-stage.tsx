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
  /** Optional className for styling overrides. */
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
 * @returns Ended panel element.
 */
function VoiceEndedPanel() {
  const directVoice = useDirectVoiceContext();
  const switchToVoice = useSwitchToVoiceContext();

  const isDirectVoice = directVoice.isDirectVoice;
  const onMinimizeVoice = isDirectVoice ? directVoice.switchToChat : switchToVoice.minimizeVoice;

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
        onClick={onMinimizeVoice}
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
 * @returns Requesting body element.
 */
function RequestingBody({
  expertName,
  expertAvatar,
  phase,
  elapsedText,
  voiceRate,
  chatRate,
  muted,
  speakerMuted,
}: {
  expertName: string;
  expertAvatar: string | null;
  phase: VoicePhase;
  elapsedText: string;
  voiceRate: number;
  chatRate: number;
  muted: boolean;
  speakerMuted: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceHero
        expertName={expertName}
        expertAvatar={expertAvatar}
        phase={phase}
        elapsedText={elapsedText}
        voiceRate={voiceRate}
      />
      <VoiceControls isRequesting muted={muted} speakerMuted={speakerMuted} />
      <div className="px-4 pb-4 md:px-8">
        <VoiceRateNote chatRate={chatRate} voiceRate={voiceRate} entry="direct" />
      </div>
    </div>
  );
}

/**
 * Live-phase body: hero, controls, rate note, and transcript strip.
 *
 * @returns Live body element.
 */
function LiveBody({
  expertName,
  expertAvatar,
  phase,
  elapsedText,
  voiceRate,
  chatRate,
  messages,
  entry,
  muted,
  speakerMuted,
}: {
  expertName: string;
  expertAvatar: string | null;
  phase: VoicePhase;
  elapsedText: string;
  voiceRate: number;
  chatRate: number;
  messages: ChatMessage[];
  entry: "upgrade" | "direct";
  muted: boolean;
  speakerMuted: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceHero
        expertName={expertName}
        expertAvatar={expertAvatar}
        phase={phase}
        elapsedText={elapsedText}
        voiceRate={voiceRate}
      />
      <VoiceControls muted={muted} speakerMuted={speakerMuted} />
      <div className="px-4 pb-3 md:px-8">
        <VoiceRateNote chatRate={chatRate} voiceRate={voiceRate} entry={entry} />
      </div>
      <VoiceTranscriptStrip messages={messages} entry={entry} />
    </div>
  );
}

/**
 * Ended-phase body: summary panel plus transcript strip.
 *
 * @returns Ended body element.
 */
function EndedBody({
  messages,
  entry,
}: {
  messages: ChatMessage[];
  entry: "upgrade" | "direct";
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
      <VoiceEndedPanel />
      <VoiceTranscriptStrip messages={messages} entry={entry} />
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
 * All callbacks consumed from context based on session mode:
 * - Direct voice (voice-first): uses `useDirectVoiceContext`
 * - Switch-to-voice (chat upgrade): uses `useSwitchToVoiceContext` + `useRoomActions`
 *
 * @returns Voice stage element (all values read from context).
 */
export function VoiceStage({ className }: { className?: string } = {}) {
  const { expertData } = useRoomIdentity();
  const { elapsedTime } = useRoomSession();
  const { chatRate } = useRoomBilling();
  const { messages } = useRoomChat();

  // Detect which voice mode we're in and use the appropriate context
  const directVoice = useDirectVoiceContext();
  const switchToVoice = useSwitchToVoiceContext();

  const isDirectVoice = directVoice.isDirectVoice;
  const voice = switchToVoice.voice;
  const displayVoiceRate = switchToVoice.displayVoiceRate;

  // Use direct-voice context props when in direct voice mode, otherwise switch-to-voice
  const phase = isDirectVoice ? directVoice.directVoice.phase : voice.voicePhase;
  const active = isDirectVoice ? directVoice.directVoice.active : voice.voiceActive;
  const muted = isDirectVoice ? directVoice.directVoice.muted : voice.muted;
  const speakerMuted = isDirectVoice ? directVoice.directVoice.speakerMuted : voice.speakerMuted;
  const voiceRate = displayVoiceRate; // both modes use the same display rate from switch-to-voice context

  const entry = (isDirectVoice ? "direct" : "upgrade") as "direct" | "upgrade";

  if (!active || phase === "requesting" || phase === "connecting") {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", className)}>
        <VoiceSecureStrip />
        <RequestingBody
          expertName={expertData?.name ?? "Expert"}
          expertAvatar={expertData?.avatar ?? null}
          phase={phase}
          elapsedText={formatTime(elapsedTime)}
          voiceRate={voiceRate}
          chatRate={chatRate}
          muted={muted}
          speakerMuted={speakerMuted}
        />
      </div>
    );
  }
  if (phase === "ended") {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", className)}>
        <VoiceSecureStrip />
        <EndedBody messages={messages} entry={entry} />
      </div>
    );
  }
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", className)}>
      <VoiceSecureStrip />
      <LiveBody
        expertName={expertData?.name ?? "Expert"}
        expertAvatar={expertData?.avatar ?? null}
        phase={phase}
        elapsedText={formatTime(elapsedTime)}
        voiceRate={voiceRate}
        chatRate={chatRate}
        messages={messages}
        entry={entry}
        muted={muted}
        speakerMuted={speakerMuted}
      />
    </div>
  );
}