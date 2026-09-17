import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";

function CardSkeleton() {
  return (
    <div className="rounded-3xl border-2 border-gray-200 bg-white p-5 shadow-sm flex flex-col justify-between h-[410px] animate-pulse">
      <div>
        {/* Top: Avatar & Rating Badge */}
        <div className="flex items-center justify-between mb-4">
          <Skeleton className="size-16 rounded-2xl" />
          <Skeleton className="w-20 h-6 rounded-xl" />
        </div>

        {/* Name & Title */}
        <Skeleton className="h-5 w-3/4 rounded-md mb-2" />
        <Skeleton className="h-3 w-full rounded-md mb-1.5" />
        <Skeleton className="h-3 w-2/3 rounded-md mb-4" />

        {/* Specialization Pills */}
        <div className="flex gap-2 mb-4">
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>

      <div>
        <div className="h-px bg-gray-100 mb-4" />
        {/* 3 Action Buttons (Chat, Call, Video) */}
        <div className="grid grid-cols-3 gap-2">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-12 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function CardsLoading() {
  return (
    <div className="w-full">
      {/* Grid of Expert Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
