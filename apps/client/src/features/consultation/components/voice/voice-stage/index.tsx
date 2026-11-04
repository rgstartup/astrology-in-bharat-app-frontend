"use client";

import React from "react";
import { cn } from "@repo/design/cn";
import type { VoicePhase } from "../../../types/voice-phase";
import { formatTime } from "../../../utils/format-time";
import { useRoomIdentity } from "../../../providers/room-lifecycle";
import { useRoomSession } from "../../../providers/room-lifecycle";
import { useRoomBilling } from "../../../providers/room-lifecycle";
import { useRoomChat } from "../../../providers/room-chat.provider";
import {
  useVoiceContext,
  type VoiceMode,
} from "../../../providers/voice.provider";
import { VoiceSecureStrip } from "./voice-secure-strip";
import { RequestingBody } from "./requesting-body";
import { EndedBody } from "./ended-body";
import { LiveBody } from "./live-body";

export type VoiceStageProps = {
  /** Optional className for styling overrides. */
  className?: string;
};

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
  const voice = useVoiceContext();

  const phase = voice.phase as VoicePhase;
  const active = voice.active;
  const muted = voice.muted;
  const speakerMuted = voice.speakerMuted;
  const voiceRate = voice.voiceRate;

  const entry: VoiceMode = voice.mode;

  if (!active || phase === "requesting" || phase === "connecting") {
    return (
      <div
        className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", className)}
      >
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
      <div
        className={cn("flex min-h-0 flex-1 flex-col bg-[#f5f1ec]", className)}
      >
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
