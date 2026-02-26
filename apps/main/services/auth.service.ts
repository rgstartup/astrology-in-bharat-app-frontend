import { apiClient } from "../lib/api-client";
import { API_ROUTES } from "../lib/api-routes";

export interface ClientUser {
    id: number;
    name?: string;
    email?: string;
    role?: string;      // Single role from JWT (new backend format)
    roles?: string[];   // Array format (backward compat)
    avatar?: string;
}

export const AuthService = {
    logout: async () => {
        return await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    },

    fetchProfile: async (serverHeaders?: any) => {
        return await apiClient.get(API_ROUTES.AUTH.ME, {
            headers: {
                ...serverHeaders,
            }
        });
    },

    fetchBalance: async () => {
        return await apiClient.get(API_ROUTES.WALLET.BALANCE);
    }
};
