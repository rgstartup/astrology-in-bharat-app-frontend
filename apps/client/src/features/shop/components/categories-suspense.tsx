"use client";

import React from "react";
import { Skeleton } from "@repo/design/shadcn";

interface CategoriesSuspenseProps {
  children: React.ReactNode;
}

export function CategoriesSuspense({ children }: CategoriesSuspenseProps) {
  return (
    <React.Suspense fallback={<CategoriesSkeleton />}>
      {children}
    </React.Suspense>
  );
}

function CategoriesSkeleton() {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
      {[...Array(6)].map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full" />
      ))}
    </div>
  );
}