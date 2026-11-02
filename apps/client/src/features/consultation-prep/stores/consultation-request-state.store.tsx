"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useStore } from "zustand";
import { createStore, type StoreApi } from "zustand/vanilla";
import {
  createJSONStorage,
  persist,
  type StateStorage,
} from "zustand/middleware";
import type {
  ConsultationBudgetHoldPayload,
  ConsultationBudgetTickPayload,
  ConsultationBudgetWarningPayload,
} from "@/realtime/types/consultation";

export interface ConsultationRequestRecord {
  maxMinutes: number | null;
  pendingExpiresAt: string | null;
}

export interface ConsultationRequestStoreState {
  requestsByConsultationId: Record<string, ConsultationRequestRecord>;
  budgetEventsByConsultationId: Record<
    string,
    {
      budgetTick: ConsultationBudgetTickPayload | null;
      budgetWarning: ConsultationBudgetWarningPayload | null;
      budgetHold: ConsultationBudgetHoldPayload | null;
    }
  >;
  /** Persist the current request window for one consultation. */
  setRequestWindow: (
    consultationId: number,
    maxMinutes: number | null,
    pendingExpiresAt: string,
  ) => void;
  /** Clear the pending response expiry while retaining the budget fallback. */
  clearPendingExpiry: (consultationId: number) => void;
  /** Store the latest live budget tick for a consultation. */
  setBudgetTick: (
    consultationId: number,
    payload: ConsultationBudgetTickPayload,
  ) => void;
  /** Store the latest live budget warning for a consultation. */
  setBudgetWarning: (
    consultationId: number,
    payload: ConsultationBudgetWarningPayload,
  ) => void;
  /** Store the live exhausted-budget event for a consultation. */
  setBudgetHold: (
    consultationId: number,
    payload: ConsultationBudgetHoldPayload,
  ) => void;
  /** Clear live events when a room subscribes to a consultation. */
  clearBudgetEvents: (consultationId: number) => void;
  /** Clear live warning and hold state after the server restores the budget. */
  clearBudgetWarningAndHold: (consultationId: number) => void;
}

type PersistedConsultationRequestState = Pick<
  ConsultationRequestStoreState,
  "requestsByConsultationId"
>;

const StoreContext =
  createContext<StoreApi<ConsultationRequestStoreState> | null>(null);

/**
 * Creates a consultation-scoped request store persisted for the current browser tab.
 *
 * @returns A persisted Zustand store for request budget and expiry data.
 */
function createConsultationRequestStore() {
  let hasHydrated = false;
  const storage: StateStorage = {
    getItem: (name) =>
      typeof window === "undefined"
        ? null
        : window.sessionStorage.getItem(name),
    setItem: (name, value) => {
      if (hasHydrated && typeof window !== "undefined") {
        window.sessionStorage.setItem(name, value);
      }
    },
    removeItem: (name) => {
      if (hasHydrated && typeof window !== "undefined") {
        window.sessionStorage.removeItem(name);
      }
    },
  };

  return createStore<ConsultationRequestStoreState>()(
    persist<
      ConsultationRequestStoreState,
      [],
      [],
      PersistedConsultationRequestState
    >(
      (set) => ({
        requestsByConsultationId: {},
        budgetEventsByConsultationId: {},
        setRequestWindow: (consultationId, maxMinutes, pendingExpiresAt) =>
          set((state) => {
            const existing = state.requestsByConsultationId[consultationId];
            return {
              requestsByConsultationId: {
                ...state.requestsByConsultationId,
                [consultationId]: {
                  maxMinutes: maxMinutes ?? existing?.maxMinutes ?? null,
                  pendingExpiresAt,
                },
              },
            };
          }),
        clearPendingExpiry: (consultationId) =>
          set((state) => {
            const current = state.requestsByConsultationId[consultationId];
            if (!current || current.pendingExpiresAt === null) return state;
            return {
              requestsByConsultationId: {
                ...state.requestsByConsultationId,
                [consultationId]: { ...current, pendingExpiresAt: null },
              },
            };
          }),
        setBudgetTick: (consultationId, payload) =>
          set((state) => {
            const current = state.budgetEventsByConsultationId[
              consultationId
            ] ?? {
              budgetTick: null,
              budgetWarning: null,
              budgetHold: null,
            };
            return {
              budgetEventsByConsultationId: {
                ...state.budgetEventsByConsultationId,
                [consultationId]: {
                  budgetTick: payload,
                  budgetWarning: current.budgetWarning ?? null,
                  budgetHold: current.budgetHold ?? null,
                },
              },
            };
          }),
        setBudgetWarning: (consultationId, payload) =>
          set((state) => {
            const current = state.budgetEventsByConsultationId[
              consultationId
            ] ?? {
              budgetTick: null,
              budgetWarning: null,
              budgetHold: null,
            };
            return {
              budgetEventsByConsultationId: {
                ...state.budgetEventsByConsultationId,
                [consultationId]: {
                  budgetTick: current.budgetTick ?? null,
                  budgetWarning: payload,
                  budgetHold: current.budgetHold ?? null,
                },
              },
            };
          }),
        setBudgetHold: (consultationId, payload) =>
          set((state) => {
            const current = state.budgetEventsByConsultationId[
              consultationId
            ] ?? {
              budgetTick: null,
              budgetWarning: null,
              budgetHold: null,
            };
            return {
              budgetEventsByConsultationId: {
                ...state.budgetEventsByConsultationId,
                [consultationId]: {
                  budgetTick: current.budgetTick ?? null,
                  budgetWarning: current.budgetWarning ?? null,
                  budgetHold: payload,
                },
              },
            };
          }),
        clearBudgetEvents: (consultationId) =>
          set((state) => ({
            budgetEventsByConsultationId: {
              ...state.budgetEventsByConsultationId,
              [consultationId]: {
                budgetTick: null,
                budgetWarning: null,
                budgetHold: null,
              },
            },
          })),
        clearBudgetWarningAndHold: (consultationId) =>
          set((state) => {
            const current = state.budgetEventsByConsultationId[consultationId];
            if (!current) return state;
            return {
              budgetEventsByConsultationId: {
                ...state.budgetEventsByConsultationId,
                [consultationId]: {
                  ...current,
                  budgetWarning: null,
                  budgetHold: null,
                },
              },
            };
          }),
      }),
      {
        name: "consultation-request-state",
        storage: createJSONStorage(() => storage),
        partialize: (state): PersistedConsultationRequestState => ({
          requestsByConsultationId: state.requestsByConsultationId,
        }),
        skipHydration: true,
        onRehydrateStorage: () => () => {
          hasHydrated = true;
        },
      },
    ),
  );
}

/**
 * Provides a request-state store to the locale subtree containing prep and room routes.
 *
 * @param props - React children that share the consultation request scope.
 * @returns The scoped store context provider.
 */
export function ConsultationRequestStateProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [store] = useState(createConsultationRequestStore);

  useEffect(() => {
    void store.persist.rehydrate();
  }, [store]);

  return (
    <StoreContext.Provider value={store}>{children}</StoreContext.Provider>
  );
}

/**
 * Selects state or actions from the scoped consultation request store.
 *
 * @param selector - Store slice to read.
 * @returns The selected store value.
 * @throws {Error} When used outside ConsultationRequestStateProvider.
 */
export function useConsultationRequestStore<TSelected>(
  selector: (state: ConsultationRequestStoreState) => TSelected,
): TSelected {
  const store = useContext(StoreContext);
  if (!store) {
    throw new Error(
      "useConsultationRequestStore must be used within ConsultationRequestStateProvider",
    );
  }
  return useStore(store, selector);
}
