import { api, API_ROUTES } from "@/actions";
import { ApiError } from "@repo/safe-fetch";

export interface ClientUser {
    id: string;
    uid?: string;
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
        return await api.post(API_ROUTES.AUTH.LOGOUT) as any;
    },

    fetchProfile: async (serverHeaders?: any): Promise<[any | null, ApiError | null]> => {
        return await api.get(API_ROUTES.AUTH.ME, {
            headers: {
                ...serverHeaders,
            }
        }) as any;
    },

    fetchBalance: async (): Promise<[any | null, ApiError | null]> => {
        return await api.get(API_ROUTES.WALLET.BALANCE) as any;
    },

    refreshToken: async (): Promise<[any | null, ApiError | null]> => {
        return await api.post(API_ROUTES.AUTH.REFRESH) as any;
    }
};

