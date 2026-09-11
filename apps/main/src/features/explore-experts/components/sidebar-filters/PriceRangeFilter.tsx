"use client";

import React from "react";
import { Slider } from "@/components/ui/slider";
import { useExploreExpertsContext } from "../../context/ExploreExpertsContext";

const PRICE_PRESETS = [
  { label: "Under ₹30", max: 30 },
  { label: "₹30 - ₹60", max: 60 },
  { label: "₹60 - ₹100", max: 100 },
  { label: "Any", max: 1000 },
];

export function PriceRangeFilter() {
  const { filters, setPriceRange } = useExploreExpertsContext();

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
          Max Price
        </label>
        <span className="text-xs font-black text-orange bg-orange/10 px-2.5 py-0.5 rounded-full border border-orange/20">
          ₹{filters.maxPrice}/min
        </span>
      </div>

      <Slider
        min={10}
        max={1000}
        step={10}
        value={filters.maxPrice}
        onValueChange={setPriceRange}
        className="my-3"
      />

      <div className="flex items-center justify-between text-[11px] text-gray-400 font-medium mb-3">
        <span>₹10/min</span>
        <span>₹500/min</span>
        <span>₹1000/min</span>
      </div>

      {/* Quick Price Preset Chips */}
      <div className="grid grid-cols-2 gap-1.5">
        {PRICE_PRESETS.map((preset) => {
          const active = filters.maxPrice === preset.max;
          return (
            <button
              key={preset.label}
              type="button"
              onClick={() => setPriceRange(preset.max)}
              className={`text-[11px] py-1 px-2 rounded-lg border font-bold transition-all cursor-pointer ${
                active
                  ? "bg-orange text-white border-orange shadow-xs"
                  : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
              }`}
            >
              {preset.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
