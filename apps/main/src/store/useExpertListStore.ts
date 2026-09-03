import type { ClientExpertProfile, ExpertFilterState } from "@/lib/types";
import { create } from "zustand";

export const defaultExpertFilterState: ExpertFilterState = {
  language: "",
  minPrice: 0,
  maxPrice: 1000,
  addressState: "",
  serviceType: "all",
  minRating: 0,
  onlyOnline: false,
  sortBy: "newest",
};

type StateUpdate<T> = T | ((current: T) => T);

interface ExpertListStore {
  experts: ClientExpertProfile[];
  loading: boolean;
  offset: number;
  hasMore: boolean;
  searchQuery: string;
  debouncedSearch: string;
  selectedSpecialization: string;
  filterState: ExpertFilterState;
  localFilter: ExpertFilterState;
  setExperts: (value: StateUpdate<ClientExpertProfile[]>) => void;
  setLoading: (loading: boolean) => void;
  setOffset: (offset: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setSearchQuery: (searchQuery: string) => void;
  setDebouncedSearch: (debouncedSearch: string) => void;
  setSelectedSpecialization: (selectedSpecialization: string) => void;
  setFilterState: (filterState: ExpertFilterState) => void;
  setLocalFilter: (localFilter: ExpertFilterState) => void;
  resetState: () => void;
}

const initialState = {
  experts: [] as ClientExpertProfile[],
  loading: false,
  offset: 0,
  hasMore: true,
  searchQuery: "",
  debouncedSearch: "",
  selectedSpecialization: "",
  filterState: { ...defaultExpertFilterState },
  localFilter: { ...defaultExpertFilterState },
};

export const useExpertListStore = create<ExpertListStore>((set) => ({
  ...initialState,
  setExperts: (value) =>
    set((state) => ({
      experts: typeof value === "function" ? value(state.experts) : value,
    })),
  setLoading: (loading) => set({ loading }),
  setOffset: (offset) => set({ offset }),
  setHasMore: (hasMore) => set({ hasMore }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setDebouncedSearch: (debouncedSearch) => set({ debouncedSearch }),
  setSelectedSpecialization: (selectedSpecialization) =>
    set({ selectedSpecialization }),
  setFilterState: (filterState) => set({ filterState }),
  setLocalFilter: (localFilter) => set({ localFilter }),
  resetState: () =>
    set({
      ...initialState,
      filterState: { ...defaultExpertFilterState },
      localFilter: { ...defaultExpertFilterState },
    }),
}));
