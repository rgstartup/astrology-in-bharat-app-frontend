"use client";

import { useEffect, useMemo } from "react";
import { realtimeSocket } from "@/realtime/socket";
import { PRESENCE_EVENTS } from "@/realtime/topics/presence";
import {
  ExpertClientStatus,
  type PresenceChangedEventPayload,
} from "@/realtime/types/presence";
import { usePresenceStore } from "@/store/presenceStore";
import { useExpertListStore } from "@/store/expertListStore";

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
  const isLive = usePresenceStore((state) => state.isLive);
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
    // Socket dead past the grace period: last-known values are unverifiable,
    // so report OFFLINE rather than a stale online/busy.
    const status: ExpertClientStatus = !isLive
      ? ExpertClientStatus.OFFLINE
      : (presenceRecord?.status ?? initialStatus ?? ExpertClientStatus.OFFLINE);

    return {
      status,
      isOnline: status === ExpertClientStatus.ONLINE,
      isBusy: status === ExpertClientStatus.BUSY,
      isOffline: status === ExpertClientStatus.OFFLINE,
      isAvailableForConsultation: status === ExpertClientStatus.ONLINE,
      lastSeenAt: presenceRecord?.lastSeenAt ?? initialLastSeenAt,
    };
  }, [isLive, presenceRecord?.status, presenceRecord?.lastSeenAt, initialStatus, initialLastSeenAt]);
};

/**
 * Stream `presence:updated` from the `/realtime` socket into the presence
 * and expert-list stores. Delegated from RealtimeProvider so the provider
 * owns only the connection lifecycle (connect / disconnect / connect_error).
 */
export const usePresenceSync = () => {
  useEffect(() => {
    const socket = realtimeSocket();

    const handlePresenceChanged = (payload: PresenceChangedEventPayload) => {
      usePresenceStore
        .getState()
        .setExpertStatus(
          payload.expertId,
          payload.status,
          payload.timestamp,
          payload.lastSeenAt,
        );

      useExpertListStore
        .getState()
        .updateExpertAvailability(
          payload.expertId,
          payload.status !== ExpertClientStatus.OFFLINE,
        );
    };

    socket.on(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);

    return () => {
      socket.off(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);
    };
  }, []);
};

/**
 * Grace period before a dead socket marks presence stale. Covers transient
 * blips / fast backend restarts (reconnect clears the timer, no flicker);
 * a genuinely down backend flips every card to Offline after this delay.
 */
const STALE_AFTER_MS = 8000;

/**
 * Manage presence lifecycle state (isLive flag, subscription rehydration,
 * stale marking) driven by socket connection events. Delegated from
 * RealtimeProvider so the provider owns only connection events.
 */
export const usePresenceLifecycle = () => {
  useEffect(() => {
    const socket = realtimeSocket();
    let staleTimer: ReturnType<typeof setTimeout> | null = null;

    const clearStaleTimer = () => {
      if (staleTimer !== null) {
        clearTimeout(staleTimer);
        staleTimer = null;
      }
    };

    const scheduleStale = () => {
      clearStaleTimer();
      staleTimer = setTimeout(() => {
        staleTimer = null;
        usePresenceStore.getState().setLive(false);
      }, STALE_AFTER_MS);
    };

    const handleConnect = () => {
      clearStaleTimer();
      usePresenceStore.getState().setLive(true);
      usePresenceStore.getState().rehydrateSubscriptions();
    };

    // No `connect` also means no `disconnect` will fire (e.g. backend down
    // at page load), so arm the stale timer whenever we aren't connected.
    const handleDisconnect = () => {
      scheduleStale();
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    if (!socket.connected) scheduleStale();

    return () => {
      clearStaleTimer();
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, []);
};
