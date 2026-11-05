"use client";

import React, { useState, useMemo } from "react";
import { ProductCard } from "./product-card.component";
import type { ShopProduct } from "../types/shop.types";
import { SlidersHorizontal } from "@repo/design/lucide";

interface ProductGridProps {
  products: ShopProduct[];
  categories?: string[];
  initialCategory?: string;
  onViewProduct?: (product: ShopProduct) => void;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  categories = ["All", "Gemstones", "Rudraksha", "Yantras", "Puja Items", "Bracelets"],
  initialCategory = "All",
  onViewProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter(
        (p) =>
          p.category?.toLowerCase() === selectedCategory.toLowerCase() ||
          p.name.toLowerCase().includes(selectedCategory.toLowerCase()),
      );
    }

    if (sortBy === "price-asc") {
      result.sort((a, b) => Number(a.sale_price || a.price || 0) - Number(b.sale_price || b.price || 0));
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => Number(b.sale_price || b.price || 0) - Number(a.sale_price || a.price || 0));
    }

    return result;
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="w-full space-y-6">
      {/* Category Pills & Sorting Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#e8e4de]">
        {/* Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`h-9 px-4 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-neutral-900 text-white border-neutral-900"
                    : "bg-[#f5f1ec] text-neutral-700 hover:text-neutral-900 hover:bg-white border-[#e8e4de]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sort & Count */}
        <div className="flex items-center gap-3 shrink-0 self-end sm:self-auto">
          <span className="text-xs text-neutral-500">
            {filteredProducts.length} items
          </span>
          <div className="flex items-center gap-1.5 bg-[#f5f1ec] border border-[#e8e4de] rounded-full px-3 py-1.5">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs text-neutral-900 font-medium outline-none cursor-pointer border-none"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-12 text-center my-8">
          <p className="text-base font-semibold text-neutral-900 mb-1">
            No items found
          </p>
          <p className="text-xs text-neutral-500 mb-4">
            Try selecting another category or clear your search filters.
          </p>
          <button
            type="button"
            onClick={() => setSelectedCategory("All")}
            className="h-10 px-6 rounded-full bg-neutral-900 text-white text-xs font-medium hover:bg-black transition-colors cursor-pointer"
          >
            Show All Products
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onView={onViewProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
