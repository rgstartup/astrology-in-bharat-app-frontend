"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, ShieldCheck } from "lucide-react";

export const OnboardHero: React.FC = () => {
  return (
    <div className="w-full flex flex-col justify-between h-full py-2">
      <div>
        {/* Brand Tagline */}
        <Badge
          variant="saffron"
          className="mb-4 px-3 py-1 text-xs font-semibold gap-1.5"
        >
          <Sparkles className="size-3.5" />
          <span>Cosmic Onboarding</span>
        </Badge>

        {/* Welcome Message */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-foreground leading-tight mb-2">
          Welcome to <span className="text-orange">Astrology in Bharat</span>
        </h1>

        <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed mb-5 font-medium">
          Personalize your journey so our verified astrologers, tarot masters,
          and Vedic algorithms can chart your planetary positions with pinpoint
          accuracy.
        </p>

        {/* Elevated Trust Badges */}
        <div className="space-y-2.5 mb-5">
          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-orange/15 shadow-xs">
            <div className="size-7 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0">
              <Star className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                Precision Natal Chart (Kundli)
              </h3>
              <p className="text-xs text-muted-foreground">
                Calculated to the exact minute and geographical coordinates.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/80 border border-orange/15 shadow-xs">
            <div className="size-7 rounded-lg bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                100% Confidential & Secure
              </h3>
              <p className="text-xs text-muted-foreground">
                Your birth details are encrypted and shared only with your
                chosen expert.
              </p>
            </div>
          </div>
        </div>

        {/* Featured Welcoming Temple Image */}
        <div className="relative w-full h-48 sm:h-56 md:h-64 rounded-2xl overflow-hidden shadow-md border-2 border-orange/20 mb-5 group">
          <Image
            src="/images/onboard-welcome.jpg"
            alt="Welcome to Astrology In Bharat"
            fill
            className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none" />
          <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
            <span className="text-xs font-bold tracking-wide flex items-center gap-1.5 drop-shadow-md">
              <Sparkles className="size-3.5 text-amber-400" />
              <span>Namaste & Welcome</span>
            </span>
            <span className="text-xs font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full border border-white/20 drop-shadow-md">
              शुभ स्वागतम्
            </span>
          </div>
        </div>

        {/* Astrology Quote Card */}
        <div className="relative p-4 rounded-2xl bg-white border border-orange/20 shadow-xs overflow-hidden">
          <div className="absolute top-1 right-3 text-orange/10 text-4xl font-serif select-none pointer-events-none">
            “
          </div>
          <div className="relative z-10 flex gap-3">
            <div className="w-1 bg-orange rounded-full shrink-0" />
            <div>
              <p className="text-foreground text-xs sm:text-sm font-semibold italic leading-relaxed">
                “Millionaires don&apos;t use astrology, billionaires do.”
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-xs text-muted-foreground font-bold">
                  — J.P. Morgan
                </span>
                <span className="text-xs text-orange font-semibold bg-orange/10 px-2 py-0.5 rounded-md">
                  यत् पिण्डे तत् ब्रह्माण्डे
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
