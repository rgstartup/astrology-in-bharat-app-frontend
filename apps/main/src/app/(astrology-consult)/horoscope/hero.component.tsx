import React from "react";
import Image from "next/image";
import { useLanguageStore, horoscopeTranslations } from "@repo/store";
import { Target, User, Calendar, Moon } from "lucide-react";

const features = [
  { icon: Target, text: "Accurate Predictions" },
  { icon: User, text: "Personalized Insights" },
  { icon: Calendar, text: "Daily Guidance" },
  { icon: Moon, text: "Planetary Influence" },
];

const HeroComponent = () => {
  const { lang } = useLanguageStore();
  const t = horoscopeTranslations[lang];
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <section className="relative overflow-hidden bg-[#fff8f2] pt-4 pb-4 md:pt-5 md:pb-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,228,193,0.45),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,159,74,0.12),transparent_25%)] pointer-events-none" />
      <div className="relative max-w-[1320px] mx-auto px-4 md:px-6 lg:px-12">
        
        <div className="relative w-full rounded-xl md:rounded-3xl lg:rounded-[24px] overflow-hidden bg-[#2d0f0c] shadow-xl flex flex-col md:flex-row items-stretch border border-[#ffb286]/20">
          
          {/* Image Section (Top on mobile, Right on desktop) */}
          <div className="w-full md:w-[55%] h-[240px] md:h-auto md:min-h-[340px] lg:min-h-[360px] relative order-1 md:order-2 bg-[#2d0f0c]">
            {/* Soft fade overlay to blend with left background exactly like Famous Temples */}
            <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2d0f0c] from-0% via-[#2d0f0c]/80 via-10% md:via-15% to-transparent to-25% md:to-40% z-10" />
            <Image
              src="/images/horoscope-bg-softglow.jpg"
              alt="Daily Horoscope"
              fill
              priority
              className="object-cover object-center"
            />
          </div>

          {/* Content Section (Bottom on mobile, Left on desktop) */}
          <div className="w-full md:w-[50%] p-6 md:p-10 lg:p-12 z-20 order-2 md:order-1 flex flex-col justify-center relative -mt-10 md:mt-0">
            
            <h1 className="text-3xl md:text-4xl lg:text-[44px] font-serif font-bold text-white mb-1 text-center md:text-left drop-shadow-md leading-tight" style={fontStyle}>
              {t.heroTitle1} <span className="text-[#ffb286]">{t.heroHighlight}</span> {t.heroTitle2}
            </h1>
            
            <div className="flex flex-col items-center md:items-start mb-4">
              <h2 className="text-[#ffb286] text-xl md:text-2xl lg:text-[22px] font-serif mb-3 text-center md:text-left drop-shadow-md">
                {lang === "hi" ? "हर दिन के लिए आपका मार्गदर्शन" : "Your Guide for Every Day"}
              </h2>
              {/* Decorative divider */}
              <div className="w-32 h-[1px] bg-gradient-to-r from-[#ffb286]/80 via-[#ffb286]/30 to-transparent hidden md:block mb-1"></div>
              <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#ffb286]/80 to-transparent md:hidden mb-1"></div>
            </div>
            
            <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 text-center md:text-left max-w-md mx-auto md:mx-0 drop-shadow-md">
              {t.heroDesc}
            </p>

            {/* Features Grid - EXACTLY like Famous Temples */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
              {features.map((feat, idx) => {
                const words = t.features[idx].split(' ');
                const word1 = words[0];
                const word2 = words.slice(1).join(' ');
                return (
                <div key={idx} className="flex items-center justify-center md:justify-start gap-3 group">
                  <div className="w-10 h-10 rounded-full border border-[#ffb286]/30 flex items-center justify-center text-[#ffb286] bg-[#3a130a] group-hover:bg-[#ffb286] group-hover:text-[#3a130a] transition-colors shrink-0 shadow-sm">
                    <feat.icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="text-[11px] font-medium text-white/90 leading-snug flex flex-col text-left">
                    <span>{word1}</span>
                    <span>{word2}</span>
                  </div>
                </div>
              )})}
            </div>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
