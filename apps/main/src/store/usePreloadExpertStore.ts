import { create } from 'zustand';
import { Expert } from '@/lib/types';

interface PreloadExpertStore {
  preloadedExpert: Expert | null;
  setPreloadedExpert: (expert: Expert | null) => void;
}

export const usePreloadExpertStore = create<PreloadExpertStore>((set) => ({
  preloadedExpert: null,
  setPreloadedExpert: (expert) => set({ preloadedExpert: expert }),
}));
