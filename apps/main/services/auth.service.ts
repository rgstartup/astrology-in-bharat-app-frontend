import { api } from "../lib/api";
import { API_ROUTES } from "../lib/api-routes";
import { ApiError } from "@repo/safe-fetch";

export interface ClientUser {
    id: number;
    name?: string;
    email?: string;
    role?: string;
    roles?: string[];
    avatar?: string;
    profile_picture?: string;
    phone?: string;
}

export const AuthService = {
    logout: async (): Promise<[any | null, ApiError | null]> => {
        return await api.post(API_ROUTES.AUTH.LOGOUT);
    },

    fetchProfile: async (serverHeaders?: any): Promise<[any | null, ApiError | null]> => {
        return await api.get(API_ROUTES.AUTH.ME, {
            headers: {
                ...serverHeaders,
            }
        });
    },

    fetchBalance: async (): Promise<[any | null, ApiError | null]> => {
        return await api.get(API_ROUTES.WALLET.BALANCE);
    }
};

