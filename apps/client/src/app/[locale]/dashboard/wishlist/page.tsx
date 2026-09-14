"use client";

import React from "react";
import WishlistGrid from "@/components/features/profile/WishlistGrid";

export default function WishlistDashboardPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="border-b border-orange-100 pb-4">
        <h1 className="text-2xl sm:text-3xl font-black text-[#301118] font-outfit">
          My Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
          Saved puja services, sacred items, and astrology products
        </p>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-orange-100 shadow-sm">
        <WishlistGrid />
      </div>
    </div>
  );
}
