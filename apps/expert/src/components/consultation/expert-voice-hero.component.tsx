"use client";

import React from "react";
import { Sparkles, User, Volume2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { ClientIntakeProfile, ExpertConsultationMetrics, ExpertSessionPhase } from "./types";
import { formatDuration, getExpertPhaseHelper, getExpertPhaseLabel } from "./types";

interface ExpertVoiceHeroProps {
  client: ClientIntakeProfile;
  phase: ExpertSessionPhase;
  metrics: ExpertConsultationMetrics;
  isClientSpeaking?: boolean;
  className?: string;
}

/**
 * Animated ripple ring behind devotee avatar when session is live and active.
 */
function LiveRipple({ isSpeaking }: { isSpeaking?: boolean }) {
  return (
    <span aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <span
        className={cn(
          "absolute inset-0 rounded-full bg-[#111111]/10 transition-all",
          isSpeaking ? "animate-ping opacity-75" : "opacity-25"
        )}
      />
      <span className="absolute inset-2 rounded-full border border-[#d3cec6]" />
    </span>
  );
}

/**
 * Pulsing ripple during connecting / incoming phase.
 */
function CallingRipple() {
  return (
    <span aria-hidden="true" className="absolute inset-0 pointer-events-none">
      <span className="absolute inset-0 animate-pulse rounded-full bg-[#f0ebe3]" />
      <span className="absolute -inset-2 animate-ping rounded-full bg-emerald-500/10 opacity-60" />
    </span>
  );
}

/**
 * Avatar Orb for the devotee on the Expert screen.
 */
function DevoteeOrb({
  client,
  phase,
  isSpeaking,
}: {
  client: ClientIntakeProfile;
  phase: ExpertSessionPhase;
  isSpeaking?: boolean;
}) {
  if (phase === "live") {
    return (
      <span className="relative flex size-28 items-center justify-center">
        <LiveRipple isSpeaking={isSpeaking} />
        <Avatar className="relative size-24 rounded-full border-2 border-white bg-white shadow-sm">
          <AvatarImage src={client.avatar || undefined} alt={client.name} />
          <AvatarFallback className="bg-[#ebe7e1] text-base font-bold text-[#111111]">
            {client.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span
          aria-label="Audio live"
          className="absolute right-1 bottom-1 flex size-6 items-center justify-center rounded-full border-2 border-white bg-[#0bdf50] shadow-xs"
        >
          {isSpeaking ? (
            <Volume2 className="size-3.5 text-white animate-pulse" />
          ) : (
            <span className="size-2 rounded-full bg-white" />
          )}
        </span>
      </span>
    );
  }

  if (phase === "reconnecting") {
    return (
      <span className="relative flex size-28 items-center justify-center">
        <Avatar className="relative size-24 rounded-full border-2 border-white bg-white opacity-70">
          <AvatarImage src={client.avatar || undefined} alt={client.name} />
          <AvatarFallback className="bg-[#ebe7e1] text-base font-bold text-[#111111]">
            {client.name.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <span
          aria-label="Reconnecting"
          className="absolute right-1 bottom-1 size-5 animate-pulse rounded-full border-2 border-white bg-[#c13515]"
        />
      </span>
    );
  }

  return (
    <span className="relative flex size-28 items-center justify-center">
      <CallingRipple />
      <Avatar className="relative size-24 rounded-full border-2 border-white bg-white shadow-sm">
        <AvatarImage src={client.avatar || undefined} alt={client.name} />
        <AvatarFallback className="bg-[#ebe7e1] text-base font-bold text-[#111111]">
          {client.name.slice(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </span>
  );
}

/**
 * Large voice hero for the expert view: devotee avatar, astrology chips,
 * consultation timer, and expert earnings metrics.
 */
export function ExpertVoiceHero({
  client,
  phase,
  metrics,
  isClientSpeaking,
  className,
}: ExpertVoiceHeroProps) {
  const elapsedText = formatDuration(metrics.elapsedSeconds);
  const accruedEarnings =
    metrics.totalEarned ??
    Math.round((metrics.elapsedSeconds / 60) * metrics.ratePerMinute);

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 pt-8 pb-4 text-center",
        className
      )}
    >
      <DevoteeOrb client={client} phase={phase} isSpeaking={isClientSpeaking} />

      {/* Phase Label */}
      <p className="text-xs font-semibold uppercase tracking-wider text-[#7b7b78]">
        {getExpertPhaseLabel(phase, "voice")}
      </p>

      {/* Devotee Name & Astrological Identity */}
      <div className="flex flex-col items-center gap-1">
        <h2 className="font-sans text-2xl font-bold tracking-tight text-[#111111]">
          {client.name}
        </h2>
        {(client.rashi || client.nakshatra) && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[#d3cec6] bg-white px-2.5 py-0.5 text-[11px] font-medium text-[#626260]">
            <Sparkles className="size-3 text-[#c13515]" />
            <span>
              {client.rashi ? `${client.rashi} Rashi` : ""}
              {client.rashi && client.nakshatra ? " · " : ""}
              {client.nakshatra ? `${client.nakshatra}` : ""}
            </span>
          </span>
        )}
      </div>

      {/* Prominent Session Timer */}
      <div className="flex flex-col items-center gap-1 pt-1">
        <p className="font-mono text-3xl font-extrabold tracking-tight text-[#111111] tabular-nums">
          {elapsedText}
        </p>
        {metrics.remainingSeconds !== undefined && metrics.remainingSeconds > 0 && (
          <span className="text-[11px] font-medium text-[#7b7b78] tabular-nums">
            {formatDuration(metrics.remainingSeconds)} prepaid time left
          </span>
        )}
      </div>

      {/* Expert Financial Earning Badge */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="rounded-full border border-[#d3cec6] bg-white px-3.5 py-1 text-xs font-semibold text-[#111111] tabular-nums shadow-2xs">
          ₹{metrics.ratePerMinute}/min rate
        </span>
        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3.5 py-1 text-xs font-semibold text-emerald-800 tabular-nums">
          Earned: ₹{accruedEarnings}
        </span>
        {metrics.isFree && (
          <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-900">
            Free 5m Trial
          </span>
        )}
      </div>

      {/* State Descriptor */}
      <p className="max-w-md text-xs leading-relaxed text-[#626260] pt-1">
        {getExpertPhaseHelper(phase, "voice")}
      </p>
    </div>
  );
}
