import { create } from "zustand";
import {
  ExpertClientStatus,
  type PresenceRecord,
  type PresenceSubscriptionSnapshot,
} from "@/realtime/types/presence";
import {
  subscribeExpertPresence,
  subscribeManyExpertPresence,
  unsubscribeExpertPresence,
  unsubscribeManyExpertPresence,
} from "@/realtime/topics/presence";

export interface PresenceState {
  presenceMap: Record<number, PresenceRecord>;
  subscribedExpertIds: number[];
  setExpertStatus: (
    expertId: number,
    status: ExpertClientStatus,
    timestamp?: string,
    lastSeenAt?: string | null,
  ) => void;
  batchSetExpertStatus: (items: PresenceSubscriptionSnapshot[]) => void;
  subscribeToExpert: (expertId: number) => void;
  subscribeManyToExperts: (expertIds: number[]) => void;
  unsubscribeFromExpert: (expertId: number) => void;
  unsubscribeManyFromExperts: (expertIds: number[]) => void;
  rehydrateSubscriptions: () => void;
  getExpertStatus: (expertId: number) => ExpertClientStatus;
  getLastSeenAt: (expertId: number) => string | null;
}

export const presenceStore = create<PresenceState>((set, get) => ({
  presenceMap: {},
  subscribedExpertIds: [],

  setExpertStatus: (expertId, status, timestamp, lastSeenAt) => {
    const writtenAt = timestamp ? Date.parse(timestamp) : Date.now();

    set((state) => {
      const existing = state.presenceMap[expertId];
      if (existing && existing.status === status && existing.lastUpdated >= writtenAt) {
        return state;
      }

      return {
        presenceMap: {
          ...state.presenceMap,
          [expertId]: {
            status,
            isAvailableForConsultation: status === ExpertClientStatus.ONLINE,
            lastUpdated: writtenAt,
            lastSeenAt:
              lastSeenAt ?? (status === ExpertClientStatus.ONLINE ? null : (existing?.lastSeenAt ?? null)),
          },
        },
      };
    });
  },

  batchSetExpertStatus: (items) => {
    if (items.length === 0) return;

    const now = Date.now();
    set((state) => {
      const nextMap = { ...state.presenceMap };
      let hasChanges = false;

      for (const item of items) {
        const existing = nextMap[item.expertId];

        if (!existing || existing.status !== item.status) {
          nextMap[item.expertId] = {
            status: item.status,
            isAvailableForConsultation: item.status === ExpertClientStatus.ONLINE,
            lastUpdated: now,
            lastSeenAt:
              item.lastSeenAt ?? (item.status === ExpertClientStatus.ONLINE ? null : (existing?.lastSeenAt ?? null)),
          };
          hasChanges = true;
        }
      }

      return hasChanges ? { presenceMap: nextMap } : state;
    });
  },

  subscribeToExpert: (expertId) => {
    const { subscribedExpertIds, setExpertStatus } = get();
    if (!subscribedExpertIds.includes(expertId)) {
      set({ subscribedExpertIds: [...subscribedExpertIds, expertId] });
    }

    subscribeExpertPresence(expertId)
      .then((ack) => {
        setExpertStatus(ack.expertId, ack.status, undefined, ack.lastSeenAt);
      })
      .catch(() => {
        // Socket unavailable (SSR/offline); snapshot already covers status.
      });
  },

  subscribeManyToExperts: (expertIds) => {
    const ids = [...new Set(expertIds)];
    if (ids.length === 0) return;

    const { subscribedExpertIds, batchSetExpertStatus } = get();
    const fresh = ids.filter((id) => !subscribedExpertIds.includes(id));
    if (fresh.length === 0) return;
    set({ subscribedExpertIds: [...subscribedExpertIds, ...fresh] });

    subscribeManyExpertPresence(fresh)
      .then((ack) => {
        batchSetExpertStatus(ack.subscribed);
      })
      .catch(() => {
        // Socket unavailable; REST snapshot already covers status.
      });
  },

  unsubscribeFromExpert: (expertId) => {
    const { subscribedExpertIds } = get();
    if (subscribedExpertIds.includes(expertId)) {
      set({
        subscribedExpertIds: subscribedExpertIds.filter((item) => item !== expertId),
      });
    }
    unsubscribeExpertPresence(expertId).catch(() => undefined);
  },

  unsubscribeManyFromExperts: (expertIds) => {
    const ids = new Set(expertIds);
    if (ids.size === 0) return;

    const { subscribedExpertIds } = get();
    set({
      subscribedExpertIds: subscribedExpertIds.filter((id) => !ids.has(id)),
    });
    unsubscribeManyExpertPresence([...ids]).catch(() => undefined);
  },

  rehydrateSubscriptions: () => {
    const { subscribedExpertIds, batchSetExpertStatus } = get();
    if (subscribedExpertIds.length === 0) return;
    subscribeManyExpertPresence(subscribedExpertIds)
      .then((ack) => {
        batchSetExpertStatus(ack.subscribed);
      })
      .catch(() => undefined);
  },

  getExpertStatus: (expertId) => {
    const record = get().presenceMap[expertId];
    return record ? record.status : ExpertClientStatus.OFFLINE;
  },

  getLastSeenAt: (expertId) => {
    return get().presenceMap[expertId]?.lastSeenAt ?? null;
  },
}));

export const usePresenceStore = presenceStore;
export default presenceStore;
