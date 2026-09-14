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
  Moon,
  Compass,
  Star,
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  ArrowRight,
  PlusCircle,
} from "lucide-react";
import {
  useDashboardOverview,
  BirthAstrologyDetails,
} from "../hooks/useDashboardOverview";
import { DEFAULT_BIRTH_ASTROLOGY } from "../data/astrology.data";

export interface AstrologyIdentityCardProps {
  astrologyDetails?: BirthAstrologyDetails;
  hasBirthDetails?: boolean;
  isLoading?: boolean;
}

export function AstrologyIdentityCard({
  astrologyDetails: propAstrologyDetails,
  hasBirthDetails: propHasBirthDetails,
  isLoading: propIsLoading,
}: AstrologyIdentityCardProps = {}) {
  const hookData = useDashboardOverview();

  const astrologyDetails = propAstrologyDetails !== undefined ? propAstrologyDetails : hookData.astrologyDetails;
  const hasBirthDetails = propHasBirthDetails !== undefined ? propHasBirthDetails : hookData.hasBirthDetails;
  const isLoadingAstrology = propIsLoading !== undefined ? propIsLoading : hookData.isLoadingAstrology;

  // If loading astrology details
  if (isLoadingAstrology) {
    return (
      <Card className="mb-6 sm:mb-8 border-orange-100 bg-white p-6 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-36 bg-orange-100" />
          <Skeleton className="h-6 w-24 bg-orange-100" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-xl bg-orange-100" />
          ))}
        </div>
      </Card>
    );
  }

  // If user has not completed birth details, show onboarding prompt
  if (!hasBirthDetails) {
    return (
      <Card className="mb-6 sm:mb-8 border-dashed border-2 border-amber-300 bg-gradient-to-r from-amber-50/70 via-orange-50/40 to-white overflow-hidden shadow-xs">
        <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="gold">Action Required</Badge>
                <span className="text-xs font-bold text-amber-900">
                  Birth Profile Missing
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-black text-[#301118] font-outfit">
                Complete your Vedic birth details
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 max-w-lg mt-1 leading-relaxed">
                Add your Date, Time, and Place of Birth to generate your personalized Kundli, planetary dashas, and precision daily horoscope.
              </p>
            </div>
          </div>

          <Link href={PATHS.DASHBOARD_PROFILE} className="no-underline shrink-0">
            <Button
              variant="default"
              className="font-bold flex items-center gap-2 shadow-md shadow-[#ff6b00]/20"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add Birth Details</span>
            </Button>
          </Link>
        </CardContent>
      </Card>
    );
  }

  const details: BirthAstrologyDetails = astrologyDetails || DEFAULT_BIRTH_ASTROLOGY;

  const birthMeta = [
    {
      label: "DOB",
      val: details.birthDate
        ? new Date(details.birthDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })
        : "Not set",
      icon: Calendar,
    },
    {
      label: "Time",
      val: details.birthTime || "12:00 PM",
      icon: Clock,
    },
    {
      label: "Place",
      val: details.birthPlace || "New Delhi, India",
      icon: MapPin,
    },
  ];

  const astroPillars = [
    {
      title: "Sun Sign",
      value: details.sunSign || "Aries",
      subtitle: "Core Identity",
      icon: Sun,
      bgColor: "bg-amber-50/80",
      textColor: "text-amber-800",
      iconColor: "text-amber-600",
      borderColor: "border-amber-200/80",
    },
    {
      title: "Moon Sign (Rashi)",
      value: details.moonSign || "Taurus",
      subtitle: "Emotional Mind",
      icon: Moon,
      bgColor: "bg-indigo-50/80",
      textColor: "text-indigo-900",
      iconColor: "text-indigo-600",
      borderColor: "border-indigo-200/80",
    },
    {
      title: "Ascendant (Lagna)",
      value: details.ascendant || "Gemini",
      subtitle: "Life Path & Persona",
      icon: Compass,
      bgColor: "bg-orange-50/80",
      textColor: "text-orange-950",
      iconColor: "text-[#ff6b00]",
      borderColor: "border-orange-200/80",
    },
    {
      title: "Nakshatra",
      value: details.nakshatra || "Rohini",
      subtitle: details.nakshatraLord ? `Lord: ${details.nakshatraLord}` : "Birth Star",
      icon: Star,
      bgColor: "bg-purple-50/80",
      textColor: "text-purple-950",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200/80",
    },
  ];

  return (
    <Card className="mb-6 sm:mb-8 border-orange-100/90 bg-gradient-to-br from-white via-[#FFFDF9] to-orange-50/30 overflow-hidden shadow-sm">
      {/* Header bar */}
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-orange-100/60">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="brand" className="text-[10px] tracking-wider uppercase">
              Vedic Blueprint
            </Badge>
            <span className="text-xs font-bold text-slate-500">
              Personal Kundli Identity
            </span>
          </div>
          <CardTitle className="text-xl font-black text-[#301118]">
            Your Astrological Identity
          </CardTitle>
        </div>

        {/* Action button */}
        <Link href={PATHS.DASHBOARD_KUNDLI} className="no-underline shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-bold gap-1.5 hover:bg-[#ff6b00] hover:text-white transition-colors"
          >
            <span>Explore My Kundli Chart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {astroPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={`p-4 rounded-2xl border ${pillar.borderColor} ${pillar.bgColor} flex flex-col justify-between transition-transform hover:-translate-y-0.5 duration-200`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    {pillar.title}
                  </span>
                  <div className={`p-1.5 rounded-lg bg-white shadow-2xs ${pillar.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h4 className={`text-lg sm:text-xl font-black font-outfit ${pillar.textColor} truncate`}>
                    {pillar.value}
                  </h4>
                  <p className="text-[11px] text-slate-500 font-medium truncate mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Birth metadata row */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-orange-100/60 text-xs text-slate-500">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {birthMeta.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-medium text-slate-400">{m.label}:</span>
                  <span className="font-bold text-slate-700">{m.val}</span>
                </div>
              );
            })}
          </div>

          <Link
            href={PATHS.DASHBOARD_PROFILE}
            className="text-[11px] font-bold text-[#ff6b00] hover:text-[#e65100] transition-colors no-underline"
          >
            Edit Birth Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default AstrologyIdentityCard;
