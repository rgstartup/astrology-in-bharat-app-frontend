"use client";

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-700" },
  AUTHORIZED: { label: "Authorized", color: "bg-blue-100 text-blue-700" },
  ACTIVE: { label: "Active", color: "bg-green-100 text-green-700" },
  FAILED: { label: "Failed", color: "bg-red-100 text-red-700" },
};

interface StatusBadgeProps {
  status: string;
  accountStatus?: string | null;
}

export function StatusBadge({ status, accountStatus }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    color: "bg-gray-100 text-gray-700",
  };

  return (
    <>
      <span
        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${config.color}`}
      >
        {config.label}
      </span>
      {accountStatus && (
        <span className="text-[10px] text-gray-500 block mt-1">
          {accountStatus}
        </span>
      )}
    </>
  );
}
