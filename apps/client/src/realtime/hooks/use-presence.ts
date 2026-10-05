"use client";

import { useEffect, useMemo } from "react";
import { ExpertClientStatus } from "@/realtime/types/presence";
import { usePresenceStore } from "@/store/presenceStore";

export interface UseExpertPresenceOptions {
  initialStatus?: ExpertClientStatus;
  initialLastSeenAt?: string | null;
  autoSubscribe?: boolean;
}

export interface UseExpertPresenceResult {
  status: ExpertClientStatus;
  isOnline: boolean;
  isBusy: boolean;
  isOffline: boolean;
  isAvailableForConsultation: boolean;
  lastSeenAt: string | null;
}

export const useExpertPresence = (
  expertId: number | null,
  options?: UseExpertPresenceOptions,
): UseExpertPresenceResult => {
  const initialStatus = options?.initialStatus;
  const initialLastSeenAt = options?.initialLastSeenAt ?? null;
  const autoSubscribe = options?.autoSubscribe ?? false;

  const presenceRecord = usePresenceStore((state) =>
    expertId === null ? undefined : state.presenceMap[expertId],
  );
  const setExpertStatus = usePresenceStore((state) => state.setExpertStatus);
  const subscribeToExpert = usePresenceStore((state) => state.subscribeToExpert);
  const unsubscribeFromExpert = usePresenceStore(
    (state) => state.unsubscribeFromExpert,
  );

  // Seed initial status if not yet tracked in store
  useEffect(() => {
    if (expertId === null || initialStatus === undefined) return;
    if (!presenceRecord) {
      setExpertStatus(expertId, initialStatus, undefined, initialLastSeenAt);
    }
  }, [expertId, initialStatus, initialLastSeenAt, presenceRecord, setExpertStatus]);

  // Active room subscription for dedicated views (Detail / Prep pages)
  useEffect(() => {
    if (expertId === null || !autoSubscribe) return;

    subscribeToExpert(expertId);

    return () => {
      unsubscribeFromExpert(expertId);
    };
  }, [expertId, autoSubscribe, subscribeToExpert, unsubscribeFromExpert]);

  return useMemo(() => {
    const status: ExpertClientStatus =
      presenceRecord?.status ?? initialStatus ?? ExpertClientStatus.OFFLINE;

    return {
      status,
      isOnline: status === ExpertClientStatus.ONLINE,
      isBusy: status === ExpertClientStatus.BUSY,
      isOffline: status === ExpertClientStatus.OFFLINE,
      isAvailableForConsultation: status === ExpertClientStatus.ONLINE,
      lastSeenAt: presenceRecord?.lastSeenAt ?? initialLastSeenAt,
    };
  }, [presenceRecord?.status, presenceRecord?.lastSeenAt, initialStatus, initialLastSeenAt]);
};
