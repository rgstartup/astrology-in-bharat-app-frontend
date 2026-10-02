import { create } from "zustand";
import {
  ExpertClientStatus,
  type PresenceRecord,
} from "@/lib/socket/types";
import { subscribeExpertPresence } from "@/lib/socket/presence.socket";

export interface PresenceState {
  presenceMap: Record<number, PresenceRecord>;
  subscribedExpertIds: number[];
  setExpertStatus: (
    expertId: number | string,
    status: ExpertClientStatus | string,
    timestamp?: string | number,
  ) => void;
  batchSetExpertStatus: (
    items: Array<{ expertId: number | string; status: ExpertClientStatus | string }>,
  ) => void;
  subscribeToExpert: (expertId: number | string) => void;
  unsubscribeFromExpert: (expertId: number | string) => void;
  rehydrateSubscriptions: () => void;
  getExpertStatus: (expertId: number | string) => ExpertClientStatus;
}

const normalizeStatus = (rawStatus: string): ExpertClientStatus => {
  const lower = rawStatus?.toLowerCase();
  if (lower === "online" || lower === "available") {
    return ExpertClientStatus.ONLINE;
  }
  if (lower === "busy") {
    return ExpertClientStatus.BUSY;
  }
  return ExpertClientStatus.OFFLINE;
};

export const presenceStore = create<PresenceState>((set, get) => ({
  presenceMap: {},
  subscribedExpertIds: [],

  setExpertStatus: (expertId, rawStatus, timestamp) => {
    const id = Number(expertId);
    if (!id || isNaN(id)) return;

    const status = normalizeStatus(String(rawStatus));
    const now = typeof timestamp === "number" ? timestamp : Date.now();

    set((state) => {
      const existing = state.presenceMap[id];
      if (existing && existing.status === status && existing.lastUpdated >= now) {
        return state;
      }

      return {
        presenceMap: {
          ...state.presenceMap,
          [id]: {
            status,
            isAvailableForConsultation: status === ExpertClientStatus.ONLINE,
            lastUpdated: now,
          },
        },
      };
    });
  },

  batchSetExpertStatus: (items) => {
    if (!items || items.length === 0) return;

    const now = Date.now();
    set((state) => {
      const nextMap = { ...state.presenceMap };
      let hasChanges = false;

      for (const item of items) {
        const id = Number(item.expertId);
        if (!id || isNaN(id)) continue;

        const status = normalizeStatus(String(item.status));
        const existing = nextMap[id];

        if (!existing || existing.status !== status) {
          nextMap[id] = {
            status,
            isAvailableForConsultation: status === ExpertClientStatus.ONLINE,
            lastUpdated: now,
          };
          hasChanges = true;
        }
      }

      return hasChanges ? { presenceMap: nextMap } : state;
    });
  },

  subscribeToExpert: (expertId) => {
    const id = Number(expertId);
    if (!id || isNaN(id)) return;

    const { subscribedExpertIds, setExpertStatus } = get();
    if (!subscribedExpertIds.includes(id)) {
      set({ subscribedExpertIds: [...subscribedExpertIds, id] });
    }

    subscribeExpertPresence(id, (ack) => {
      if (ack && ack.status) {
        setExpertStatus(id, ack.status);
      }
    });
  },

  unsubscribeFromExpert: (expertId) => {
    const id = Number(expertId);
    if (!id || isNaN(id)) return;

    const { subscribedExpertIds } = get();
    if (subscribedExpertIds.includes(id)) {
      set({
        subscribedExpertIds: subscribedExpertIds.filter((item) => item !== id),
      });
    }
  },

  rehydrateSubscriptions: () => {
    const { subscribedExpertIds, setExpertStatus } = get();
    for (const id of subscribedExpertIds) {
      subscribeExpertPresence(id, (ack) => {
        if (ack && ack.status) {
          setExpertStatus(id, ack.status);
        }
      });
    }
  },

  getExpertStatus: (expertId) => {
    const id = Number(expertId);
    if (!id || isNaN(id)) return ExpertClientStatus.OFFLINE;
    const record = get().presenceMap[id];
    return record ? record.status : ExpertClientStatus.OFFLINE;
  },
}));

export const usePresenceStore = presenceStore;
export default presenceStore;
