"use client";

import { useEffect } from "react";
import { getAccount, getOnboardingStatus } from "../api";
import { useOnboardingStore } from "../store";
import type { OnboardingStatus } from "../types";

export function useOnboarding() {
  const store = useOnboardingStore();

  const { status, account, loading, error } = store;
  const { setStatus, setAccount, setLoading, setError } = store;

  useEffect(() => {
    let cancelled = false;

    const init = async () => {
      try {
        setLoading(true);
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
        if (!cancelled) setLoading(false);
      }
    };

    init();
    return () => {
      cancelled = true;
    };
  }, [setStatus, setAccount, setLoading, setError]);

  return { status, account, loading, error };
}
