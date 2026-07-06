"use client";
import React, { Suspense } from "react";
import OrderSummary from "./order-summary.component";
import PaymentMethod from "./payment-method.component";
import { useCheckout } from "./useCheckout";

const CheckoutContent = () => {
  const {
    isOrder,
    loadingProfile,
    address,
    handleAddressChange,
    buyNowInfo,
    directProduct,
    cartItems,
    expertName,
    date,
    time,
    duration,
    couponCode,
    setCouponCode,
    appliedCoupon,
    isApplying,
    availableCoupons,
    handleApplyCoupon,
    handleRemoveCoupon,
    discountAmount,
    total,
    paymentMethod,
    setPaymentMethod,
    balance,
    handlePayment,
    isProcessing,
    handleQuantityChange,
    useSplitPayment,
    setUseSplitPayment,
    walletAmountToUse,
    setWalletAmountToUse,
  } = useCheckout();

  return (
    <div className="bg-[#fdfdfd] min-h-screen font-sans">
      {/* Premium Hero Section */}
      <section className="relative pt-14 pb-20 overflow-hidden bg-[#050505] border-b border-orange/10">
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
           <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-orange/10 rounded-full blur-[150px] -translate-y-1/2"></div>
           <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-yellow-500/5 rounded-full blur-[120px] translate-y-1/2"></div>
           {/* Subtle stars/dots background effect can be added here if needed */}
        </div>
        
        <div className="max-w-[1200px] mx-auto px-4 md:px-6 relative z-10 flex flex-col md:flex-row items-center justify-between">
          <div className="text-center md:text-left mb-8 md:mb-0">
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange/10 rounded-full border border-orange/20 mb-6 mx-auto md:mx-0">
                <i className="fa-solid fa-lock text-orange text-xs"></i>
                <span className="text-[10px] font-black text-orange uppercase tracking-widest">SECURE CHECKOUT ENCRYPTED</span>
             </div>
             <h1 className="text-2xl md:text-4xl font-black text-white mb-4 leading-tight tracking-tight">
               Finalize Your <span className="text-orange italic">Journey</span>
             </h1>
             <p className="text-gray-400 font-medium text-sm md:text-base max-w-xl">
               {isOrder ? "You're just one step away from placing your order securely." : "You're just one step away from starting your personal consultation session."}
             </p>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-white text-sm font-medium"><i className="fa-solid fa-headset mr-2"></i> Need Help?</span>
            <button className="px-6 py-2.5 rounded-full border border-orange/30 text-orange font-bold text-sm hover:bg-orange hover:text-white transition-colors">
              <i className="fa-solid fa-comment-dots mr-2"></i> Chat With Us
            </button>
          </div>
        </div>
      </section>

      {/* Main Content Section */}
      <section className="py-12 md:py-16 -mt-28 relative z-20">
        <div className="max-w-[1200px] mx-auto px-4 md:px-6">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Left Column: Order Summary */}
            <div className="w-full lg:w-[420px] shrink-0">
              <OrderSummary
                isOrder={isOrder}
                loadingProfile={loadingProfile}
                address={address}
                handleAddressChange={handleAddressChange}
                buyNowInfo={buyNowInfo}
                directProduct={directProduct}
                cartItems={cartItems}
                expertName={expertName}
                date={date}
                time={time}
                duration={duration}
                couponCode={couponCode}
                setCouponCode={setCouponCode}
                appliedCoupon={appliedCoupon}
                isApplying={isApplying}
                availableCoupons={availableCoupons}
                handleApplyCoupon={handleApplyCoupon}
                handleRemoveCoupon={handleRemoveCoupon}
                discountAmount={discountAmount}
                total={total}
                handleQuantityChange={handleQuantityChange}
              />
            </div>

            {/* Right: Payment + Trust Cards */}
            <div className="flex-grow w-full max-w-3xl flex flex-col gap-6">
              <PaymentMethod
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
                balance={balance}
                total={total}
                handlePayment={handlePayment}
                isProcessing={isProcessing}
                isOrder={isOrder}
                useSplitPayment={useSplitPayment}
                setUseSplitPayment={setUseSplitPayment}
                walletAmountToUse={walletAmountToUse}
                setWalletAmountToUse={setWalletAmountToUse}
              />

              {/* Trust & Payment Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {/* We Accept */}
                <div className="col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">We Accept</p>
                  <div className="flex items-center gap-3 flex-wrap">
                    <i className="fa-brands fa-cc-visa text-3xl text-[#1a1f71]"></i>
                    <i className="fa-brands fa-cc-mastercard text-3xl text-[#eb001b]"></i>
                    <span className="text-[#0070ba] font-black italic text-lg">RuPay</span>
                    <span className="text-gray-800 font-black italic text-lg">UPI</span>
                    <i className="fa-brands fa-apple-pay text-4xl text-black"></i>
                    <i className="fa-brands fa-amazon-pay text-3xl text-[#ff9900]"></i>
                  </div>
                </div>

                {/* 100% Secure */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-lock text-orange text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">100% Secure</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Payments</p>
                  </div>
                </div>

                {/* Trusted by 1M+ */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange/10 flex items-center justify-center shrink-0">
                    <i className="fa-solid fa-users text-orange text-lg"></i>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-900 leading-tight">Trusted by 1M+</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">Customers India</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const CheckoutPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
          <div className="flex flex-col items-center gap-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-4 border-orange/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-t-orange rounded-full animate-spin"></div>
            </div>
            <div className="flex flex-col items-center gap-2">
               <p className="text-white font-black text-xs uppercase tracking-[0.4em]">Initializing Secure Portal</p>
               <div className="flex gap-1.5">
                  <div className="w-1 h-1 bg-orange rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-orange rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                  <div className="w-1 h-1 bg-orange rounded-full animate-bounce [animation-delay:-0.3s]"></div>
               </div>
            </div>
          </div>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;
