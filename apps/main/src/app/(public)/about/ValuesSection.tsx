"use client";
import React from "react";
import { useLanguageStore } from "@repo/store";
import { aboutTranslations } from "@/lib/translations/about";

const ValuesSection: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = aboutTranslations[lang as keyof typeof aboutTranslations] || aboutTranslations.en;

  const values = [
    { icon: "fa-solid fa-shield-halved", title: t.value1Title, desc: t.value1Desc },
    { icon: "fa-solid fa-user-shield", title: t.value2Title, desc: t.value2Desc },
    { icon: "fa-solid fa-star", title: t.value3Title, desc: t.value3Desc },
    { icon: "fa-solid fa-hand-holding-heart", title: t.value4Title, desc: t.value4Desc },
  ];

  return (
    <section className="py-24 bg-[#fafafa] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="text-center mb-20 space-y-4">
          <span className="text-[11px] font-black uppercase tracking-[0.4em] text-orange block animate-in fade-in slide-in-from-top-4 duration-700">
            {t.valuesTag}
          </span>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
            {t.valuesTitle}
          </h2>
          <div className="w-16 h-1.5 bg-orange mx-auto rounded-full mt-6"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((v, i) => (
            <div 
              key={i} 
              className="group relative bg-gradient-to-br from-[#2b1117] to-[#3e1b23] rounded-[2.5rem] p-10 flex flex-col items-center text-center overflow-hidden transition-all duration-500 h-full border border-white/5 shadow-2xl hover:-translate-y-3 hover:shadow-orange-500/20 active:scale-95 animate-in fade-in slide-in-from-bottom-8 duration-700"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Visual Depth Elements */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              <div className="absolute -bottom-16 -right-16 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl group-hover:bg-orange-500/10 transition-colors"></div>

              {/* Icon Container */}
              <div className="mb-8 relative shrink-0">
                <div className="absolute inset-0 bg-orange-500 rounded-full opacity-20 blur-xl group-hover:opacity-40 transition-all duration-500"></div>
                <div className="relative z-10 w-20 h-20 bg-gradient-to-br from-orange-400 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg shadow-orange-500/30 transform group-hover:rotate-6 transition-transform duration-500">
                  <i className={`${v.icon} text-white text-2xl`} />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-4 grow flex flex-col items-center justify-center">
                <h5 className="text-[17px] font-black text-white uppercase tracking-widest leading-tight group-hover:text-orange transition-colors">
                  {v.title}
                </h5>
                <div className="w-8 h-px bg-white/10 group-hover:bg-orange/50 transition-all duration-500"></div>
                <p className="text-sm font-medium text-slate-400 leading-relaxed max-w-[220px] italic">
                  {v.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ValuesSection;
