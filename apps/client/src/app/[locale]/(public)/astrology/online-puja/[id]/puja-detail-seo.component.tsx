"use client";

import React from "react";
import { useTranslations } from "next-intl";

export default function PujaDetailSeoContent({
  pujaName,
}: {
  pujaName: string;
}) {
  const t = useTranslations("PujaTranslations");
  const safeName = pujaName || t("seo.defaultPujaName");

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12 mt-2">
      <section className="bg-[#FFFDF9] rounded-3xl p-6 md:p-10 border border-[#F0E0D0] shadow-[0_4px_15px_0_rgba(0,0,0,0.03)]">
        <h2 className="text-2xl font-bold md:font-black text-[#1A1A1A] mb-6 flex items-center gap-3 border-b-2 border-[#FF5500] inline-flex pb-2">
          {t("seo.title", { name: safeName })}
        </h2>

        <p className="text-slate-600 text-[15px] leading-relaxed mb-8">
          {t("seo.intro", { name: safeName })}
        </p>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 mb-10 rounded-r-xl">
          <h3 className="text-[17px] font-bold text-blue-900 mb-2 flex items-center gap-2">
            {t("seo.whyOnlineTitle", { name: safeName })}
          </h3>
          <p className="text-blue-800 text-[14.5px] leading-relaxed">
            {t("seo.whyOnlineDesc", { name: safeName })}
          </p>
        </div>

        <div className="mb-10">
          <h3 className="text-xl font-bold md:font-black text-[#1A1A1A] mb-6">
            {t("seo.benefitsHeading")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                {t("seo.karmicTitle")}
              </h4>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {t("seo.karmicDesc")}
              </p>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                {t("seo.grahaTitle")}
              </h4>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {t("seo.grahaDesc")}
              </p>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                {t("seo.clarityTitle")}
              </h4>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {t("seo.clarityDesc")}
              </p>
            </div>
            <div className="bg-[#FAF8F5] border border-[#EAE2D6] p-6 rounded-2xl hover:shadow-md transition-shadow">
              <h4 className="font-bold text-[#FF5500] text-[17px] mb-2 flex items-center gap-2">
                {t("seo.successTitle")}
              </h4>
              <p className="text-[14px] text-slate-600 leading-relaxed">
                {t("seo.successDesc")}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-orange-50 border-l-4 border-[#FF5500] p-6 mb-10 rounded-r-xl">
          <p className="text-[#993E00] text-[15px] font-medium leading-relaxed">
            {t("seo.muhurat", { name: safeName })}
          </p>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold md:font-black text-[#1A1A1A] mb-6">
            {t("seo.faqHeading")}
          </h3>

          <div className="space-y-6">
            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
              <h4 className="font-bold text-[#FF5500] text-[16px] mb-2">
                {t("seo.faq1Q", { name: safeName })}
              </h4>
              <p className="text-slate-600 text-[14.5px] leading-relaxed">
                {t("seo.faq1A")}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
              <h4 className="font-bold text-[#FF5500] text-[16px] mb-2">
                {t("seo.faq2Q")}
              </h4>
              <p className="text-slate-600 text-[14.5px] leading-relaxed">
                {t("seo.faq2A")}
              </p>
            </div>

            <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EAE2D6]">
              <h4 className="font-bold text-[#FF5500] text-[16px] mb-2">
                {t("seo.faq3Q")}
              </h4>
              <p className="text-slate-600 text-[14.5px] leading-relaxed">
                {t("seo.faq3A")}
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
