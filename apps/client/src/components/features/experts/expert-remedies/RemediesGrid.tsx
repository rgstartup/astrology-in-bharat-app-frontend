"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Sparkles, ArrowRight, PackageOpen } from "lucide-react";
import { RemedyItem, RemedyTabConfig } from "./types";
import { RemedyCard } from "./RemedyCard";

interface RemediesGridProps {
  tabConfig: RemedyTabConfig;
  items: RemedyItem[];
  expertName: string;
  expertId: string;
}

export const RemediesGrid: React.FC<RemediesGridProps> = ({
  tabConfig,
  items,
  expertName,
  expertId,
}) => {
  return (
    <div
      role="tabpanel"
      id={`remedy-panel-${tabConfig.key}`}
      aria-labelledby={`remedy-tab-${tabConfig.key}`}
      className="space-y-6 animate-fadeIn transition-opacity duration-300"
    >
      {/* Tab Context Banner */}
      <div className="bg-amber-50/60 border border-amber-200/60 rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start sm:items-center gap-2.5">
          <div className="size-7 rounded-lg bg-orange/10 text-orange flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
            <Sparkles className="size-4" />
          </div>
          <div>
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              {tabConfig.description}
            </p>
          </div>
        </div>

        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-700 text-[11px] font-bold border border-slate-200/80 shrink-0 self-start sm:self-center shadow-2xs">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          <span>{tabConfig.highlightTag}</span>
        </span>
      </div>

      {/* Cards Grid */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
          {items.map((item) => (
            <RemedyCard
              key={String(item.id)}
              item={item}
              expertName={expertName}
              expertId={expertId}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="py-14 text-center bg-gray-50/50 rounded-2xl border border-dashed border-gray-200 p-8">
          <PackageOpen className="size-12 text-gray-300 mx-auto mb-3" />
          <h4 className="text-base font-bold text-gray-800 mb-1">
            No Remedies Available in this Category Yet
          </h4>
          <p className="text-xs text-gray-500 max-w-md mx-auto mb-5">
            {expertName} is currently updating their specific recommendations for {tabConfig.label}.
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange text-white text-xs font-bold shadow-xs hover:bg-[#d35400] transition-colors"
          >
            <span>Browse Full Spiritual Store</span>
            <ArrowRight className="size-3.5" />
          </Link>
        </div>
      )}
    </div>
  );
};
