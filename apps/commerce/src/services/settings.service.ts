import { api } from "@/lib/api";

/**
 * Service for Merchant Shop Profile Settings
 */
export const settingsService = {
  /**
   * Fetch the currently logged-in merchant's profile
   */
  getProfile: async () => {
    const [response, error] = await api.get<any>('/merchant/profile');
    // Backend returns { success, exists, data: {...} }
    // We return the full response object so the hook can read .data and .exists
    return [response || null, error];
  },

  /**
   * Update the merchant's profile
   * @param formData Profile data including potential image/video files
   */
  updateProfile: async (formData: FormData) => {
    const [response, error] = await api.patch<any>('/merchant/profile', formData);
    return [response || null, error];
  },

  updateOnlineStatus: async (isOnline: boolean) => {
    const [response, error] = await api.patch<any>('/merchant/profile', { isOnline });
    return [response || null, error];
  },

};
