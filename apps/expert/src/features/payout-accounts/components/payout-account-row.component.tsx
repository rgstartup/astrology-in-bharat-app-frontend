"use client";

import type { PayoutAccountLink } from "@/features/payout-accounts/api";
import { StatusBadge } from "./status-badge.component";
import { PayoutAccountActions } from "./payout-account-actions.component";

interface PayoutAccountRowProps {
  link: PayoutAccountLink;
  removingId: number | null;
  settingPrimaryId: number | null;
  onRemove: (id: number) => void;
  onSetPrimary: (id: number) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function PayoutAccountRow({
  link,
  removingId,
  settingPrimaryId,
  onRemove,
  onSetPrimary,
  onRefresh,
  refreshing,
}: PayoutAccountRowProps) {
  return (
    <tr
      key={link.id}
      className="relative hover:bg-gray-50/80 transition-all duration-300 group border-b border-gray-50 sm:border-none last:border-0"
    >
      <td className="px-8 py-6">
        <div className="flex flex-col gap-1">
          <span className="text-[13px] font-bold text-gray-900">
            {link.accountNumberMasked
              ? `•••• ${link.accountNumberMasked}`
              : (link.externalAccountId ?? "—")}
          </span>
          {link.ifsc && (
            <span className="text-[11px] text-gray-500 font-mono">
              {link.ifsc}
            </span>
          )}
          <span className="text-[11px] text-gray-500">
            Created{" "}
            {new Date(link.createdAt).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        </div>
      </td>
      <td className="px-8 py-6 text-center">
        <span
          className={`text-[11px] font-mono font-bold ${link.ifsc ? "text-gray-700" : "text-gray-400"}`}
        >
          {link.ifsc ?? "—"}
        </span>
      </td>
      <td className="px-8 py-6 text-center">
        <StatusBadge status={link.onboardingStatus} accountStatus={link.accountStatus} />
      </td>
      <td className="px-8 py-6 text-center">
        {link.isPrimary ? (
          <span className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wider border border-green-100">
            Primary
          </span>
        ) : (
          <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-[10px] font-bold uppercase tracking-wider">
            —
          </span>
        )}
      </td>
      <PayoutAccountActions
        link={link}
        removingId={removingId}
        settingPrimaryId={settingPrimaryId}
        onRemove={onRemove}
        onSetPrimary={onSetPrimary}
        onRefresh={onRefresh}
        refreshing={refreshing}
      />
    </tr>
  );
}
