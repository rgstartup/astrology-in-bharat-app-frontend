"use client";

import React from "react";
import { useExploreExpertsContext } from "@/features/explore-experts/context/ExploreExpertsContext";
import { ExploreExpertGrid } from "@/features/explore-experts/components/ExploreExpertGrid";

export default function CardsSlot() {
  const {
    experts,
    loading,
    hasMore,
    handleLoadMore,
    resetFilters,
  } = useExploreExpertsContext();

  return (
    <ExploreExpertGrid
      experts={experts}
      loading={loading}
      hasMore={hasMore}
      onLoadMore={handleLoadMore}
      onResetFilters={resetFilters}
    />
  );
}
