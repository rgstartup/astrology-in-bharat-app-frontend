"use client";

import React from "react";
import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/lib/types";
import type { VoicePhase } from "../types/voice-phase";
import { VoiceHero } from "./voice-hero";
import { VoiceControls } from "./voice-controls";
import { VoiceTranscriptStrip } from "./voice-transcript-strip";
import { VoiceRateNote } from "./voice-rate-note";

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
      <span className="text-xs font-medium text-[#626260]">Voice secured end to end</span>
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
      <p className="font-sans text-base font-medium text-[#111111]">Voice session ended</p>
      <p className="max-w-sm text-[13px] text-[#626260]">
        Your chat history and remaining time are intact. Continue in chat whenever ready.
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
        <VoiceRateNote chatRate={props.chatRate} voiceRate={props.voiceRate} entry={entry} />
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
 * @param props - Phase, expert identity, billing, transcript, and callbacks.
 * @returns Voice stage element.
 */
export function VoiceStage(props: VoiceStageProps) {
  if (props.phase === "requesting" || props.phase === "connecting") {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", props.className)}>
        <VoiceSecureStrip />
        <RequestingBody {...props} />
      </div>
    );
  }
  if (props.phase === "ended") {
    return (
      <div className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", props.className)}>
        <VoiceSecureStrip />
        <EndedBody {...props} />
      </div>
    );
  }
  return (
    <div className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", props.className)}>
      <VoiceSecureStrip />
      <LiveBody {...props} />
    </div>
  );
}
