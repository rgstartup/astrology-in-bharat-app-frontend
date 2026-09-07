import { create } from "zustand";
import type { Store } from "@/lib/types/shop";

type StateUpdate<T> = T | ((current: T) => T);

export interface MerchantStore {
  merchants: Store[];
  merchantStatuses: Record<string, boolean>;
  isLoading: boolean;
  selectedMerchant: Store | null;
  searchQuery: string;

  // Actions
  setMerchants: (value: StateUpdate<Store[]>) => void;
  updateMerchantStatus: (
    merchantId: string | number,
    isOnline: boolean,
  ) => void;
  setMerchantStatus: (merchantId: string | number, isOnline: boolean) => void;
  setMerchantStatuses: (statuses: Record<string, boolean>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setSelectedMerchant: (merchant: Store | null) => void;
  setSearchQuery: (query: string) => void;
  reset: () => void;
  resetState: () => void;
}

const initialState = {
  merchants: [] as Store[],
  merchantStatuses: {} as Record<string, boolean>,
  isLoading: false,
  selectedMerchant: null as Store | null,
  searchQuery: "",
};

export const useMerchantStore = create<MerchantStore>((set, get) => ({
  ...initialState,

  setMerchants: (value) =>
    set((state) => ({
      merchants: typeof value === "function" ? value(state.merchants) : value,
    })),

  updateMerchantStatus: (merchantId, isOnline) =>
    set((state) => {
      const idKey = String(merchantId);
      const newStatuses = {
        ...state.merchantStatuses,
        [idKey]: isOnline,
      };

      const updatedMerchants =
        state.merchants.length > 0
          ? state.merchants.map((merchant) =>
              String(merchant.id) === idKey
                ? { ...merchant, isOnline }
                : merchant,
            )
          : state.merchants;

      const updatedSelected =
        state.selectedMerchant && String(state.selectedMerchant.id) === idKey
          ? { ...state.selectedMerchant, isOnline }
          : state.selectedMerchant;

      return {
        merchantStatuses: newStatuses,
        merchants: updatedMerchants,
        selectedMerchant: updatedSelected,
      };
    }),

  setMerchantStatus: (merchantId, isOnline) => {
    get().updateMerchantStatus(merchantId, isOnline);
  },

  setMerchantStatuses: (statuses) =>
    set((state) => ({
      merchantStatuses: {
        ...state.merchantStatuses,
        ...statuses,
      },
    })),

  setIsLoading: (isLoading) => set({ isLoading }),

  setSelectedMerchant: (selectedMerchant) => set({ selectedMerchant }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  reset: () => set(initialState),
  resetState: () => set(initialState),
}));

// Named alias matching user request
export const merchantStore = useMerchantStore;
export default useMerchantStore;
