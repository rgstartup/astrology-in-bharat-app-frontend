import React from "react";
import { Link } from "@/i18n/navigation";
import { getTranslations } from "next-intl/server";

const HeroSection = async () => {
  const t = await getTranslations("About");

  return (
    <section className="relative overflow-hidden py-24 md:py-32 bg-gradient-to-br from-[#1a0a00] via-[#301118] to-[#1a0a00] min-h-[500px] flex items-center">
      {/* Decorative Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-orange-500/10 rounded-full blur-[100px] -translate-y-1/4 translate-x-1/4 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-orange-500/5 rounded-full blur-[80px] translate-y-1/4 -translate-x-1/4 pointer-events-none animate-pulse delay-700"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10 text-center text-white">
        {/* Vedic Badge */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-orange-500/10 text-orange-400 border border-orange-500/20 rounded-full mb-8 backdrop-blur-sm animate-in fade-in slide-in-from-top-4 duration-700">
          <i className="fa-solid fa-om text-sm"></i>
          <span className="text-[11px] font-black uppercase tracking-[0.3em]">
            {t("badgeText")}
          </span>
        </div>

        {/* Hero Title */}
        <h1 className="text-5xl md:text-8xl font-black mb-8 leading-[1.1] tracking-tight animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
          {t("titleStart")}{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-600">
            {t("titleHighlight")}
          </span>
        </h1>

        {/* Hero Description */}
        <p className="max-w-2xl mx-auto mb-12 text-white/70 text-lg md:text-xl leading-relaxed font-medium italic animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          &quot;{t("heroDesc")}&quot;
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
          <Link
            href="/our-experts"
            className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-[0_15px_35px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.45)] hover:-translate-y-1 transition-all duration-300 no-underline"
          >
            <span className="flex items-center gap-3">
              <i className="fa-solid fa-user-astronaut text-sm group-hover:rotate-12 transition-transform"></i>
              {t("btnConsult")}
            </span>
          </Link>

          <Link
            href="/contact"
            className="group px-10 py-5 bg-white/5 text-white border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.3em] backdrop-blur-md hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 no-underline"
          >
            <span className="flex items-center gap-3">
              <i className="fa-solid fa-envelope text-sm group-hover:scale-110 transition-transform"></i>
              {t("btnContact")}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
