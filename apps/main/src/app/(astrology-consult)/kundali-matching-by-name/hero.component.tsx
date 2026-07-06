import React from "react";
import Image from "next/image";
import { useLanguageStore } from "@repo/store";
import { matchingTranslations } from "@/lib/translations/calculators/matching";

const HeroComponent = () => {
  const { lang } = useLanguageStore();
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  return (
    <section className="relative overflow-hidden bg-[#fff8f2] pt-12 pb-4 md:pt-16 md:pb-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,228,193,0.45),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,159,74,0.12),transparent_25%)] pointer-events-none" />
      <div className="relative max-w-7xl mx-auto px-4">
        <div className="relative overflow-hidden rounded-[3rem] border border-orange-100/50 bg-white shadow-[0_30px_80px_rgba(15,23,42,0.09)]">
          <Image
            src={encodeURI("/images/Screenshot 2026-07-04 153017.png")}
            alt="Kundali Matching Banner"
            width={1600}
            height={420}
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroComponent;
