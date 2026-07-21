"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useLanguageStore, horoscopeTranslations } from "@repo/store";
import { ZodiacSignsData } from "@/components/features/services/zodiac";
import HeroComponent from "./hero.component";
import ZodiacGrid from "./zodiac-grid.component";
import HoroscopeSidebar from "./horoscope-sidebar.component";
import HoroscopeSeoContent from "./horoscope-seo-content.component";

const HoroscopeContent = () => {
  const router = useRouter();
  const { lang } = useLanguageStore();
  const t = horoscopeTranslations[lang];
  const [activeTab, setActiveTab] = useState("daily");
  const [signPreviews, setSignPreviews] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch preview for all signs.
    const fetchAllSigns = async () => {
      const signs = ZodiacSignsData.map((s) => s.title.toLowerCase());
      const previews: Record<string, string> = {};
      
      await Promise.all(
        signs.map(async (sign) => {
          const [res, err] = await api.get<any>(`/astrology/horoscope-daily?sign=${sign}&lang=${lang}`);
          if (!err && res?.data?.predictions) {
            const overview = res.data.predictions.find((p: any) => p.type === 'love')?.description || res.data.predictions[0]?.description;
            if (overview) {
              previews[sign.charAt(0).toUpperCase() + sign.slice(1)] = overview.length > 80 ? overview.substring(0, 80) + '...' : overview;
            }
          }
        })
      );
      setSignPreviews(previews);
    };
    fetchAllSigns();
  }, [lang]);

  const tabs = [
    { id: "daily", label: t.tabs.daily },
    { id: "weekly", label: t.tabs.weekly },
    { id: "monthly", label: t.tabs.monthly },
    { id: "yearly", label: t.tabs.yearly },
  ];

  const handleSignSelect = (sign: any) => {
    router.push(`/horoscope/${sign.title.toLowerCase()}`);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen pb-20">
      <HeroComponent />

      {/* Tabs */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 mt-6">
        <div className="bg-[#FAF4EE] p-2 rounded-2xl flex flex-col md:flex-row items-center gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3.5 rounded-xl text-[14px] font-bold transition-all flex items-center gap-2 w-full md:flex-1 justify-center ${
                activeTab === tab.id
                  ? "bg-[#2D1205] text-white shadow-md"
                  : "bg-white text-[#3D1A0B] hover:bg-gray-50 border border-[#F0E6DD]"
              }`}
            >
              <i className={`fa-regular fa-calendar text-[#F26500] text-lg`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Left Column (Zodiac Grid) */}
          <div className="flex-1 w-full">
            <ZodiacGrid onSelectSign={handleSignSelect} signPreviews={signPreviews} activeTab={activeTab} />
            
            {/* Bottom CTA (Generate My Horoscope) */}
            <div className="bg-[#FFF8F0] border border-[#E8D5C0] rounded-xl p-4 sm:p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 relative opacity-30 shrink-0 flex items-center justify-center">
                  <i className="fa-solid fa-dharmachakra text-[#F26500] text-[40px] sm:text-[48px]"></i>
                </div>
                <div>
                  <h3 className="font-bold text-[#3D1A0B] text-[15px] sm:text-[18px] leading-tight sm:leading-normal">{t.bottomCta.title}</h3>
                  <p className="text-gray-800 text-[12px] sm:text-[13px] mt-0.5">{t.bottomCta.subtitle}</p>
                </div>
              </div>
              <button className="bg-transparent border border-[#F26500] text-[#F26500] hover:bg-[#F26500] hover:text-white transition-colors px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg text-sm font-bold whitespace-nowrap w-full sm:w-auto">
                {t.bottomCta.btn}
              </button>
            </div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="w-full lg:w-[350px] shrink-0">
            <HoroscopeSidebar />
          </div>

        </div>
      </div>

      {/* Very Bottom CTA (Talk to Expert) */}
      <div className="max-w-[1300px] mx-auto px-4 md:px-8 mt-12">
        <div className="bg-[#2D1205] rounded-[24px] p-5 md:p-8 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6 border border-[#3D1A0B]">
          <div className="relative z-10 w-full text-center md:text-left">
            <h3 className="text-[17px] sm:text-[19px] md:text-[22px] font-serif font-bold text-[#F26500] mb-2 leading-tight md:leading-normal">{t.bottomCta.templeTitle}</h3>
            <p className="text-white/80 text-[13px] md:text-[14px]">{t.bottomCta.templeSubtitle}</p>
          </div>
          <div className="relative z-10">
            <Link href="/our-experts" className="bg-[#F26500] hover:bg-orange-600 transition-colors text-white text-[15px] font-bold px-6 py-3 rounded-xl flex items-center justify-center gap-2 whitespace-nowrap">
              <i className="fa-solid fa-comments"></i> {t.bottomCta.templeBtn}
            </Link>
          </div>
          {/* Decorative */}
          <div className="absolute right-[-20px] bottom-[-60px] opacity-10 pointer-events-none transform rotate-45">
            <i className="fa-solid fa-dharmachakra text-[#F26500] text-[200px]"></i>
          </div>
        </div>
      </div>

      {/* SEO/Content Section */}
      <HoroscopeSeoContent />

    </div>
  );
};

const HoroscopePage = () => {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">Loading...</div>}>
      <HoroscopeContent />
    </Suspense>
  );
};

export default HoroscopePage;
