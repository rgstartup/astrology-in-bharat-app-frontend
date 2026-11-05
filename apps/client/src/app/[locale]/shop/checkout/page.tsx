"use client";

import React, { Suspense } from "react";
import { Link } from "@/i18n";
import { ChevronLeft, Lock } from "@repo/design/lucide";
import {
  useShopCheckout,
  ShopShippingForm,
  ShopOrderSummary,
  ShopPaymentMethod,
} from "@/features/shop";

function CheckoutContent() {
  const {
    address,
    loadingProfile,
    handleAddressChange,
    buyNowInfo,
    directProduct,
    cartItems,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isApplying,
    handleApplyCoupon,
    handleRemoveCoupon,
    discountAmount,
    shippingCharge,
    platformFee,
    total,
    handlePayment,
    isProcessing,
  } = useShopCheckout();

  const subtotal = buyNowInfo
    ? Number(directProduct?.sale_price || directProduct?.price || 0) * buyNowInfo.quantity
    : cartItems.reduce(
        (acc: number, item: any) =>
          acc +
          Number(item.product?.sale_price || item.product?.price || 0) *
            item.quantity,
        0,
      );

  const itemCount = buyNowInfo
    ? buyNowInfo.quantity
    : cartItems.reduce((acc: number, item: any) => acc + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#e8e4de]">
        <div className="flex items-center gap-3">
          <Link
            href="/shop/cart"
            className="w-9 h-9 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center text-neutral-900 hover:bg-[#f5f1ec] transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-neutral-900">
              Secure Checkout
            </h1>
            <p className="text-xs text-neutral-500 mt-0.5">
              Enter shipping address and proceed with online payment
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-900 bg-[#f5f1ec] border border-[#e8e4de] px-3.5 py-1.5 rounded-full">
          <Lock className="w-3.5 h-3.5 text-neutral-900" />
          <span>SSL 256-bit Encrypted</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Shipping Form */}
        <div className="lg:col-span-7 space-y-6">
          <ShopShippingForm
            address={address}
            onChange={handleAddressChange}
            isLoading={loadingProfile}
          />
        </div>

        {/* Right: Order Summary & Payment */}
        <div className="lg:col-span-5 space-y-6">
          <ShopOrderSummary
            subtotal={subtotal}
            shipping={shippingCharge}
            platformFee={platformFee}
            discount={discountAmount}
            total={total}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            appliedCoupon={appliedCoupon}
            isApplying={isApplying}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={handleRemoveCoupon}
            itemCount={itemCount}
          />

          <ShopPaymentMethod
            total={total}
            onPay={handlePayment}
            isProcessing={isProcessing}
          />
        </div>
      </div>
    </div>
  );
}

export default function ShopCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-24 text-center text-sm text-neutral-500">
          Initializing secure checkout portal...
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
