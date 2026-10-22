"use client";

import React from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";

type VoiceRateNoteProps = {
  chatRate: number;
  voiceRate: number;
  /** Direct voice bills at the voice rate from join; upgrade switches mid-session. */
  entry?: "upgrade" | "direct";
  className?: string;
};

/**
 * Direct-entry billing copy.
 *
 * @param props - Voice rate.
 * @returns Direct billing element.
 */
function DirectRateCopy({ voiceRate }: { voiceRate: number }) {
  return (
    <p className="text-[13px] leading-relaxed text-[#626260]">
      <span className="font-medium text-[#111111]">Voice billed from connection. </span>
      This session runs at Rs.{voiceRate} per min from the moment the expert joins. Chat
      stays free for sharing details.
    </p>
  );
}

/**
 * Upgrade-entry billing copy.
 *
 * @param props - Chat and voice rates.
 * @returns Upgrade billing element.
 */
function UpgradeRateCopy({ chatRate, voiceRate }: { chatRate: number; voiceRate: number }) {
  return (
    <p className="text-[13px] leading-relaxed text-[#626260]">
      <span className="font-medium text-[#111111]">Billing continues seamlessly. </span>
      Chat was Rs.{chatRate} per min. Voice is Rs.{voiceRate} per min from the moment the
      expert answers. Your remaining time updates automatically.
    </p>
  );
}

/**
 * Rate note body with waterfall branch on entry path.
 *
 * @param props - Rates and entry path.
 * @returns Rate body element.
 */
function RateNoteBody({
  chatRate,
  voiceRate,
  entry,
}: {
  chatRate: number;
  voiceRate: number;
  entry: "upgrade" | "direct";
}) {
  if (entry === "direct") return <DirectRateCopy voiceRate={voiceRate} />;
  return <UpgradeRateCopy chatRate={chatRate} voiceRate={voiceRate} />;
}

/**
 * Billing-continuity note shown under voice controls.
 * States the rate switch plainly so the timer change never surprises.
 *
 * @param props - Chat and voice per-minute rates.
 * @returns Rate note element.
 */
export function VoiceRateNote({ chatRate, voiceRate, entry = "upgrade", className }: VoiceRateNoteProps) {
  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-2xl items-start gap-2 rounded-xl border border-[#d3cec6] bg-white p-3",
        className,
      )}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-[#7b7b78]" />
      <RateNoteBody chatRate={chatRate} voiceRate={voiceRate} entry={entry} />
    </div>
  );
}
