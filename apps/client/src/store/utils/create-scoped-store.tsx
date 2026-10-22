"use client";

import React, { createContext, useContext, useState } from "react";
import { createStore, type StoreApi } from "zustand/vanilla";
import { useStore } from "zustand";

/**
 * Return interface for a scoped Zustand store created by `createScopedStore`.
 */
export interface ScopedStoreBundle<
  TState extends object,
  TActions extends object,
> {
  /**
   * React context provider that creates and bounds the store lifecycle to this component subtree.
   */
  Provider: React.ComponentType<{
    children: React.ReactNode;
    initialState?: Partial<TState>;
  }>;
  /**
   * Hook to select state from the scoped store instance.
   */
  useStore: {
    (): TState & TActions;
    <TSelected>(selector: (state: TState & TActions) => TSelected): TSelected;
    getState: () => TState & TActions;
    setState: StoreApi<TState & TActions>["setState"];
  };
  /**
   * Hook to access the raw Zustand `StoreApi` object directly.
   */
  useStoreApi: () => StoreApi<TState & TActions>;
}

/**
 * Factory for creating boundary-scoped Zustand stores tied to React context lifecycles.
 *
 * @template TState - Shape of reactive state properties
 * @template TActions - Shape of action methods modifying state
 * @param initializer - Zustand initializer callback producing state and action definitions
 * @returns Object containing `Provider`, `useStore`, and `useStoreApi` hooks
 * @throws {Error} When `useStore` or `useStoreApi` are invoked outside their corresponding `Provider`
 */
export function createScopedStore<
  TState extends object,
  TActions extends object,
>(
  initializer: (
    set: StoreApi<TState & TActions>["setState"],
    get: StoreApi<TState & TActions>["getState"],
  ) => TState & TActions,
): ScopedStoreBundle<TState, TActions> {
  type TStore = TState & TActions;

  const StoreContext = createContext<StoreApi<TStore> | null>(null);
  let activeStore: StoreApi<TStore> | null = null;

  /**
   * Scoped store Provider component.
   *
   * @param props - Provider props containing children and optional initialState overrides
   * @returns React Context provider wrapping children with scoped store instance
   */
  function Provider({
    children,
    initialState,
  }: {
    children: React.ReactNode;
    initialState?: Partial<TState>;
  }) {
    const [store] = useState(() => {
      const s = createStore<TStore>()((set, get) => {
        const state = initializer(set, get);
        return { ...state, ...initialState };
      });
      activeStore = s;
      return s;
    });

    React.useEffect(() => {
      activeStore = store;
      return () => {
        if (activeStore === store) {
          activeStore = null;
        }
      };
    }, [store]);

    return (
      <StoreContext.Provider value={store}>
        {children}
      </StoreContext.Provider>
    );
  }

  /**
   * Hook to consume scoped store state with optional selector.
   *
   * @param selector - Optional state mapping function
   * @returns Selected slice or entire store state
   * @throws {Error} If called outside Provider
   */
  function useScopedStore(): TStore;
  function useScopedStore<TSelected>(
    selector: (state: TStore) => TSelected,
  ): TSelected;
  function useScopedStore<TSelected = TStore>(
    selector?: (state: TStore) => TSelected,
  ): TSelected {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("useScopedStore must be used within its Provider");
    }

    if (selector) {
      return useStore(store, selector);
    }

    return useStore(store) as TSelected;
  }

  useScopedStore.getState = (): TStore => {
    if (!activeStore) {
      throw new Error("Cannot call getState() outside of an active Provider");
    }
    return activeStore.getState();
  };

  useScopedStore.setState = ((
    ...args: Parameters<StoreApi<TStore>["setState"]>
  ) => {
    if (!activeStore) {
      throw new Error("Cannot call setState() outside of an active Provider");
    }
    return (activeStore.setState as any)(...args);
  }) as StoreApi<TStore>["setState"];

  /**
   * Hook to retrieve raw StoreApi instance.
   *
   * @returns Zustand StoreApi instance
   * @throws {Error} If called outside Provider
   */
  function useScopedStoreApi(): StoreApi<TStore> {
    const store = useContext(StoreContext);

    if (!store) {
      throw new Error("useScopedStoreApi must be used within its Provider");
    }

    return store;
  }

  return {
    Provider,
    useStore: useScopedStore,
    useStoreApi: useScopedStoreApi,
  };
}
