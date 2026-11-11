"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export interface LoginShowcaseCardProps {
  className?: string;
}

/**
 * LoginShowcaseCard component for Expert Login screen.
 * Product-focused card communicating platform functionality:
 * consultation management, real-time sessions, and earnings tracking.
 * Layout mirrors ExpertShowcaseCard with sage illustration placed in between.
 */
export const LoginShowcaseCard: React.FC<LoginShowcaseCardProps> = ({
  className = "",
}) => {
  return (
    <div
      className={`relative w-full max-w-[480px] bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[25px_30px_60px_-12px_rgba(28,25,23,0.35),10px_12px_24px_-6px_rgba(41,37,36,0.25)] overflow-hidden flex flex-col justify-between min-h-[580px] h-full lg:h-auto ${className}`}
    >
      {/* Top Section: Header & Image in Between */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Dark Text on White Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-stone-900 text-xs font-bold shadow-md mb-4 w-fit">
          <Sparkles className="size-3.5 text-amber-700" />
          <span>
            EXPERT <span className="text-amber-800">PORTAL</span>
          </span>
        </div>

        {/* Stark White Bold Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug tracking-tight mb-1 drop-shadow-sm">
          Manage Your Astrology Practice
        </h2>

        {/* High-Contrast Description */}
        <p className="text-xs sm:text-sm font-medium text-amber-100/90 tracking-wide leading-relaxed mt-1">
          Access your expert dashboard to manage consultations, connect with clients, and track your earnings.
        </p>

        {/* Hero Illustration - Centered in Between */}
        <div className="relative z-10 flex items-center justify-center flex-1 min-h-0 py-4 sm:py-6">
          <div className="relative size-44 sm:size-48 lg:size-52 drop-shadow-[0_20px_35px_rgba(0,0,0,0.5)]">
            <Image
              src="/images/Expert.png"
              alt="Expert Community"
              fill
              sizes="(max-width: 640px) 176px, 208px"
              className="object-contain -scale-x-100"
              priority
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Features in Frosted Glass Card */}
      <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-md shrink-0">
        <p className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-3 flex items-center gap-1.5">
          <Sparkles className="size-3 text-amber-300" />
          <span>What You Can Do</span>
        </p>

        <ul className="space-y-2 text-xs font-medium text-white/95 list-disc pl-4 marker:text-amber-400">
          <li className="leading-snug">Manage consultation requests</li>
          <li className="leading-snug">Conduct chat, voice and video sessions</li>
          <li className="leading-snug">Monitor earnings and payouts</li>
        </ul>
      </div>
    </div>
  );
};

export default LoginShowcaseCard;
