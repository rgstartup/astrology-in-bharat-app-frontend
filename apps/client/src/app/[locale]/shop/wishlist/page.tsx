"use client";

import React from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n";
import { Heart, Trash2 } from "@repo/design/lucide";
import { useShopStore } from "@/features/shop";
import { getProductImageUrl } from "@/utils/image-utils";

export default function ShopWishlistPage() {
  const router = useRouter();
  const { wishlistItems, removeFromWishlist, addToCart } = useShopStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e4de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">
            Saved Items
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Your sacred gemstones and puja items wishlist
          </p>
        </div>
        <span className="text-xs font-medium text-neutral-900 bg-[#f5f1ec] border border-[#e8e4de] px-3.5 py-1.5 rounded-full">
          {wishlistItems.length} {wishlistItems.length === 1 ? "saved item" : "saved items"}
        </span>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-12 text-center max-w-lg mx-auto space-y-4 my-8">
          <div className="w-14 h-14 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center mx-auto text-neutral-900">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-neutral-500">
            Explore authentic energized items and click the heart icon to save them for later.
          </p>
          <Link
            href="/shop"
            className="inline-flex h-11 px-6 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-medium items-center justify-center transition-colors"
          >
            Explore Shop
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {wishlistItems.map((item) => {
            const prod = item.product || (item as any);
            const productId = String(prod.id || item.productId);
            const imageUrl = getProductImageUrl(prod);
            const price = Number(prod.sale_price || prod.price || 0);

            return (
              <div
                key={productId}
                className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-5 hover:border-[#111111] transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative w-full aspect-[4/3] rounded-[14px] bg-white border border-[#e8e4de] overflow-hidden flex items-center justify-center p-3 mb-3">
                    <Image
                      src={imageUrl}
                      alt={prod.name || "Item"}
                      fill
                      className="object-contain p-2"
                    />
                    <button
                      type="button"
                      onClick={() => removeFromWishlist(productId)}
                      aria-label="Remove from wishlist"
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center text-neutral-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                    {prod.name || "Sacred Item"}
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    ₹{price}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#e8e4de] flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      addToCart(productId, 1);
                      removeFromWishlist(productId);
                    }}
                    className="flex-1 h-9 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-medium transition-colors cursor-pointer"
                  >
                    Move to Bag
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push(`/shop/product/${productId}`)}
                    className="h-9 px-3 rounded-full bg-white border border-[#d3cec6] text-neutral-900 hover:bg-neutral-50 text-xs font-medium transition-colors"
                  >
                    View
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
