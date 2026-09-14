"use client";

import React from "react";
import { RecommendedExperts, Button } from "@/features/dashboard";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { ArrowRight } from "lucide-react";

export default function DashboardExpertsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-orange-100 pb-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
            Verified Astrologers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
            Connect directly with verified Vedic astrologers, tarot masters, and numerologists
          </p>
        </div>

        <Link href="/experts" className="no-underline">
          <Button variant="secondary" size="sm" className="font-bold border border-orange-200">
            <span>Explore All Marketplace Experts</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      </div>

      <RecommendedExperts />
    </div>
  );
}
