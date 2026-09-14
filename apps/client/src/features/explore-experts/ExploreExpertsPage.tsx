"use client";

import React from "react";
import type { Expert } from "@repo/lib";
import {
  ExploreExpertsProvider,
  useExploreExpertsContext,
} from "./context/ExploreExpertsContext";
import { ExploreBreadcrumb } from "./components/ExploreBreadcrumb";
import { ExploreHeader } from "./components/ExploreHeader";
import { ExploreSidebarFilters } from "./components/sidebar-filters";
import { ExploreMobileFiltersDrawer } from "./components/ExploreMobileFiltersDrawer";
import { ExploreExpertGrid } from "./components/ExploreExpertGrid";

export interface ExploreExpertsPageProps {
  initialExperts?: Expert[];
  initialTotal?: number;
  initialHasNextPage?: boolean;
}

function ExploreExpertsContent() {
  const {
    filters,
    experts,
    loading,
    hasMore,
    totalCount,
    activeFiltersCount,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    handleLoadMore,
    setSearchQuery,
    toggleSpecialization,
    setSortBy,
    resetFilters,
  } = useExploreExpertsContext();

  return (
    <div className="min-h-screen bg-[#FFFFFF] text-gray-900 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Breadcrumb Navigation on Top */}
        <ExploreBreadcrumb />

        {/* Top Header with Search Bar & Control Bar */}
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

        {/* Main Two-Column Explore Layout */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Column: Desktop Sticky Filter Sidebar (Zero Props!) */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <ExploreSidebarFilters />
          </aside>

          {/* Right Column: Expert List Grid */}
          <main className="flex-1 w-full min-w-0">
            <ExploreExpertGrid
              experts={experts}
              loading={loading}
              hasMore={hasMore}
              onLoadMore={handleLoadMore}
              onResetFilters={resetFilters}
            />
          </main>
        </div>

        {/* Mobile Filters Drawer (Zero Filter Props!) */}
        <ExploreMobileFiltersDrawer
          isOpen={isMobileFiltersOpen}
          onClose={() => setIsMobileFiltersOpen(false)}
        />
      </div>
    </div>
  );
}

export function ExploreExpertsPage({
  initialExperts,
  initialTotal,
  initialHasNextPage,
}: ExploreExpertsPageProps) {
  return (
    <ExploreExpertsProvider
      initialExperts={initialExperts}
      initialTotal={initialTotal}
      initialHasNextPage={initialHasNextPage}
    >
      <ExploreExpertsContent />
    </ExploreExpertsProvider>
  );
}

export default ExploreExpertsPage;
