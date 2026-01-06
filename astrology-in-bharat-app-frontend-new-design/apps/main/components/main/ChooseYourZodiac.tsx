"use client";
import React from "react";
import { ZodiacSignsData } from "@/data/homePagaData";
import NextLink from "next/link";
const Link = NextLink as any;

const ChooseYourZodiac = () => {
  return (
    <section className="horoscopes-container light-back">
      <div className="container">
        <div className="light-card">
          <h2 className="title-line mb-3 c-1e0b0f">
            <span>Choose Your Zodiac Sign </span>
          </h2>
          <p className="text-center text-[#1a1a1a] mb-8 text-base font-medium">
            Discover Your Daily, Monthly and Yearly Horoscope
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {ZodiacSignsData.map((sign) => (
              <NextLink
                href={`/zodiac-signs/${sign.title.toLowerCase()}`}
                key={sign.id}
                className="block h-full group no-underline"
              >
                <div
                  className="bg-white overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center p-3 rounded-[10px] transition-all duration-300 ease-in-out text-[#1a1a1a] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] h-full flex flex-col items-center justify-center cursor-pointer"
                  style={{ border: "1px solid #daa23e73" }}
                >
                  <img
                    src={sign.image}
                    alt={sign.title}
                    className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110 mb-2"
                  />
                  <h3 className="text-lg font-semibold mb-0.5 text-[#1e0b0f]">
                    {sign.title}
                  </h3>
                  <p className="text-xs text-[#666] mb-0">{sign.date}</p>
                </div>
              </NextLink>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChooseYourZodiac;
