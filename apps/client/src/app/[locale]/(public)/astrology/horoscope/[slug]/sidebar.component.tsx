"use client";
import React, { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";

const ARTICLE_IMAGES = [
  "/images/ser1.jpg",
  "/images/ser2.jpg",
  "/images/ser3.jpg",
];

export default function ZodiacDetailsSidebar({ signData }: { signData: any }) {
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);
  const t = useTranslations("Horoscope");

  const displayTitle = t(`zodiacNames.${signData.title}`) || signData.title;

  const toggleArticle = (idx: number, e: React.MouseEvent) => {
    e.preventDefault();
    setExpandedArticle(expandedArticle === idx ? null : idx);
  };

  return (
    <div className="space-y-6">
      {/* Zodiac Details Card */}
      <div
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9]"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6 flex items-center gap-3">
          <i className="fa-solid fa-star-of-life text-[#F26500]"></i>
          {t("zodiacSidebar.zodiacDetails")}
        </h3>

        <div className="space-y-5">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-globe text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">
                {t("zodiacSidebar.rulingPlanet")}
              </p>
              <p className="text-sm font-bold text-[#3D1A0B]">
                {t("zodiacSidebar.mars")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-fire text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">
                {t("zodiacSidebar.element")}
              </p>
              <p className="text-sm font-bold text-[#3D1A0B]">
                {t("zodiacSidebar.fire")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-circle-notch text-[#F26500]"></i>
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">
                {t("zodiacSidebar.quality")}
              </p>
              <p className="text-sm font-bold text-[#3D1A0B]">
                {t("zodiacSidebar.cardinal")}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full border border-[#E8D5C0] flex items-center justify-center shrink-0">
              <Image
                src={signData.image}
                alt={signData.title}
                width={20}
                height={20}
                className="object-contain"
              />
            </div>
            <div>
              <p className="text-xs text-slate-500 font-semibold mb-0.5">
                {t("zodiacSidebar.symbol")}
              </p>
              <p className="text-sm font-bold text-[#3D1A0B]">
                {t("zodiacSidebar.ram")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Traits Card */}
      <div
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9]"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6">
          {displayTitle} {t("zodiacSidebar.traits")}
        </h3>

        {/* Pills */}
        <div className="flex flex-wrap gap-2 mb-6">
          {[0, 1, 2, 3, 4, 5].map((idx) => (
            <span
              key={idx}
              className="bg-[#FFFDF9] border border-[#E8D5C0] text-slate-600 px-3 py-1.5 rounded-full text-xs font-semibold"
            >
              {t(`zodiacSidebar.traitsList.${idx}` as any)}
            </span>
          ))}
        </div>

        <div className="mb-4">
          <p className="text-sm font-bold text-[#3D1A0B] mb-1">
            {t("zodiacSidebar.strengths")}
          </p>
          <p className="text-sm text-slate-600">
            {t("zodiacSidebar.strengthsDesc")}
          </p>
        </div>

        <div>
          <p className="text-sm font-bold text-[#3D1A0B] mb-1">
            {t("zodiacSidebar.weaknesses")}
          </p>
          <p className="text-sm text-slate-600">
            {t("zodiacSidebar.weaknessesDesc")}
          </p>
        </div>
      </div>

      {/* Trending Articles Card */}
      <div
        className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9]"
        style={{
          backgroundImage: "url('/images/back-image.webp')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h3 className="text-xl font-bold text-[#3D1A0B] mb-6 flex items-center gap-3">
          <i className="fa-solid fa-fire text-[#F26500]"></i>
          {t("zodiacSidebar.trendingArticles")}
        </h3>

        <div className="space-y-4">
          {ARTICLE_IMAGES.map((imgSrc, idx) => {
            const title = t(`zodiacSidebar.articles.${idx}.title` as any);
            const content = t(`zodiacSidebar.articles.${idx}.content` as any);
            const isExpanded = expandedArticle === idx;
            return (
              <div key={idx} className="flex flex-col gap-3">
                <div
                  className="flex gap-4 items-center group cursor-pointer no-underline"
                  onClick={(e) => toggleArticle(idx, e)}
                >
                  <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                    <Image
                      src={imgSrc}
                      alt={title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform"
                    />
                  </div>
                  <div className="flex-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-bold text-[#3D1A0B] group-hover:text-[#F26500] transition-colors leading-snug m-0">
                      {title}
                    </p>
                    <i
                      className={`fa-solid fa-chevron-${isExpanded ? "up" : "down"} text-xs text-slate-400 group-hover:text-[#F26500] transition-colors`}
                    ></i>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#F0E6DD] text-xs text-slate-600 leading-relaxed">
                    {content}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
