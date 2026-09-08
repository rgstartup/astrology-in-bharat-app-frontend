"use client";

import React from "react";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { OnboardingFormData } from "@/lib/types";

interface AddressFieldsProps {
  register: UseFormRegister<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export const AddressFields: React.FC<AddressFieldsProps> = ({
  register,
  errors,
}) => {
  return (
    <div className="space-y-4 pt-2">
      <div className="flex items-center gap-2 pb-1 border-b border-gray-100">
        <i className="fa-solid fa-location-dot text-orange text-sm" />
        <h5 className="text-sm font-bold text-[#301118]">
          Address Details{" "}
          <span className="text-xs font-normal text-gray-400">
            (For accurate geographic calculations & delivery)
          </span>
        </h5>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Street Address */}
        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            Street Address / House No.
          </label>
          <input
            type="text"
            placeholder="e.g. 124, Lotus Apartments, MG Road"
            {...register("address.line1")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all placeholder:text-gray-400"
          />
        </div>

        {/* City */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            City / Town
          </label>
          <input
            type="text"
            placeholder="e.g. New Delhi"
            {...register("address.city")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all placeholder:text-gray-400"
          />
        </div>

        {/* State */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            State
          </label>
          <input
            type="text"
            placeholder="e.g. Delhi"
            {...register("address.state")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all placeholder:text-gray-400"
          />
        </div>

        {/* PIN Code */}
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">
            PIN / Postal Code
          </label>
          <input
            type="text"
            maxLength={6}
            placeholder="e.g. 110001"
            {...register("address.pincode")}
            className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange/20 focus:border-orange transition-all placeholder:text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};
