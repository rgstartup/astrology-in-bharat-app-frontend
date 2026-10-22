"use client";

import React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { VoicePhase } from "./voice-phase";
import { getVoicePhaseHelper, getVoicePhaseLabel } from "./voice-phase";

type VoiceHeroProps = {
  expertName: string;
  expertAvatar?: string | null;
  phase: VoicePhase;
  elapsedText: string;
  voiceRate: number;
  className?: string;
};

/**
 * Speaking ripple rings rendered behind the avatar while live.
 *
 * @returns Ripple decoration element.
 */
function LiveRipple() {
  return (
    <span aria-hidden="true" className="absolute inset-0">
      <span className="absolute inset-0 animate-ping rounded-full bg-[#111111]/10" />
      <span className="absolute inset-2 rounded-full border border-[#d3cec6]" />
    </span>
  );
}

/**
 * Dialing ripple shown while requesting or connecting.
 *
 * @returns Dialing decoration element.
 */
function DialingRipple() {
  return (
    <span aria-hidden="true" className="absolute inset-0">
      <span className="absolute inset-0 animate-pulse rounded-full bg-[#f5f1ec]" />
    </span>
  );
}

/**
 * Avatar orb with phase-specific ripple decoration.
 *
 * @param props - Avatar source, phase, and expert name.
 * @returns Avatar orb element.
 */
function HeroOrb({
  expertAvatar,
  expertName,
  phase,
}: Pick<VoiceHeroProps, "expertAvatar" | "expertName" | "phase">) {
  if (phase === "live") {
    return (
      <span className="relative flex size-24 items-center justify-center">
        <LiveRipple />
        <Avatar className="relative size-24 rounded-full border border-[#d3cec6] bg-white">
          <AvatarImage src={expertAvatar ?? undefined} alt={expertName} />
          <AvatarFallback className="bg-white text-[#626260]">
            <User className="size-10" />
          </AvatarFallback>
        </Avatar>
        <span
          aria-label="Voice live"
          className="absolute -right-1 -bottom-1 size-5 rounded-full border-2 border-white bg-[#0bdf50]"
        />
      </span>
    );
  }
  if (phase === "reconnecting") {
    return (
      <span className="relative flex size-24 items-center justify-center">
        <Avatar className="relative size-24 rounded-full border border-[#d3cec6] bg-white opacity-80">
          <AvatarImage src={expertAvatar ?? undefined} alt={expertName} />
          <AvatarFallback className="bg-white text-[#626260]">
            <User className="size-10" />
          </AvatarFallback>
        </Avatar>
        <span
          aria-label="Reconnecting"
          className="absolute -right-1 -bottom-1 size-5 animate-pulse rounded-full border-2 border-white bg-[#c13515]"
        />
      </span>
    );
  }
  return (
    <span className="relative flex size-24 items-center justify-center">
      <DialingRipple />
      <Avatar className="relative size-24 rounded-full border border-[#d3cec6] bg-white">
        <AvatarImage src={expertAvatar ?? undefined} alt={expertName} />
        <AvatarFallback className="bg-white text-[#626260]">
          <User className="size-10" />
        </AvatarFallback>
      </Avatar>
    </span>
  );
}

/**
 * Large-format voice hero: expert orb, phase label, and session timer.
 * Replaces the message list position when the consultation upgrades to voice.
 *
 * @param props - Expert identity, voice phase, elapsed timer text, and rate.
 * @returns Voice hero element.
 */
export function VoiceHero({
  expertName,
  expertAvatar,
  phase,
  elapsedText,
  voiceRate,
  className,
}: VoiceHeroProps) {
  return (
    <div className={cn("flex flex-col items-center gap-3 px-6 pt-8 pb-2 text-center", className)}>
      <HeroOrb expertAvatar={expertAvatar} expertName={expertName} phase={phase} />
      <p className="text-[13px] font-medium text-[#7b7b78]">{getVoicePhaseLabel(phase)}</p>
      <h2 className="font-sans text-[22px] leading-tight font-medium tracking-[-0.3px] text-[#111111]">
        {expertName}
      </h2>
      <p className="font-mono text-3xl font-semibold tracking-tight text-[#111111] tabular-nums">
        {elapsedText}
      </p>
      <p className="rounded-full border border-[#d3cec6] bg-white px-3 py-1 text-xs font-semibold text-[#111111] tabular-nums">
        Voice rate Rs.{voiceRate} per min
      </p>
      <p className="max-w-sm text-[13px] leading-relaxed text-[#626260]">
        {getVoicePhaseHelper(phase)}
      </p>
    </div>
  );
}
