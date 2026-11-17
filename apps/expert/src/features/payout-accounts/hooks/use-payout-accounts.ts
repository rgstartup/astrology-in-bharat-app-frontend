"use client";

import { useCallback, useState } from "react";
import {
  listPayoutAccountLinks,
  type PayoutAccountLink,
} from "@/features/payout-accounts/api";
import { getErrorMessage } from "@repo/lib";

export function usePayoutAccounts() {
  const [links, setLinks] = useState<PayoutAccountLink[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    const result = await listPayoutAccountLinks();
    if (result.ok) {
      setLinks(Array.isArray(result.data) ? result.data : []);
    } else {
      throw new Error(
        getErrorMessage(result.error) || "Failed to load payout accounts.",
      );
    }
    setLoading(false);
  }, []);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    const result = await listPayoutAccountLinks();
    setRefreshing(false);
    if (result.ok) {
      setLinks(Array.isArray(result.data) ? result.data : []);
      return { ok: true as const, text: "Payout accounts refreshed." };
    }
    return {
      ok: false as const,
      text: getErrorMessage(result.error) || "Failed to refresh payout accounts.",
    };
  }, []);

  return {
    links,
    loading,
    refreshing,
    fetchLinks,
    handleRefresh,
  };
}
