import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

export default function HeaderLoading() {
  return (
    <div className="w-full pb-5 mb-6 border-b border-gray-200 animate-pulse">
      {/* Breadcrumb Skeleton */}
      <div className="pt-3 pb-4 flex items-center gap-2">
        <Skeleton className="w-12 h-4 rounded-md" />
        <span className="text-gray-300 text-xs">/</span>
        <Skeleton className="w-20 h-4 rounded-md" />
      </div>

      {/* Main Toolbar: Count on Left, Search + Sort on Right */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Heading Count Skeleton */}
        <div className="flex items-center gap-2.5">
          <Skeleton className="w-56 sm:w-72 h-8 rounded-lg" />
        </div>

        {/* Right: Search & Sort Skeletons */}
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full md:w-auto justify-end">
          <Skeleton className="h-11 w-full sm:w-80 md:w-96 lg:w-[440px] xl:w-[480px] rounded-xl" />
          <Skeleton className="h-11 w-36 rounded-xl shrink-0" />
          <Skeleton className="lg:hidden h-11 w-24 rounded-xl shrink-0" />
        </div>
      </div>
    </div>
  );
}
