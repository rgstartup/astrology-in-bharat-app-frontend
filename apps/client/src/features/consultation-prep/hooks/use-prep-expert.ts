"use client";

import { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import { type IExpert } from "@repo/lib";
import { getChatPrepExpertAction } from "@/actions/chat";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";

/**
 * Fetches the prep-time expert profile and resolves live availability
 * (REST snapshot + realtime presence subscription).
 *
 * @param expertId - Expert identifier.
 * @returns Expert profile, fetch loading flag, and resolved availability.
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

  useEffect(() => {
    if (!expertId) return;
    let isCancelled = false;

    const fetchExpert = async () => {
      setLoading(true);
      const res = await getChatPrepExpertAction(expertId);
      if (isCancelled) return;
      setLoading(false);

      if (!res.ok) {
        toast.error(res.error.message || "Failed to fetch expert");
        return;
      }
      setExpert(res.data);
    };

    fetchExpert();
    return () => {
      isCancelled = true;
    };
  }, [expertId]);

  return { expert, loading, isExpertAvailable };
}
