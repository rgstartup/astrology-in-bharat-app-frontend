import type { ExpertFilterState } from "@/lib/types";
import type { IExpert } from "@repo/lib";
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

export interface ExpertListStore {
  experts: IExpert[];
  loading: boolean;
  page: number;
  hasMore: boolean;
  searchQuery: string;
  debouncedSearch: string;
  selectedSpecialization: string;
  filterState: ExpertFilterState;
  localFilter: ExpertFilterState;
  preloadedExpert: IExpert | null;
  setPreloadedExpert: (expert: IExpert | null) => void;
  setExperts: (value: StateUpdate<IExpert[]>) => void;
  updateExpertAvailability: (
    expertId: string | number,
    isAvailable: boolean,
  ) => void;
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
  experts: [] as IExpert[],
  loading: false,
  page: 1,
  hasMore: true,
  searchQuery: "",
  debouncedSearch: "",
  selectedSpecialization: "",
  preloadedExpert: null as IExpert | null,
  filterState: { ...defaultExpertFilterState },
  localFilter: { ...defaultExpertFilterState },
};

export const expertListStore = create<ExpertListStore>((set, get) => ({
  ...initialState,
  setPreloadedExpert: (preloadedExpert) => set({ preloadedExpert }),
  setExperts: (value) =>
    set((state) => ({
      experts: typeof value === "function" ? value(state.experts) : value,
    })),

  updateExpertAvailability: (expertId, isAvailable) =>
    set((state) => ({
      experts: state.experts.map((expert) =>
        String(expert.id) === String(expertId)
          ? { ...expert, is_available: isAvailable }
          : expert,
      ),
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
      limit: "10",
      page: String(currentPage),
      ...(debouncedSearch && { q: debouncedSearch }),
      ...(selectedSpecialization && {
        specializations: selectedSpecialization,
      }),
      ...(filterState.sortBy &&
        filterState.sortBy !== "newest" && { sort: filterState.sortBy }),
      ...(filterState.language && { languages: filterState.language }),
      ...(filterState.minPrice > 0 && {
        minPrice: String(filterState.minPrice),
      }),
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

export const useExpertListStore = expertListStore;
export default expertListStore;
