"use client";
import React, { useEffect, useState } from "react";

import { useTranslations } from "next-intl";
import { useSpecializationScroll } from "../hooks/useSpecializationScroll";
import { useExpertListStore } from "@/store/useExpertListStore";
import { Specialization } from "@repo/lib";
import { fetchSpecializations } from "../api/fetch-specializations";

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
  const t = useTranslations("Home");
  const {
    searchQuery,
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    resetState: resetFilters,
    loading,
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

        setSpecializations(res.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      {/* Title & Mobile Buttons Row */}
      <div
        className="flex justify-between items-center mb-3 lg:mb-6 text-white"
        style={{ "--heading-border-color": "rgba(255,255,255,0.2)" } as any}
      >
        <h2 className="section-heading-premium m-0">
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
            {specializations.map((item) => {
              const isActive = selectedSpecialization === item.id;

              return (
                <div
                  key={item.id}
                  data-active={isActive}
                  onClick={() => setSelectedSpecialization(item.id)}
                  className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-colors duration-300 shadow-md shrink-0 whitespace-nowrap snap-center ${isActive ? "bg-orange text-white" : "bg-white text-gray-800 hover:bg-orange hover:text-white"}`}
                >
                  {item.title}
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
