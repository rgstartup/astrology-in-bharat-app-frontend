"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
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
} from "@repo/design/lucide";
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

/** Skeleton shown while birth astrology details load. */
function IdentityLoading() {
  return (
    <Card className="mb-6 sm:mb-8 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-36" />
        <Skeleton className="h-6 w-24" />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-20 rounded-xl" />
        ))}
      </div>
    </Card>
  );
}

/** Onboarding prompt shown when birth details are missing. */
function IdentityOnboarding() {
  return (
    <Card className="mb-6 sm:mb-8 border-dashed overflow-hidden">
      <CardContent className="p-6 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-full bg-[#ebe7e1] text-[#111111] flex items-center justify-center shrink-0">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge variant="secondary">Action required</Badge>
              <span className="font-sans text-xs font-medium text-[#626260]">
                Birth profile missing
              </span>
            </div>
            <h3 className="font-sans text-lg sm:text-xl font-medium tracking-tight text-[#111111]">
              Complete your Vedic birth details
            </h3>
            <p className="font-sans text-xs sm:text-sm text-[#626260] max-w-lg mt-1 leading-relaxed">
              Add your Date, Time, and Place of Birth to generate your
              personalized Kundli, planetary dashas, and precision daily
              horoscope.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Link
          href={PATHS.DASHBOARD.PROFILE}
          className="no-underline shrink-0"
        >
          <Button
            variant="default"
            className="flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add birth details</span>
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
}

/**
 * Vedic identity summary for the dashboard: sun/moon/ascendant/
 * nakshatra pillars plus the birth metadata row.
 */
export function AstrologyIdentityCard({
  astrologyDetails: propAstrologyDetails,
  hasBirthDetails: propHasBirthDetails,
  isLoading: propIsLoading,
}: AstrologyIdentityCardProps = {}) {
  const hookData = useDashboardOverview();

  const astrologyDetails =
    propAstrologyDetails !== undefined
      ? propAstrologyDetails
      : hookData.astrologyDetails;
  const hasBirthDetails =
    propHasBirthDetails !== undefined
      ? propHasBirthDetails
      : hookData.hasBirthDetails;
  const isLoadingAstrology =
    propIsLoading !== undefined ? propIsLoading : hookData.isLoadingAstrology;

  if (isLoadingAstrology) {
    return <IdentityLoading />;
  }

  if (!hasBirthDetails) {
    return <IdentityOnboarding />;
  }

  const details: BirthAstrologyDetails =
    astrologyDetails || DEFAULT_BIRTH_ASTROLOGY;

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
      title: "Sun sign",
      value: details.sunSign || "Aries",
      subtitle: "Core identity",
      icon: Sun,
    },
    {
      title: "Moon sign (Rashi)",
      value: details.moonSign || "Taurus",
      subtitle: "Emotional mind",
      icon: Moon,
    },
    {
      title: "Ascendant (Lagna)",
      value: details.ascendant || "Gemini",
      subtitle: "Life path & persona",
      icon: Compass,
    },
    {
      title: "Nakshatra",
      value: details.nakshatra || "Rohini",
      subtitle: details.nakshatraLord
        ? `Lord: ${details.nakshatraLord}`
        : "Birth star",
      icon: Star,
    },
  ];

  return (
    <Card className="mb-6 sm:mb-8 overflow-hidden">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 gap-3 border-b border-[#ebe7e1]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge
              variant="secondary"
              className="text-[10px]"
            >
              Vedic blueprint
            </Badge>
            <span className="font-sans text-xs font-medium text-[#626260]">
              Personal kundli identity
            </span>
          </div>
          <CardTitle className="text-xl">
            Your astrological identity
          </CardTitle>
        </div>

        <Link href={PATHS.DASHBOARD.KUNDLI} className="no-underline shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="text-xs gap-1.5"
          >
            <span>Explore my Kundli chart</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Button>
        </Link>
      </CardHeader>

      <CardContent className="pt-5 space-y-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {astroPillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className="p-4 rounded-xl border border-[#ebe7e1] bg-[#f5f1ec] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-sans text-[11px] font-medium text-[#626260]">
                    {pillar.title}
                  </span>
                  <div
                    className="p-1.5 rounded-md bg-white border border-[#ebe7e1] text-[#111111]"
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h4
                    className="font-sans text-lg sm:text-xl font-medium tracking-tight text-[#111111] truncate"
                  >
                    {pillar.value}
                  </h4>
                  <p className="font-sans text-[11px] text-[#626260] truncate mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-[#ebe7e1] text-xs">
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            {birthMeta.map((m) => {
              const Icon = m.icon;
              return (
                <div key={m.label} className="flex items-center gap-1.5">
                  <Icon className="w-3.5 h-3.5 text-[#7b7b78]" />
                  <span className="font-sans text-[#7b7b78]">{m.label}:</span>
                  <span className="font-sans font-medium text-[#111111]">{m.val}</span>
                </div>
              );
            })}
          </div>

          <Link
            href={PATHS.DASHBOARD.PROFILE}
            className="font-sans text-[11px] font-medium text-[#111111] hover:underline no-underline"
          >
            Edit birth details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default AstrologyIdentityCard;
