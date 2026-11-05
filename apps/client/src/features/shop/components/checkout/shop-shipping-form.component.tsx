"use client";

import React from "react";
import type { ShopShippingAddress } from "../../types/shop.types";
import { MapPin } from "@repo/design/lucide";

interface ShopShippingFormProps {
  address: ShopShippingAddress;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isLoading?: boolean;
}

export const ShopShippingForm: React.FC<ShopShippingFormProps> = ({
  address,
  onChange,
  isLoading,
}) => {
  return (
    <div className="bg-[#f5f1ec] border border-[#e8e4de] rounded-2xl p-6 sm:p-8">
      <div className="flex items-center gap-2.5 pb-4 mb-6 border-b border-[#e8e4de]">
        <div className="w-8 h-8 rounded-full bg-white border border-[#e8e4de] flex items-center justify-center text-neutral-900">
          <MapPin className="w-4 h-4" />
        </div>
        <div>
          <h2 className="text-base font-semibold text-neutral-900 leading-tight">
            Delivery Address
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Where should we send your sacred items?
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Address Line 1 */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            House / Flat / Street address <span className="text-rose-600">*</span>
          </label>
          <input
            type="text"
            name="line1"
            value={address.line1}
            onChange={onChange}
            disabled={isLoading}
            placeholder="e.g. Flat 402, Shanti Nilayam, MG Road"
            className="w-full h-12 px-3.5 bg-white border border-[#e8e4de] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        {/* Address Line 2 */}
        <div>
          <label className="block text-xs font-medium text-neutral-700 mb-1.5">
            Apartment, suite, landmark (optional)
          </label>
          <input
            type="text"
            name="line2"
            value={address.line2 || ""}
            onChange={onChange}
            disabled={isLoading}
            placeholder="e.g. Near Shiv Temple"
            className="w-full h-12 px-3.5 bg-white border border-[#e8e4de] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
          />
        </div>

        {/* City & State */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              City <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="city"
              value={address.city}
              onChange={onChange}
              disabled={isLoading}
              placeholder="e.g. Varanasi"
              className="w-full h-12 px-3.5 bg-white border border-[#e8e4de] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              State <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="state"
              value={address.state}
              onChange={onChange}
              disabled={isLoading}
              placeholder="e.g. Uttar Pradesh"
              className="w-full h-12 px-3.5 bg-white border border-[#e8e4de] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
        </div>

        {/* PIN Code & Phone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              PIN code <span className="text-rose-600">*</span>
            </label>
            <input
              type="text"
              name="zip_code"
              value={address.zip_code}
              onChange={onChange}
              disabled={isLoading}
              placeholder="e.g. 221001"
              maxLength={6}
              className="w-full h-12 px-3.5 bg-white border border-[#e8e4de] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-700 mb-1.5">
              Mobile phone <span className="text-rose-600">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={address.phone}
              onChange={onChange}
              disabled={isLoading}
              placeholder="10-digit mobile number"
              maxLength={12}
              className="w-full h-12 px-3.5 bg-white border border-[#e8e4de] rounded-xl text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
