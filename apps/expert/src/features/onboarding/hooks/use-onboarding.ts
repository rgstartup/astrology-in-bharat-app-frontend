"use client";

import { useEffect, useState } from "react";
import { getAccount, getOnboardingStatus } from "../api";
import type { OnboardingStatus } from "../types";
import type { ExpertAccount } from "@repo/lib/contracts/expert/account-api";

export function useOnboarding() {
  const [status, setStatus] = useState<OnboardingStatus | null>(null);
  const [account, setAccount] = useState<ExpertAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        const [statusResult, accountResult] = await Promise.all([
          getOnboardingStatus(),
          getAccount(),
        ]);
        if (cancelled) return;
        if (statusResult.ok && statusResult.data) {
          setStatus(statusResult.data);
        }
        setAccount(accountResult);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, []);

  return { status, account, loading, error };
}
