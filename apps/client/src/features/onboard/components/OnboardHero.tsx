"use client";

import React from "react";
import Image from "next/image";

export const OnboardHero: React.FC = () => {
  return (
    <div className="w-full flex flex-col justify-between h-full py-2">
      <div>
        {/* Brand Tagline */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange/10 border border-orange/20 text-orange text-xs font-bold uppercase tracking-wider mb-4">
          <i className="fa-solid fa-sparkles text-xs" />
          <span>Cosmic Onboarding</span>
        </div>

        {/* Welcome Message */}
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#301118] leading-tight mb-2">
          Welcome to <span className="text-orange">Astrology in Bharat</span>
        </h2>

        <p className="text-gray-600 text-xs sm:text-sm leading-relaxed mb-5 font-medium">
          Personalize your journey so our verified astrologers, tarot masters,
          and Vedic algorithms can chart your planetary positions with pinpoint
          accuracy.
        </p>

        {/* Featured Welcoming Temple Image */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden shadow-md border-2 border-orange/20 mb-5 group">
          <Image
            src="/images/onboard-welcome.jpg"
            alt="Welcome to Astrology In Bharat"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-bold tracking-wide flex items-center gap-1.5 drop-shadow-md">
              <i className="fa-solid fa-hands-pranam text-[#FFA726]" />
              <span>Namaste & Welcome</span>
            </span>
            <span className="text-[11px] font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 drop-shadow-md">
              शुभ स्वागतम्
            </span>
          </div>
        </div>

        {/* Astrology Quote Card */}
        <div className="relative p-4 rounded-2xl bg-white border border-orange/20 shadow-sm mb-5 overflow-hidden">
          <div className="absolute top-1 right-3 text-orange/10 text-4xl font-serif select-none pointer-events-none">
            “
          </div>
          <div className="relative z-10 flex gap-3">
            <div className="w-1 bg-orange rounded-full shrink-0" />
            <div>
              <p className="text-[#301118] text-xs sm:text-sm font-semibold italic leading-relaxed">
                “Millionaires don&apos;t use astrology, billionaires do.”
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-[11px] text-gray-500 font-bold">
                  — J.P. Morgan
                </span>
                <span className="text-[10px] text-orange font-semibold bg-orange/5 px-2 py-0.5 rounded-md">
                  यत् पिण्डे तत् ब्रह्माण्डे
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Perks / Badges */}
        <div className="space-y-2.5">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-gray-100">
            <div className="w-7 h-7 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <i className="fa-solid fa-star text-xs" />
            </div>
            <div>
              <h6 className="text-xs font-bold text-[#301118]">
                Precision Natal Chart (Kundli)
              </h6>
              <p className="text-[11px] text-gray-500">
                Calculated to the exact minute and geographical coordinates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/70 border border-gray-100">
            <div className="w-7 h-7 rounded-lg bg-[#4A1D1F]/10 text-[#4A1D1F] flex items-center justify-center shrink-0">
              <i className="fa-solid fa-user-shield text-xs" />
            </div>
            <div>
              <h6 className="text-xs font-bold text-[#301118]">
                100% Confidential & Secure
              </h6>
              <p className="text-[11px] text-gray-500">
                Your birth details are encrypted and shared only with your
                chosen expert.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
