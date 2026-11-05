"use client";

import React, { useState } from "react";
import { Link, useRouter } from "@/i18n";
import { Search, Heart, Package, Sparkles } from "@repo/design/lucide";
import { ShopCartButton } from "./shop-cart-button.component";
import { ShopProfileDropdown } from "./shop-profile-dropdown.component";

export const ShopHeader: React.FC = () => {
  const router = useRouter();
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      router.push(`/shop?search=${encodeURIComponent(search.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-md border-b border-[#e8e4de]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-6">
          <Link
            href="/shop"
            className="flex items-center gap-2.5 text-neutral-900 no-underline group"
          >
            <div className="w-9 h-9 rounded-full bg-neutral-900 text-white flex items-center justify-center font-semibold text-sm">
              AS
            </div>
            <div className="flex flex-col">
              <span className="text-base font-semibold text-neutral-900 leading-none tracking-tight">
                Astro Shop
              </span>
              <span className="text-[11px] font-normal text-neutral-500 mt-0.5">
                Energized & Authentic
              </span>
            </div>
          </Link>

          {/* Consultation Return Link */}
          <Link
            href="/"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-neutral-600 hover:text-neutral-900 transition-colors px-3.5 py-1.5 rounded-full hover:bg-[#f5f1ec] border border-transparent hover:border-[#e8e4de]"
          >
            <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
            <span>Consultation & Astrologers</span>
          </Link>
        </div>

        {/* Search */}
        <form
          onSubmit={handleSearch}
          className="hidden sm:flex flex-1 max-w-md mx-4 items-center relative"
        >
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search gemstones, yantras, rudraksha..."
            className="w-full h-10 pl-10 pr-4 bg-[#f5f1ec] border border-[#e8e4de] rounded-full text-sm text-neutral-900 placeholder:text-neutral-500 focus:bg-white focus:outline-none focus:border-neutral-900 transition-all"
          />
        </form>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/shop/wishlist"
            className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-[#f5f1ec] border border-[#e8e4de] transition-colors"
          >
            <Heart className="w-4 h-4 text-neutral-500" />
            <span>Wishlist</span>
          </Link>

          <Link
            href="/shop/orders"
            className="hidden sm:inline-flex items-center gap-1.5 h-10 px-4 rounded-full text-xs font-medium text-neutral-700 hover:text-neutral-900 hover:bg-[#f5f1ec] border border-[#e8e4de] transition-colors"
          >
            <Package className="w-4 h-4 text-neutral-500" />
            <span>Orders</span>
          </Link>

          <ShopCartButton />

          {/* Dedicated Shop Auth Avatar Dropdown (Zero Wallet) */}
          <ShopProfileDropdown />
        </div>
      </div>
    </header>
  );
};
