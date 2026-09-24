"use client";

import React from "react";
import { Sparkles } from "lucide-react";
import { useFormatter } from "next-intl";

export interface GreetingCardProps {
  name?: string;
}

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
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-200/70">
          <Sparkles className="w-3 h-3" />
          <span>Vedic Sanctuary</span>
        </span>
        <span className="text-xs text-amber-800 font-medium">
          {currentDate}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl text-slate-700 font-outfit tracking-tight">
        {getGreetingTime()},{" "}
        <span className="text-orange-500">{displayName}</span> 👋
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
        Welcome to your personal astrology space. Planetary alignments and
        guidance curated for your chart.
      </p>
    </div>
  );
}

export default GreetingCard;
