"use client";

import React from "react";
import { useLanguageStore } from "@repo/store";
import { aboutTranslations } from "@/lib/translations/about";

const StatsBar: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = aboutTranslations[lang as keyof typeof aboutTranslations] || aboutTranslations.en;

  const stats = [
    { value: "1,00,000+", label: t.statUsers },
    { value: "500+", label: t.statExperts },
    { value: "10+", label: t.statServices },
    { value: "4.8★", label: t.statRating },
  ];

  return (
    <section className="bg-orange-50/50 border-b border-orange-100 overflow-hidden relative">
       {/* Background subtle texture/pattern could go here */}
       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange/20 to-transparent"></div>
       
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 text-center items-center">
          {stats.map((s, i) => (
            <div key={i} className="group relative">
               {/* Vertical Divider for Desktop */}
               {i < stats.length - 1 && (
                 <div className="hidden md:block absolute -right-6 top-1/2 -translate-y-1/2 h-8 w-px bg-orange-200/50"></div>
               )}
               
               <div className="space-y-1 transition-transform duration-500 hover:-translate-y-1">
                 <div className="text-3xl md:text-5xl font-black text-orange tabular-nums leading-none tracking-tighter decoration-orange/20 group-hover:scale-110 transition-transform">
                   {s.value}
                 </div>
                 <div className="text-[10px] md:text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                   {s.label}
                 </div>
               </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
