"use client";

import React from "react";
import ReportsTab from "@/components/features/profile/ReportsTab";

export default function MyReportsDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-orange-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
          My Saved Reports
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Review, analyze, and download your previous Kundli matching and astrological reports
        </p>
      </div>

      <ReportsTab />
    </div>
  );
}
