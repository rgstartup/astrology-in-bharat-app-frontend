"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLanguageStore, horoscopeTranslations } from "@repo/store";
import { api } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";

const HoroscopeSidebar = () => {
  const { lang } = useLanguageStore();
  const t = horoscopeTranslations[lang];
  const [formattedDate, setFormattedDate] = useState("");
  const [panchang, setPanchang] = useState<any>(null);
  const [planets, setPlanets] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date().toLocaleDateString(lang === "hi" ? "hi-IN" : "en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      weekday: "long"
    });
    setFormattedDate(today);

    const fetchAstroData = async () => {
      const datetime = new Date().toISOString();
      const lat = "28.6139"; // default Delhi
      const lon = "77.2090";
      
      const [panchangRes] = await api.get<any>(`${API_ROUTES.ASTROLOGY.PANCHANG}?datetime=${datetime}&lat=${lat}&lon=${lon}&lang=${lang}`);
      if (panchangRes?.data) {
        setPanchang(panchangRes.data);
      }

      const [planetRes] = await api.get<any>(`${API_ROUTES.ASTROLOGY.PLANETARY_POSITIONS}?datetime=${datetime}&lat=${lat}&lon=${lon}&lang=${lang}`);
      if (planetRes?.data) {
        setPlanets(planetRes.data);
      }
    };
    fetchAstroData();
  }, [lang]);

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    return new Date(isoString).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-US", {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const defaultPlanets = [
    { name: t.planets.Sun, sign: t.zodiacNames.Taurus },
    { name: t.planets.Moon, sign: t.zodiacNames.Taurus },
    { name: t.planets.Mars, sign: t.zodiacNames.Pisces },
    { name: t.planets.Mercury, sign: t.zodiacNames.Gemini },
    { name: t.planets.Jupiter, sign: t.zodiacNames.Aries },
    { name: t.planets.Venus, sign: t.zodiacNames.Gemini },
    { name: t.planets.Saturn, sign: t.zodiacNames.Aquarius },
    { name: t.planets.Rahu, sign: t.zodiacNames.Pisces },
    { name: t.planets.Ketu, sign: t.zodiacNames.Virgo },
  ];

  const displayPlanets = planets && planets.length > 0 
    ? planets.map(p => ({ 
        name: t.planets[p.name as keyof typeof t.planets] || p.name, 
        sign: t.zodiacNames[p.zodiac?.name as keyof typeof t.zodiacNames] || p.zodiac?.name || p.position || "Unknown" 
      })) 
    : defaultPlanets;

  return (
    <div className="flex flex-col gap-6 w-full">
      
      {/* Today's Overview */}
      <div className="bg-[#FAF8F5] rounded-xl p-6 border border-[#E8D5C0]">
        <h3 className="text-[18px] font-bold text-[#3D1A0B] mb-5 flex items-center gap-2">
          <i className="fa-regular fa-sun text-[#F26500]"></i> {t.sidebar.overview}
        </h3>
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <i className="fa-regular fa-calendar text-[#F26500] mt-1"></i>
            <div>
              <p className="text-[13px] font-bold text-[#3D1A0B]">{t.sidebar.date}</p>
              <p className="text-[13px] text-gray-800">{formattedDate || "18 May 2024, Saturday"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <i className="fa-regular fa-clock text-[#F26500] mt-1"></i>
            <div>
              <p className="text-[13px] font-bold text-[#3D1A0B]">{t.sidebar.tithi}</p>
              <p className="text-[13px] text-gray-800">{panchang?.tithi?.details?.[0]?.name || panchang?.tithi?.name || "Shukla Paksha, Dashami"}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <i className="fa-regular fa-star text-[#F26500] mt-1"></i>
            <div>
              <p className="text-[13px] font-bold text-[#3D1A0B]">{t.sidebar.nakshatra}</p>
              <p className="text-[13px] text-gray-800">{panchang?.nakshatra?.details?.[0]?.name || panchang?.nakshatra?.name || "Rohini"}</p>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-2 pt-4 border-t border-[#E8D5C0]">
            <div className="flex flex-col items-center">
              <i className="fa-solid fa-cloud-sun text-[#F26500] text-lg mb-1"></i>
              <p className="text-[12px] font-bold text-[#3D1A0B]">{t.sidebar.sunrise}</p>
              <p className="text-[11px] text-gray-700">{formatTime(panchang?.sunrise) || "05:33 AM"}</p>
            </div>
            <div className="flex flex-col items-center">
              <i className="fa-solid fa-moon text-[#F26500] text-lg mb-1"></i>
              <p className="text-[12px] font-bold text-[#3D1A0B]">{t.sidebar.sunset}</p>
              <p className="text-[11px] text-gray-700">{formatTime(panchang?.sunset) || "07:05 PM"}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Planetary Position */}
      <div className="bg-[#FAF8F5] rounded-xl p-6 border border-[#E8D5C0]">
        <h3 className="text-[18px] font-bold text-[#3D1A0B] mb-5 flex items-center gap-2">
          <i className="fa-solid fa-sun text-[#F26500]"></i> {t.sidebar.planetaryPosition}
        </h3>
        <div className="flex flex-col gap-3">
          {displayPlanets.map((planet, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <i className="fa-solid fa-dharmachakra text-[#F26500] text-[10px]"></i>
              <div className="flex-1 text-[13px] font-bold text-[#3D1A0B]">{planet.name}</div>
              <div className="text-[13px] text-gray-800">{planet.sign}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Get Personalized Horoscope */}
      <div className="bg-[#2D1205] rounded-xl p-6 relative overflow-hidden border border-[#3D1A0B]">
        <div className="relative z-10">
          <h3 className="text-[15px] sm:text-[18px] font-bold text-[#F26500] mb-2 whitespace-nowrap">{t.sidebar.personalizedTitle}</h3>
          <p className="text-white/80 text-[13px] leading-relaxed mb-6">
            {t.sidebar.personalizedSubtitle}
          </p>
          <Link href="/our-experts" className="bg-[#F26500] hover:bg-orange-600 transition-colors text-white text-[14px] font-bold px-4 py-2 rounded-lg flex items-center justify-center gap-2 w-fit">
            <i className="fa-solid fa-comments"></i> {t.sidebar.talkToExpert}
          </Link>
        </div>
        {/* Decorative Mandala */}
        <div className="absolute right-[-40px] bottom-[-40px] opacity-[0.15] pointer-events-none">
          <i className="fa-solid fa-dharmachakra text-[#F26500] text-[150px]"></i>
        </div>
      </div>

    </div>
  );
};

export default HoroscopeSidebar;
