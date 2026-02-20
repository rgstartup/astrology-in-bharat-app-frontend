import { apiClient } from "../lib/api-client";
import { API_ROUTES } from "../lib/api-routes";

export interface ClientUser {
    id: number;
    name?: string;
    email?: string;
    roles?: string[];
    avatar?: string;
}

export const AuthService = {
    logout: async () => {
        return await apiClient.post(API_ROUTES.AUTH.LOGOUT);
    },

    fetchProfile: async (serverHeaders?: any) => {
        const response = await apiClient.get(API_ROUTES.AUTH.ME, {
            headers: {
                ...serverHeaders,
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            },
            params: {
                _t: new Date().getTime() // Anti-cache timestamp
            }
        });
        return response;
    },

    fetchBalance: async () => {
        const response = await apiClient.get(API_ROUTES.WALLET.BALANCE);
        return response.data;
    }
};
