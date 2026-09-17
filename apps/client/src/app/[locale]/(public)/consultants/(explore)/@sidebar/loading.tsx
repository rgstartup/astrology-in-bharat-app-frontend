import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Separator } from "@/components/ui/separator";

export default function SidebarLoading() {
  return (
    <div className="w-full bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-xl shadow-black/5 sticky top-24">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-gray-100">
        <Skeleton className="w-24 h-6 rounded-lg" />
        <Skeleton className="w-14 h-4 rounded-md" />
      </div>

      <div className="space-y-6 pt-5">
        {/* Availability Toggle Skeleton */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-gray-100">
          <Skeleton className="w-28 h-4 rounded-md" />
          <Skeleton className="w-10 h-6 rounded-full" />
        </div>

        <Separator />

        {/* Specializations Skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-28 h-4 rounded-md" />
          <Skeleton className="w-full h-8 rounded-xl" />
          <div className="space-y-2 pt-1">
            <Skeleton className="w-full h-7 rounded-xl" />
            <Skeleton className="w-full h-7 rounded-xl" />
            <Skeleton className="w-full h-7 rounded-xl" />
            <Skeleton className="w-full h-7 rounded-xl" />
          </div>
        </div>

        <Separator />

        {/* Price Range Slider Skeleton */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="w-24 h-4 rounded-md" />
            <Skeleton className="w-16 h-4 rounded-md" />
          </div>
          <Skeleton className="w-full h-3 rounded-full" />
        </div>

        <Separator />

        {/* Rating Skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-20 h-4 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="w-full h-7 rounded-xl" />
            <Skeleton className="w-full h-7 rounded-xl" />
            <Skeleton className="w-full h-7 rounded-xl" />
          </div>
        </div>

        <Separator />

        {/* Languages Skeleton */}
        <div className="space-y-3">
          <Skeleton className="w-24 h-4 rounded-md" />
          <div className="flex flex-wrap gap-2">
            <Skeleton className="w-16 h-6 rounded-lg" />
            <Skeleton className="w-20 h-6 rounded-lg" />
            <Skeleton className="w-14 h-6 rounded-lg" />
            <Skeleton className="w-18 h-6 rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}
