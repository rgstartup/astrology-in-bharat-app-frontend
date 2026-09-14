"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import {
  Card,
  CardContent,
  Button,
  Skeleton,
  useDashboardOverview,
  usePersonalHoroscope,
} from "@/features/dashboard";
import {
  Sun,
  Moon,
  Compass,
  Star,
  Sparkles,
  Heart,
  Briefcase,
  Coins,
  Smile,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Clock,
  Palette,
  Hash,
} from "lucide-react";

export default function MyHoroscopePage() {
  const [selectedDay, setSelectedDay] = useState<"yesterday" | "today" | "tomorrow">(
    "today"
  );
  const { astrologyDetails, hasBirthDetails } = useDashboardOverview();

  const userSign = (
    astrologyDetails?.sunSign ||
    astrologyDetails?.moonSign ||
    "gemini"
  ).toLowerCase();

  const { data: horoscope, isLoading } = usePersonalHoroscope(
    userSign,
    selectedDay
  );

  const scores = horoscope?.scores || {
    relationships: 84,
    career: 76,
    finance: 71,
    wellbeing: 88,
  };

  const dayTabs: { id: "yesterday" | "today" | "tomorrow"; label: string }[] = [
    { id: "yesterday", label: "Yesterday" },
    { id: "today", label: "Today" },
    { id: "tomorrow", label: "Tomorrow" },
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="border-b border-orange-100/80 pb-6">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1.5 rounded-lg bg-amber-100 text-amber-700">
            <Sun className="w-4 h-4" />
          </span>
          <span className="text-xs font-black uppercase tracking-wider text-amber-800 font-outfit">
            Personal Transit Forecast
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-[#301118] font-outfit tracking-tight">
              My Horoscope
            </h1>
            <p className="text-sm text-slate-600 font-medium mt-1">
              Personalized interpretation tuned to your Natal Sun, Moon, and Ascendant
            </p>
          </div>

          {/* Quick Vedic Badge */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-slate-700">
            <span className="px-3 py-1.5 rounded-xl bg-orange-100/60 text-[#ff6b00] border border-orange-200/50 flex items-center gap-1.5">
              <Sun className="w-3.5 h-3.5" />
              <span>{astrologyDetails?.sunSign || "Gemini"}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-700 border border-indigo-200/50 flex items-center gap-1.5">
              <Moon className="w-3.5 h-3.5" />
              <span>{astrologyDetails?.moonSign || "Taurus"} Moon</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 border border-purple-200/50 flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5" />
              <span>{astrologyDetails?.nakshatra || "Rohini"}</span>
            </span>
            <span className="px-3 py-1.5 rounded-xl bg-amber-50 text-amber-700 border border-amber-200/50 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5" />
              <span>{astrologyDetails?.ascendant || "Gemini"} Ascendant</span>
            </span>
          </div>
        </div>
      </div>

      {/* Day Navigation Tabs */}
      <div className="flex justify-center sm:justify-start">
        <div className="inline-flex p-1 rounded-2xl bg-orange-100/60 border border-orange-200/60 shadow-xs">
          {dayTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedDay(tab.id)}
              className={`px-5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
                selectedDay === tab.id
                  ? "bg-white text-[#ff6b00] shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (8 cols): Overall Interpretation & Aspect Scores */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="border-orange-200/80 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#ff6b00]">
                  Daily Vedic Synthesis
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#301118] font-outfit">
                  Overall Atmosphere
                </h2>
              </div>
              <span className="text-xs font-bold text-slate-400">
                {new Date().toLocaleDateString("en-IN", {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                })}
              </span>
            </div>

            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-full bg-orange-100" />
                <Skeleton className="h-6 w-5/6 bg-orange-100" />
                <Skeleton className="h-6 w-4/6 bg-orange-100" />
              </div>
            ) : (
              <div className="prose prose-slate max-w-none">
                <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
                  {horoscope?.summary}
                </p>
                <div className="mt-6 p-4 rounded-2xl bg-orange-50/60 border border-orange-100 flex items-start gap-3">
                  <Sparkles className="w-5 h-5 text-[#ff6b00] shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#ff6b00] mb-1 font-outfit">
                      Planetary Influence
                    </h4>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      {horoscope?.planetaryInfluence}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </Card>

          {/* Aspect Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card className="p-5 border-rose-100 bg-rose-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-rose-100 text-rose-600">
                    <Heart className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 font-outfit">
                    Love & Relationships
                  </h3>
                </div>
                <span className="text-sm font-black text-rose-600">
                  {scores.relationships}%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Open communication fosters genuine warmth. Excellent timing to address emotional depth with close companions.
              </p>
            </Card>

            <Card className="p-5 border-blue-100 bg-blue-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-blue-100 text-blue-600">
                    <Briefcase className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 font-outfit">
                    Career & Ambition
                  </h3>
                </div>
                <span className="text-sm font-black text-blue-600">
                  {scores.career}%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Strategic calculations yield fruit. Focus on structured execution rather than hasty commitments.
              </p>
            </Card>

            <Card className="p-5 border-amber-100 bg-amber-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-amber-100 text-amber-600">
                    <Coins className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 font-outfit">
                    Finance & Wealth
                  </h3>
                </div>
                <span className="text-sm font-black text-amber-600">
                  {scores.finance}%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Favorable for reviewing budgets and long-term security. Moderate speculative investments with discretion.
              </p>
            </Card>

            <Card className="p-5 border-emerald-100 bg-emerald-50/30">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="p-2 rounded-xl bg-emerald-100 text-emerald-600">
                    <Smile className="w-4 h-4" />
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 font-outfit">
                    Wellbeing & Vitality
                  </h3>
                </div>
                <span className="text-sm font-black text-emerald-600">
                  {scores.wellbeing}%
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                High mental resilience and steady vitality. A quick meditation or walk in nature recharges your prana.
              </p>
            </Card>
          </div>
        </div>

        {/* Right Column (4 cols): Lucky Elements & Guidance Card */}
        <div className="lg:col-span-4 space-y-6">
          {/* Lucky Elements */}
          <Card className="p-6 border-orange-200/80 bg-gradient-to-br from-amber-50/60 to-orange-50/40 shadow-xs">
            <h3 className="text-base font-bold text-[#301118] font-outfit mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#ff6b00]" />
              <span>Auspicious Elements</span>
            </h3>

            <div className="space-y-3.5">
              <div className="p-3 rounded-xl bg-white border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Hash className="w-4 h-4 text-amber-500" />
                  <span className="font-semibold">Lucky Number</span>
                </div>
                <span className="text-sm font-black text-slate-900">
                  {horoscope?.luckyNumber || 7}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Palette className="w-4 h-4 text-rose-500" />
                  <span className="font-semibold">Lucky Color</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {horoscope?.luckyColor || "Emerald & Saffron"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-white border border-orange-100 flex items-center justify-between">
                <div className="flex items-center gap-2.5 text-xs text-slate-600">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  <span className="font-semibold">Lucky Time</span>
                </div>
                <span className="text-xs font-bold text-slate-900">
                  {horoscope?.luckyTime || "10:30 AM - 12:00 PM"}
                </span>
              </div>
            </div>
          </Card>

          {/* Need Specific Consultation CTA */}
          <Card className="p-6 border-orange-200/80 bg-white text-center">
            <div className="w-12 h-12 rounded-2xl bg-orange-100 text-[#ff6b00] flex items-center justify-center mx-auto mb-3 shadow-xs">
              <Sun className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-slate-900 font-outfit mb-1.5">
              Need deep planetary analysis?
            </h4>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Consult a verified Vedic expert to understand current Mahadasha transits affecting your chart.
            </p>
            <Link href={PATHS.DASHBOARD_EXPERTS} className="no-underline block">
              <Button variant="default" size="sm" className="w-full justify-center">
                <span>Talk to an Astrologer</span>
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
