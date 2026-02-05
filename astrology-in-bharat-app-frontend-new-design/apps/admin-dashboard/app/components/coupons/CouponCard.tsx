import React from "react";
import { Copy, Clock, Eye, EyeOff, Edit2, Trash2 } from "lucide-react";

interface CouponCardProps {
  id: number;
  code: string;
  description: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderValue: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  validFrom: string;
  validUntil: string;
  status: "active" | "inactive" | "expired";
  onCopy: (code: string) => void;
  onEdit: (id: number) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export function CouponCard(props: any) {
  const {
    id,
    code,
    description = "",
    type,
    value,
    minOrderValue,
    maxDiscount = 0,
    maxUsageLimit,
    redemptionsCount = 0,
    expiryDate,
    status,
    onCopy,
    onEdit,
    onDelete,
    onToggleStatus,
  } = props;

  // Minimal fallbacks for display only
  const _status = status || "active";
  const _type = type || "percentage";
  const _value = value || 0;
  const _minOrder = minOrderValue || 0;
  const _limit = maxUsageLimit || 0;
  const _used = redemptionsCount || 0;
  const _expiry = expiryDate;

  const getStatusBadge = (s: string) => {
    switch (s?.toLowerCase()) {
      case "active":
        return "bg-green-100 text-green-700 border-green-200";
      case "inactive":
        return "bg-gray-100 text-gray-700 border-gray-200";
      case "expired":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-blue-100 text-blue-700 border-blue-200";
    }
  };

  const usagePercentage = _limit > 0 ? Math.round((_used / _limit) * 100) : 0;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all hover:border-orange-300">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-4 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 text-white font-bold text-lg rounded-lg shadow-md">
              {code || "N/A"}
            </div>
            {code && (
              <button
                onClick={() => onCopy?.(code)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Copy code"
              >
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
            )}
          </div>
          <p className="text-gray-700 text-sm">{description || "No description provided"}</p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(_status)}`}
        >
          {String(_status).toUpperCase()}
        </span>
      </div>

      {/* Discount Info */}
      <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
        <div>
          <p className="text-xs text-gray-600 mb-1">Discount</p>
          <p className="font-bold text-lg text-orange-600">
            {_type === "percentage"
              ? `${_value}%`
              : `₹${_value}`}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Max Discount</p>
          <p className="font-bold text-lg text-gray-800">₹{maxDiscount}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Min Order</p>
          <p className="font-semibold text-gray-700">₹{_minOrder}</p>
        </div>
        <div>
          <p className="text-xs text-gray-600 mb-1">Usage</p>
          <p className="font-semibold text-gray-700">
            {_used} / {_limit || "∞"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      {_limit > 0 && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Redemption Progress</span>
            <span>{usagePercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-500 to-yellow-500 h-2 rounded-full transition-all"
              style={{ width: `${usagePercentage}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Validity */}
      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
        <Clock className="w-4 h-4" />
        <span>
          Expires: {_expiry ? new Date(_expiry).toLocaleDateString() : "No expiry"}
        </span>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button
          onClick={() => onToggleStatus?.(id)}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors text-sm"
        >
          {_status === "active" ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Deactivate</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Activate</span>
            </>
          )}
        </button>
        <button
          onClick={() => onEdit?.(id)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors text-sm"
        >
          <Edit2 className="w-4 h-4" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete?.(id)}
          className="flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}