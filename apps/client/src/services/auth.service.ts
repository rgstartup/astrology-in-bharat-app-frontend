// "use server";

import { apiV2, API_ROUTES } from "@/actions";
import type { Client, ClientWallet } from "@repo/lib";

export const AuthService = {
  logout: async () => {
    return apiV2.post(API_ROUTES.AUTH.LOGOUT);
  },

  fetchProfile: async (serverHeaders?: HeadersInit) => {
    return apiV2
      .extend({
        headers: {
          ...serverHeaders,
        },
      })
      .get<Client>(API_ROUTES.AUTH.ME);
  },

  fetchBalance: async () => {
    return apiV2.get<ClientWallet>(API_ROUTES.WALLET.ROOT);
  },

  refreshToken: async () => {
    return apiV2.post<{ accessToken: string; refreshToken: string }>(API_ROUTES.AUTH.REFRESH);
  },
};
