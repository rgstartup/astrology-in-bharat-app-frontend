"use client";

import React from "react";
import {
  FaPalette,
  FaHashtag,
  FaCalendarAlt,
} from "react-icons/fa";
import { TbCrystalBall } from "react-icons/tb";
import { GiLotus, GiSparkles } from "react-icons/gi";
import { LuckyVibesResultProps } from "@/lib/types/calculator";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "@/lib/translations/home";

const LuckyVibesResult: React.FC<LuckyVibesResultProps> = ({ result }) => {
  const { lang } = useLanguageStore();
  const translationSet = (homeTranslations[lang as "en" | "hi"] || homeTranslations.en) as any;
  const t = translationSet.calculators.luckyVibes;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <div className="bg-gradient-to-br from-[#301118] to-[#1a090d] rounded-[2.5rem] p-8 md:p-10 shadow-2xl relative overflow-hidden border border-orange-500/20 w-full h-full flex flex-col justify-center">
      <div className="absolute top-0 right-0 p-12 opacity-[0.05] pointer-events-none">
        <GiLotus size={200} className="text-orange-500 animate-spin-slow" />
      </div>

      <div className="relative z-10">
        <div className="text-center mb-10">
          <span className="inline-block bg-orange-500/20 text-orange-400 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-[3px] mb-8" style={fontStyle}>
            {t.result.badge}
          </span>
        </div>

              {/* Lucky Number Ring */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative mb-8">
                  <div className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-orange-500/30 flex items-center justify-center relative bg-[#301118] group">
                    <div className="absolute inset-0 rounded-full border-8 border-orange-500 border-t-transparent animate-spin-slow opacity-50"></div>

                    <div className="text-center">
                      <span className="block text-5xl md:text-7xl font-black text-white leading-none group-hover:scale-110 transition-transform duration-500">
                        {result.luckyNumber}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-[2px] text-orange-400 mt-2 block" style={fontStyle}>
                        {t.result.luckyNumber}
                      </span>
                    </div>

                    <FaHashtag className="absolute -top-3 -right-3 text-orange-500 text-4xl animate-bounce shadow-xl" />
                  </div>
                </div>

                {/* Message */}
                <div className="w-full text-center mb-4">
                  <div className="bg-white/5 border border-white/10 text-white p-6 rounded-3xl shadow-xl relative mt-4">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-orange-500 p-3 rounded-xl shadow-lg">
                      <GiSparkles size={20} className="text-[#301118]" />
                    </div>

                    <p className="text-base md:text-lg font-light italic leading-relaxed text-orange-100/90 m-0 mt-2" style={fontStyle}>
                      "{t.dynamic.messages[result.element as keyof typeof t.dynamic.messages] || result.message}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {/* Lucky Color */}
                <div className="bg-white/5 rounded-3xl p-5 border border-orange-500/10 shadow-sm text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                      <FaPalette className="text-orange-400" size={18} />
                    </div>
                    <div>
                      <p className="m-0 text-[10px] font-black uppercase tracking-widest text-orange-400/80" style={fontStyle}>
                        {t.result.luckyColor}
                      </p>
                      <p className="m-0 text-lg font-black text-white" style={fontStyle}>{t.dynamic.colors[result.luckyColor as keyof typeof t.dynamic.colors] || result.luckyColor}</p>
                    </div>
                  </div>

                  <p className="m-0 text-[11px] text-orange-100/60 italic" style={fontStyle}>
                    {t.result.secondaryColor}: <span className="font-bold text-white">{t.dynamic.colors[result.secondaryColor as keyof typeof t.dynamic.colors] || result.secondaryColor}</span>
                  </p>
                </div>

                {/* Lucky Day */}
                <div className="bg-white/5 rounded-3xl p-5 border border-orange-500/10 shadow-sm text-left">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                      <FaCalendarAlt className="text-orange-400" size={18} />
                    </div>
                    <div>
                      <p className="m-0 text-[10px] font-black uppercase tracking-widest text-orange-400/80" style={fontStyle}>
                        {t.result.luckyDay}
                      </p>
                      <p className="m-0 text-lg font-black text-white" style={fontStyle}>{t.dynamic.days[result.luckyDay as keyof typeof t.dynamic.days] || result.luckyDay}</p>
                    </div>
                  </div>

                  <p className="m-0 text-[11px] text-orange-100/60 italic" style={fontStyle}>
                    {t.result.element}: <span className="font-bold text-white">{t.dynamic.elements[result.element] || result.element}</span>
                  </p>
                </div>

                {/* Numerology */}
                <div className="bg-white/5 rounded-3xl p-5 border border-orange-500/10 shadow-sm text-left md:col-span-2">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center">
                      <TbCrystalBall className="text-orange-400" size={18} />
                    </div>
                    <div>
                      <p className="m-0 text-[10px] font-black uppercase tracking-widest text-orange-400/80" style={fontStyle}>
                        {t.result.numerologyBase}
                      </p>
                      <p className="m-0 text-lg font-black text-white" style={fontStyle}>{lang === 'hi' ? 'DOB + नाम' : 'DOB + Name'}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <span className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold uppercase tracking-widest text-orange-200" style={fontStyle}>
                      {t.result.dobNumber}: {result.dobNumber}
                    </span>
                    <span className="px-3 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold uppercase tracking-widest text-orange-200" style={fontStyle}>
                      {t.result.nameNumber}: {result.nameNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footer badge */}
              <div className="mt-8 flex justify-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20">
                  <span className="text-[9px] font-black uppercase tracking-[3px] text-orange-400" style={fontStyle}>
                    {t.result.footerBadge}
                  </span>
                </div>
              </div>

            </div>
    </div>
  );
};

export default LuckyVibesResult;
