import React from "react";
import HeaderLoading from "./@header/loading";
import SidebarLoading from "./@sidebar/loading";
import CardsLoading from "./@cards/loading";

export default function ExpertsLoading() {
  return (
    <div className="min-h-screen bg-[#FFFFFF] text-gray-900 pb-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        {/* Header Skeleton (Breadcrumb, Title, Search & Sort) */}
        <HeaderLoading />

        {/* Main Two-Column Layout Skeletons */}
        <div className="flex flex-col lg:flex-row items-start gap-8">
          {/* Left Column: Sidebar Filters Skeleton */}
          <aside className="hidden lg:block w-[300px] shrink-0">
            <SidebarLoading />
          </aside>

          {/* Right Column: Expert Cards Grid Skeleton */}
          <main className="flex-1 w-full min-w-0">
            <CardsLoading />
          </main>
        </div>
      </div>
    </div>
  );
}
