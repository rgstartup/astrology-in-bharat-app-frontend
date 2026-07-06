"use client";
import React from 'react'
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";
import GuidanceCTA from "@/components/ui/GuidanceCTA";

const CTA = () => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <GuidanceCTA 
          subtitle=""
          title={t.cta.title}
          description={t.cta.subtitle}
          buttonText={t.cta.btn}
          buttonLink="/our-experts"
          buttonIcon="fa-solid fa-comments"
        />
      </div>
    </section>
  )
}

export default CTA

