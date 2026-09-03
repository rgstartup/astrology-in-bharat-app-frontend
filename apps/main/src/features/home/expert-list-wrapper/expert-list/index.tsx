"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useHomeTranslations } from "@/i18n/useHomeTranslations";
import ExpertListHeader from "./components/ExpertListHeader";
import ExpertFilterModal from "./components/ExpertFilterModal";
import ExpertSortModal from "./components/ExpertSortModal";
import ExpertSlider from "./components/ExpertSlider";
import ExpertGrid from "./components/ExpertGrid";
import dummyExperts from "./data/dummy-experts.json";
// import { useExpertListLogic } from "./useExpertListLogic";
import { useExpertListLogic } from "@/components/features/experts/useExpertListLogic";
import { ExpertProfile } from "@/lib/types";
import { useExpertListStore } from "@/store/useExpertListStore";
import { useLocale, useTranslations } from "next-intl";

interface ExpertListProps {
  initialExperts: ExpertProfile[];
  initialPagination?: {
    total: number;
    hasMore: boolean;
  };
  initialError?: string;
  layout?: "slider" | "grid";
  title?: string;
}

const ExpertList: React.FC<ExpertListProps> = ({
  initialExperts,
  initialPagination,
  initialError,
  layout = "slider",
  title,
}) => {
  const t = useTranslations("Home");
  // const lang = useLocale();
  // const fontStyle =
  //   lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showSortModal, setShowSortModal] = React.useState(false);

  // const {
  //   experts,
  //   loading,
  //   hasMore,
  //   searchQuery,
  //   setSearchQuery,
  //   selectedSpecialization,
  //   setSelectedSpecialization,
  //   filterState,
  //   setFilterState,
  //   localFilter,
  //   setLocalFilter,
  //   hasActiveFilters,
  //   scrollTabs,
  //   scrollContainerRef,
  //   handleLoadMore,
  //   applyFilters,
  //   resetFilters,
  // } = useExpertListLogic(
  //   initialExperts,
  //   initialPagination,
  //   initialError,
  //   lang,
  //   t,
  // );

  const {
    searchQuery,
    selectedSpecialization,
    filterState,
    localFilter,
    loading,
    experts,
  } = useExpertListStore();

  const hasActiveFilters = useMemo(() => {
    return (
      filterState.language !== "" ||
      filterState.minPrice !== 0 ||
      filterState.maxPrice !== 1000 ||
      filterState.addressState !== "" ||
      filterState.serviceType !== "all" ||
      filterState.minRating !== 0 ||
      filterState.onlyOnline !== false ||
      filterState.sortBy !== "newest"
    );
  }, [filterState]);

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedSpecialization !== "" ||
    hasActiveFilters;

  const displayExperts =
    !loading && !isFiltered && experts.length > 0 && experts.length < 4
      ? [...experts, ...dummyExperts.slice(0, 4 - experts.length)]
      : !loading && !isFiltered && experts.length === 0
        ? dummyExperts
        : experts;

  return (
    <section
      id="our-experts"
      className="pt-6 pb-10 relative overflow-hidden"
      style={{
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <ExpertListHeader
          title={title || t("expertSection.title")}
          searchQuery={searchQuery}
          // setSearchQuery={setSearchQuery}
          // selectedSpecialization={selectedSpecialization}
          // setSelectedSpecialization={setSelectedSpecialization}
          hasActiveFilters={hasActiveFilters}
          onOpenFilter={() => setShowFilterModal(true)}
          onOpenSort={() => setShowSortModal(true)}
          // resetFilters={resetFilters}
          // scrollTabs={scrollTabs}
          // scrollContainerRef={scrollContainerRef}
        />

        {showFilterModal && (
          <ExpertFilterModal
            show={showFilterModal}
            onHide={() => setShowFilterModal(false)}
            localFilter={localFilter}
            setLocalFilter={setLocalFilter}
            applyFilters={() => {
              applyFilters();
              setShowFilterModal(false);
            }}
            resetFilters={() => {
              resetFilters();
              setShowFilterModal(false);
            }}
          />
        )}

        {showSortModal && (
          <ExpertSortModal
            show={showSortModal}
            onHide={() => setShowSortModal(false)}
            sortBy={filterState.sortBy}
            setSortBy={(val: string) =>
              setFilterState({ ...filterState, sortBy: val })
            }
            applySort={() => setShowSortModal(false)}
          />
        )}

        {layout === "slider" ? (
          <ExpertSlider
            experts={displayExperts}
            loading={loading}
            initialError={initialError}
            lang={lang}
          />
        ) : (
          <ExpertGrid
            experts={displayExperts}
            loading={loading}
            hasMore={hasMore}
            initialError={initialError}
            lang={lang}
            t={t}
            handleLoadMore={handleLoadMore}
          />
        )}

        {layout === "slider" && (
          <div className="view-all mt-4 md:mt-6">
            <Link
              href="/our-experts"
              className="no-underline bg-orange hover:opacity-90 text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all mx-auto flex items-center justify-center gap-2 w-fit"
            >
              <i className="fa-regular fa-user"></i>{" "}
              {t("expertSection.viewAllExperts")}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExpertList;
