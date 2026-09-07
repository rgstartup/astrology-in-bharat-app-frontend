"use client";
import React from "react";

import { useLocale, useTranslations } from "next-intl";
import { useSpecializationScroll } from "../hooks/useSpecializationScroll";
import { useExpertListStore } from "@/store/useExpertListStore";

export interface ExpertListHeaderProps {
  title?: string;
  hasActiveFilters: boolean;
  onOpenFilter: () => void;
  onOpenSort: () => void;
}

const ExpertListHeader: React.FC<ExpertListHeaderProps> = ({
  title,
  hasActiveFilters,
  onOpenFilter,
  onOpenSort,
}) => {
  const lang = useLocale();
  const t = useTranslations("Home");
  const {
    searchQuery,
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    resetState: resetFilters,
  } = useExpertListStore();

  const { scrollRef, goLeft, goRight } = useSpecializationScroll(
    selectedSpecialization,
  );

  const specializations = [
    { key: "numerology", value: "Numerology" },
    { key: "vedic", value: "Vedic" },
    { key: "zodiacCompatibility", value: "Zodiac Compatibility" },
    { key: "astrocartography", value: "Astrocartography" },
    { key: "lunarNodeAnalysis", value: "Lunar Node Analysis" },
    { key: "loveProblem", value: "Love Problem Solution" },
    { key: "marriageProblem", value: "Marriage Problem" },
    { key: "divorceProblem", value: "Divorce Problem Solution" },
    { key: "breakupProblem", value: "Breakup Problem Solution" },
    { key: "exLoveBack", value: "Get Your Ex Love Back" },
    { key: "familyProblem", value: "Family Problem Solution" },
    { key: "disputeSolution", value: "Dispute Solution" },
    { key: "childlessCouple", value: "Childless Couple Solution" },
    { key: "businessProblem", value: "Business Problem Solution" },
  ] as const;

  // Build full list: "All" + specializations
  const allItems: Array<
    { key: "__all__"; value: "" } | (typeof specializations)[number]
  > = [{ key: "__all__", value: "" }, ...specializations];

  return (
    <>
      {/* Title & Mobile Buttons Row */}
      <div
        className="flex justify-between items-center mb-3 lg:mb-6 text-white"
        style={{ "--heading-border-color": "rgba(255,255,255,0.2)" } as any}
      >
        <h2
          className="section-heading-premium m-0"
          style={
            lang === "hi"
              ? { fontFamily: "'Noto Sans Devanagari', sans-serif" }
              : {}
          }
        >
          <span>{title}</span>
        </h2>

        {/* Mobile Filter & Sort */}
        <div className="flex lg:hidden items-center gap-2">
          <button
            type="button"
            className="flex items-center gap-1.5 bg-orange text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-all relative text-xs shadow-md whitespace-nowrap"
            onClick={onOpenFilter}
          >
            <i className="fa-solid fa-filter"></i>{" "}
            {t("expertSection.filterBtn")}
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-white border-2 border-orange rounded-full animate-pulse"></span>
            )}
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 bg-orange text-white px-3 py-1.5 rounded-full font-medium hover:opacity-90 transition-all text-xs shadow-md whitespace-nowrap"
            onClick={onOpenSort}
          >
            <i className="fa-solid fa-sort"></i>{" "}
            {t("expertSection.sortByTitle")}
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mb-4 text-white w-full">
        {/* Search Box */}
        <div className="w-full lg:w-[30%] shrink-0">
          <div className="flex w-full shadow-lg h-[50px] rounded-full overflow-hidden bg-white">
            <input
              type="text"
              className="flex-1 px-4 md:px-6 border-0 outline-none text-sm md:text-base bg-white text-black h-full min-w-0"
              placeholder={t("expertSection.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button
              type="button"
              className="px-4 md:px-8 bg-orange text-white font-bold text-sm md:text-base hover:opacity-90 transition-all h-full shrink-0"
            >
              {t("expertSection.searchBtn")}
            </button>
          </div>
        </div>

        {/* Desktop Filter & Reset & Sort */}
        <div className="hidden lg:flex shrink-0 items-center gap-3">
          <button
            type="button"
            className="flex items-center gap-2 bg-orange text-white px-4 md:px-5 py-2 rounded-full font-medium hover:opacity-90 transition-all relative whitespace-nowrap text-sm md:text-base shadow-md"
            onClick={onOpenFilter}
          >
            <i className="fa-solid fa-filter"></i>{" "}
            {t("expertSection.filterBtn")}
            {hasActiveFilters && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-white border-2 border-orange rounded-full animate-pulse"></span>
            )}
          </button>

          <button
            type="button"
            className="flex items-center gap-2 bg-orange text-white px-4 md:px-5 py-2 rounded-full font-medium hover:opacity-90 transition-all whitespace-nowrap text-sm md:text-base shadow-md"
            onClick={onOpenSort}
          >
            <i className="fa-solid fa-sort"></i>{" "}
            {t("expertSection.sortByTitle")}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              className="flex items-center gap-2 text-red-100 font-medium hover:text-red-300 transition-all text-sm whitespace-nowrap h-full"
              onClick={resetFilters}
            >
              <i className="fa-solid fa-xmark"></i>{" "}
              {t("expertSection.applyBtns.resetAll")}
            </button>
          )}
        </div>

        {/* Specialization Scrollable Slider */}
        <div className="w-full lg:flex-1 min-w-0 flex items-center gap-2 relative">
          <button
            onClick={goLeft}
            className="text-orange hover:scale-110 transition-transform p-1 shrink-0 hidden md:block"
          >
            <i className="fa-solid fa-chevron-left text-xl"></i>
          </button>

          <div
            ref={scrollRef}
            className="flex gap-3 py-2 w-full overflow-x-auto scroll-smooth [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] snap-x"
          >
            {allItems.map((item) => {
              const isAll = item.key === "__all__";
              const isActive = isAll
                ? selectedSpecialization === ""
                : selectedSpecialization === item.value;
              const label =
                item.key === "__all__"
                  ? t("expertSection.all")
                  : t(`expertSection.specializations.${item.key}`);

              return (
                <div
                  key={item.key}
                  data-active={isActive}
                  onClick={() => setSelectedSpecialization(item.value)}
                  className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-colors duration-300 shadow-md shrink-0 whitespace-nowrap snap-center ${isActive ? "bg-orange text-white" : "bg-white text-gray-800 hover:bg-orange hover:text-white"}`}
                >
                  {label}
                </div>
              );
            })}
          </div>

          <button
            onClick={goRight}
            className="text-orange hover:scale-110 transition-transform p-1 shrink-0 hidden md:block"
          >
            <i className="fa-solid fa-chevron-right text-xl"></i>
          </button>
        </div>
      </div>
    </>
  );
};

export default ExpertListHeader;
