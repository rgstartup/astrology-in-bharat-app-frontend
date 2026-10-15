"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useFormatter } from "next-intl";

export interface GreetingCardProps {
  name?: string;
}

/**
 * Page greeting header for the client dashboard. Sets the time-aware
 * salutation, current date, and intro line above the widgets.
 */
export function GreetingCard({ name }: GreetingCardProps) {
  const currentDateObject = new Date();

  const getGreetingTime = () => {
    const hour = currentDateObject.getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = name || "Seeker";

  const format = useFormatter();
  const currentDate = format.dateTime(currentDateObject, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border border-[#d3cec6] bg-white font-sans text-[11px] font-medium text-[#111111]">
          <Sparkles className="w-3 h-3" />
          <span>Vedic sanctuary</span>
        </span>
        <span className="font-sans text-xs text-[#7b7b78]">
          {currentDate}
        </span>
      </div>

      <h1 className="font-sans text-2xl sm:text-3xl lg:text-4xl text-[#111111] font-medium tracking-tight">
        {getGreetingTime()}, {displayName} 👋
      </h1>
      <p className="font-sans text-xs sm:text-sm text-[#626260] mt-1">
        Welcome to your personal astrology space. Planetary alignments and
        guidance curated for your chart.
      </p>
    </div>
  );
}

export default GreetingCard;
