"use client";

import React from "react";
import { Search, X, SlidersHorizontal, ArrowUpDown } from "lucide-react";
import { ExploreFilterState, SortOption } from "../types";

interface ExploreHeaderProps {
  filters: ExploreFilterState;
  totalCount: number;
  activeFiltersCount: number;
  onSearchChange: (q: string) => void;
  onToggleSpecialization: (spec: string) => void;
  onResetFilters: () => void;
  onSortChange: (sort: SortOption) => void;
  onOpenMobileFilters: () => void;
}

export function ExploreHeader({
  filters,
  totalCount,
  activeFiltersCount,
  onSearchChange,
  onToggleSpecialization,
  onResetFilters,
  onSortChange,
  onOpenMobileFilters,
}: ExploreHeaderProps) {
  const [localQuery, setLocalQuery] = React.useState(filters.searchQuery);

  React.useEffect(() => {
    setLocalQuery(filters.searchQuery);
  }, [filters.searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextVal = e.target.value;
    setLocalQuery(nextVal);
    onSearchChange(nextVal);
  };

  const handleClearSearch = () => {
    setLocalQuery("");
    onSearchChange("");
  };

  return (
    <div className="w-full pb-5 mb-6 border-b border-gray-200">
      {/* Main Bar: Count on Left, Toolbar (Search + Sort + Mobile Filters) on Right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Count */}
        <div className="flex items-center gap-2.5 shrink-0">
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900">
            {totalCount} {totalCount === 1 ? "Astrologer" : "Astrologers"} Available
          </h1>
          {activeFiltersCount > 0 && (
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600 border border-gray-200">
              {activeFiltersCount} active
            </span>
          )}
        </div>

        {/* Right: Search + Sort + Mobile Filter Toolbar */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full md:w-auto justify-end">
          {/* Search Input */}
          <div className="relative flex items-center h-11 w-full sm:w-80 md:w-96 lg:w-[440px] xl:w-[480px] bg-white border border-gray-200 rounded-lg px-3.5 hover:border-gray-300 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors">
            <Search className="size-4.5 text-gray-400 shrink-0 mr-2.5" />
            <input
              type="text"
              value={localQuery}
              onChange={handleInputChange}
              placeholder="Search by name, skill, specialization..."
              className="w-full text-sm sm:text-base text-gray-900 placeholder:text-gray-400 bg-transparent focus:outline-none min-w-0"
            />
            {localQuery && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="p-1 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer rounded-full hover:bg-gray-100"
                title="Clear search"
                aria-label="Clear search"
              >
                <X className="size-4" />
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="relative flex items-center h-11 bg-white border border-gray-200 rounded-lg px-3 hover:border-gray-300 focus-within:border-gray-900 focus-within:ring-1 focus-within:ring-gray-900 transition-colors shrink-0">
            <ArrowUpDown className="size-3.5 text-gray-400 mr-2 shrink-0" />
            <select
              value={filters.sortBy}
              onChange={(e) => onSortChange(e.target.value as SortOption)}
              className="bg-transparent text-sm font-medium text-gray-700 focus:outline-none cursor-pointer pr-1 h-full"
              aria-label="Sort astrologers"
            >
              <option value="recommended">Recommended</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="experience_desc">Experience</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          {/* Mobile Filter Trigger Button (hidden on lg screens) */}
          <button
            type="button"
            onClick={onOpenMobileFilters}
            className="lg:hidden flex items-center gap-1.5 h-11 px-3.5 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors shrink-0 cursor-pointer"
            aria-label="Open filters"
          >
            <SlidersHorizontal className="size-3.5 text-gray-500" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full bg-gray-900 text-white text-[11px] font-semibold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Active Filter Badges */}
      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-gray-100 text-xs">
          <span className="text-gray-400 font-medium">Applied:</span>

          {filters.onlyOnline && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
              <span className="size-1.5 rounded-full bg-emerald-500" />
              Online Only
            </span>
          )}

          {filters.selectedSpecializations.map((spec) => (
            <button
              key={spec}
              type="button"
              onClick={() => onToggleSpecialization(spec)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors cursor-pointer"
            >
              <span>{spec}</span>
              <X className="size-3 text-gray-400 hover:text-gray-700" />
            </button>
          ))}

          {filters.minRating > 0 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-amber-50 text-amber-800 border border-amber-200 font-medium">
              {filters.minRating}★ & above
            </span>
          )}

          {filters.maxPrice < 1000 && (
            <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium">
              Max ₹{filters.maxPrice}/min
            </span>
          )}

          {filters.languages.map((lang) => (
            <span
              key={lang}
              className="inline-flex items-center px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-medium"
            >
              {lang}
            </span>
          ))}

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-medium text-gray-500 hover:text-gray-900 underline underline-offset-2 ml-1 cursor-pointer transition-colors"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}
