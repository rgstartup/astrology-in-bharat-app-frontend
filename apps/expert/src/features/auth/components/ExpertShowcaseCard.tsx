"use client";

import React from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";

export interface ExpertShowcaseCardProps {
  /** Optional badge text displayed above the welcome headline */
  badgeText?: string;
  /** Main welcome headline */
  title?: string;
  /** Subtitle or introductory description */
  subtitle?: string;
  /** Bottom welcome message text */
  welcomeNote?: string;
  /** Optional additional class names */
  className?: string;
}

/**
 * ExpertShowcaseCard component for Expert Authentication screens.
 * Features a deep dark amber-orange gradient background,
 * high-contrast dark and stark white typography, hero expert artwork,
 * and minimalist onboarding steps guide.
 *
 * @param props - Component configuration options
 * @returns React showcase card element
 */
export const ExpertShowcaseCard: React.FC<ExpertShowcaseCardProps> = ({
  badgeText = "Verified Expert Network",
  title = "Welcome to",
  subtitle = "Astrology in Bharat",
  welcomeNote = "A dedicated sanctuary for certified astrologers, numerologists, and spiritual guides to connect with seekers worldwide.",
  className = "",
}) => {
  return (
    <div
      className={`relative w-full max-w-[480px] bg-gradient-to-br from-amber-600 via-amber-700 to-amber-950 text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-[25px_30px_60px_-12px_rgba(28,25,23,0.35),10px_12px_24px_-6px_rgba(41,37,36,0.25)] overflow-hidden flex flex-col justify-between min-h-[580px] h-full lg:h-auto ${className}`}
    >
      {/* Welcome Message Section */}
      <div className="relative z-10 flex-1 flex flex-col">
        {/* Dark Text on White Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-stone-900 text-xs font-bold shadow-md mb-4 w-fit">
          <Sparkles className="size-3.5 text-amber-700" />
          <span>
            Verified <span className="text-amber-800">Expert Network</span>
          </span>
        </div>

        {/* Stark White Bold Heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug tracking-tight mb-1 drop-shadow-sm">
          {title}{" "}
          <span className="text-white font-extrabold underline decoration-amber-400/80 decoration-2 underline-offset-4">
            Expert Portal
          </span>
        </h2>

        {/* High-Contrast Subtitle Badge */}
        <p className="text-xs sm:text-sm font-bold text-amber-200 tracking-wide leading-relaxed mt-1">
          {subtitle}
        </p>

        {/* Hero Illustration - centered vertically in available space */}
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

      {/* Bottom: High-Contrast Minimalist Steps Guide */}
      <div className="relative z-10 p-4 sm:p-5 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 shadow-md shrink-0">
        <p className="text-[10px] uppercase tracking-wider font-bold text-amber-300 mb-3 flex items-center gap-1.5">
          <Sparkles className="size-3 text-amber-300" />
          <span>How to Get Started</span>
        </p>

        <ul className="space-y-2 text-xs font-medium text-white/95 list-disc pl-4 marker:text-amber-400">
          <li className="leading-snug">
            <span className="font-bold text-white">Register</span> — Create account & verify email
          </li>
          <li className="leading-snug">
            <span className="font-bold text-white">Complete profile</span> — Onboard skills, bio & services
          </li>
          <li className="leading-snug">
            <span className="font-bold text-white">Add bank details</span> — Enable direct & secure payouts
          </li>
        </ul>
      </div>
    </div>
  );
};

export default ExpertShowcaseCard;
