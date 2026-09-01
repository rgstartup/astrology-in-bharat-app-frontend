import React from "react";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

const CTABanner = async () => {
  const t = await getTranslations("About");

  return (
    <section className="relative py-24 text-center text-white overflow-hidden bg-gradient-to-br from-[#1a0a00] via-[#301118] to-[#1a0a00]">
      {/* Decorative Glows */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-orange-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 pointer-events-none animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-500/5 rounded-full blur-[120px] translate-x-1/4 translate-y-1/4 pointer-events-none animate-pulse delay-1000"></div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 relative z-10">
        {/* Floating Icon Container */}
        <div className="inline-flex items-center justify-center w-24 h-24 bg-orange-500/20 border border-orange-500/30 rounded-[2.5rem] mb-10 text-4xl shadow-[0_20px_50px_rgba(249,115,22,0.2)] animate-bounce-slow transform hover:rotate-12 transition-transform duration-500 backdrop-blur-md">
          <span className="drop-shadow-lg">🌟</span>
        </div>

        {/* Text Content */}
        <div className="space-y-6 max-w-3xl mx-auto mb-12">
          <h2 className="text-4xl md:text-6xl font-black leading-tight tracking-tight">
            {t("ctaTitle")}
          </h2>
          <p className="text-white/70 text-lg md:text-xl leading-relaxed font-medium italic">
            &quot;{t("ctaDesc")}&quot;
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-wrap justify-center gap-6">
          <Link
            href="/our-experts"
            className="group relative px-10 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-black text-xs uppercase tracking-[0.3em] shadow-[0_15px_35px_rgba(249,115,22,0.3)] hover:shadow-[0_20px_45px_rgba(249,115,22,0.45)] hover:-translate-y-1 transition-all duration-300 no-underline"
          >
            <span className="flex items-center gap-3">
              <i className="fa-solid fa-star text-sm group-hover:rotate-12 transition-transform"></i>
              {t("ctaBtn1")}
            </span>
          </Link>

          <Link
            href="/calculator"
            className="group px-10 py-5 bg-white/5 text-white border border-white/20 rounded-full font-black text-xs uppercase tracking-[0.3em] backdrop-blur-md hover:bg-white/10 hover:-translate-y-1 transition-all duration-300 no-underline"
          >
            <span className="flex items-center gap-3">
              <i className="fa-solid fa-calculator text-sm group-hover:scale-110 transition-transform"></i>
              {t("ctaBtn2")}
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTABanner;
