"use client";

import React from "react";

const RemedyCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-200/90 overflow-hidden shadow-2xs flex flex-col justify-between animate-pulse">
    <div>
      <div className="aspect-16/10 w-full bg-slate-200" />
      <div className="p-3.5 sm:p-4 space-y-2">
        <div className="h-3.5 w-20 bg-slate-200 rounded" />
        <div className="h-4 w-full bg-slate-200 rounded" />
        <div className="space-y-1 pt-0.5">
          <div className="h-2.5 w-4/5 bg-slate-100 rounded" />
          <div className="h-2.5 w-3/5 bg-slate-100 rounded" />
        </div>
      </div>
    </div>
    <div className="p-3.5 sm:p-4 pt-0">
      <div className="h-px bg-gray-100 mb-2.5" />
      <div className="flex items-center justify-between gap-2">
        <div className="h-5 w-16 bg-slate-200 rounded" />
        <div className="h-7 w-20 bg-slate-200 rounded-lg" />
      </div>
    </div>
  </div>
);

export default function ProductsLoading() {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-white via-slate-50/50 to-white border-t border-gray-100 animate-pulse">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 space-y-8">
        {/* Header Strip Skeleton */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-6 w-52 bg-orange/10 rounded-full" />
            <div className="h-8 w-80 sm:w-96 bg-slate-200 rounded-lg" />
            <div className="h-4 w-full max-w-xl bg-slate-100 rounded" />
          </div>
        </div>

        {/* Tabs Bar Skeleton */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-100">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-11 rounded-xl shrink-0 ${
                i === 1
                  ? "w-40 bg-orange/20 border border-orange/30"
                  : "w-36 bg-slate-100 border border-slate-200/60"
              }`}
            />
          ))}
        </div>

        {/* Tab Context Banner Skeleton */}
        <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-lg bg-orange/10 shrink-0" />
            <div className="h-4 w-64 bg-slate-200 rounded" />
          </div>
          <div className="h-6 w-32 bg-white rounded-full border border-slate-200" />
        </div>

        {/* Cards Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {[1, 2, 3, 4].map((n) => (
            <RemedyCardSkeleton key={n} />
          ))}
        </div>
      </div>
    </section>
  );
}
