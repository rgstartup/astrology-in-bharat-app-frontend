"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import { PERSONALIZED_RECOMMENDATIONS } from "../data/recommendations.data";

export function PersonalizedRecs() {
  const recommendations = PERSONALIZED_RECOMMENDATIONS;

  return (
    <div className="mb-8">
      <div className="mb-4">
        <div className="flex items-center gap-1.5 mb-1">
          <Sparkles className="w-3.5 h-3.5 text-[#ff6b00]" />
          <span className="text-[10px] font-black uppercase tracking-wider text-[#ff6b00] font-outfit">
            Curated Insights
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-[#301118] font-outfit">
          Recommended For You
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Based on your astrology profile and planetary alignment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const Icon = rec.icon;
          return (
            <Card
              key={rec.title}
              className={`border-orange-100/90 bg-gradient-to-br ${rec.bgColor} bg-white hover:shadow-md transition-all duration-200 p-5 sm:p-6 flex flex-col justify-between`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${rec.iconColor} flex items-center justify-center shadow-xs`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100/70 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {rec.badge}
                  </span>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit mb-1.5">
                  {rec.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                  {rec.desc}
                </p>
              </div>

              <Link href={rec.href} className="no-underline block">
                <Button
                  variant="outline"
                  className="w-full justify-between font-bold text-xs sm:text-sm hover:bg-[#ff6b00] hover:text-white hover:border-[#ff6b00] transition-colors"
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
