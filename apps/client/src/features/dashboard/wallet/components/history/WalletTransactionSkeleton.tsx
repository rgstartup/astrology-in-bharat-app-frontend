import React from "react";
import { Skeleton } from "@/features/dashboard";

export function WalletTransactionSkeleton() {
  return (
    <div className="space-y-3 py-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div
          key={i}
          className="p-3.5 rounded-xl border border-slate-100 flex items-center justify-between gap-3 bg-slate-50/50"
        >
          <div className="flex items-center gap-3">
            <Skeleton className="w-9 h-9 rounded-full shrink-0 bg-slate-200" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-36 bg-slate-200" />
              <Skeleton className="h-3 w-20 bg-slate-200" />
            </div>
          </div>
          <div className="space-y-1 text-right">
            <Skeleton className="h-3.5 w-16 ml-auto bg-slate-200" />
            <Skeleton className="h-3 w-12 ml-auto bg-slate-200" />
          </div>
        </div>
      ))}
    </div>
  );
}
