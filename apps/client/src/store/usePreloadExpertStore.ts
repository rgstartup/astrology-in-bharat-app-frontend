/**
 * @deprecated Deprecated in favor of useExpertListStore.
 * All expert-related state has been unified in useExpertListStore.
 */
import { useExpertListStore } from "./useExpertListStore";

export const usePreloadExpertStore = useExpertListStore;
export default usePreloadExpertStore;
