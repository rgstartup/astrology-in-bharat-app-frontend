
import { apiClient } from "../lib/api-client";
import { getCookie } from "../utils/cookie";

export interface ClientUser {
    id: number;
    name?: string;
    email?: string;
    roles?: string[];
    avatar?: string;
}

export const AuthService = {
    logout: async () => {
        return await apiClient.post('/auth/client-logout');
    },

    fetchProfile: async () => {
        const response = await apiClient.get('/client', {
            headers: {
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
        const response = await apiClient.get('/wallet/balance');
        return response.data;
    }
};
