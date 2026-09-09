"use client";

import React from "react";
import { Sparkles } from "lucide-react";

export interface GreetingCardProps {
  name?: string;
}

export function GreetingCard({ name }: GreetingCardProps) {
  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const displayName = name || "Seeker";

  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex items-center gap-2 mb-1.5">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-100/80 text-amber-900 border border-amber-200">
          <Sparkles className="w-3 h-3 text-amber-600" />
          <span>Vedic Sanctuary</span>
        </span>
        <span className="text-xs text-slate-400 font-medium">
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#301118] font-outfit tracking-tight">
        {getGreetingTime()}, {displayName} 👋
      </h1>
      <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
        Welcome to your personal astrology space. Planetary alignments and guidance curated for your chart.
      </p>
    </div>
  );
};

export default GreetingCard;
