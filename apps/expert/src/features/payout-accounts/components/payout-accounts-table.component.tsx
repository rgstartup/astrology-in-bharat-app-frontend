"use client";

import type { PayoutAccountLink } from "@/features/payout-accounts/api";
import { PayoutAccountRow } from "./payout-account-row.component";

interface PayoutAccountsTableProps {
  links: PayoutAccountLink[];
  removingId: number | null;
  settingPrimaryId: number | null;
  onRemove: (id: number) => void;
  onSetPrimary: (id: number) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function PayoutAccountsTable({
  links,
  removingId,
  settingPrimaryId,
  onRemove,
  onSetPrimary,
  onRefresh,
  refreshing,
}: PayoutAccountsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[700px] text-left">
        <thead>
          <tr className="bg-gray-50/50 border-b border-gray-50">
            <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest">
              Account
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
              IFSC
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
              Status
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
              Primary
            </th>
            <th className="px-8 py-5 text-[10px] font-black text-gray-700 uppercase tracking-widest text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {links.length === 0 ? (
            <tr>
              <td colSpan={4} className="p-20 text-center">
                <p className="text-[12px] font-bold text-gray-700">
                  No payout accounts linked
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Click "Link Bank Account" to get started.
                </p>
              </td>
            </tr>
          ) : (
            links.map((link) => (
              <PayoutAccountRow
                key={link.id}
                link={link}
                removingId={removingId}
                settingPrimaryId={settingPrimaryId}
                onRemove={onRemove}
                onSetPrimary={onSetPrimary}
                onRefresh={onRefresh}
                refreshing={refreshing}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
