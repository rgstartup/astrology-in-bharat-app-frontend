import { create } from 'zustand';
import { api } from '@/lib/api';
import { merchantLogoutAction } from '@/actions/auth';

interface User {
    merchantId?: string;
    id?: string;
    shopName?: string;
    email?: string;
    role?: string;
    roles?: string[];
    status?: string;
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    refreshAuth: (user: User | null) => void;
    login: (token: string, userData?: User) => Promise<void>;
    logout: () => Promise<void>;
    refreshProfile: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    refreshAuth: (user: User | null) => {
        if (user) {
            set({ user, isAuthenticated: true, loading: false });
        } else {
            set({ user: null, isAuthenticated: false, loading: false });
        }
    },

    login: async (newToken: string, userData?: User) => {
        // Token is already set as httpOnly cookie by server action
        set({ isAuthenticated: true, loading: false });

        if (userData) {
            const normalizedData = {
                ...userData,
                id: userData.merchantId || userData.id,
                status: userData.status || 'pending_verification',
                name: userData.shopName || userData.name
            };
            set({ user: normalizedData });
        }
    },

    logout: async () => {
        set({ user: null, isAuthenticated: false, loading: false });
        await merchantLogoutAction();
    },

    refreshProfile: async () => {
        console.log("[AuthStore] Refreshing profile...");
        set({ loading: true });
        
        try {
            const [res, error] = await api.get<any>('/auth/merchant/profile');
            
            if (error) {
                console.error("Auth refresh error:", error);
                set({ loading: false, isAuthenticated: false, user: null });
                return;
            }

            const payload = res?.data ?? res;
            if (payload) {
                const normalizedData = {
                    ...payload,
                    id: payload.merchantId || payload.id,
                    status: payload.status,
                    name: payload.shopName || payload.name
                };
                set({ user: normalizedData, isAuthenticated: true, loading: false });
            }
        } catch (err) {
            console.error("Critical Profile Refresh Error:", err);
            set({ loading: false, isAuthenticated: false, user: null });
        }
    },

    setUser: (user: User | null) => {
        set({ user });
    },
}));
