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

function getScorePillClass(score: number): string {
  if (score >= 80) return "text-[#111111] bg-white border-[#d3cec6]";
  if (score >= 65) return "text-[#626260] bg-white border-[#d3cec6]";
  return "text-[#7b7b78] bg-white border-[#d3cec6]";
}

function getScoreBarClass(score: number): string {
  if (score >= 80) return "bg-[#111111]";
  if (score >= 65) return "bg-[#626260]";
  return "bg-[#7b7b78]";
}

/** Skeleton shown while the personal horoscope loads. */
function GuidanceLoading() {
  return (
    <Card className="mb-6 sm:mb-8 p-6 space-y-4">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-16 w-full" />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </Card>
  );
}

/** Qualitative label for a 0-100 aspect score. */
function ScoreLabel({ score }: { score: number }) {
  if (score >= 80) {
    return (
      <span
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${getScorePillClass(score)}`}
      >
        Excellent
      </span>
    );
  }
  if (score >= 65) {
    return (
      <span
        className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${getScorePillClass(score)}`}
      >
        Favorable
      </span>
    );
  }
  return (
    <span
      className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full border ${getScorePillClass(score)}`}
    >
      Moderate
    </span>
  );
}

/**
 * Daily horoscope summary for the dashboard: planetary overview,
 * four aspect scores, and lucky indicators for the user's sign.
 */
export function TodaysGuidanceCard({
  sign,
}: TodaysGuidanceCardProps) {
  const { data: horoscope, isLoading } = usePersonalHoroscope(sign);

  if (isLoading) {
    return <GuidanceLoading />;
  }

  const scores = horoscope?.scores || DEFAULT_HOROSCOPE_SCORES;

  const aspectItems = [
    {
      title: "Relationships",
      score: scores.relationships,
      icon: Heart,
    },
    {
      title: "Career & ambition",
      score: scores.career,
      icon: Briefcase,
    },
    {
      title: "Finance & wealth",
      score: scores.finance,
      icon: Coins,
    },
    {
      title: "Health & wellbeing",
      score: scores.wellbeing,
      icon: Activity,
    },
  ];

  return (
    <Card className="mb-6 sm:mb-8 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-[#ebe7e1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-[10px]">
              <Sun className="w-3 h-3 text-[#111111] mr-1" />
              <span>Daily cosmic transit</span>
            </Badge>
            <span className="font-sans text-xs font-medium text-[#626260] capitalize">
              {horoscope?.sign || "Gemini"} forecast
            </span>
          </div>
          <CardTitle className="text-xl">
            Today&apos;s astrological guidance
          </CardTitle>
        </div>

        <Link href={PATHS.DASHBOARD.HOROSCOPE} className="no-underline shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
          >
            <span>Full horoscope &amp; remedies</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        <div className="p-4 rounded-xl bg-[#f5f1ec] border border-[#ebe7e1] flex items-start gap-3">
          <div className="p-2 rounded-md bg-white border border-[#ebe7e1] text-[#111111] shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div className="space-y-1">
            <span className="font-sans text-xs font-medium text-[#7b7b78]">
              Planetary influence
            </span>
            <p className="font-sans text-xs sm:text-sm text-[#111111] leading-relaxed">
              {horoscope?.summary ||
                "A balanced day full of thoughtful decisions, positive communication, and opportunities for mindful progress."}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {aspectItems.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-3.5 rounded-xl border border-[#ebe7e1] bg-[#f5f1ec] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-[11px] font-medium text-[#626260] truncate">
                    {item.title}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-[#7b7b78] shrink-0" />
                </div>

                <div className="flex items-baseline justify-between mb-2">
                  <span className="font-sans text-xl font-medium text-[#111111]">
                    {item.score}
                    <span className="text-[10px] text-[#7b7b78]">
                      /100
                    </span>
                  </span>
                  <ScoreLabel score={item.score} />
                </div>

                <div className="w-full h-1.5 rounded-full bg-[#ebe7e1] overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${getScoreBarClass(item.score)}`}
                    style={{ width: `${item.score}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-[#ebe7e1] text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[#7b7b78]">Lucky color:</span>
              <span className="font-sans font-medium text-[#111111]">
                {horoscope?.luckyColor || "Emerald green"}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[#7b7b78]">Lucky number:</span>
              <span className="font-sans font-medium text-[#111111]">
                {horoscope?.luckyNumber || 7}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-sans text-[#7b7b78]">Auspicious time:</span>
              <span className="font-sans font-medium text-[#111111]">
                {horoscope?.luckyTime || "10:30 AM - 12:00 PM"}
              </span>
            </div>
          </div>

          <Link
            href={PATHS.DASHBOARD.HOROSCOPE}
            className="font-sans text-[11px] font-medium text-[#111111] hover:underline no-underline"
          >
            Check tomorrow&apos;s transit →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TodaysGuidanceCard;
