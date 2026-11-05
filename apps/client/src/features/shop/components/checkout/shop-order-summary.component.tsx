"use client";

import React from "react";
import { Sparkles, Check } from "@repo/design/lucide";

interface ShopOrderSummaryProps {
  subtotal: number;
  shipping: number;
  platformFee: number;
  discount: number;
  total: number;
  couponCode: string;
  setCouponCode: (code: string) => void;
  appliedCoupon: any;
  isApplying: boolean;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  itemCount: number;
}

export const ShopOrderSummary: React.FC<ShopOrderSummaryProps> = ({
  subtotal,
  shipping,
  platformFee,
  discount,
  total,
  couponCode,
  setCouponCode,
  appliedCoupon,
  isApplying,
  onApplyCoupon,
  onRemoveCoupon,
  itemCount,
}) => {
  return (
    <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e4de]">
        <h2 className="text-base font-semibold text-neutral-900">
          Order Summary
        </h2>
        <span className="text-xs text-neutral-500">
          {itemCount} {itemCount === 1 ? "item" : "items"}
        </span>
      </div>

      {/* Breakdown */}
      <div className="space-y-3 text-sm">
        <div className="flex items-center justify-between text-neutral-600">
          <span>Items subtotal</span>
          <span className="font-medium text-neutral-900">₹{subtotal}</span>
        </div>

        <div className="flex items-center justify-between text-neutral-600">
          <span>Delivery charge</span>
          <span className="font-medium text-neutral-900">
            {shipping === 0 ? "Free" : `₹${shipping}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-neutral-600">
          <span>Packaging & platform</span>
          <span className="font-medium text-neutral-900">₹{platformFee}</span>
        </div>

        {discount > 0 && (
          <div className="flex items-center justify-between text-emerald-600 font-medium">
            <span>Coupon savings</span>
            <span>-₹{discount}</span>
          </div>
        )}

        <div className="pt-3 border-t border-[#e8e4de] flex items-center justify-between text-base font-semibold text-neutral-900">
          <span>Total payable</span>
          <span className="text-xl">₹{Math.round(total)}</span>
        </div>
      </div>

      {/* Coupon Box */}
      <div className="pt-4 border-t border-[#e8e4de]">
        {appliedCoupon ? (
          <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-[#e8e4de]">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-neutral-900" />
              <span className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                {appliedCoupon.code}
              </span>
            </div>
            <button
              type="button"
              onClick={onRemoveCoupon}
              className="text-xs text-rose-600 font-medium hover:underline cursor-pointer"
            >
              Remove
            </button>
          </div>
        ) : (
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                placeholder="Coupon code"
                className="w-full h-10 pl-8 pr-3 bg-white border border-[#e8e4de] rounded-full text-xs text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900"
              />
            </div>
            <button
              type="button"
              onClick={onApplyCoupon}
              disabled={isApplying || !couponCode.trim()}
              className="h-10 px-5 rounded-full bg-neutral-900 text-white hover:bg-black text-xs font-medium transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
            >
              {isApplying ? "..." : "Apply"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
