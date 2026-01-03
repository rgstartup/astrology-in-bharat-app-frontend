import React from "react";

interface StatusBadgeProps {
  status: "confirmed" | "pending" | "cancelled";
  statusColors: Record<"confirmed" | "pending" | "cancelled", string>;
}

export default function StatusBadge({ status, statusColors }: StatusBadgeProps) {
  const cn = (...classes: (string | undefined | null | boolean)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <span
      className={cn(
        "inline-block px-3 py-1 text-xs rounded-full font-medium shadow-sm capitalize border border-current",
        statusColors[status]
      )}
    >
      {status}
    </span>
  );
}