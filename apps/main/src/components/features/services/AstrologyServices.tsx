"use client";
import React from "react";
import homepageData from "../../../../public/data/homepage.json";
import ServiceCard from "./ServiceCard";
import NextLink from "next/link";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";

const Link = NextLink as any;

const AstrologyServices = () => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;

  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div className="bg-white p-5 md:p-6 rounded-[3px] shadow-[0_4px_9px_0_rgba(0,0,0,0.08)] mt-4">
          <h2 className="section-heading-premium">
            <span>{t.services.title}</span>
          </h2>
          <div className="overflow-hidden">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pt-1 pb-1">
              {homepageData.astrologyServices.map((service) => (
                  <div key={service.id} className="mb-4">
                    <Link
                      href="/our-experts"
                      className="block h-full no-underline hover:text-inherit"
                    >
                      <ServiceCard item={{ ...service, id: String(service.id) }} />
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
    </section>
  );
};

export default AstrologyServices;
