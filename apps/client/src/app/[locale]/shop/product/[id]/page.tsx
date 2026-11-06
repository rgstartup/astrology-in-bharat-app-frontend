"use client";

import React, { useState, useEffect, use } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n";
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  Heart,
  ChevronLeft,
} from "@repo/design/lucide";
import { useShopStore } from "@/features/shop";
import { ShopProductService } from "@/features/shop/services/shop-product.service";
import { useAuthStore } from "@/store/authStore";
import { toast } from "@repo/design/shadcn";
import type { Product } from "@repo/lib";
import {
  getProductPrice,
  getProductOriginalPrice,
  getProductImage,
  getProductImages,
  getProductCategory,
} from "@/features/shop/utils/product-adapter";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default function ShopProductDetailPage({ params }: ProductPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();
  const { addToCart, isInWishlist, toggleWishlist } = useShopStore();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    let isMounted = true;
    ShopProductService.getProductById(id).then((data) => {
      if (!isMounted) return;
      if (data) {
        setProduct(data);
        const img = getProductImage(data);
        setSelectedImage(img);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-neutral-500 text-sm">
        Loading product details...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-xl font-semibold text-neutral-900">Product Not Found</h2>
        <p className="text-xs text-neutral-500">
          The product you are looking for is unavailable or removed.
        </p>
        <Link
          href="/shop"
          className="inline-flex h-10 px-6 rounded-full bg-neutral-900 text-white text-xs font-medium items-center justify-center hover:bg-black transition-colors"
        >
          Back to Shop
        </Link>
      </div>
    );
  }

  const productId = String(product.id);
  const isLiked = isInWishlist(productId);
  const price = getProductPrice(product);
  const originalPrice = getProductOriginalPrice(product);
  const images = getProductImages(product);
  const category = getProductCategory(product);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to bag");
      router.push("/login");
      return;
    }

    setIsAdding(true);
    await addToCart(productId, quantity);
    setIsAdding(false);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.error("Please sign in to buy items");
      router.push("/login");
      return;
    }

    sessionStorage.setItem(
      "buyNowItem",
      JSON.stringify({ productId, quantity }),
    );
    router.push(`/shop/checkout?productId=${productId}&quantity=${quantity}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-10">
      {/* Back button */}
      <div>
        <Link
          href="/shop"
          className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Collection</span>
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Images Plate (Cream Container with Inner White Plate) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative w-full aspect-[4/3] rounded-2xl bg-[#f5f1ec] border border-[#e8e4de] overflow-hidden flex items-center justify-center p-6">
            <div className="relative w-full h-full rounded-[14px] bg-white border border-[#e8e4de] overflow-hidden flex items-center justify-center p-4">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-contain p-4"
              />
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(productId)}
              aria-label={isLiked ? "Remove from wishlist" : "Add to wishlist"}
              className={`absolute top-8 right-8 w-9 h-9 rounded-full flex items-center justify-center border transition-all ${
                isLiked
                  ? "bg-neutral-900 text-white border-neutral-900"
                  : "bg-white/90 backdrop-blur-xs text-neutral-500 hover:text-neutral-900 border-[#e8e4de]"
              }`}
            >
              <Heart className={`w-4 h-4 ${isLiked ? "fill-white" : ""}`} />
            </button>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex items-center gap-3 overflow-x-auto pb-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setSelectedImage(img)}
                  className={`relative w-20 h-20 rounded-xl bg-white border overflow-hidden shrink-0 cursor-pointer transition-all ${
                    selectedImage === img
                      ? "border-neutral-900 ring-2 ring-neutral-900/10"
                      : "border-[#e8e4de] hover:border-neutral-400"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${product.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="80px"
                    className="object-contain p-1.5"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info Card (Cream Floating Tile) */}
        <div className="lg:col-span-5 bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <span className="capitalize">{category}</span>
              <div className="flex items-center gap-1 font-medium text-neutral-900">
                <Star className="w-3.5 h-3.5 fill-neutral-900 text-neutral-900" />
                <span>{4.8}</span>
                <span className="text-neutral-400">(48)</span>
              </div>
            </div>

            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900 leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="flex items-baseline gap-3 pt-2">
              <span className="text-2xl sm:text-3xl font-semibold text-neutral-900">
                ₹{price}
              </span>
              {originalPrice > price && (
                <span className="text-sm text-neutral-400 line-through">
                  ₹{originalPrice}
                </span>
              )}
            </div>
          </div>

          <p className="text-sm text-neutral-600 leading-relaxed">
            {product.description || ""}
          </p>

          {/* Quantity selector */}
          <div className="pt-4 border-t border-[#e8e4de] flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-700">Quantity</span>
            <div className="flex items-center gap-2 bg-white border border-[#e8e4de] rounded-full p-1">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="w-7 h-7 rounded-full bg-[#f5f1ec] text-neutral-900 flex items-center justify-center text-xs font-semibold hover:bg-neutral-200 transition-colors"
              >
                -
              </button>
              <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                {quantity}
              </span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="w-7 h-7 rounded-full bg-[#f5f1ec] text-neutral-900 flex items-center justify-center text-xs font-semibold hover:bg-neutral-200 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* CTAs */}
          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleBuyNow}
              className="w-full h-12 rounded-full bg-neutral-900 hover:bg-black text-white text-sm font-medium transition-colors cursor-pointer"
            >
              Buy Now (₹{price * quantity})
            </button>

            <button
              type="button"
              onClick={handleAddToCart}
              disabled={isAdding}
              className="w-full h-12 rounded-full bg-white border border-[#d3cec6] text-neutral-900 hover:bg-neutral-50 text-sm font-medium transition-colors cursor-pointer"
            >
              {isAdding ? "Adding..." : "Add to Shopping Bag"}
            </button>
          </div>

          {/* Trust points */}
          <div className="pt-4 border-t border-[#e8e4de] space-y-2 text-xs text-neutral-500">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-neutral-900" />
              <span>Certified authentic & Vedic purified</span>
            </div>
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-neutral-900" />
              <span>Dispatched within 24-48 hours via courier</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-neutral-900" />
              <span>Easy replacement if damaged during transit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Specifications & FAQs in Cream Floating Cards */}
      {product.variants && product.variants[0]?.description && (
        <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-semibold text-neutral-900">Specifications</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl bg-white border border-[#e8e4de]">
              <span className="font-semibold text-neutral-900 block mb-0.5">Description</span>
              <span className="text-neutral-600">{product.variants[0].description}</span>
            </div>
          </div>
        </div>
      )}

      {product.variants && product.variants[0]?.promotions && product.variants[0].promotions.length > 0 && (
        <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 sm:p-8 space-y-4">
          <h2 className="text-base font-semibold text-neutral-900">Offers</h2>
          <div className="space-y-3">
            {product.variants[0].promotions.map((f, i) => (
              <div key={i} className="border-b border-[#e8e4de] pb-3 last:border-0">
                <p className="text-sm font-medium text-neutral-900">{f.name}: {f.discount_value}{f.discount_type === "percentage" ? "%" : "₹"} off</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}