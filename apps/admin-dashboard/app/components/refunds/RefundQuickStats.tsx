import React from "react";
import { CheckCircle, XCircle, Clock } from "lucide-react";

interface RefundQuickStatsProps {
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
}

export default function RefundQuickStats({
  pendingCount,
  approvedCount,
  rejectedCount,
}: RefundQuickStatsProps) {
  return (
    <div className="flex gap-4 flex-wrap text-sm">
      <div className="flex items-center gap-2">
        <Clock size={16} className="text-yellow-500" />
        <span className="text-gray-600">
          Pending: <strong>{pendingCount}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <CheckCircle size={16} className="text-green-500" />
        <span className="text-gray-600">
          Approved: <strong>{approvedCount}</strong>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <XCircle size={16} className="text-red-500" />
        <span className="text-gray-600">
          Rejected: <strong>{rejectedCount}</strong>
        </span>
      </div>
    </div>
  );
}