import type { ExpertFilterState } from "@/lib/types";
import type { Expert } from "@repo/lib";
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

export type ExpertFetchParams = Record<string, string>;

interface ExpertListStore {
  experts: Expert[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  searchQuery: string;
  debouncedSearch: string;
  selectedSpecialization: string;
  filterState: ExpertFilterState;
  localFilter: ExpertFilterState;
  setExperts: (value: StateUpdate<Expert[]>) => void;
  setLoading: (loading: boolean) => void;
  setPage: (page: number) => void;
  setHasMore: (hasMore: boolean) => void;
  setSearchQuery: (searchQuery: string) => void;
  setDebouncedSearch: (debouncedSearch: string) => void;
  setSelectedSpecialization: (selectedSpecialization: string) => void;
  setFilterState: (filterState: ExpertFilterState) => void;
  setLocalFilter: (localFilter: ExpertFilterState) => void;
  buildFetchParams: (
    currentPage: number,
    debouncedSearch?: string,
  ) => ExpertFetchParams;
  resetState: () => void;
}

const initialState = {
  experts: [] as Expert[],
  loading: false,
  page: 1,
  hasMore: true,
  searchQuery: "",
  debouncedSearch: "",
  selectedSpecialization: "",
  filterState: { ...defaultExpertFilterState },
  localFilter: { ...defaultExpertFilterState },
};

export const useExpertListStore = create<ExpertListStore>((set, get) => ({
  ...initialState,
  setExperts: (value) =>
    set((state) => ({
      experts: typeof value === "function" ? value(state.experts) : value,
    })),

  setLoading: (loading) => set({ loading }),

  setPage: (page) => set({ page }),

  setHasMore: (hasMore) => set({ hasMore }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setDebouncedSearch: (debouncedSearch) => set({ debouncedSearch }),

  setSelectedSpecialization: (selectedSpecialization) =>
    set({ selectedSpecialization }),

  setFilterState: (filterState) => set({ filterState }),

  setLocalFilter: (localFilter) => set({ localFilter }),

  buildFetchParams: (currentPage, debouncedSearch = "") => {
    const { selectedSpecialization, filterState } = get();

    return {
      limit: "20",
      page: String(currentPage),
      ...(debouncedSearch && { q: debouncedSearch }),
      ...(selectedSpecialization && {
        specializations: selectedSpecialization,
      }),
      sort: filterState.sortBy,
      ...(filterState.language && { languages: filterState.language }),
      minPrice: String(filterState.minPrice),
      ...(filterState.maxPrice < 1000 && {
        maxPrice: String(filterState.maxPrice),
      }),
      ...(filterState.addressState && { state: filterState.addressState }),
      ...(filterState.serviceType !== "all" && {
        service: filterState.serviceType,
      }),
      ...(filterState.minRating > 0 && {
        rating: String(filterState.minRating),
      }),
      ...(filterState.onlyOnline && { online: "true" }),
    };
  },
  resetState: () =>
    set({
      ...initialState,
      filterState: { ...defaultExpertFilterState },
      localFilter: { ...defaultExpertFilterState },
    }),
}));
