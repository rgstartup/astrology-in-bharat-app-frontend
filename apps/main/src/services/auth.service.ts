// "use server";

import { api, API_ROUTES } from "@/actions";
import type { Client } from "@repo/lib";

export const AuthService = {
  logout: async () => {
    return api.post(API_ROUTES.AUTH.LOGOUT);
  },

  fetchProfile: async (serverHeaders?: HeadersInit) => {
    return api
      .extend({
        headers: {
          ...serverHeaders,
        },
      })
      .get<Client>(API_ROUTES.AUTH.CLIENT.ME);
  },

  fetchBalance: async () => {
    return api.get(API_ROUTES.WALLET.BALANCE);
  },

  refreshToken: async () => {
    return api.post(API_ROUTES.AUTH.REFRESH);
  },
};
