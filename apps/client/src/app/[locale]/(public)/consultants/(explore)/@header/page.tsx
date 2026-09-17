"use client";

import React from "react";
import { useExploreExpertsContext } from "@/features/explore-experts/context/ExploreExpertsContext";
import { ExploreBreadcrumb } from "@/features/explore-experts/components/ExploreBreadcrumb";
import { ExploreHeader } from "@/features/explore-experts/components/ExploreHeader";
import { ExploreMobileFiltersDrawer } from "@/features/explore-experts/components/ExploreMobileFiltersDrawer";

export default function HeaderSlot() {
  const {
    filters,
    totalCount,
    activeFiltersCount,
    setSearchQuery,
    toggleSpecialization,
    resetFilters,
    setSortBy,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
  } = useExploreExpertsContext();

  return (
    <>
      {/* Breadcrumb Navigation on Top */}
      <ExploreBreadcrumb />

      {/* Top Header with Search Bar, Sort Dropdown & Control Bar */}
      <ExploreHeader
        filters={filters}
        totalCount={totalCount}
        activeFiltersCount={activeFiltersCount}
        onSearchChange={setSearchQuery}
        onToggleSpecialization={toggleSpecialization}
        onResetFilters={resetFilters}
        onSortChange={setSortBy}
        onOpenMobileFilters={() => setIsMobileFiltersOpen(true)}
      />

      {/* Mobile Filters Drawer */}
      <ExploreMobileFiltersDrawer
        isOpen={isMobileFiltersOpen}
        onClose={() => setIsMobileFiltersOpen(false)}
      />
    </>
  );
}
