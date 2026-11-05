"use client";

import React from "react";
import { Link } from "@/i18n";
import { ShoppingBag } from "@repo/design/lucide";
import { useShopStore } from "../stores/shop.store";

export const ShopCartButton: React.FC = () => {
  const cartCount = useShopStore((state) => state.cartCount);

  return (
    <Link
      href="/shop/cart"
      aria-label="Shopping bag"
      title="Shopping Bag"
      className="inline-flex items-center gap-2 h-10 px-4 rounded-full bg-white hover:bg-[#f5f1ec] text-neutral-900 border border-[#e8e4de] transition-all text-sm font-medium relative select-none cursor-pointer"
    >
      <ShoppingBag className="w-4 h-4 text-neutral-900" />
      <span className="text-sm font-medium">Bag</span>
      {cartCount > 0 && (
        <span className="min-w-5 h-5 px-1.5 rounded-full bg-neutral-900 text-white text-[11px] font-semibold flex items-center justify-center">
          {cartCount > 99 ? "99+" : cartCount}
        </span>
      )}
    </Link>
  );
};
