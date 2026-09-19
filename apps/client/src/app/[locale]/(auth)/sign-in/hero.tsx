import React from "react";
import { Sparkles, Star, ShieldCheck, Zap } from "lucide-react";

const HeroComponent = async () => {
  return (
    <div className="mb-0">
      {/* Platform Badge */}
      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-900 text-xs font-semibold mb-3.5">
        <Sparkles className="size-3.5 text-amber-500" />
        <span>India&apos;s Premier Vedic Platform</span>
      </div>

      {/* Main Hero Title */}
      <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug mb-2.5 tracking-tight">
        Connect with Verified Vedic Astrologers
      </h2>

      {/* Subtitle / Description */}
      <p className="text-stone-600 text-xs sm:text-sm leading-relaxed mb-5">
        Unlock accurate Kundli predictions, love compatibility, career timing,
        and authentic Vedic remedies.
      </p>

      {/* Trust Highlights */}
      <div className="flex flex-wrap items-center gap-2 pt-4 border-t border-stone-200/90">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs">
          <Star className="size-3.5 text-amber-500 fill-amber-500" />
          <span>500+ Experts</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs">
          <ShieldCheck className="size-3.5 text-emerald-600" />
          <span>100% Confidential</span>
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-semibold text-stone-800 shadow-2xs">
          <Zap className="size-3.5 text-orange fill-orange/20" />
          <span>Instant Call & Chat</span>
        </div>
      </div>
    </div>
  );
};

export default HeroComponent;
