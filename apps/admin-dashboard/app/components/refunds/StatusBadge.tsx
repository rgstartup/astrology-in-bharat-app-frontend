import React from "react";

interface StatusBadgeProps {
  status: "pending" | "approved" | "rejected" | "processing";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const styles = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    approved: "bg-green-100 text-green-800 border-green-300",
    rejected: "bg-red-100 text-red-800 border-red-300",
    processing: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold border ${styles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}