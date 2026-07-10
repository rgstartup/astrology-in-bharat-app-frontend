import React from "react";
import { WHY_VISIT_ITEMS } from "./constants";
import Image from "next/image";
import Link from "next/link";

// ─── Why Visit Temples ───────────────────────────────────────────────────────
export const WhyVisitSidebar = () => (
  <div className="bg-white rounded-2xl border-2 border-[#ff6b00] shadow-sm hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow p-5">
    <h3 className="text-sm font-black text-gray-900 mb-4">Why Visit Temples?</h3>
    <div className="space-y-4">
      {WHY_VISIT_ITEMS.map(({ icon, title, desc }) => (
        <div key={title} className="flex items-start gap-3">
          <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <i className={`fa-solid ${icon} text-orange-500 text-lg`} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-900">{title}</p>
            <p className="text-[11px] text-gray-400 leading-relaxed">{desc}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// ─── Zodiac Recommendation ───────────────────────────────────────────────────
export const ZodiacRecommendationSidebar = () => (
  <Link href="/horoscope" className="relative block w-full rounded-2xl overflow-hidden shadow-sm bg-gradient-to-br from-[#3b1c15] to-[#250d0a] hover:opacity-95 transition-opacity p-4 md:p-6 min-h-[140px] md:min-h-[160px] flex flex-col justify-center border border-[#4a261d]">
    
    {/* Zodiac Wheel Background Image */}
    <div className="absolute top-1/2 -translate-y-1/2 -right-8 md:-right-6 w-[130px] h-[130px] md:w-[180px] md:h-[180px] pointer-events-none opacity-90">
      <Image 
        src="/images/zodiac-wheel.png" 
        alt="Zodiac Wheel" 
        fill 
        className="object-contain"
        priority
      />
    </div>
    
    {/* Overlay Content */}
    <div className="relative z-10 max-w-[70%] md:max-w-[65%]">
      <h3 className="text-[15px] md:text-[17px] font-bold text-[#F4A841] leading-tight md:leading-snug mb-1.5 md:mb-2 font-serif">
        Temple Recommendation<br />by Your Zodiac
      </h3>
      <p className="text-[10px] md:text-[11px] text-white/90 leading-relaxed mb-3 md:mb-4 pr-2">
        Get temples recommended according to your zodiac sign and planetary positions.
      </p>
      
      <div className="inline-flex items-center justify-center gap-1.5 bg-[#F26500] hover:bg-[#d95a00] text-white text-[10px] md:text-[11px] font-bold px-3 py-2 md:px-4 md:py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap">
        <i className="fa-solid fa-star-and-crescent text-[9px] md:text-[10px]" /> Get Recommendation
      </div>
    </div>
  </Link>
);

// ─── Today's Special ─────────────────────────────────────────────────────────
export const TodaysSpecialSidebar = () => (
  <div className="bg-[#FCF8F4] rounded-2xl border border-[#E8D5C0] shadow-sm p-5">
    <div className="flex items-center gap-2.5 mb-4">
      <div className="flex items-center justify-center">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#D35400]">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="12" cy="15" r="3" />
        </svg>
      </div>
      <h3 className="text-[17px] font-bold text-[#3D1A0B]">Today's Special</h3>
    </div>
    
    <div className="flex items-start gap-4">
      <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0 relative shadow-sm border border-[#E8D5C0]">
        <Image src="/images/ekadashi-special.png" alt="Ekadashi" fill className="object-cover" />
      </div>
      <div>
        <p className="text-[13px] font-bold text-[#D35400] mb-1">Ekadashi Special</p>
        <p className="text-[11px] font-medium text-gray-500 leading-relaxed pr-2">
          Visit Lord Vishnu temples today to get special blessings.
        </p>
        <button className="mt-2 text-[11px] font-bold text-[#F26500] flex items-center gap-1.5 hover:opacity-80 transition-opacity">
          View Temples <i className="fa-solid fa-arrow-right text-[10px]" />
        </button>
      </div>
    </div>
  </div>
);

// ─── Ask Expert CTA ──────────────────────────────────────────────────────────
export const AskExpertSidebar = () => (
  <div className="bg-orange-500 rounded-2xl p-5 text-white">
    <p className="text-xs font-bold opacity-80 mb-1">Need Guidance?</p>
    <h3 className="text-sm font-black mb-3">Talk to an Astrology Expert</h3>
    <Link
      href="/chat"
      className="inline-flex items-center gap-2 bg-white text-orange-500 text-xs font-black px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
    >
      <i className="fa-solid fa-comments" /> Talk to Expert
    </Link>
  </div>
);
