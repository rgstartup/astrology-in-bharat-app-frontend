"use client";

import React from "react";
import { useTranslations } from "next-intl";

export function LuckyAspects() {
  const t = useTranslations("Horoscope");

  return (
    <div
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-[#1A1A1A]"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-wand-magic-sparkles text-[#F26500]"></i>
        {t("bottomCards.luckyAspects.title")}
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.luckyAspects.p1")}
          </p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.luckyAspects.p2")}
          </p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.luckyAspects.p3")}
          </p>
        </li>
      </ul>
    </div>
  );
}

export function RemedyForYou() {
  const t = useTranslations("Horoscope");

  return (
    <div
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-[#1A1A1A]"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-hands-praying text-[#F26500]"></i>
        {t("bottomCards.remedyForYou.title")}
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.remedyForYou.p1")}
          </p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.remedyForYou.p2")}
          </p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.remedyForYou.p3")}
          </p>
        </li>
      </ul>
    </div>
  );
}

export function ThingsToAvoid() {
  const t = useTranslations("Horoscope");

  return (
    <div
      className="rounded-3xl p-6 md:p-8 border border-[#F0E6DD] shadow-sm relative overflow-hidden h-full bg-[#1A1A1A]"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <h3 className="text-lg font-bold text-[#3D1A0B] mb-4 flex items-center gap-3">
        <i className="fa-solid fa-triangle-exclamation text-[#F26500]"></i>
        {t("bottomCards.thingsToAvoid.title")}
      </h3>

      <ul className="space-y-3 relative z-10">
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.thingsToAvoid.p1")}
          </p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.thingsToAvoid.p2")}
          </p>
        </li>
        <li className="flex gap-3 items-start">
          <i className="fa-solid fa-star text-[#F26500] text-xs mt-1"></i>
          <p className="text-slate-600 text-sm leading-relaxed">
            {t("bottomCards.thingsToAvoid.p3")}
          </p>
        </li>
      </ul>
    </div>
  );
}
