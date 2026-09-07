// refund-management/components/RefundCard/RefundStatusBadge.tsx
import React from "react";
import { Clock, CheckCircle, XCircle, Loader, Circle } from "lucide-react";
import { RefundStatus } from "./types";
import { statusColors } from "./refundsConfig";

interface RefundStatusBadgeProps {
  status: RefundStatus;
}

export function RefundStatusBadge({ status }: RefundStatusBadgeProps) {
  const icons = {
    pending: Clock,
    refunded: CheckCircle,
    approved: CheckCircle,
    rejected: XCircle,
    processing: Loader,
    completed: Circle
  } as any;

  const Icon = icons[status] || Circle;
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status}</span>
    </div>
  );
}



