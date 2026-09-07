"use client";

import React from "react";

interface AddressDto {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  is_primary?: boolean;
}

interface AddressFieldProps {
  address: AddressDto;
  index: number;
  totalAddresses: number;
  handleAddressChange: (e: React.ChangeEvent<HTMLInputElement>, index: number) => void;
  handleRemoveAddress: (index: number) => void;
}

const AddressField: React.FC<AddressFieldProps> = ({
  address,
  index,
  totalAddresses,
  handleAddressChange,
  handleRemoveAddress,
}) => {
  return (
    <div className="bg-gray-50/50 rounded-3xl p-6 border-2 border-orange/20 mb-6 transition-all hover:bg-white hover:shadow-xl group">
      <div className="flex justify-between items-center mb-6">
        <h6 className="font-black text-gray-900 text-lg flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange/10 text-orange flex items-center justify-center text-xs">
            {index + 1}
          </div>
          Address Details
        </h6>
        {totalAddresses > 1 && (
          <button
            type="button"
            className="w-10 h-10 flex items-center justify-center rounded-xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm border-0"
            onClick={() => handleRemoveAddress(index)}
            title="Remove Address"
          >
            <i className="fa-solid fa-trash-can text-sm"></i>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Address Line 1 (REQUIRED) */}
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
            Address Line 1 <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange focus:ring-4 focus:ring-orange/5 transition-all outline-none font-bold text-sm"
            name="line1"
            value={address.line1}
            onChange={(e) => handleAddressChange(e, index)}
            required={index === 0}
            placeholder="Street address, house no., etc."
          />
        </div>

        {/* Address Line 2 */}
        <div className="md:col-span-2">
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
            Address Line 2 <span className="text-gray-400 italic font-bold ml-1">(Optional)</span>
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange focus:ring-4 focus:ring-orange/5 transition-all outline-none font-bold text-sm"
            name="line2"
            value={address.line2 || ""}
            onChange={(e) => handleAddressChange(e, index)}
            placeholder="Apartment, suite, etc."
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
            City <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange focus:ring-4 focus:ring-orange/5 transition-all outline-none font-bold text-sm"
            name="city"
            value={address.city}
            onChange={(e) => handleAddressChange(e, index)}
            required={index === 0}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
            State <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange focus:ring-4 focus:ring-orange/5 transition-all outline-none font-bold text-sm"
            name="state"
            value={address.state}
            onChange={(e) => handleAddressChange(e, index)}
            required={index === 0}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
            Country <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange focus:ring-4 focus:ring-orange/5 transition-all outline-none font-bold text-sm"
            name="country"
            value={address.country}
            onChange={(e) => handleAddressChange(e, index)}
            required={index === 0}
          />
        </div>

        <div>
          <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2 ml-1">
            Zip Code <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full px-5 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-orange focus:ring-4 focus:ring-orange/5 transition-all outline-none font-bold text-sm"
            name="zip_code"
            value={address.zip_code}
            onChange={(e) => handleAddressChange(e, index)}
            required={index === 0}
          />
        </div>

        <div className="md:col-span-2 mt-2">
          <label className="inline-flex items-center cursor-pointer group/check">
            <input
              type="checkbox"
              className="peer hidden"
              name="is_primary"
              checked={address.is_primary || false}
              onChange={(e) => handleAddressChange(e, index)}
              id={`is_primary-${index}`}
            />
            <div className="w-6 h-6 rounded-lg border-2 border-gray-200 peer-checked:border-orange peer-checked:bg-orange flex items-center justify-center transition-all">
              <i className="fa-solid fa-check text-white text-[10px] opacity-0 peer-checked:opacity-100 transition-opacity"></i>
            </div>
            <span className="ml-3 text-sm font-black text-gray-600 group-hover/check:text-orange transition-colors">
              Set as Primary Address
            </span>
          </label>
        </div>
      </div>
    </div>
  );
};

export default AddressField;
