"use client";

import React from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

export function FilterHeader() {
  const { activeFiltersCount, resetFilters } = useExploreExpertsContext();

  return (
    <div className="flex items-center justify-between pb-5 border-b border-gray-100">
      <div className="flex items-center gap-2.5">
        <div className="size-8 rounded-xl bg-orange/10 flex items-center justify-center text-orange">
          <SlidersHorizontal className="size-4" />
        </div>
        <div>
          <h3 className="text-base font-black text-gray-900 font-display">
            Filters
          </h3>
          <p className="text-[11px] font-medium text-gray-400">
            Refine by skills & rate
          </p>
        </div>
      </div>

      {activeFiltersCount > 0 ? (
        <button
          type="button"
          onClick={resetFilters}
          className="flex items-center gap-1 text-xs font-bold text-orange hover:text-[#d35400] transition-colors py-1 px-2.5 rounded-lg bg-orange/5 cursor-pointer"
        >
          <RotateCcw className="size-3" />
          <span>Reset ({activeFiltersCount})</span>
        </button>
      ) : (
        <Badge
          variant="outline"
          className="text-[11px] font-semibold text-gray-400"
        >
          All Experts
        </Badge>
      )}
    </div>
  );
}
