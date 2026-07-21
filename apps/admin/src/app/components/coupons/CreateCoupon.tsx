"use client";
import React, { useState } from "react";
import { X, Loader2 } from "lucide-react";
import { Button } from "@repo/ui";
import { createCoupon } from "@/services/admin.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

interface Props {
  onClose: () => void;
  onSuccess?: () => void;
  initialData?: any;
}

const CreateCoupon = ({ onClose, onSuccess, initialData }: Props) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    code: initialData?.code || "",
    type: initialData?.type || initialData?.discountType || "percentage",
    value: initialData?.value || initialData?.discountValue || "",
    min_order_value: initialData?.min_order_value || initialData?.minOrderValue || "",
    expiry_date: initialData?.expiry_date || (initialData?.validUntil ? new Date(initialData.validUntil).toISOString().split('T')[0] : ""),
    max_usage_limit: initialData?.max_usage_limit || initialData?.usageLimit || ""
  });

  const isEditing = !!initialData;

  const handleSubmit = async () => {
    if (!formData.code || !formData.value) {
      toast.error("Please fill in required fields");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...formData,
        value: Number(formData.value),
        min_order_value: Number(formData.min_order_value) || 0,
        max_usage_limit: Number(formData.max_usage_limit) || null
      };

      if (isEditing) {
        await import("@/services/admin.service").then(m => m.updateCoupon(initialData.id, payload));
        toast.success("Coupon updated successfully!");
      } else {
        await import("@/services/admin.service").then(m => m.createCoupon(payload));
        toast.success("Coupon created successfully!");
      }
      onSuccess?.();
      onClose();
    } catch (error: any) {
      toast.error(getErrorMessage(error) || `Failed to ${isEditing ? 'update' : 'create'} coupon`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden border border-gray-100 transform transition-all">

        {/* Header */}
        <div className="flex items-center justify-between px-5 sm:px-8 py-4 sm:py-5 bg-gradient-to-r from-orange to-yellow-600 text-white">
          <div>
            <h2 className="text-xl font-bold">{isEditing ? "Edit Coupon" : "Create New Coupon"}</h2>
            <p className="text-white/80 text-xs mt-0.5">{isEditing ? "Modify existing coupon details" : "Define your discount offer parameters"}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 sm:p-8 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Coupon Code - Full Width */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Coupon Code<span className="text-red-500 ml-0.5">*</span></label>
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all font-mono uppercase tracking-widest"
              placeholder="e.g. DIWALI2026"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              disabled={isEditing}
            />
          </div>

          {/* Discount Type + Discount Value */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Discount Type</label>
              <select
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all appearance-none bg-white"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="percentage">Percentage (%)</option>
                <option value="flat">Flat Amount (₹)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Discount Value<span className="text-red-500 ml-0.5">*</span></label>
              <div className="relative">
                <input
                  type="number"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                  placeholder={formData.type === 'percentage' ? "20" : "100"}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">
                  {formData.type === 'percentage' ? '%' : '₹'}
                </span>
              </div>
            </div>
          </div>

          {/* Min Order Value + Expiry Date */}
          <div className="grid grid-cols-1 min-[480px]:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Min Order Value (₹)</label>
              <input
                type="number"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all font-semibold"
                placeholder="0"
                value={formData.min_order_value}
                onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-700">Expiry Date</label>
              <input
                type="date"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange/20 focus:border-orange outline-none transition-all"
                value={formData.expiry_date}
                onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-4 sm:px-8 py-4 sm:py-5 bg-gray-50 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-6 py-2.5 border-gray-300 rounded-xl"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            className="px-8 py-2.5 bg-orange hover:opacity-90 text-white rounded-xl shadow-lg shadow-orange/20 disabled:opacity-70 flex items-center gap-2"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : null}
            {loading ? (isEditing ? "Updating..." : "Creating...") : (isEditing ? "Update Coupon" : "Create Coupon")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CreateCoupon;



