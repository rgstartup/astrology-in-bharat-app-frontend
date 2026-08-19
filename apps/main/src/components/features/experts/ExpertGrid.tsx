"use client";

import React from "react";
import ExpertCard from "./ExpertCard";
import { ExpertGridSkeleton, SkeletonCard } from "./SkeletonCard";
import { ClientExpertProfile } from "@/lib/types";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";

interface ExpertGridProps {
  experts: ClientExpertProfile[];
  loading: boolean;
  hasMore: boolean;
  initialError?: string;
  lang: string;
  t: any;
  handleLoadMore: () => void;
}

const ExpertGrid: React.FC<ExpertGridProps> = ({
  experts,
  loading,
  hasMore,
  initialError,
  lang,
  t,
  handleLoadMore,
}) => {
  return (
    <div className="mt-12 w-full">
      {/* Dynamic Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {experts.length === 0 ? (
           Array.from({ length: 4 }).map((_, i) => (
             <div key={`skeleton-${i}`} className="w-full h-full">
               <SkeletonCard />
             </div>
           ))
        ) : (
          experts.map((item, idx) => (
            <div 
              key={item.id} 
              className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              <ExpertCard expertData={item} />
            </div>
          ))
        )}
      </div>

      {/* Loading Spinner for Infinite Scroll */}
      {loading && experts.length > 0 && (
        <div className="flex justify-center items-center py-16">
          <div className="relative">
             <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
             <div className="relative flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-lg">
                <FaSpinner className="animate-spin text-primary" />
                <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Gathering More Profiles</span>
             </div>
          </div>
        </div>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div className="flex justify-center mt-16 mb-24 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent -z-10"></div>
          <button
            onClick={handleLoadMore}
            className="group relative px-12 py-6 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-premium hover:shadow-2xl hover:bg-slate-950 hover:text-white hover:-translate-y-1 active:scale-95 transition-all duration-500"
          >
            <div className="flex items-center gap-4">
               <HiOutlineSparkles className="text-orange shadow-orange/30 shadow-2xl" />
               <span>{t.expertSection.loadMore}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertGrid;
