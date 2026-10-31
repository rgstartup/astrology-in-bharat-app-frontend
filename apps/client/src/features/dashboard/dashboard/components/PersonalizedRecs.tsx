"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, ArrowRight } from "@repo/design/lucide";
import { PERSONALIZED_RECOMMENDATIONS } from "../data/recommendations.data";

/**
 * Curated insight tiles matched to the user's astrology profile
 * and planetary alignment.
 */
export function PersonalizedRecs() {
  const recommendations = PERSONALIZED_RECOMMENDATIONS;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#111111]" />
          <span className="font-sans text-[10px] font-medium tracking-wide text-[#7b7b78]">
            Curated insights
          </span>
        </div>
        <h2 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-[#111111]">
          Recommended for you
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#626260]">
          Based on your astrology profile and planetary alignment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card
              key={rec.title}
              className="hover:border-[#111111] p-6 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-full ${rec.iconColor} flex items-center justify-center`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="font-sans text-[10px] font-medium text-[#111111] bg-white border border-[#d3cec6] px-2.5 py-0.5 rounded-full tracking-wide">
                    {rec.badge}
                  </span>
                </div>

                <h3 className="font-sans text-base sm:text-lg font-medium tracking-tight text-[#111111] mb-1.5">
                  {rec.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-[#626260] leading-relaxed mb-6">
                  {rec.desc}
                </p>
              </div>

              <Link href={rec.href} className="no-underline block">
                <Button
                  variant="outline"
                  className="w-full justify-between rounded-full text-xs sm:text-sm transition-colors"
                >
                  <span>{rec.cta}</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

export default PersonalizedRecs;
