"use client";

import React from "react";
import { Separator } from "@/components/ui/separator";
import { FilterHeader } from "./FilterHeader";
import { AvailabilityFilter } from "./AvailabilityFilter";
import { SpecializationsFilter } from "./SpecializationsFilter";
import { PriceRangeFilter } from "./PriceRangeFilter";
import { RatingFilter } from "./RatingFilter";
import { ExperienceFilter } from "./ExperienceFilter";
import { LanguagesFilter } from "./LanguagesFilter";

export * from "./FilterHeader";
export * from "./AvailabilityFilter";
export * from "./SpecializationsFilter";
export * from "./PriceRangeFilter";
export * from "./RatingFilter";
export * from "./ExperienceFilter";
export * from "./LanguagesFilter";
export * from "./ConsultationModeFilter";

export interface ExploreSidebarFiltersProps {
  className?: string;
  // Optional legacy props supported for backwards compatibility
  [key: string]: any;
}

export function ExploreSidebarFilters({ className }: ExploreSidebarFiltersProps) {
  return (
    <div
      className={`w-full bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xl shadow-black/5 sticky top-24 transition-all ${
        className || ""
      }`}
    >
      <FilterHeader />

      <div className="space-y-6 pt-5">
        <AvailabilityFilter />
        <Separator />
        <SpecializationsFilter />
        <Separator />
        <PriceRangeFilter />
        <Separator />
        <RatingFilter />
        <Separator />
        <ExperienceFilter />
        <Separator />
        <LanguagesFilter />
      </div>
    </div>
  );
}

export default ExploreSidebarFilters;
