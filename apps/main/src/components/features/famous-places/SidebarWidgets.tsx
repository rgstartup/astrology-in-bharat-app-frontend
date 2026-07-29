"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguageStore } from "@repo/store";

const WHY_VISIT = {
  en: [
    { icon: "fa-spa", title: "Spiritual Peace", desc: "Connect with divine energy and inner peace." },
    { icon: "fa-sun", title: "Positive Energy", desc: "Remove negativity and attract positivity." },
    { icon: "fa-star", title: "Astrology Benefits", desc: "Visit temples recommended for your zodiac and planets." },
    { icon: "fa-landmark", title: "Cultural Heritage", desc: "Explore India's rich spiritual and cultural legacy." },
  ],
  hi: [
    { icon: "fa-spa", title: "आध्यात्मिक शांति", desc: "दिव्य ऊर्जा और आंतरिक शांति से जुड़ें।" },
    { icon: "fa-sun", title: "सकारात्मक ऊर्जा", desc: "नकारात्मकता दूर करें और सकारात्मकता को आकर्षित करें।" },
    { icon: "fa-star", title: "ज्योतिष लाभ", desc: "अपनी राशि और ग्रहों के लिए अनुशंसित मंदिर जाएं।" },
    { icon: "fa-landmark", title: "सांस्कृतिक विरासत", desc: "भारत की समृद्ध आध्यात्मिक और सांस्कृतिक विरासत को जानें।" },
  ],
};

// ─── Why Visit Temples ───────────────────────────────────────────────────────
export const WhyVisitSidebar = () => {
  const { lang } = useLanguageStore();
  const items = WHY_VISIT[lang] || WHY_VISIT.en;
  const title = lang === 'hi' ? 'मंदिर क्यों जाएं?' : 'Why Visit Temples?';

  return (
    <div className="bg-white rounded-2xl border-2 border-[#ff6b00] shadow-sm hover:shadow-lg hover:shadow-[#ff6b00]/10 transition-shadow p-5">
      <h3 className="text-sm font-black text-gray-900 mb-4">{title}</h3>
      <div className="space-y-4">
        {items.map(({ icon, title, desc }) => (
          <div key={title} className="flex items-start gap-3">
            <div className="w-12 h-12 bg-orange-50 border border-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
              <i className={`fa-solid ${icon} text-orange-500 text-lg`} />
            </div>
            <div>
              <p className="text-xs font-bold text-gray-900">{title}</p>
              <p className="text-[11px] text-gray-700 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ─── Zodiac Recommendation ───────────────────────────────────────────────────
export const ZodiacRecommendationSidebar = () => {
  const { lang } = useLanguageStore();
  const tx = {
    en: {
      title: "Temple Recommendation\nby Your Zodiac",
      desc: "Get temples recommended according to your zodiac sign and planetary positions.",
      btn: "Get Recommendation",
    },
    hi: {
      title: "मंदिर सिफारिश\nआपकी राशि अनुसार",
      desc: "अपनी राशि और ग्रहों की स्थिति के अनुसार मंदिरों की सिफारिश पाएं।",
      btn: "सिफारिश पाएं",
    },
  }[lang] || {} as any;

  const titleLines = tx.title?.split('\n') || [];

  return (
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
          {titleLines[0]}<br />{titleLines[1]}
        </h3>
        <p className="text-[10px] md:text-[11px] text-white/90 leading-relaxed mb-3 md:mb-4 pr-2">
          {tx.desc}
        </p>
        
        <div className="inline-flex items-center justify-center gap-1.5 bg-[#F26500] hover:bg-[#d95a00] text-white text-[10px] md:text-[11px] font-bold px-3 py-2 md:px-4 md:py-2.5 rounded-lg transition-colors shadow-sm whitespace-nowrap">
          <i className="fa-solid fa-star-and-crescent text-[9px] md:text-[10px]" /> {tx.btn}
        </div>
      </div>
    </Link>
  );
};

// ─── Today's Special ─────────────────────────────────────────────────────────
export const TodaysSpecialSidebar = () => {
  const { lang } = useLanguageStore();
  const tx = {
    en: {
      heading: "Today's Special",
      title: "Ekadashi Special",
      desc: "Visit Lord Vishnu temples today to get special blessings.",
      btn: "View Temples",
    },
    hi: {
      heading: "आज का विशेष",
      title: "एकादशी विशेष",
      desc: "आज भगवान विष्णु के मंदिर जाएं और विशेष आशीर्वाद प्राप्त करें।",
      btn: "मंदिर देखें",
    },
  }[lang] || {} as any;

  return (
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
        <h3 className="text-[17px] font-bold text-[#3D1A0B]">{tx.heading}</h3>
      </div>
      
      <div className="flex items-start gap-4">
        <div className="w-[60px] h-[60px] rounded-full overflow-hidden flex-shrink-0 relative shadow-sm border border-[#E8D5C0]">
          <Image src="/images/ekadashi-special.jpg" alt="Ekadashi" fill className="object-cover" />
        </div>
        <div>
          <p className="text-[13px] font-bold text-[#D35400] mb-1">{tx.title}</p>
          <p className="text-[11px] font-medium text-gray-700 leading-relaxed pr-2">{tx.desc}</p>
          <button className="mt-2 text-[11px] font-bold text-[#F26500] flex items-center gap-1.5 hover:opacity-80 transition-opacity">
            {tx.btn} <i className="fa-solid fa-arrow-right text-[10px]" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ─── Ask Expert CTA ──────────────────────────────────────────────────────────
export const AskExpertSidebar = () => {
  const { lang } = useLanguageStore();
  const tx = {
    en: { need: "Need Guidance?", title: "Talk to an Astrology Expert", btn: "Talk to Expert" },
    hi: { need: "मार्गदर्शन चाहिए?", title: "ज्योतिषी से बात करें", btn: "विशेषज्ञ से बात करें" },
  }[lang] || {} as any;

  return (
    <div className="bg-orange-500 rounded-2xl p-5 text-white">
      <p className="text-xs font-bold opacity-80 mb-1">{tx.need}</p>
      <h3 className="text-sm font-black mb-3">{tx.title}</h3>
      <Link
        href="/chat"
        className="inline-flex items-center gap-2 bg-white text-orange-500 text-xs font-black px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
      >
        <i className="fa-solid fa-comments" /> {tx.btn}
      </Link>
    </div>
  );
};
