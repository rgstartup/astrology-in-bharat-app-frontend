"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import {
  Sun,
  Heart,
  Briefcase,
  Coins,
  Activity,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { usePersonalHoroscope } from "../hooks/usePersonalHoroscope";
import { DEFAULT_HOROSCOPE_SCORES } from "../data/horoscope.data";

export interface TodaysGuidanceCardProps {
  sign?: string;
}

export function TodaysGuidanceCard({
  sign,
}: TodaysGuidanceCardProps) {
  const { data: horoscope, isLoading } = usePersonalHoroscope(sign);

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-600 bg-emerald-50 border-emerald-200";
    if (score >= 65) return "text-amber-600 bg-amber-50 border-amber-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getScoreProgressBg = (score: number) => {
    if (score >= 80) return "bg-emerald-500";
    if (score >= 65) return "bg-amber-500";
    return "bg-orange-500";
  };

  if (isLoading) {
    return (
      <Card className="mb-6 sm:mb-8 border-orange-100 bg-white p-6 space-y-4">
        <Skeleton className="h-6 w-48 bg-orange-100" />
        <Skeleton className="h-16 w-full bg-orange-100" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-16 bg-orange-100 rounded-xl" />
          ))}
        </div>
      </Card>
    );
  }

  const scores = horoscope?.scores || DEFAULT_HOROSCOPE_SCORES;

  const aspectItems = [
    {
      title: "Relationships",
      score: scores.relationships,
      icon: Heart,
    },
    {
      title: "Career & Ambition",
      score: scores.career,
      icon: Briefcase,
    },
    {
      title: "Finance & Wealth",
      score: scores.finance,
      icon: Coins,
    },
    {
      title: "Health & Wellbeing",
      score: scores.wellbeing,
      icon: Activity,
    },
  ];

  return (
    <Card className="mb-6 sm:mb-8 border-orange-100/90 bg-white shadow-sm overflow-hidden">
      {/* Header bar */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-orange-50">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-[10px] tracking-wider uppercase">
              <Sun className="w-3 h-3 text-[#ff6b00] mr-1" />
              <span>Daily Cosmic Transit</span>
            </Badge>
            <span className="text-xs font-bold text-slate-500 capitalize">
              {horoscope?.sign || "Gemini"} Forecast
            </span>
          </div>
          <CardTitle className="text-xl font-black text-[#301118]">
            Today's Astrological Guidance
          </CardTitle>
        </div>

        <Link href={PATHS.DASHBOARD_HOROSCOPE} className="no-underline shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 hover:bg-orange-50 hover:text-[#ff6b00]"
          >
            <span>Full Horoscope & Remedies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* Core summary callout */}
        <div className="p-4 rounded-2xl bg-gradient-to-r from-orange-50/70 via-amber-50/40 to-transparent border border-orange-100/80 flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white text-[#ff6b00] shadow-2xs shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#ff6b00]">
              Planetary Influence
            </span>
            <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
              {horoscope?.summary ||
                "A balanced day full of thoughtful decisions, positive communication, and opportunities for mindful progress."}
            </p>
          </div>
        </div>

        {/* 4 Aspect Scores */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {aspectItems.map((item) => {
            const Icon = item.icon;
            const scoreClass = getScoreColor(item.score);
            const progressClass = getScoreProgressBg(item.score);
            return (
              <div
                key={item.title}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-600 truncate">
                    {item.title}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="text-xl font-black font-outfit text-slate-900">
                    {item.score}
                    <span className="text-[10px] text-slate-400 font-normal">
                      /100
                    </span>
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md border ${scoreClass}`}
                  >
                    {item.score >= 80
                      ? "Excellent"
                      : item.score >= 65
                      ? "Favorable"
                      : "Moderate"}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-1.5 rounded-full bg-slate-200/80 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${progressClass}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Lucky meta indicators */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-orange-50 text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Lucky Color:</span>
              <span className="font-bold text-slate-800">
                {horoscope?.luckyColor || "Emerald Green"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Lucky Number:</span>
              <span className="font-bold text-slate-800">
                {horoscope?.luckyNumber || 7}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400 font-medium">Auspicious Time:</span>
              <span className="font-bold text-slate-800">
                {horoscope?.luckyTime || "10:30 AM - 12:00 PM"}
              </span>
            </div>
          </div>

          <Link
            href={PATHS.DASHBOARD_HOROSCOPE}
            className="text-[11px] font-bold text-[#ff6b00] hover:underline no-underline"
          >
            Check Tomorrow's Transit →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysGuidanceCard;
