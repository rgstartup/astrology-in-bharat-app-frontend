/**
 * @deprecated Deprecated in favor of useExpertListStore.
 * All expert-related state has been unified in useExpertListStore.
 */
import { useExpertListStore, type ExpertListStore } from "./useExpertListStore";

export type { ExpertListStore };
export const usePreloadExpertStore = useExpertListStore;
export default usePreloadExpertStore;
