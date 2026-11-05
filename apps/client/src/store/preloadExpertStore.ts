import type { IExpert } from "@repo/lib";
import { create } from "zustand";

/**
 * Preload cache for the expert being visited: a card writes the expert here
 * before navigation so the profile page can render from it immediately.
 */
interface PreloadExpertStore {
  preloadedExpert: IExpert | null;
  setPreloadedExpert: (expert: IExpert | null) => void;
}

export const preloadExpertStore = create<PreloadExpertStore>((set) => ({
  preloadedExpert: null as IExpert | null,
  setPreloadedExpert: (preloadedExpert) => set({ preloadedExpert }),
}));

export const usePreloadExpertStore = preloadExpertStore;
export default preloadExpertStore;
