"use client";

import React from "react";
import { Sparkles, RotateCcw, Loader2 } from "lucide-react";
import type { Expert } from "@repo/lib";
import { ExploreExpertCard } from "./ExploreExpertCard";

interface ExploreExpertGridProps {
  experts: Expert[];
  loading: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onResetFilters: () => void;
}

function CardSkeleton() {
  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-5 shadow-sm animate-pulse flex flex-col justify-between h-[410px]">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="size-16 rounded-2xl bg-gray-200" />
          <div className="w-20 h-6 rounded-xl bg-gray-200" />
        </div>
        <div className="h-5 w-3/4 rounded-md bg-gray-200 mb-2" />
        <div className="h-3 w-full rounded-md bg-gray-100 mb-1" />
        <div className="h-3 w-2/3 rounded-md bg-gray-100 mb-4" />
        <div className="flex gap-2 mb-4">
          <div className="h-6 w-16 rounded-full bg-gray-200" />
          <div className="h-6 w-16 rounded-full bg-gray-200" />
        </div>
      </div>
      <div>
        <div className="h-px bg-gray-100 mb-4" />
        <div className="grid grid-cols-3 gap-2">
          <div className="h-12 rounded-xl bg-gray-200" />
          <div className="h-12 rounded-xl bg-gray-200" />
          <div className="h-12 rounded-xl bg-gray-200" />
        </div>
      </div>
    </div>
  );
}

export function ExploreExpertGrid({
  experts,
  loading,
  hasMore,
  onLoadMore,
  onResetFilters,
}: ExploreExpertGridProps) {
  // Empty State
  if (!loading && experts.length === 0) {
    return (
      <div className="w-full bg-white rounded-3xl p-12 text-center border-2 border-dashed border-amber-300 shadow-sm flex flex-col items-center justify-center min-h-[380px]">
        <div className="size-16 rounded-full bg-amber-500/10 text-orange flex items-center justify-center mb-4">
          <Sparkles className="size-8" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2 font-display">
          No Astrologers Match Your Criteria
        </h3>
        <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
          Try expanding your price range, clearing some specializations, or
          unchecking the &quot;Online Only&quot; toggle to see more verified
          gurus.
        </p>
        <button
          type="button"
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange text-white font-bold text-sm shadow-md shadow-orange/30 hover:opacity-90 active:scale-95 transition-all"
        >
          <RotateCcw className="size-4" />
          <span>Reset All Filters</span>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Grid of Expert Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {experts.map((expert) => (
          <ExploreExpertCard key={expert.id} expert={expert} />
        ))}

        {/* Loading Skeletons when fetching additional cards */}
        {loading &&
          Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-12 mb-8">
          <button
            type="button"
            onClick={onLoadMore}
            disabled={loading}
            className="group relative px-10 py-4 bg-white border-2 border-orange/40 hover:border-orange text-gray-900 hover:text-white hover:bg-orange rounded-2xl font-black text-xs uppercase tracking-widest shadow-lg shadow-orange/10 hover:shadow-orange/30 hover:-translate-y-0.5 active:scale-95 transition-all duration-300 flex items-center gap-2.5"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin text-orange group-hover:text-white" />
            ) : (
              <Sparkles className="size-4 text-orange group-hover:text-white transition-colors" />
            )}
            <span>Load More Experts</span>
          </button>
        </div>
      )}
    </div>
  );
}
