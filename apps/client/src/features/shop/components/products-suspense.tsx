"use client";

import React from "react";
import { Skeleton } from "@repo/design/shadcn";

interface ProductsSuspenseProps {
  children: React.ReactNode;
}

export function ProductsSuspense({ children }: ProductsSuspenseProps) {
  return (
    <React.Suspense fallback={<ProductsSkeleton />}>
      {children}
    </React.Suspense>
  );
}

function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-5 animate-pulse">
          <Skeleton className="w-full aspect-[4/3] rounded-[14px] bg-white border border-[#e8e4de]" />
          <div className="space-y-3 pt-4">
            <Skeleton className="w-24 h-3 rounded-full" />
            <Skeleton className="w-3/4 h-4 rounded" />
            <Skeleton className="w-1/2 h-3 rounded" />
            <Skeleton className="w-20 h-5 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}