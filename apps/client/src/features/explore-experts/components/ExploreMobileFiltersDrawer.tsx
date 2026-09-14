"use client";

import React, { useEffect } from "react";
import { X, SlidersHorizontal, RotateCcw } from "lucide-react";
import { useExploreExpertsContext } from "../context/ExploreExpertsContext";
import { ExploreSidebarFilters } from "./sidebar-filters";

export interface ExploreMobileFiltersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  // Optional legacy props accepted for backwards compatibility
  [key: string]: any;
}

export function ExploreMobileFiltersDrawer({
  isOpen,
  onClose,
}: ExploreMobileFiltersDrawerProps) {
  const { activeFiltersCount, totalCount, resetFilters } =
    useExploreExpertsContext();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in"
        onClick={onClose}
      />

      {/* Drawer panel */}
      <div className="relative ml-auto w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300">
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-linear-to-r from-orange/5 to-amber-500/5">
          <div className="flex items-center gap-2">
            <div className="size-8 rounded-xl bg-orange/10 flex items-center justify-center text-orange">
              <SlidersHorizontal className="size-4" />
            </div>
            <div>
              <h3 className="text-base font-black text-gray-900 font-display">
                Filters
              </h3>
              <p className="text-[11px] font-medium text-gray-400">
                {totalCount} {totalCount === 1 ? "astrologer" : "astrologers"} found
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-xs font-bold text-orange hover:text-[#d35400] transition-colors py-1 px-2.5 rounded-lg bg-orange/5 cursor-pointer"
              >
                <RotateCcw className="size-3" />
                <span>Reset ({activeFiltersCount})</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer"
              title="Close filters"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div
          data-lenis-prevent="true"
          className="flex-1 overflow-y-auto overscroll-contain p-4"
        >
          <ExploreSidebarFilters className="border-0 shadow-none sticky-none rounded-none p-0" />
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-gray-100 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-2xl bg-orange text-white font-bold text-sm shadow-md shadow-orange/20 hover:opacity-95 active:scale-98 transition-all cursor-pointer"
          >
            Show Results ({totalCount})
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExploreMobileFiltersDrawer;
