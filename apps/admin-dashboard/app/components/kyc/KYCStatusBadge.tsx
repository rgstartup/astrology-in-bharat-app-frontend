import React from "react";

interface KYCStatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "under_review";
}

export default function KYCStatusBadge({ status }: KYCStatusBadgeProps) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    approved: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
    under_review: "bg-blue-100 text-blue-800 border-blue-300",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    under_review: "Under Review",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {labels[status]}
    </span>
  );
}