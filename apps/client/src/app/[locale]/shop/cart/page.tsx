"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { Link, useRouter } from "@/i18n";
import { Trash2, ShoppingBag, ArrowRight } from "@repo/design/lucide";
import { useShopStore } from "@/features/shop";
import { useAuthStore } from "@/store/authStore";
import { getProductImageUrl } from "@/utils/image-utils";

export default function ShopCartPage() {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuthStore();
  const {
    cartItems,
    cartTotal,
    isCartLoading,
    updateQuantity,
    removeFromCart,
    platformFee,
  } = useShopStore();

  useEffect(() => {
    // Clear any direct single-purchase item when viewing shopping bag
    sessionStorage.removeItem("buyNowItem");
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  if (loading || isCartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center text-sm text-neutral-500">
        Loading shopping bag...
      </div>
    );
  }

  // Calculate shipping per merchant
  let shipping = 0;
  const merchantShippingMap = new Map<string, number>();
  cartItems.forEach((item: any) => {
    if (item.product?.is_shipping_chargeable) {
      const merchantId = item.product?.merchant_id || "platform";
      const currentMax = merchantShippingMap.get(merchantId) || 0;
      const charge = Number(item.product?.shipping_charge) || 0;
      if (charge > currentMax) {
        merchantShippingMap.set(merchantId, charge);
      }
    }
  });
  merchantShippingMap.forEach((charge) => {
    shipping += charge;
  });

  const grandTotal = cartTotal + shipping + platformFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e4de]">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">
            Shopping Bag
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Review your selected spiritual items before checkout
          </p>
        </div>
        <span className="text-xs font-medium text-neutral-900 bg-[#f5f1ec] border border-[#e8e4de] px-3.5 py-1.5 rounded-full">
          {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-12 text-center my-12 max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center mx-auto text-neutral-900">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900">
            Your shopping bag is empty
          </h2>
          <p className="text-xs text-neutral-500 max-w-xs mx-auto">
            Discover lab-certified gemstones, energized yantras, and pure puja samagri in our catalog.
          </p>
          <Link
            href="/shop"
            className="inline-flex h-11 px-6 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-medium items-center justify-center transition-colors"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Cart Item Rows (Cream Cards with White Photo Plates) */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item: any) => {
              const prod = item.product || {};
              const imageUrl = getProductImageUrl(prod);
              const price = Number(prod.sale_price || prod.price || 0);
              const itemId = String(prod.id || item.productId);

              return (
                <div
                  key={itemId}
                  className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  {/* Image & Title */}
                  <div className="flex items-center gap-4 flex-1">
                    <div className="relative w-18 h-18 rounded-[14px] bg-white border border-[#e8e4de] overflow-hidden shrink-0 flex items-center justify-center p-2">
                      <Image
                        src={imageUrl}
                        alt={prod.name || "Item"}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm sm:text-base font-semibold text-neutral-900 line-clamp-1">
                        {prod.name || "Sacred Item"}
                      </h3>
                      <p className="text-xs text-neutral-500">
                        ₹{price} per unit
                      </p>
                    </div>
                  </div>

                  {/* Quantity & Price */}
                  <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-0 border-[#e8e4de]">
                    <div className="flex items-center gap-2 bg-white border border-[#e8e4de] rounded-full p-1">
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemId, item.quantity - 1)}
                        className="w-7 h-7 rounded-full bg-[#f5f1ec] text-neutral-900 flex items-center justify-center text-xs font-semibold hover:bg-neutral-200 transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-semibold text-neutral-900">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(itemId, item.quantity + 1)}
                        className="w-7 h-7 rounded-full bg-[#f5f1ec] text-neutral-900 flex items-center justify-center text-xs font-semibold hover:bg-neutral-200 transition-colors"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right min-w-[70px]">
                      <span className="text-base font-semibold text-neutral-900">
                        ₹{price * item.quantity}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(itemId)}
                      aria-label="Remove item"
                      className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-rose-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Box (Cream Card) */}
          <div className="lg:col-span-4 bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 sm:p-8 space-y-6 sticky top-24">
            <h2 className="text-base font-semibold text-neutral-900 pb-3 border-b border-[#e8e4de]">
              Order Summary
            </h2>

            <div className="space-y-3 text-sm text-neutral-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">₹{cartTotal}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="font-medium text-neutral-900">
                  {shipping === 0 ? "Free" : `₹${shipping}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Platform & packaging</span>
                <span className="font-medium text-neutral-900">₹{platformFee}</span>
              </div>

              <div className="pt-3 border-t border-[#e8e4de] flex justify-between text-base font-semibold text-neutral-900">
                <span>Total amount</span>
                <span className="text-xl">₹{Math.round(grandTotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => router.push("/shop/checkout")}
              className="w-full h-12 rounded-full bg-neutral-900 hover:bg-black text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
