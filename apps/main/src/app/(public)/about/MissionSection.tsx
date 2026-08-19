"use client";
import React from "react";
import { useLanguageStore } from "@repo/store";
import { aboutTranslations } from "@/lib/translations/about";

const MissionSection: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = aboutTranslations[lang as keyof typeof aboutTranslations] || aboutTranslations.en;

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
          {/* Left Column Component */}
          <div className="w-full lg:w-1/2 space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="space-y-4">
              <span className="text-[11px] font-black uppercase tracking-[0.4em] text-orange block">
                {t.missionTag}
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tight">
                {t.missionTitle}
              </h2>
            </div>
            
            <div className="space-y-6">
              <p className="text-slate-600 text-lg leading-relaxed font-medium italic border-l-4 border-orange/20 pl-6 py-2">
                &quot;{t.missionDesc1}&quot;
              </p>
              <p className="text-slate-500 text-base leading-relaxed">
                {t.missionDesc2}
              </p>
            </div>

            <div className="flex flex-wrap gap-x-8 gap-y-4 pt-4">
              {[
                { icon: "fa-check-double", text: t.missionFeature1 },
                { icon: "fa-check-double", text: t.missionFeature2 },
                { icon: "fa-check-double", text: t.missionFeature3 },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-slate-700 text-xs font-black uppercase tracking-widest group"
                >
                  <div className="w-8 h-8 bg-orange/10 rounded-lg flex items-center justify-center group-hover:bg-orange group-hover:text-white transition-colors">
                    <i className={`fa-solid ${item.icon} text-[10px]`} />
                  </div>
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right Column Content */}
          <div className="w-full lg:w-1/2 animate-in fade-in slide-in-from-right duration-700">
            <div className="bg-gradient-to-br from-[#1a0a00] to-[#301118] rounded-[3rem] p-10 md:p-16 shadow-2xl relative overflow-hidden group">
              {/* Decorative Aura */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-32 -mt-32 group-hover:bg-orange-500/20 transition-colors duration-700"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-2xl -ml-24 -mb-24 group-hover:bg-orange-500/10 transition-colors duration-700"></div>

              <div className="relative z-10">
                <i className="fa-solid fa-quote-left text-5xl mb-10 text-orange/30 group-hover:text-orange/50 transition-colors" />
                <p className="text-white text-xl md:text-2xl leading-relaxed mb-12 font-medium italic opacity-90">
                  {t.missionQuote}
                </p>
                <div className="flex items-center gap-6 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl shadow-lg shadow-orange-500/20 transform group-hover:rotate-6 transition-transform">
                    🕉
                  </div>
                  <div>
                    <div className="text-white font-black text-sm uppercase tracking-widest mb-1">{t.missionBrand}</div>
                    <div className="text-xs text-white/50 font-bold uppercase tracking-wider">
                      {t.missionSubtext}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
