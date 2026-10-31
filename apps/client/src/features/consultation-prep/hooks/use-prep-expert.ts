"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "@repo/design/shadcn";
import { type IExpert } from "@repo/lib";
import { getChatPrepExpertAction } from "@/actions/chat";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";

/**
 * Fetches the prep-time expert profile and resolves live availability
 * (REST snapshot + realtime presence subscription).
 *
 * The fetch itself is exposed so the composition root can run it with
 * Promise.all alongside the wallet balance refresh on modal open.
 *
 * @param expertId - Expert identifier.
 * @returns Expert profile, fetch loading flag, resolved availability, and the imperative fetch.
 */
export function usePrepExpert(expertId: string) {
  const [expert, setExpert] = useState<Partial<IExpert> | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAvailableForConsultation } = useExpertPresence(Number(expertId), {
    initialStatus: toExpertStatus(
      expert?.isAvailableForConsultation ??
        expert?.status ??
        expert?.is_available,
    ),
    autoSubscribe: true,
  });

  const isExpertAvailable = expert ? isAvailableForConsultation : false;

  // Latest expertId seen: responses racing an id change must not land.
  const expertIdRef = useRef(expertId);
  useEffect(() => {
    expertIdRef.current = expertId;
  }, [expertId]);

  const fetchExpert = useCallback(async (): Promise<Partial<IExpert> | null> => {
    if (!expertId) return null;
    setLoading(true);
    const res = await getChatPrepExpertAction(expertId);
    if (expertIdRef.current !== expertId) return null;
    setLoading(false);
    if (!res.ok) {
      toast.error(res.error.message || "Failed to fetch expert");
      return null;
    }
    setExpert(res.data);
    return res.data;
  }, [expertId]);

  // Fetch is on-demand; the composition root fires it when the dialog opens.
  return { expert, loading, isExpertAvailable, fetchExpert };
}
