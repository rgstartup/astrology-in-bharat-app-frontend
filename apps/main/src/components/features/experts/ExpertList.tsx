"use client";

import React from "react";
import NextLink from "next/link";
const Link = NextLink as any;
import { useHomeTranslations } from "@/i18n/useHomeTranslations";
import ExpertListHeader from "./ExpertListHeader";
import ExpertFilterModal from "./ExpertFilterModal";
import ExpertSortModal from "./ExpertSortModal";
import ExpertSlider from "./ExpertSlider";
import ExpertGrid from "./ExpertGrid";
import { useExpertListLogic } from "./useExpertListLogic";
import { ExpertProfile } from "@/lib/types";

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

const DUMMY_EXPERTS = [
  {
    id: "dummy-1",
    user: {
      id: "d1",
      name: "Astrology Ravi Rai",
      avatar: "/images/dummy-expert.jpg",
    },
    specialization: "Vedic, Numerology",
    experience_in_years: 5,
    languages: ["English", "Hindi"],
    price: 51,
    rating: 5,
    is_available: true,
    isDummy: true,
  },
  {
    id: "dummy-2",
    user: {
      id: "d2",
      name: "Astrologer Shanti",
      avatar: "/images/dummy-expert.jpg",
    },
    specialization: "Tarot, Vastu",
    experience_in_years: 8,
    languages: ["English", "Hindi", "Marathi"],
    price: 101,
    rating: 4.8,
    is_available: false,
    isDummy: true,
  },
  {
    id: "dummy-3",
    user: {
      id: "d3",
      name: "Pandit Sharma",
      avatar: "/images/dummy-expert.jpg",
    },
    specialization: "Kundli, Palmistry",
    experience_in_years: 12,
    languages: ["Hindi", "Sanskrit"],
    price: 21,
    rating: 4.9,
    is_available: true,
    isDummy: true,
  },
  {
    id: "dummy-4",
    user: { id: "d4", name: "Astro Dev", avatar: "/images/dummy-expert.jpg" },
    specialization: "Numerology, Nadi",
    experience_in_years: 3,
    languages: ["English", "Gujarati"],
    price: 51,
    rating: 4.7,
    is_available: true,
    isDummy: true,
  },
];

const ExpertList: React.FC<ExpertListProps> = ({
  initialExperts,
  initialPagination,
  initialError,
  layout = "slider",
  title,
}) => {
  const { lang, t } = useHomeTranslations();
  const fontStyle =
    lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const [showFilterModal, setShowFilterModal] = React.useState(false);
  const [showSortModal, setShowSortModal] = React.useState(false);

  const {
    experts,
    loading,
    hasMore,
    searchQuery,
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    filterState,
    setFilterState,
    localFilter,
    setLocalFilter,
    hasActiveFilters,
    scrollTabs,
    scrollContainerRef,
    handleLoadMore,
    applyFilters,
    resetFilters,
  } = useExpertListLogic(
    initialExperts,
    initialPagination,
    initialError,
    lang,
    t,
  );

  const isFiltered =
    searchQuery.trim() !== "" ||
    selectedSpecialization !== "" ||
    hasActiveFilters;

  const displayExperts =
    !loading && !isFiltered && experts.length > 0 && experts.length < 4
      ? [...experts, ...DUMMY_EXPERTS.slice(0, 4 - experts.length)]
      : !loading && !isFiltered && experts.length === 0
        ? DUMMY_EXPERTS
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
          title={title || (t as any).expertSection.title}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSpecialization={selectedSpecialization}
          setSelectedSpecialization={setSelectedSpecialization}
          hasActiveFilters={hasActiveFilters}
          onOpenFilter={() => setShowFilterModal(true)}
          onOpenSort={() => setShowSortModal(true)}
          resetFilters={resetFilters}
          scrollTabs={scrollTabs}
          scrollContainerRef={scrollContainerRef}
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
              {t.expertSection.viewAllExperts}
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default ExpertList;
