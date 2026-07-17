"use client";

import React from "react";
import { Place } from "@/libs/serp-api";
import PlaceCard from "./PlaceCard";
import { useLanguageStore } from "@repo/store";

interface PlacesSectionProps {
  title: React.ReactNode;
  subtitle?: string;
  places: Place[];
  loading: boolean;
  showAll: boolean;
  onToggleShowAll: () => void;
  emptyIcon?: string;
  idPrefix: string;
  initialCount?: number;
  headerIcon?: React.ReactNode;
}

const SkeletonCard = () => (
  <div className="animate-pulse bg-white rounded-2xl overflow-hidden shadow border border-gray-100">
    <div className="h-44 bg-gray-200" />
    <div className="p-4 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4" />
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-8 bg-gray-200 rounded w-full mt-3" />
    </div>
  </div>
);

const PlacesSection: React.FC<PlacesSectionProps> = ({
  title,
  subtitle,
  places,
  loading,
  showAll,
  onToggleShowAll,
  emptyIcon = "fa-place-of-worship",
  idPrefix,
  initialCount = 6,
  headerIcon,
}) => {
  const { lang } = useLanguageStore();
  const tx = {
    en: { sortPopular: "Sort By: Popular", sortNearest: "Sort By: Nearest", sortRating: "Sort By: Rating", showLess: "Show Less", viewMore: "View More Temples", noResults: "No results found" },
    hi: { sortPopular: "लोकप्रियता अनुसार", sortNearest: "नजदीक अनुसार", sortRating: "रेटिंग अनुसार", showLess: "कम दिखाएं", viewMore: "और मंदिर देखें", noResults: "कोई परिणाम नहीं मिला" },
  }[lang] || { en: {} } as any;
  const visible = showAll ? places : places.slice(0, initialCount);
  const hasMore = places.length > initialCount;

  return (
    <section className="bg-[#FCF8F4] border border-[#E8D5C0] rounded-2xl p-5 md:p-7 shadow-sm">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 mb-6">
        <div className="flex items-center gap-2 sm:gap-4">
          {headerIcon && (
            <div className="flex-shrink-0 text-orange-500 text-3xl">
              {headerIcon}
            </div>
          )}
          <div className="min-w-0">
            <h2 className="text-[16px] sm:text-xl font-black text-[#3D1A0B] leading-tight whitespace-nowrap truncate sm:whitespace-normal sm:truncate-none">{title}</h2>
            {subtitle && <p className="text-[12px] sm:text-sm text-gray-500 font-medium mt-0.5 break-words">{subtitle}</p>}
          </div>
        </div>

        {/* Sort Dropdown */}
        <div className="relative flex-shrink-0">
          <select className="appearance-none bg-white border border-[#E8D5C0] rounded-lg px-4 py-2 text-sm text-gray-600 font-medium pr-8 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition-all cursor-pointer">
            <option>{tx.sortPopular}</option>
            <option>{tx.sortNearest}</option>
            <option>{tx.sortRating}</option>
          </select>
          <i className="fa-solid fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-gray-400 pointer-events-none"></i>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {[...Array(initialCount)].map((_, i) => <SkeletonCard key={`${idPrefix}-sk-${i}`} />)}
        </div>
      ) : visible.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {visible.map((place, idx) => (
              <PlaceCard key={place.id || `${idPrefix}-${idx}`} place={place} />
            ))}
          </div>

          {hasMore && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={onToggleShowAll}
                className="border border-orange-300 text-orange-500 font-bold text-[13px] px-8 py-2.5 rounded-lg hover:bg-orange-50 transition-colors flex items-center gap-2"
              >
                {showAll ? tx.showLess : tx.viewMore}
                <i className={`fa-solid fa-arrow-${showAll ? "up" : "right"} text-[11px]`} />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-14 bg-[#FAF5EE] rounded-2xl border border-dashed border-[#E8D5C0]">
          <i className={`fa-solid ${emptyIcon} text-orange-200 text-4xl mb-3 block`} />
          <p className="text-gray-400 font-medium text-sm">{tx.noResults}</p>
        </div>
      )}
    </section>
  );
};

export default PlacesSection;
