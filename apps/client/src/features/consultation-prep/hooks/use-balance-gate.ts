"use client";

import { useCallback, useState } from "react";
import { api } from "@/actions";
import { useAuthStore } from "@repo/store";

/**
 * Wallet state needed before starting a consultation: auth flag, the
 * imperative balance refresh (run on open via Promise.all with the expert
 * fetch, and again on the start CTA before initiate), and the
 * forced-recharge flag tripped by INSUFFICIENT_BALANCE.
 */
export function useBalanceGate() {
  const { isAuthenticated, refreshBalance } = useAuthStore();
  const [needsRecharge, setNeedsRecharge] = useState(false);

  const refreshBalanceNow = useCallback(async () => {
    if (!isAuthenticated) return;
    await refreshBalance(api);
  }, [isAuthenticated, refreshBalance]);

  return { isAuthenticated, needsRecharge, setNeedsRecharge, refreshBalanceNow };
}
