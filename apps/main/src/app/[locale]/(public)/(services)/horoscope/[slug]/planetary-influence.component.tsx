"use client";

import React from "react";
import { useTranslations } from "next-intl";

const PLANETS = [
  {
    name: "Sun",
    sign: "Taurus",
    status: "Positive",
    color: "text-emerald-500",
    icon: "bg-yellow-400",
  },
  {
    name: "Moon",
    sign: "Libra",
    status: "Neutral",
    color: "text-orange-500",
    icon: "bg-slate-300",
  },
  {
    name: "Mars",
    sign: "Pisces",
    status: "Positive",
    color: "text-emerald-500",
    icon: "bg-red-500",
  },
  {
    name: "Mercury",
    sign: "Gemini",
    status: "Positive",
    color: "text-emerald-500",
    icon: "bg-green-500",
  },
  {
    name: "Jupiter",
    sign: "Aries",
    status: "Very Positive",
    color: "text-emerald-600",
    icon: "bg-yellow-600",
  },
  {
    name: "Venus",
    sign: "Gemini",
    status: "Positive",
    color: "text-emerald-500",
    icon: "bg-indigo-300",
  },
  {
    name: "Saturn",
    sign: "Aquarius",
    status: "Neutral",
    color: "text-orange-500",
    icon: "bg-indigo-800",
  },
];

export default function PlanetaryInfluence() {
  const t = useTranslations("Horoscope");

  return (
    <div
      className="mt-8 rounded-3xl px-6 pb-4 pt-5 md:px-8 md:pb-5 md:pt-6 border border-[#F0E6DD] shadow-sm relative overflow-hidden bg-[#FFFDF9]"
      style={{
        backgroundImage: "url('/images/back-image.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {/* Title */}
      <h3 className="text-xl font-bold text-[#3D1A0B] mb-6 flex items-center gap-3">
        <i className="fa-solid fa-sun text-[#F26500]"></i>
        {t("planetaryInfluence.title")}
        <span className="text-[#E8D5C0] ml-2">←</span>
      </h3>

      {/* Horizontal Scroll List */}
      <div className="w-full overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex items-center gap-3 min-w-max">
          {PLANETS.map((planet, idx) => {
            const planetName =
              t(`planets.${planet.name}` as any) || planet.name;
            const signName =
              t(`zodiacNames.${planet.sign}` as any) || planet.sign;
            const statusName =
              t(`planetaryInfluence.status.${planet.status}` as any) ||
              planet.status;

            return (
              <div
                key={idx}
                className="bg-[#FFFDF9] rounded-xl p-3 border border-[#F0E6DD] shadow-sm flex flex-col items-center justify-center min-w-[110px]"
              >
                {/* Icon & Name Row */}
                <div className="flex items-center gap-2 mb-1">
                  <div
                    className={`w-5 h-5 rounded-full ${planet.icon} shadow-inner`}
                  ></div>
                  <h4 className="font-bold text-[#3D1A0B] text-[15px]">
                    {planetName}
                  </h4>
                </div>

                <p className="text-slate-500 text-[12px] mb-1.5">
                  {t("planetaryInfluence.inSign", { sign: signName })}
                </p>
                <span className={`text-[11px] font-bold ${planet.color}`}>
                  {statusName}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
