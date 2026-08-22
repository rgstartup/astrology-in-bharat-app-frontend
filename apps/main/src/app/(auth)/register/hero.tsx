"use client";

import { authTranslations } from "@/lib/translations/auth";
import { useLanguageStore } from "@repo/store";
import authContent from "../../../data/auth-content.json";
import React from "react";

const HeroComponent = () => {
  const { lang } = useLanguageStore();
  const t =
    authTranslations[lang as keyof typeof authTranslations] ||
    authTranslations.en;
  const { signUp } = authContent;

  return (
    <div className="mb-8">
      <h3
        className="text-[20px] min-[390px]:text-[24px] sm:text-[28px] md:text-[32px] lg:text-[36px] xl:text-[42px] font-extrabold leading-tight mb-4 whitespace-nowrap tracking-tight md:tracking-normal"
        style={{
          fontFamily:
            lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
        }}
      >
        <span className="text-[#301118]">{t.signUp.title}</span>{" "}
        {t.signIn.brandTo}{" "}
        <span className="text-orange">{t.signIn.brandName}</span>
      </h3>
      <p
        className="text-black text-base md:text-lg leading-relaxed font-medium"
        style={{
          fontFamily:
            lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
        }}
      >
        {signUp.description}
      </p>
      <p
        className="text-gray-800 mt-4 font-medium"
        style={{
          fontFamily:
            lang === "hi" ? "'Noto Sans Devanagari', sans-serif" : "inherit",
        }}
      >
        {t.signUp.subtitle}
      </p>
    </div>
  );
};

export default HeroComponent;
