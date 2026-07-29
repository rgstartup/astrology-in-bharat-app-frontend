"use client";

import Image from "next/image";
import { Flower2, Landmark, Sparkles, ShieldCheck } from "lucide-react";
import { useLanguageStore } from "@repo/store";

const FamousPlacesHero = () => {
  const { lang } = useLanguageStore();

  const t = {
    en: {
      title: "FAMOUS TEMPLES",
      subtitle: "Find Divine Places Near You",
      desc: "Search any place in India and discover famous temples, their history, timings and spiritual significance.",
      features: [
        { icon: Flower2, text: "Spiritual\nGuidance" },
        { icon: Landmark, text: "Verified\nInformation" },
        { icon: Sparkles, text: "Astrology\nBenefits" },
        { icon: ShieldCheck, text: "Trusted\nPlatform" },
      ],
    },
    hi: {
      title: "प्रसिद्ध मंदिर",
      subtitle: "अपने पास दिव्य स्थान खोजें",
      desc: "भारत में किसी भी स्थान को खोजें और प्रसिद्ध मंदिरों, उनके इतिहास, समय और आध्यात्मिक महत्व को जानें।",
      features: [
        { icon: Flower2, text: "आध्यात्मिक\nमार्गदर्शन" },
        { icon: Landmark, text: "सत्यापित\nजानकारी" },
        { icon: Sparkles, text: "ज्योतिष\nलाभ" },
        { icon: ShieldCheck, text: "विश्वसनीय\nप्लेटफॉर्म" },
      ],
    },
  };

  const tx = t[lang] || t.en;

  return (
    <section className="relative w-full bg-[#2d0f0c] flex flex-col md:flex-row items-stretch">
      {/* Image Section (Top on mobile, Right on desktop) */}
      <div className="w-full md:w-[55%] h-[240px] md:h-auto md:min-h-[380px] relative order-1 md:order-2">
        {/* Gradient Overlay for smooth blending */}
        <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#2d0f0c] from-0% via-[#2d0f0c]/80 via-10% md:via-15% to-transparent to-25% md:to-40% z-10" />
        <Image
          src="/images/famous-temples-clean.jpg"
          alt="Famous Temples"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Content Section (Bottom on mobile, Left on desktop) */}
      <div className="w-full md:w-[50%] p-6 md:p-10 lg:p-12 z-20 order-2 md:order-1 flex flex-col justify-center relative -mt-10 md:mt-0">
        
        <h1 className="text-3xl md:text-4xl lg:text-[44px] font-serif font-bold text-white mb-1 text-center md:text-left drop-shadow-md">
          {tx.title}
        </h1>
        
        <div className="flex flex-col items-center md:items-start mb-4">
          <h2 className="text-[#ffb286] text-xl md:text-2xl font-serif mb-3 text-center md:text-left drop-shadow-md">
            {tx.subtitle}
          </h2>
          {/* Decorative divider */}
          <div className="w-32 h-[1px] bg-gradient-to-r from-[#ffb286]/80 via-[#ffb286]/30 to-transparent hidden md:block mb-1"></div>
          <div className="w-32 h-[1px] bg-gradient-to-r from-transparent via-[#ffb286]/80 to-transparent md:hidden mb-1"></div>
        </div>
        
        <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-10 text-center md:text-left max-w-md mx-auto md:mx-0 drop-shadow-md">
          {tx.desc}
        </p>

        {/* Features Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-auto">
          {tx.features.map((feat, idx) => {
            const lines = feat.text.split('\n');
            return (
              <div key={idx} className="flex items-center justify-center md:justify-start gap-3 group">
                <div className="w-10 h-10 rounded-full border border-[#ffb286]/30 flex items-center justify-center text-[#ffb286] bg-[#3a130a] group-hover:bg-[#ffb286] group-hover:text-[#3a130a] transition-colors shrink-0 shadow-sm">
                  <feat.icon className="w-4 h-4 md:w-5 md:h-5" />
                </div>
                <div className="text-[11px] font-medium text-white/90 leading-snug flex flex-col text-left">
                  <span>{lines[0]}</span>
                  <span>{lines[1]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FamousPlacesHero;
