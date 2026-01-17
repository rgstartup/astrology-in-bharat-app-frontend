"use client";
import { X } from "lucide-react";
import { Button } from "@/app/components/admin/Button";

interface Props {
  onClose: () => void;
}

const CreateCoupon = ({ onClose }: Props) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-lg overflow-hidden border border-gray-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-orange-500 text-white">
          <h2 className="text-lg font-semibold">Create Coupon</h2>
          <button onClick={onClose} className="hover:opacity-80">
            <X />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5">
          {/* Coupon Code */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Coupon Code
            </label>
            <input
              className="
                w-full px-4 py-3 
                border border-gray-300
                rounded-xl
                bg-white
                text-gray-800
                placeholder:text-gray-400
                transition-all duration-200
                hover:border-orange-300
                focus:border-orange-500
                focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
                outline-none
              "
              placeholder="e.g. SAVE20"
            />
          </div>

          {/* Discount */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Discount (%)
            </label>
            <input
              className="
                w-full px-4 py-3 
                border border-gray-300
                rounded-xl
                bg-white
                text-gray-800
                placeholder:text-gray-400
                transition-all duration-200
                hover:border-orange-300
                focus:border-orange-500
                focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
                outline-none
              "
              placeholder="20"
            />
          </div>

          {/* Minimum Order Value */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Minimum Order Value
            </label>
            <input
              className="
                w-full px-4 py-3 
                border border-gray-300
                rounded-xl
                bg-white
                text-gray-800
                placeholder:text-gray-400
                transition-all duration-200
                hover:border-orange-300
                focus:border-orange-500
                focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
                outline-none
              "
              placeholder="₹1000"
            />
          </div>

          {/* Max Usage Limit */}
          <div className="space-y-1">
            <label className="text-sm font-bold text-gray-900">
              Max Usage Limit
            </label>
            <input
              className="
                w-full px-4 py-3 
                border border-gray-300
                rounded-xl
                bg-white
                text-gray-800
                placeholder:text-gray-400
                transition-all duration-200
                hover:border-orange-300
                focus:border-orange-500
                focus:ring-2 focus:ring-orange-400 focus:ring-opacity-30
                outline-none
              "
              placeholder="100"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="px-6 py-2 border-gray-300 rounded-xl"
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
          >
            Create Coupon
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;