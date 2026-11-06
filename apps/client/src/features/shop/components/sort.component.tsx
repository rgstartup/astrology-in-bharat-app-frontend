"use client";

import { useRouter } from "next/navigation";
import { SlidersHorizontal } from "@repo/design/lucide";
import { buildShopHref, type ShopQueryState } from "../utils/shop-params";

interface SortProps extends ShopQueryState {
  currentSort?: string;
}

export function Sort({ currentSort = "featured", ...state }: SortProps) {
  const router = useRouter();

  const handleChange = (value: string) => {
    router.push(buildShopHref({ ...state, sort: value === "featured" ? undefined : value }));
  };

  return (
    <div className="flex items-center gap-1.5 bg-[#f5f1ec] border border-[#e8e4de] rounded-full px-3 py-1.5">
      <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
      <select
        value={currentSort}
        onChange={(e) => handleChange(e.target.value)}
        className="bg-transparent text-xs text-neutral-900 font-medium outline-none cursor-pointer border-none"
      >
        <option value="featured">Featured</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
    </div>
  );
}
