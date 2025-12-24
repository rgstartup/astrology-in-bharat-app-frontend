// refund-management/components/RefundCard/RefundAmount.tsx
import React from "react";
import { IndianRupee } from "lucide-react";

interface RefundAmountProps {
  original: number;
  requested: number;
  status: string;
}

export function RefundAmount({ original, requested, status }: RefundAmountProps) {
  const isFullRefund = original === requested;
  const percentage = Math.round((requested / original) * 100);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Original Amount:</span>
        <span className="font-semibold text-gray-900 flex items-center">
          <IndianRupee className="w-3 h-3 mr-1" />
          {original}
        </span>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">Requested:</span>
        <span className={`font-bold flex items-center ${
          isFullRefund ? "text-red-600" : "text-orange-600"
        }`}>
          <IndianRupee className="w-4 h-4 mr-1" />
          {requested} ({percentage}%)
        </span>
      </div>
      
      {!isFullRefund && (
        <div className="text-xs text-gray-500">
          Partial refund requested
        </div>
      )}
    </div>
  );
}