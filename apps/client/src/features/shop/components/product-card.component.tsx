"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "@/i18n";
import { Heart, Star } from "@repo/design/lucide";
import { useShopStore } from "../stores/shop.store";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@repo/design/shadcn";
import type { Product } from "@repo/lib";
import {
  getProductPrice,
  getProductOriginalPrice,
  getProductImage,
  getProductCategory,
  getProductImages,
} from "../utils/product-adapter";

interface ProductCardProps {
  product: Product;
  onView?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onView,
}) => {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToCart, isInWishlist, toggleWishlist } = useShopStore();
  const [isAdding, setIsAdding] = useState(false);

  const productId = String(product.id);
  const isLiked = isInWishlist(productId);

  const imageUrl = getProductImage(product);
  const price = getProductPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const category = getProductCategory(product);

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(productId);
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to add items to bag");
      router.push("/login");
      return;
    }

    setIsAdding(true);
    await addToCart(productId, 1);
    setIsAdding(false);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Please sign in to proceed with purchase");
      router.push("/login");
      return;
    }

    sessionStorage.setItem(
      "buyNowItem",
      JSON.stringify({ productId, quantity: 1 }),
    );
    router.push(`/shop/checkout?productId=${productId}&quantity=1`);
  };

  return (
    <div
      onClick={() => (onView ? onView(product) : router.push(`/shop/product/${productId}`))}
      className="group bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-5 hover:border-[#111111] transition-all flex flex-col cursor-pointer select-none"
    >
      {/* Crisp White Photo Plate (14px radius inside Cream Card) — image covers the full section */}
      <div className="relative w-full aspect-[4/3] rounded-[14px] bg-white border border-[#e8e4de] overflow-hidden">
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleLike}
          aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center border transition-all ${
            isLiked
              ? "bg-neutral-900 text-white border-neutral-900"
              : "bg-white/90 backdrop-blur-xs text-neutral-500 hover:text-neutral-900 border-[#e8e4de]"
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 pt-4">
        {/* Rating & Category */}
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <span className="capitalize">{category}</span>
          <div className="flex items-center gap-1 font-medium text-neutral-900">
            <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
            <span>{4.8}</span>
          </div>
        </div>

        {/* Title */}
        <h3 className="text-base font-semibold text-neutral-900 line-clamp-1">
          {product.name}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-sm text-neutral-600 line-clamp-2 mt-1 leading-snug">
            {product.description}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mt-auto pt-3">
          <span className="text-lg font-semibold text-neutral-900">
            ₹{price}
          </span>
          {originalPrice > price && (
            <span className="text-xs text-neutral-400 line-through">
              ₹{originalPrice}
            </span>
          )}
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mt-3 pt-2 border-t border-[#e8e4de]">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="w-full h-10 rounded-full bg-white border border-[#d3cec6] text-neutral-900 hover:bg-neutral-50 text-xs font-medium transition-colors cursor-pointer"
          >
            {isAdding ? "Adding..." : "Add to Bag"}
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="w-full h-10 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-medium transition-colors cursor-pointer"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
};