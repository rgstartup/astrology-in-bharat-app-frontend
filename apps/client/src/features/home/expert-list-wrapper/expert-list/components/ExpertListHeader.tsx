"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useTranslations } from "next-intl";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  Star,
  Globe,
  ArrowDownUp,
  RotateCcw,
  IndianRupee,
  Sparkles,
  Zap,
} from "lucide-react";
import { useSpecializationScroll } from "../hooks/useSpecializationScroll";
import { useExpertListStore } from "@/store/useExpertListStore";
import { Specialization } from "@repo/lib";
import { fetchSpecializations } from "../api/fetch-specializations";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";

export interface ExpertListHeaderProps {
  title?: string;
}

const LANGUAGES = [
  "Hindi",
  "English",
  "Sanskrit",
  "Gujarati",
  "Marathi",
  "Bengali",
  "Punjabi",
  "Tamil",
  "Telugu",
];

const PRICE_TIERS = [
  { label: "All Prices", min: 0, max: 1000 },
  { label: "Under ₹30/min", min: 0, max: 30 },
  { label: "₹30 – ₹60/min", min: 30, max: 60 },
  { label: "₹60+/min", min: 60, max: 1000 },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Recommended", icon: Sparkles },
  { value: "rating", label: "Highest Rated", icon: Star },
  { value: "price_asc", label: "Price: Low to High", icon: IndianRupee },
  { value: "price_desc", label: "Price: High to Low", icon: IndianRupee },
  { value: "experience", label: "Most Experienced", icon: Zap },
];

const RATING_OPTIONS = [
  { value: 0, label: "All Ratings" },
  { value: 4.5, label: "4.5+ ★" },
  { value: 4.0, label: "4.0+ ★" },
  { value: 3.5, label: "3.5+ ★" },
];

export const ExpertListHeader: React.FC<ExpertListHeaderProps> = ({
  title,
}) => {
  const t = useTranslations("Home");
  const {
    searchQuery,
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    filterState,
    setFilterState,
    resetState: resetFilters,
    setLoading,
  } = useExpertListStore();

  const { scrollRef, goLeft, goRight } = useSpecializationScroll(
    selectedSpecialization,
  );
  const [specializations, setSpecializations] = useState<Specialization[]>([]);

  useEffect(() => {
    setLoading(true);
    fetchSpecializations()
      .then(([res, error]) => {
        if (error || !res) return;
        setSpecializations(res.data || []);
      })
      .finally(() => setLoading(false));
  }, [setLoading]);

  // Current active labels for the dropdown subtriggers
  const currentSortLabel = useMemo(() => {
    return (
      SORT_OPTIONS.find((s) => s.value === (filterState.sortBy || "newest"))
        ?.label || "Recommended"
    );
  }, [filterState.sortBy]);

  const currentPriceLabel = useMemo(() => {
    const match = PRICE_TIERS.find(
      (t) =>
        t.min === filterState.minPrice && t.max === filterState.maxPrice,
    );
    return match ? match.label : "All Prices";
  }, [filterState.minPrice, filterState.maxPrice]);

  const currentRatingLabel = useMemo(() => {
    const match = RATING_OPTIONS.find((r) => r.value === filterState.minRating);
    return match ? match.label : "All Ratings";
  }, [filterState.minRating]);

  // Active filter checks
  const activeFilters = useMemo(() => {
    const list: { key: string; label: string; onRemove: () => void }[] = [];

    if (filterState.onlyOnline) {
      list.push({
        key: "online",
        label: "Online Now",
        onRemove: () => setFilterState({ ...filterState, onlyOnline: false }),
      });
    }

    if (filterState.sortBy && filterState.sortBy !== "newest") {
      const match = SORT_OPTIONS.find((s) => s.value === filterState.sortBy);
      if (match) {
        list.push({
          key: "sort",
          label: `Sort: ${match.label}`,
          onRemove: () => setFilterState({ ...filterState, sortBy: "newest" }),
        });
      }
    }

    if (filterState.minRating > 0) {
      list.push({
        key: "rating",
        label: `${filterState.minRating}+ Stars`,
        onRemove: () => setFilterState({ ...filterState, minRating: 0 }),
      });
    }

    if (filterState.language) {
      list.push({
        key: "lang",
        label: `Lang: ${filterState.language}`,
        onRemove: () => setFilterState({ ...filterState, language: "" }),
      });
    }

    if (filterState.minPrice > 0 || filterState.maxPrice < 1000) {
      const tierMatch = PRICE_TIERS.find(
        (t) => t.min === filterState.minPrice && t.max === filterState.maxPrice,
      );
      list.push({
        key: "price",
        label: tierMatch
          ? tierMatch.label
          : `₹${filterState.minPrice} - ₹${filterState.maxPrice}`,
        onRemove: () =>
          setFilterState({ ...filterState, minPrice: 0, maxPrice: 1000 }),
      });
    }

    return list;
  }, [filterState, setFilterState]);

  const hasActiveFilters =
    activeFilters.length > 0 ||
    selectedSpecialization !== "" ||
    searchQuery.trim() !== "";

  return (
    <div className="w-full mb-6">
      {/* 1. Header Title & Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        {/* Title */}
        <div
          className="text-white"
          style={{ "--heading-border-color": "rgba(255,255,255,0.2)" } as any}
        >
          <h2 className="section-heading-premium mb-0">
            <span>{title || t("expertSection.title")}</span>
          </h2>
        </div>

        {/* Search Bar & Dropdown Menu Filter Controls */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 sm:w-[260px] lg:w-[300px]">
            <input
              type="text"
              placeholder={
                t("expertSection.searchPlaceholder") ||
                "Search astrologer by name..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 bg-white/10 hover:bg-white/15 focus:bg-white text-white focus:text-gray-900 border border-white/20 focus:border-orange rounded-full text-sm placeholder:text-gray-300 focus:placeholder:text-gray-400 outline-none transition-all shadow-inner backdrop-blur-md"
            />
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 size-5 flex items-center justify-center rounded-full hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Online Status Toggle */}
          <button
            type="button"
            onClick={() =>
              setFilterState({
                ...filterState,
                onlyOnline: !filterState.onlyOnline,
              })
            }
            className={`inline-flex items-center gap-2 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer select-none shadow-sm ${
              filterState.onlyOnline
                ? "bg-emerald-500 text-white border-emerald-400 shadow-emerald-500/20"
                : "bg-white/10 hover:bg-white/20 text-gray-200 border-white/20"
            }`}
          >
            <span
              className={`size-2 rounded-full ${
                filterState.onlyOnline
                  ? "bg-white animate-pulse"
                  : "bg-emerald-400"
              }`}
            />
            <span>Online Now</span>
          </button>

          {/* Shadcn Dropdown Menu for Filters & Sorting */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border cursor-pointer shadow-sm ${
                    activeFilters.length > 0
                      ? "bg-orange text-white border-orange shadow-orange/30 ring-2 ring-orange/30"
                      : "bg-white/10 hover:bg-white/20 text-gray-200 border-white/20"
                  }`}
                />
              }
            >
              <SlidersHorizontal className="size-3.5" />
              <span>Filters</span>
              {activeFilters.length > 0 && (
                <span className="size-4 rounded-full bg-white text-orange text-[10px] font-black flex items-center justify-center shadow-xs">
                  {activeFilters.length}
                </span>
              )}
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              side="bottom"
              sideOffset={8}
              className="w-64 sm:w-72 bg-white text-gray-900 rounded-2xl p-2 shadow-2xl border border-gray-100 ring-1 ring-black/5"
            >
              {/* Header Label */}
              <DropdownMenuLabel className="flex items-center gap-2 px-2.5 py-1.5 text-xs font-black text-gray-900 uppercase tracking-wider">
                <SlidersHorizontal className="size-3.5 text-orange" />
                Filter & Sort
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuGroup>
                {/* 1. Live Availability Checkbox Item */}
                <DropdownMenuCheckboxItem
                  checked={filterState.onlyOnline}
                  onCheckedChange={(checked) =>
                    setFilterState({
                      ...filterState,
                      onlyOnline: Boolean(checked),
                    })
                  }
                  className="cursor-pointer py-2 px-2.5 rounded-xl font-semibold text-xs text-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        filterState.onlyOnline
                          ? "bg-emerald-500 shadow-[0_0_6px_rgba(16,185,129,0.8)] animate-pulse"
                          : "bg-gray-300"
                      }`}
                    />
                    Online Astrologers Only
                  </span>
                </DropdownMenuCheckboxItem>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuGroup>
                {/* 2. Sort Submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100">
                    <span className="flex items-center gap-2 truncate">
                      <ArrowDownUp className="size-3.5 text-orange shrink-0" />
                      <span>Sort: {currentSortLabel}</span>
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-56 bg-white text-gray-900 rounded-xl p-1.5 shadow-xl border border-gray-100">
                    <DropdownMenuRadioGroup
                      value={filterState.sortBy || "newest"}
                      onValueChange={(val) =>
                        setFilterState({ ...filterState, sortBy: val })
                      }
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <DropdownMenuRadioItem
                          key={opt.value}
                          value={opt.value}
                          className="cursor-pointer py-1.5 px-2 rounded-lg text-xs font-medium text-gray-800"
                        >
                          {opt.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* 3. Consultation Fee Submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100">
                    <span className="flex items-center gap-2 truncate">
                      <IndianRupee className="size-3.5 text-orange shrink-0" />
                      <span>Price: {currentPriceLabel}</span>
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-52 bg-white text-gray-900 rounded-xl p-1.5 shadow-xl border border-gray-100">
                    <DropdownMenuRadioGroup
                      value={currentPriceLabel}
                      onValueChange={(val) => {
                        const match = PRICE_TIERS.find((t) => t.label === val);
                        if (match) {
                          setFilterState({
                            ...filterState,
                            minPrice: match.min,
                            maxPrice: match.max,
                          });
                        }
                      }}
                    >
                      {PRICE_TIERS.map((tier) => (
                        <DropdownMenuRadioItem
                          key={tier.label}
                          value={tier.label}
                          className="cursor-pointer py-1.5 px-2 rounded-lg text-xs font-medium text-gray-800"
                        >
                          {tier.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* 4. Rating Submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100">
                    <span className="flex items-center gap-2 truncate">
                      <Star className="size-3.5 text-orange shrink-0" />
                      <span>Rating: {currentRatingLabel}</span>
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48 bg-white text-gray-900 rounded-xl p-1.5 shadow-xl border border-gray-100">
                    <DropdownMenuRadioGroup
                      value={String(filterState.minRating)}
                      onValueChange={(val) =>
                        setFilterState({
                          ...filterState,
                          minRating: Number(val),
                        })
                      }
                    >
                      {RATING_OPTIONS.map((r) => (
                        <DropdownMenuRadioItem
                          key={r.value}
                          value={String(r.value)}
                          className="cursor-pointer py-1.5 px-2 rounded-lg text-xs font-medium text-gray-800"
                        >
                          {r.label}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>

                {/* 5. Language Submenu */}
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger className="cursor-pointer py-2 px-2.5 rounded-xl text-xs font-semibold text-gray-800 hover:bg-gray-100">
                    <span className="flex items-center gap-2 truncate">
                      <Globe className="size-3.5 text-orange shrink-0" />
                      <span>
                        Lang: {filterState.language || "All Languages"}
                      </span>
                    </span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuSubContent className="w-48 max-h-60 overflow-y-auto bg-white text-gray-900 rounded-xl p-1.5 shadow-xl border border-gray-100">
                    <DropdownMenuRadioGroup
                      value={filterState.language || "all"}
                      onValueChange={(val) =>
                        setFilterState({
                          ...filterState,
                          language: val === "all" ? "" : val,
                        })
                      }
                    >
                      <DropdownMenuRadioItem
                        value="all"
                        className="cursor-pointer py-1.5 px-2 rounded-lg text-xs font-medium text-gray-800"
                      >
                        All Languages
                      </DropdownMenuRadioItem>
                      {LANGUAGES.map((lang) => (
                        <DropdownMenuRadioItem
                          key={lang}
                          value={lang}
                          className="cursor-pointer py-1.5 px-2 rounded-lg text-xs font-medium text-gray-800"
                        >
                          {lang}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </DropdownMenuSubContent>
                </DropdownMenuSub>
              </DropdownMenuGroup>

              <DropdownMenuSeparator className="my-1.5" />

              <DropdownMenuGroup>
                {/* Reset All Filters Item */}
                <DropdownMenuItem
                  onClick={resetFilters}
                  className="cursor-pointer py-2 px-2.5 rounded-xl text-xs font-bold text-red-600 focus:bg-red-50 focus:text-red-700 flex items-center gap-2"
                >
                  <RotateCcw className="size-3.5" />
                  <span>Reset All Filters</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 2. Specializations Scrollable Pill Bar */}
      <div className="relative flex items-center gap-2 mb-4 bg-[#1f0b10]/60 p-2 rounded-2xl border border-white/10 backdrop-blur-md">
        <button
          type="button"
          onClick={goLeft}
          aria-label="Scroll specializations left"
          className="size-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        <div
          ref={scrollRef}
          className="flex gap-2 overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] w-full py-0.5"
        >
          {/* 'All' Category Chip */}
          <button
            type="button"
            onClick={() => setSelectedSpecialization("")}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm ${
              selectedSpecialization === ""
                ? "bg-orange text-white shadow-orange/30 ring-2 ring-orange/40"
                : "bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white"
            }`}
          >
            All Specializations
          </button>

          {specializations.map((item) => {
            const isActive =
              selectedSpecialization === item.id ||
              selectedSpecialization === item.title;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() =>
                  setSelectedSpecialization(isActive ? "" : item.id)
                }
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer shadow-sm ${
                  isActive
                    ? "bg-orange text-white shadow-orange/30 ring-2 ring-orange/40"
                    : "bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white"
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={goRight}
          aria-label="Scroll specializations right"
          className="size-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-all shrink-0 cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3. Active Filter Tags Bar (With 1-click Clear Chips) */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-1 mb-2">
          <span className="text-xs font-bold text-gray-300">Active:</span>

          {searchQuery && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20">
              <span>"{searchQuery}"</span>
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="hover:text-red-300 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {selectedSpecialization && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-orange/30 text-orange-200 border border-orange/40">
              <span>
                Specialization:{" "}
                {specializations.find((s) => s.id === selectedSpecialization)
                  ?.title || selectedSpecialization}
              </span>
              <button
                type="button"
                onClick={() => setSelectedSpecialization("")}
                className="hover:text-white cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          )}

          {activeFilters.map((f) => (
            <span
              key={f.key}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-white/15 text-white border border-white/20"
            >
              <span>{f.label}</span>
              <button
                type="button"
                onClick={f.onRemove}
                className="hover:text-red-300 cursor-pointer"
              >
                <X className="size-3" />
              </button>
            </span>
          ))}

          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-1 text-xs font-bold text-red-300 hover:text-red-200 ml-2 cursor-pointer transition-colors"
          >
            <RotateCcw className="size-3" />
            Reset All
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertListHeader;
