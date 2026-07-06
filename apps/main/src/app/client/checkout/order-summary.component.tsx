"use client";

import React from "react";

type Props = {
  isOrder: boolean;
  loadingProfile: boolean;
  address: any;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buyNowInfo: any;
  directProduct: any;
  cartItems: any[];
  expertName: string;
  date: string;
  time: string;
  duration: string;
  couponCode: string;
  setCouponCode: (val: string) => void;
  appliedCoupon: any;
  isApplying: boolean;
  handleApplyCoupon: () => void;
  handleRemoveCoupon: () => void;
  discountAmount: number;
  total: number;
  handleQuantityChange?: (qty: number) => void;
  availableCoupons?: any[];
};

const OrderSummary = ({
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
  handleApplyCoupon,
  handleRemoveCoupon,
  discountAmount,
  total,
  handleQuantityChange,
  availableCoupons = [],
}: Props) => {
  return (
    <div className="w-full lg:w-[420px] shrink-0 space-y-6">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex items-start justify-between">
          <div className="flex gap-3">
             <i className="fa-regular fa-file-lines text-orange text-2xl mt-1"></i>
             <div>
               <h5 className="text-lg font-bold text-gray-900 leading-tight">Order Summary</h5>
               <p className="text-xs text-gray-500 mt-1">Review your order details</p>
             </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-full border border-green-200">
            <i className="fa-solid fa-shield-check text-sm"></i>
            <span className="text-[11px] font-bold">Secure & Verified</span>
          </div>
        </div>

        <div className="p-6">
          {/* Expert / Product Profile */}
          {isOrder ? (
            <div className="space-y-4 mb-6">
              {buyNowInfo ? (
                directProduct ? (
                  <div className="flex justify-between items-center group bg-gray-50 p-4 rounded-xl border border-gray-200 hover:border-orange/30 transition-all">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-gray-900">{directProduct.name}</span>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-gray-500">Quantity:</span>
                        <div className="flex items-center bg-white rounded-md border border-gray-200 p-1 shadow-sm">
                          <button 
                            onClick={() => handleQuantityChange?.(buyNowInfo.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-orange transition-all disabled:opacity-30"
                            disabled={buyNowInfo.quantity <= 1}
                          >
                            <i className="fa-solid fa-minus text-[10px]"></i>
                          </button>
                          <span className="w-8 text-center text-sm font-bold text-gray-900">{buyNowInfo.quantity}</span>
                          <button 
                            onClick={() => handleQuantityChange?.(buyNowInfo.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-orange transition-all"
                          >
                            <i className="fa-solid fa-plus text-[10px]"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                    <span className="text-lg font-bold text-gray-900">₹{(Number(directProduct.sale_price || directProduct.price || 0)) * buyNowInfo.quantity}</span>
                  </div>
                ) : (
                  <div className="flex justify-center py-4">
                    <div className="w-6 h-6 border-2 border-gray-200 border-t-orange rounded-full animate-spin"></div>
                  </div>
                )
              ) : (
                cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <span className="text-sm font-medium text-gray-700">{item.product?.name} <span className="text-orange text-xs font-bold ml-1">x{item.quantity}</span></span>
                    <span className="text-sm font-bold text-gray-900">₹{(item.product?.sale_price || item.product?.price || 0) * item.quantity}</span>
                  </div>
                ))
              )}
            </div>
          ) : (
            <>
              {/* Expert Profile Block */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
                  <img src="/images/expert-placeholder.jpg" alt={expertName} className="w-full h-full object-cover" onError={(e) => { e.currentTarget.src = 'https://ui-avatars.com/api/?name=' + expertName + '&background=ff6b00&color=fff'; }} />
                </div>
                <div>
                  <h6 className="text-base font-bold text-gray-900 flex items-center gap-1.5">
                    {expertName}
                    <i className="fa-solid fa-circle-check text-orange text-sm"></i>
                  </h6>
                  <p className="text-xs text-gray-500 mt-0.5">Vedic Astrology Expert</p>
                  <div className="flex items-center gap-1 mt-1.5">
                    <i className="fa-solid fa-star text-orange text-[10px]"></i>
                    <span className="text-xs font-bold text-gray-900">4.9</span>
                    <span className="text-xs text-gray-400">(1289)</span>
                  </div>
                </div>
              </div>

              {/* Session Details Grid */}
              <div className="grid grid-cols-3 gap-3 mb-6 border-b border-gray-100 pb-6">
                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-white">
                  <i className="fa-regular fa-calendar text-orange text-lg mb-2"></i>
                  <span className="text-xs font-bold text-gray-900">{date || 'N/A'}</span>
                  <span className="text-[10px] text-gray-500">Date</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-white">
                  <i className="fa-regular fa-clock text-orange text-lg mb-2"></i>
                  <span className="text-xs font-bold text-gray-900">{time || 'N/A'}</span>
                  <span className="text-[10px] text-gray-500">Session Time</span>
                </div>
                <div className="flex flex-col items-center justify-center p-3 rounded-xl border border-gray-100 bg-white">
                  <i className="fa-solid fa-hourglass-half text-orange text-lg mb-2"></i>
                  <span className="text-xs font-bold text-gray-900">{duration || '30'} Mins</span>
                  <span className="text-[10px] text-gray-500">Duration</span>
                </div>
              </div>
            </>
          )}

          {/* Promo Code Section */}
          <div className="mb-6 border-b border-gray-100 pb-6">
            <label className="text-sm font-semibold text-gray-900 block mb-3">Have a Promo Code?</label>
            
            {!appliedCoupon ? (
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  className="w-full sm:flex-grow px-4 py-2.5 rounded-lg border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition-all outline-none text-sm text-gray-900 uppercase"
                  placeholder="PROMO CODE"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={isApplying}
                />
                <button
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#ff4500] text-white rounded-lg font-bold text-sm hover:bg-orange transition-all disabled:opacity-50 flex items-center justify-center"
                  onClick={handleApplyCoupon}
                  disabled={isApplying || !couponCode}
                  type="button"
                >
                  {isApplying ? <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : "Apply"}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                <div>
                   <div className="flex items-center gap-1.5 mb-1">
                     <i className="fa-solid fa-circle-check text-green-600 text-sm"></i>
                     <span className="text-xs font-bold text-green-600">Coupon Applied!</span>
                   </div>
                   <span className="text-sm font-bold text-gray-900">{appliedCoupon.code || couponCode}</span>
                </div>
                <button
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={handleRemoveCoupon}
                  type="button"
                >
                  <i className="fa-solid fa-xmark text-lg"></i>
                </button>
              </div>
            )}

            {availableCoupons && availableCoupons.length > 0 && !appliedCoupon && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Available Coupons</p>
                <div className="flex flex-wrap gap-2">
                  {availableCoupons.map((c: any, index: number) => {
                    const coupon = c.coupon || c;
                    if (!coupon || !coupon.code) return null;
                    return (
                      <button
                        key={coupon.id || index}
                        onClick={() => setCouponCode(coupon.code)}
                        className="px-3 py-1 bg-white border border-orange/30 text-orange rounded-full hover:bg-orange hover:text-white transition-colors text-xs font-semibold flex items-center gap-1.5"
                        type="button"
                      >
                        {coupon.code} 
                        <span className="text-[10px] font-normal opacity-80 uppercase">
                           {coupon.type === 'percentage' ? `${coupon.value}% OFF` : `₹${coupon.value} OFF`}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Price Breakdown */}
          <div className="space-y-3 mb-6">
            <h6 className="text-sm font-bold text-gray-900 mb-2">Price Breakdown</h6>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">{isOrder ? "Items Total" : "Consultation Fees"}</span>
              <span className="text-sm font-medium text-gray-900">₹ {total + discountAmount - 50}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Platform Charges</span>
              <span className="text-sm font-medium text-gray-900">₹ 50</span>
            </div>
            {discountAmount > 0 && (
              <div className="flex justify-between items-center text-green-600 font-medium">
                <span className="text-sm">Coupon Discount ({appliedCoupon?.code || couponCode})</span>
                <span className="text-sm">- ₹ {discountAmount}</span>
              </div>
            )}
          </div>

          {/* Grand Total */}
          <div className="pt-4 border-t border-gray-100 flex flex-wrap sm:flex-nowrap justify-between items-start sm:items-end gap-4 mb-6">
            <div>
              <h6 className="text-base font-bold text-gray-900 mb-1">Grand Total</h6>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-600 rounded border border-green-100 whitespace-nowrap">
                  <i className="fa-solid fa-shield-check text-[10px]"></i>
                  <span className="text-[10px] font-bold">Verified</span>
                </div>
                <span className="text-xs text-gray-500 whitespace-nowrap">Included all taxes</span>
              </div>
            </div>
            <div className="text-3xl font-black text-[#ff6b00] whitespace-nowrap text-right">
              ₹{total}
            </div>
          </div>
          
          {/* Info Box */}
          <div className="p-3 bg-orange/5 rounded-lg border border-orange/10 flex items-start gap-3">
             <i className="fa-solid fa-circle-info text-orange mt-0.5"></i>
             <p className="text-xs text-gray-700 leading-relaxed">
               {isOrder ? "Order confirmation will be sent to your email." : "Session will start automatically after payment."}
             </p>
          </div>
        </div>
      </div>

      {/* Shipping Address - Only for Products */}
      {isOrder && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            <h5 className="text-lg font-bold text-gray-900 mb-6 flex items-center justify-between">
              Shipping Details
              {loadingProfile && (
                <div className="w-4 h-4 border-2 border-orange/20 border-t-orange rounded-full animate-spin"></div>
              )}
            </h5>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Address Line 1*</label>
                <input
                  type="text"
                  name="line1"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition-all outline-none text-sm text-gray-900"
                  placeholder="House No., Street Name"
                  value={address.line1}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Address Line 2</label>
                <input
                  type="text"
                  name="line2"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition-all outline-none text-sm text-gray-900"
                  placeholder="Apartment, Landmark"
                  value={address.line2}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">City*</label>
                <input
                  type="text"
                  name="city"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition-all outline-none text-sm text-gray-900"
                  value={address.city}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">State*</label>
                <input
                  type="text"
                  name="state"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition-all outline-none text-sm text-gray-900"
                  value={address.state}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Pincode*</label>
                <input
                  type="text"
                  name="zip_code"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 focus:border-orange focus:ring-1 focus:ring-orange transition-all outline-none text-sm text-gray-900"
                  value={address.zip_code}
                  onChange={handleAddressChange}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-500">Country</label>
                <input
                  type="text"
                  name="country"
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-100 border border-gray-200 outline-none text-sm text-gray-400 cursor-not-allowed"
                  value={address.country}
                  disabled
                />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <i className="fa-solid fa-truck-fast text-blue-500"></i>
              <p className="text-xs font-medium text-blue-600">Express Delivery to this address</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
