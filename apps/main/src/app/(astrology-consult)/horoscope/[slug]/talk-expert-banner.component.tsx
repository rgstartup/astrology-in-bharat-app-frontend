import React from 'react';
import Link from 'next/link';

export default function TalkExpertBanner() {
  return (
    <div className="mt-8 relative overflow-hidden rounded-3xl bg-[#2B0F0E] px-6 py-6 md:px-8 md:py-6 flex flex-col md:flex-row items-center justify-between gap-6 shadow-lg border border-[#3D1A0B]">
      
      {/* Decorative Zodiac Background */}
      <div 
        className="absolute right-[-100px] top-1/2 -translate-y-1/2 w-[400px] h-[400px] opacity-[0.15] md:opacity-[0.25] pointer-events-none mix-blend-screen"
        style={{
          backgroundImage: "url('/images/zodiac-wheel.png')",
          backgroundSize: "contain",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat"
        }}
      />
      
      {/* Left Content (Text) */}
      <div className="relative z-10 flex-1">
        <h3 className="text-2xl md:text-[26px] font-bold text-[#E5B55E] mb-1.5 tracking-wide">
          Get More Personalized Predictions
        </h3>
        <p className="text-[#D1C4BC] text-sm md:text-base">
          Talk to our expert astrologers for in-depth guidance based on your birth chart.
        </p>
      </div>

      {/* Right Content (Button) */}
      <div className="relative z-10 shrink-0 mt-2 md:mt-0">
        <Link href="/our-experts" className="inline-flex items-center gap-3 bg-[#F26500] hover:bg-[#E65A00] text-white px-7 py-3 rounded-xl font-semibold transition-all shadow-[0_4px_12px_rgba(242,101,0,0.3)] hover:-translate-y-0.5 whitespace-nowrap">
          <i className="fa-solid fa-headset text-lg"></i>
          Talk to Expert
        </Link>
      </div>

    </div>
  );
}
