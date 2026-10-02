import { useEffect, useMemo } from "react";
import { ExpertClientStatus } from "@/lib/socket/types";
import { usePresenceStore } from "@/store/presenceStore";

export interface UseExpertPresenceOptions {
  initialStatus?: ExpertClientStatus | string | boolean;
  autoSubscribe?: boolean;
}

export interface UseExpertPresenceResult {
  status: ExpertClientStatus;
  isOnline: boolean;
  isBusy: boolean;
  isOffline: boolean;
  isAvailableForConsultation: boolean;
}

const parseInitialStatus = (
  initial?: ExpertClientStatus | string | boolean,
): ExpertClientStatus => {
  if (initial === undefined || initial === null) {
    return ExpertClientStatus.OFFLINE;
  }
  if (typeof initial === "boolean") {
    return initial ? ExpertClientStatus.ONLINE : ExpertClientStatus.OFFLINE;
  }
  const lower = String(initial).toLowerCase();
  if (lower === "online" || lower === "available") {
    return ExpertClientStatus.ONLINE;
  }
  if (lower === "busy") {
    return ExpertClientStatus.BUSY;
  }
  return ExpertClientStatus.OFFLINE;
};

export const useExpertPresence = (
  expertId?: number | string | null,
  options?: UseExpertPresenceOptions,
): UseExpertPresenceResult => {
  const id = Number(expertId);
  const isValidId = Boolean(id && !isNaN(id));

  const initialStatus = options?.initialStatus;
  const autoSubscribe = options?.autoSubscribe ?? false;

  const presenceRecord = usePresenceStore((state) =>
    isValidId ? state.presenceMap[id] : undefined,
  );
  const setExpertStatus = usePresenceStore((state) => state.setExpertStatus);
  const subscribeToExpert = usePresenceStore((state) => state.subscribeToExpert);
  const unsubscribeFromExpert = usePresenceStore(
    (state) => state.unsubscribeFromExpert,
  );

  // Seed initial status if not yet tracked in store
  useEffect(() => {
    if (!isValidId || initialStatus === undefined) return;
    if (!presenceRecord) {
      setExpertStatus(id, parseInitialStatus(initialStatus));
    }
  }, [id, isValidId, initialStatus, presenceRecord, setExpertStatus]);

  // Active room subscription for dedicated views (Detail / Prep pages)
  useEffect(() => {
    if (!isValidId || !autoSubscribe) return;

    subscribeToExpert(id);

    return () => {
      unsubscribeFromExpert(id);
    };
  }, [id, isValidId, autoSubscribe, subscribeToExpert, unsubscribeFromExpert]);

  return useMemo(() => {
    const status: ExpertClientStatus =
      presenceRecord?.status ?? parseInitialStatus(initialStatus);

    return {
      status,
      isOnline: status === ExpertClientStatus.ONLINE,
      isBusy: status === ExpertClientStatus.BUSY,
      isOffline: status === ExpertClientStatus.OFFLINE,
      isAvailableForConsultation: status === ExpertClientStatus.ONLINE,
    };
  }, [presenceRecord?.status, initialStatus]);
};
