"use client";

import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export function AnalyticsSkeleton() {
  return (
    <div className="space-y-10 pb-20">
      {/* Header Skeleton */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-4">
          <Skeleton className="h-10 w-64 rounded-2xl" />
          <Skeleton className="h-6 w-96 rounded-xl" />
        </div>
      </div>

      {/* Summary Cards Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-[2.5rem]" />
        ))}
      </div>

      {/* Main Charts Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <Skeleton className="h-[400px] rounded-[2.5rem]" />
        <Skeleton className="h-[400px] rounded-[2.5rem]" />
        <Skeleton className="lg:col-span-2 h-[400px] rounded-[2.5rem]" />
      </div>
    </div>
  );
}
