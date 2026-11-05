"use client";

import React from "react";
import { Lock, ShieldCheck } from "@repo/design/lucide";

interface ShopPaymentMethodProps {
  total: number;
  onPay: () => void;
  isProcessing: boolean;
}

export const ShopPaymentMethod: React.FC<ShopPaymentMethodProps> = ({
  total,
  onPay,
  isProcessing,
}) => {
  return (
    <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 sm:p-8 space-y-6">
      <div className="flex items-center gap-2.5 pb-4 border-b border-[#e8e4de]">
        <div className="w-8 h-8 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center text-neutral-900">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-neutral-900 leading-tight">
            Secure Payment
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Encrypted direct payment via Razorpay gateway
          </p>
        </div>
      </div>

      {/* Payment Option Tile (White surface inside Cream card) */}
      <div className="p-4 rounded-xl border-2 border-neutral-900 bg-white flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3.5 h-3.5 rounded-full border-4 border-neutral-900 bg-white"></span>
            <span className="text-sm font-semibold text-neutral-900">
              Online Payment (UPI, Cards, NetBanking)
            </span>
          </div>
          <p className="text-xs text-neutral-500 pl-5.5 leading-relaxed">
            Google Pay, PhonePe, Paytm, BHIM, all major Debit & Credit Cards, and NetBanking supported.
          </p>
        </div>
        <span className="text-xs font-semibold text-neutral-900 shrink-0 bg-neutral-100 border border-[#e8e4de] px-2.5 py-1 rounded-full">
          Instant
        </span>
      </div>

      {/* Pay CTA */}
      <button
        type="button"
        onClick={onPay}
        disabled={isProcessing || total <= 0}
        className="w-full h-12 rounded-full bg-neutral-900 hover:bg-black text-white text-base font-medium flex items-center justify-center gap-2 transition-colors disabled:bg-neutral-200 disabled:text-neutral-400 disabled:cursor-not-allowed cursor-pointer"
      >
        <Lock className="w-4 h-4" />
        <span>
          {isProcessing ? "Processing..." : `Pay ₹${Math.round(total)} securely`}
        </span>
      </button>

      {/* Trust & Guarantee */}
      <div className="flex items-center justify-center gap-2 text-xs text-neutral-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-neutral-900" />
        <span>256-bit SSL encrypted. 100% safe & trusted transactions.</span>
      </div>
    </div>
  );
};
