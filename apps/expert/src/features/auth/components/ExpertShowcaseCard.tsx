"use client";

import React from "react";
import Image from "next/image";
import { Sparkles, Users, Clock } from "lucide-react";

/**
 * ExpertShowcaseCard component for Expert Login.
 * Amber gradient matching primary CTA with subtle glass blur,
 * hero expert artwork, and key platform trust metrics.
 */
export const ExpertShowcaseCard: React.FC = () => {
  return (
    <div className="relative w-full max-w-[480px] bg-gradient-to-br from-amber-600/90 via-amber-600/85 to-amber-700/90 backdrop-blur-[3px] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-7 border border-white/20 shadow-xl overflow-hidden flex flex-col justify-between h-full gap-4">
      {/* Subtle Glowing Ambience */}
      <div className="absolute -top-24 -right-24 size-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 size-72 bg-amber-950/30 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="relative z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/75 backdrop-blur-md border border-white/60 text-stone-700 text-xs font-semibold shadow-2xs mb-2.5">
          <Sparkles className="size-3.5 text-amber-600" />
          <span>Bharat&apos;s Verified Expert Network</span>
        </div>

        <h2 className="text-lg sm:text-xl font-bold text-white leading-snug tracking-tight mb-1.5">
          Empower Seekers with Your Cosmic Wisdom
        </h2>

        <p className="text-amber-50/85 text-xs leading-relaxed">
          Connect with thousands of devotees globally. Conduct instant voice, chat,
          and remedial consultations with guaranteed on-time payouts.
        </p>
      </div>

      {/* Hero Illustration directly beneath top section */}
      <div className="relative z-10 mt-1 mb-2 py-1 flex items-center justify-center">
        <div className="relative size-44 sm:size-48 lg:size-52 drop-shadow-[0_15px_20px_rgba(0,0,0,0.22)]">
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

      {/* Bottom: Trust Metrics Grid */}
      <div className="relative z-10 grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-center">
        <div>
          <div className="flex items-center justify-center gap-1 text-amber-200 mb-0.5">
            <Users className="size-3.5" />
            <p className="text-sm sm:text-base font-bold text-white leading-tight">
              500+
            </p>
          </div>
          <p className="text-[10px] font-medium text-amber-100/75">
            Verified Gurus
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-amber-200 mb-0.5">
            <Sparkles className="size-3.5" />
            <p className="text-sm sm:text-base font-bold text-white leading-tight">
              100k+
            </p>
          </div>
          <p className="text-[10px] font-medium text-amber-100/75">
            Consultations
          </p>
        </div>
        <div>
          <div className="flex items-center justify-center gap-1 text-amber-200 mb-0.5">
            <Clock className="size-3.5" />
            <p className="text-sm sm:text-base font-bold text-white leading-tight">
              99.8%
            </p>
          </div>
          <p className="text-[10px] font-medium text-amber-100/75">
            On-Time Payouts
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExpertShowcaseCard;
