"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "@repo/design/lucide";
import type { PayoutAccountLink } from "@/features/payout-accounts/api";

interface PayoutAccountActionsProps {
  link: PayoutAccountLink;
  removingId: number | null;
  settingPrimaryId: number | null;
  onRemove: (id: number) => void;
  onSetPrimary: (id: number) => void;
  onRefresh: () => void;
  refreshing: boolean;
}

export function PayoutAccountActions({
  link,
  removingId,
  settingPrimaryId,
  onRemove,
  onSetPrimary,
  onRefresh,
  refreshing,
}: PayoutAccountActionsProps) {
  return (
    <td className="px-8 py-6 text-right space-x-1">
      <Button
        onClick={() => onRemove(link.id)}
        size="sm"
        disabled={removingId === link.id}
        variant="outline"
        className="text-[10px] px-3 py-1.5 text-red-600 border-red-100 hover:bg-red-50"
      >
        {removingId === link.id
          ? "Removing…"
          : link.isPrimary
            ? "Primary"
            : "Unlink"}
      </Button>
      {!link.isPrimary && (
        <Button
          onClick={() => onSetPrimary(link.id)}
          size="sm"
          disabled={settingPrimaryId === link.id}
          variant="outline"
          className="text-[10px] px-3 py-1.5 text-gray-700 border-gray-100 hover:bg-gray-100"
        >
          {settingPrimaryId === link.id ? "Setting…" : "Set Primary"}
        </Button>
      )}
      <Button
        onClick={onRefresh}
        size="sm"
        disabled={refreshing}
        className="text-[10px] px-3 py-1.5"
      >
        <RefreshCw className="w-3 h-3" />
      </Button>
    </td>
  );
}
