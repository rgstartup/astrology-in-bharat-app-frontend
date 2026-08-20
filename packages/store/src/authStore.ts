import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { SafeFetchInstance } from "@repo/safe-fetch";

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
    profile?: string;
}

interface AuthState {
    user: ClientUser | null;
    balance: number;
    loading: boolean;
    isAuthenticated: boolean;

    // Actions
    login: (api: SafeFetchInstance, userData?: ClientUser) => void;
    logout: (api: SafeFetchInstance, redirectUrl?: string) => Promise<void>;
    refreshAuth: (api: SafeFetchInstance) => Promise<void>;
    refreshBalance: (api: SafeFetchInstance) => Promise<void>;
    updateUser: (data: Partial<ClientUser>) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            balance: 0,
            loading: true,
            isAuthenticated: false,

            login: (api: SafeFetchInstance, userData?: ClientUser) => {
                if (userData) {
                    set({ user: userData, isAuthenticated: true, loading: false });
                } else {
                    set({ isAuthenticated: true, loading: false });
                }
                get().refreshBalance(api);
                // if (!userData) {
                //     get().refreshAuth();
                // }
            },

            logout: async (api: SafeFetchInstance, redirectUrl?: string) => {
                set({
                    user: null,
                    isAuthenticated: false,
                    loading: false,
                    balance: 0,
                });

                try {
                    // Call backend to invalidate token
                    await api.post('/auth/logout');
                } catch {
                    // Silently fail logout cleanup
                }

                try {
                    // Call Next.js API route to clear HttpOnly cookies
                    await fetch('/api/auth/logout', { method: 'POST' });
                } catch {
                    // Silently fail
                }

                if (typeof window !== "undefined") {
                    // Use a more standard way for shared package
                    if (redirectUrl) {
                        window.location.href = redirectUrl;
                    } else if (redirectUrl !== "") {
                        window.location.href = "/?_logout=1";
                    }
                }
            },

            refreshBalance: async (api: SafeFetchInstance) => {
                const [res, error] = await api.get<any>('/wallet/balance');
                if (error) return;

                const raw = res?.data ?? res;
                let parsed = 0;
                if (typeof raw === "number") {
                    parsed = raw;
                } else if (typeof raw === "string") {
                    const n = Number(raw);
                    parsed = Number.isFinite(n) ? n : 0;
                } else if (raw && typeof raw === "object") {
                    const candidate = raw.balance ?? raw.amount ?? raw.walletBalance;
                    const n = Number(candidate);
                    parsed = Number.isFinite(n) ? n : 0;
                }
                set({ balance: parsed });
            },

            refreshAuth: async (api: SafeFetchInstance) => {
                if (!get().isAuthenticated) {
                    set({ loading: true });
                }

                const [res, error] = await api.get<any>('/client/profile');
                if (error) {
                    // 403 = user is authenticated but wrong role (e.g. expert accessing client profile)
                    // Do NOT clear auth on 403 — only clear on 401 (truly unauthenticated)
                    const status = (error as any)?.status || (error as any)?.response?.status || (error as any)?.statusCode;
                    if (status === 403) {
                        console.warn('[refreshAuth] 403 Forbidden — user authenticated but wrong role, keeping session.');
                        toast.error("Access forbidden: You are logged in as an Expert. Please login with a User account.");
                        set({ loading: false });
                        return;
                    }
                    set({ isAuthenticated: false, user: null, loading: false });
                    return;
                }

                const raw = res?.data ?? res;
                let user: ClientUser | null = null;

                if (raw?.user?.id) {
                    user = {
                        id: raw.user.id,
                        uid: raw.user.uid || raw.uid,
                        name: raw.user.name,
                        email: raw.user.email,
                        roles: raw.user.roles || [],
                        profile_picture: raw.profile_picture || raw.user?.profile_picture || raw.avatar || raw.user?.avatar,
                        avatar: raw.profile_picture || raw.user?.profile_picture || raw.avatar || raw.user?.avatar,
                        profile: raw.profile || raw.user.profile || raw.id,
                    };
                } else if (raw?.id) {
                    user = {
                        id: raw.id,
                        uid: raw.uid,
                        name: raw.full_name || raw.name || "User",
                        email: raw.email || "",
                        roles: raw.roles || [],
                        profile_picture: raw.profile_picture || raw.avatar,
                        avatar: raw.profile_picture || raw.avatar,
                        profile: raw.profile || raw.id,
                    };
                }

                if (user) {
                    set({
                        user: { ...(get().user || {}), ...user } as ClientUser,
                        isAuthenticated: true,
                        loading: false
                    });
                    get().refreshBalance(api);
                } else {
                    set({ isAuthenticated: false, user: null, loading: false });
                }
            },

            updateUser: (data: Partial<ClientUser>) => {
                const current = get().user;
                if (current) {
                    set({ user: { ...current, ...data } });
                }
            },
        }),
        {
            name: "astrology-auth-storage",
            partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
        }
    )
);
