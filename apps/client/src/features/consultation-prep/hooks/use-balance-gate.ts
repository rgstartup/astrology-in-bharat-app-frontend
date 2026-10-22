"use client";

import { useEffect, useState } from "react";
import { api } from "@/actions";
import { useAuthStore } from "@repo/store";

/**
 * Wallet state needed before starting a consultation: auth flag, upfront
 * balance refresh, and the forced-recharge flag tripped by
 * INSUFFICIENT_BALANCE.
 */
export function useBalanceGate() {
  const { isAuthenticated, refreshBalance } = useAuthStore();
  const [needsRecharge, setNeedsRecharge] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      refreshBalance(api);
    }
  }, [isAuthenticated, refreshBalance]);

  return { isAuthenticated, needsRecharge, setNeedsRecharge };
}
