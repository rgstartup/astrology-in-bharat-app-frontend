"use client";

import { createScopedStore } from "@/store/utils/create-scoped-store";
import type { RoomSeed } from "../../hooks/use-room-seed";

export type RoomSeedState = {
  roomConsultationId: number | null;
  seed: RoomSeed | null;
  seedKey: string | null;
};

export type RoomSeedActions = {
  setSeed: (value: Partial<RoomSeedState>) => void;
};

export const { Provider: RoomSeedProvider, useStore: useRoomSeedContext } =
  createScopedStore<RoomSeedState, RoomSeedActions>((set) => ({
    roomConsultationId: null,
    seed: null,
    seedKey: null,
    setSeed: (next) => set((state) => ({ ...state, ...next })),
  }));

export type { RoomSeed };
