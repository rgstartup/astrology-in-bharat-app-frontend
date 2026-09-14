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
  SAMPLE_PLANETS_TABLE,
  SAMPLE_HOUSES_LIST,
  SAMPLE_VIMSHOTTARI_TIMELINE,
  SAMPLE_YOGAS_LIST,
  SAMPLE_DOSHA_ANALYSIS,
} from "@/features/dashboard";
import {
  Scroll,
  Calendar,
  Clock,
  MapPin,
  Edit3,
  Orbit,
  Home,
  Star,
  Hourglass,
  ShieldAlert,
  FileText,
  Sparkles,
  Info,
  CheckCircle2,
} from "lucide-react";

type KundliTab =
  | "chart"
  | "planets"
  | "houses"
  | "nakshatra"
  | "dasha"
  | "yogas"
  | "doshas"
  | "reports";

export default function MyKundliPage() {
  const [activeTab, setActiveTab] = useState<KundliTab>("chart");
  const { user, astrologyDetails, hasBirthDetails, isLoadingAstrology } =
    useDashboardOverview();

  // If birth details are missing, show prompt to add birth details
  if (!hasBirthDetails) {
    return (
      <div className="max-w-2xl mx-auto py-12 text-center animate-in fade-in duration-300">
        <Card className="border-2 border-dashed border-orange-300 p-8 sm:p-12 bg-white text-center">
          <div className="w-16 h-16 rounded-3xl bg-orange-100 text-[#ff6b00] flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Scroll className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit mb-2">
            Your Kundli Isn't Generated Yet
          </h2>

          <p className="text-sm text-slate-600 max-w-md mx-auto mb-6 leading-relaxed">
            Add your exact birth date, time, and birthplace in your profile to instantly
            unlock your Vedic birth chart, planetary houses, and dasha cycles without entering
            details each time.
          </p>

          <Link href={PATHS.DASHBOARD_PROFILE} className="no-underline">
            <Button variant="default" className="shadow-md font-bold">
              <span>Add Birth Details</span>
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  const raw = astrologyDetails?.raw;

  const tabs: { id: KundliTab; label: string; icon: any }[] = [
    { id: "chart", label: "Birth Chart", icon: Scroll },
    { id: "planets", label: "Planets", icon: Orbit },
    { id: "houses", label: "Houses", icon: Home },
    { id: "nakshatra", label: "Nakshatra", icon: Star },
    { id: "dasha", label: "Dasha", icon: Hourglass },
    { id: "yogas", label: "Yogas", icon: Sparkles },
    { id: "doshas", label: "Doshas", icon: ShieldAlert },
    { id: "reports", label: "Reports", icon: FileText },
  ];

  const formattedDob = astrologyDetails?.birthDate
    ? new Date(astrologyDetails.birthDate).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "22 February 2002";

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header Profile Section */}
      <Card className="border-orange-200/90 bg-gradient-to-r from-[#FFFDF9] via-[#FFF9F2] to-[#FFF3E5] shadow-xs p-6 sm:p-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-1 rounded-md bg-orange-100 text-[#ff6b00]">
                <Scroll className="w-4 h-4" />
              </span>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#ff6b00] font-outfit">
                Saved Vedic Janam Kundli
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
              {user?.name || "Client"}'s Kundli
            </h1>

            <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs text-slate-600 pt-1 font-medium">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-orange-500" />
                <span>{formattedDob}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-orange-500" />
                <span>{astrologyDetails?.birthTime || "20:16"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-orange-500" />
                <span>{astrologyDetails?.birthPlace || "Ludhiana, India"}</span>
              </div>
            </div>
          </div>

          {/* Action: Edit Birth Details */}
          <Link href={PATHS.DASHBOARD_PROFILE} className="no-underline shrink-0">
            <Button
              variant="outline"
              size="sm"
              className="border-orange-200 hover:bg-orange-100/60 font-bold"
            >
              <Edit3 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
              <span>Edit Birth Details</span>
            </Button>
          </Link>
        </div>
      </Card>

      {/* Exploration Navigation Tabs */}
      <div className="flex overflow-x-auto pb-2 border-b border-orange-100 gap-1.5 sm:gap-2 no-scrollbar">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                isActive
                  ? "bg-[#ff6b00] text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-orange-50/70 border border-orange-100/70"
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {/* 1. BIRTH CHART TAB */}
        {activeTab === "chart" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Chart SVG Representation / Diamond Vedic Chart */}
            <div className="lg:col-span-8">
              <Card className="p-6 sm:p-8 border-orange-200/80 bg-white shadow-sm flex flex-col items-center justify-center">
                <div className="w-full flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
                  <h3 className="text-base font-bold text-slate-900 font-outfit">
                    Lagna Chart (D1)
                  </h3>
                  <span className="text-xs font-semibold text-slate-400">
                    Ascendant: {astrologyDetails?.ascendant || "Gemini"}
                  </span>
                </div>

                {/* Classical Vedic Diamond Chart SVG */}
                <div className="w-full max-w-md aspect-square relative my-4">
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full text-slate-800 drop-shadow-xs"
                  >
                    {/* Outer Square */}
                    <rect
                      x="10"
                      y="10"
                      width="380"
                      height="380"
                      fill="#FFFDF9"
                      stroke="#f97316"
                      strokeWidth="2.5"
                    />

                    {/* Diagonals */}
                    <line
                      x1="10"
                      y1="10"
                      x2="390"
                      y2="390"
                      stroke="#f97316"
                      strokeWidth="2"
                    />
                    <line
                      x1="390"
                      y1="10"
                      x2="10"
                      y2="390"
                      stroke="#f97316"
                      strokeWidth="2"
                    />

                    {/* Inner Diamond */}
                    <polygon
                      points="200,10 390,200 200,390 10,200"
                      fill="#FFF9F2"
                      stroke="#f97316"
                      strokeWidth="2"
                    />

                    {/* House labels & planets */}
                    <text
                      x="200"
                      y="100"
                      textAnchor="middle"
                      className="font-bold text-xs fill-orange-700"
                    >
                      1 (Lagna)
                    </text>
                    <text
                      x="200"
                      y="120"
                      textAnchor="middle"
                      className="font-black text-[13px] fill-slate-900"
                    >
                      {astrologyDetails?.ascendant || "Gemini"}
                    </text>

                    <text
                      x="110"
                      y="60"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      2 • Cancer
                    </text>
                    <text
                      x="60"
                      y="110"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      3 • Leo
                    </text>
                    <text
                      x="110"
                      y="200"
                      textAnchor="middle"
                      className="font-bold text-xs fill-orange-700"
                    >
                      4 (Sukha)
                    </text>
                    <text
                      x="60"
                      y="290"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      5 • Libra
                    </text>
                    <text
                      x="110"
                      y="340"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      6 • Scorpio
                    </text>

                    <text
                      x="200"
                      y="300"
                      textAnchor="middle"
                      className="font-bold text-xs fill-orange-700"
                    >
                      7 (Jaya)
                    </text>
                    <text
                      x="200"
                      y="320"
                      textAnchor="middle"
                      className="font-black text-[13px] fill-slate-900"
                    >
                      Sagittarius
                    </text>

                    <text
                      x="290"
                      y="340"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      8 • Capricorn
                    </text>
                    <text
                      x="340"
                      y="290"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      9 • Aquarius
                    </text>
                    <text
                      x="290"
                      y="200"
                      textAnchor="middle"
                      className="font-bold text-xs fill-orange-700"
                    >
                      10 (Karma)
                    </text>
                    <text
                      x="340"
                      y="110"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      11 • Aries
                    </text>
                    <text
                      x="290"
                      y="60"
                      textAnchor="middle"
                      className="font-bold text-[11px] fill-slate-500"
                    >
                      12 • Taurus (Moon)
                    </text>
                  </svg>
                </div>

                <p className="text-xs text-slate-500 text-center max-w-sm mt-2">
                  North Indian Diamond format. First house begins at the top center diamond representing your physical constitution and life vitality.
                </p>
              </Card>
            </div>

            {/* Quick Chart Summary */}
            <div className="lg:col-span-4 space-y-4">
              <Card className="p-5 border-orange-200/80 bg-white">
                <h4 className="text-sm font-bold text-slate-900 font-outfit mb-3 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff6b00]" />
                  <span>Key Pillars</span>
                </h4>

                <div className="space-y-2.5 text-xs">
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-500">Lagna / Ascendant:</span>
                    <span className="font-bold text-slate-900">
                      {astrologyDetails?.ascendant || "Gemini"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-500">Moon Sign (Rashi):</span>
                    <span className="font-bold text-slate-900">
                      {astrologyDetails?.moonSign || "Taurus"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-500">Sun Sign:</span>
                    <span className="font-bold text-slate-900">
                      {astrologyDetails?.sunSign || "Gemini"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50">
                    <span className="text-slate-500">Birth Star (Nakshatra):</span>
                    <span className="font-bold text-slate-900">
                      {astrologyDetails?.nakshatra || "Rohini"}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Consultation CTA */}
              <Card className="p-5 border-orange-200/80 bg-gradient-to-br from-orange-50 to-amber-50">
                <h4 className="text-sm font-bold text-slate-900 font-outfit mb-1">
                  Have questions on your chart?
                </h4>
                <p className="text-xs text-slate-600 mb-3">
                  Ask our verified astrologers about specific yogas, career houses, and timing.
                </p>
                <Link href={PATHS.DASHBOARD_EXPERTS} className="no-underline block">
                  <Button variant="default" size="sm" className="w-full justify-center">
                    <span>Ask Astrologer</span>
                  </Button>
                </Link>
              </Card>
            </div>
          </div>
        )}

        {/* 2. PLANETS TAB */}
        {activeTab === "planets" && (
          <Card className="p-6 border-orange-200/80 bg-white">
            <h3 className="text-lg font-bold text-slate-900 font-outfit mb-4">
              Planetary Positions (Graha Sthiti)
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-orange-100 text-slate-500 uppercase tracking-wider font-semibold">
                    <th className="py-3 px-4">Planet</th>
                    <th className="py-3 px-4">Rashi (Sign)</th>
                    <th className="py-3 px-4">Degree</th>
                    <th className="py-3 px-4">Nakshatra</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-800">
                  {SAMPLE_PLANETS_TABLE.map((row) => (
                    <tr key={row.planet} className="hover:bg-orange-50/40 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.planet}</td>
                      <td className="py-3 px-4">{row.sign}</td>
                      <td className="py-3 px-4 font-mono">{row.deg}</td>
                      <td className="py-3 px-4">{row.nak}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-[#ff6b00] font-bold text-[10px]">
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        )}

        {/* 3. HOUSES TAB */}
        {activeTab === "houses" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SAMPLE_HOUSES_LIST.map((h) => (
              <Card key={h.house} className="p-4 border-orange-100 bg-white">
                <span className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider block mb-1 font-outfit">
                  {h.house}
                </span>
                <h4 className="text-sm font-bold text-slate-900 mb-1">{h.sign}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{h.sig}</p>
              </Card>
            ))}
          </div>
        )}

        {/* 4. NAKSHATRA TAB */}
        {activeTab === "nakshatra" && (
          <Card className="p-6 sm:p-8 border-orange-200/80 bg-white space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-outfit">
                  Birth Star: {astrologyDetails?.nakshatra || "Rohini"}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Nakshatra Lord: {astrologyDetails?.nakshatraLord || "Moon"} • Deity: Prajapati (Brahma)
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Gana</span>
                <span className="text-sm font-bold text-slate-900">Manushya (Human)</span>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Nadi</span>
                <span className="text-sm font-bold text-slate-900">Antya Nadi</span>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Animal Yoni</span>
                <span className="text-sm font-bold text-slate-900">Serpent (Sarpa)</span>
              </div>
              <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
                <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Element</span>
                <span className="text-sm font-bold text-slate-900">Earth (Prithvi)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Rohini Nakshatra symbolizes fertile creation, charm, aesthetic balance, and steadfast determination. Governed by the Moon and Brahma, it imparts creativity and graceful temperament.
            </p>
          </Card>
        )}

        {/* 5. DASHA TAB */}
        {activeTab === "dasha" && (
          <Card className="p-6 border-orange-200/80 bg-white space-y-4">
            <h3 className="text-lg font-bold text-slate-900 font-outfit">
              Vimshottari Mahadasha Timeline
            </h3>
            <div className="space-y-3">
              {SAMPLE_VIMSHOTTARI_TIMELINE.map((d) => (
                <div
                  key={d.planet}
                  className={`p-4 rounded-xl border flex items-center justify-between ${
                    d.current
                      ? "bg-orange-50 border-orange-200"
                      : "bg-slate-50/60 border-slate-100"
                  }`}
                >
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{d.planet}</h4>
                    <span className="text-xs text-slate-500">{d.period}</span>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${
                      d.current
                        ? "bg-[#ff6b00] text-white"
                        : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {d.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* 6. YOGAS TAB */}
        {activeTab === "yogas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_YOGAS_LIST.map((y) => (
              <Card key={y.name} className="p-5 border-orange-100 bg-white">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <h4 className="font-bold text-sm text-slate-900">{y.name}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {y.description}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* 7. DOSHAS TAB */}
        {activeTab === "doshas" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SAMPLE_DOSHA_ANALYSIS.map((d) => (
              <Card key={d.name} className="p-5 border-emerald-100 bg-emerald-50/30">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h4 className="font-bold text-sm text-slate-900">{d.name}</h4>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed mb-2">
                  {d.description}
                </p>
                <p className="text-[11px] text-amber-900 bg-amber-50/80 p-2 rounded-lg border border-amber-200">
                  <span className="font-bold">Remedy:</span> {d.remedy}
                </p>
              </Card>
            ))}
          </div>
        )}

        {/* 8. REPORTS TAB */}
        {activeTab === "reports" && (
          <Card className="p-8 border-orange-200/80 bg-white text-center">
            <FileText className="w-10 h-10 text-[#ff6b00] mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-900 mb-1">
              Kundli Reports Archive
            </h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
              Explore your detailed generated compatibility and astrological reports.
            </p>
            <Link href={PATHS.DASHBOARD_REPORTS} className="no-underline">
              <Button variant="default" size="sm">
                <span>Go to Saved Reports</span>
              </Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  );
}
