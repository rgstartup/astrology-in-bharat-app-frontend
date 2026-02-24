import { create } from 'zustand';
import { api } from "@/src/lib/api";

interface User {
    id: number;
    name?: string;
    email?: string;
    role?: string;       // Single role from JWT (new format)
    roles?: string[];    // Array format (backward compat)
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (userData?: User) => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    login: (userData?: User) => {
        // HttpOnly cookies are managed by Server Actions, not client JS
        set({
            isAuthenticated: true,
            user: userData || null,
            loading: !userData // If no user data, keep loading true until refreshAuth completes
        });

        if (!userData) {
            get().refreshAuth();
        }
    },

    logout: async () => {
        try {
            const { adminLogoutAction } = await import("@/src/actions/auth");
            await adminLogoutAction();
            await api.post('/auth/logout');
        } catch (err) {
            console.error("Logout error:", err);
        }

        set({ user: null, isAuthenticated: false, loading: false });
        if (typeof window !== 'undefined') window.location.href = '/';
    },

    refreshAuth: async () => {
        // Since accessToken is HttpOnly, getCookie will return null.
        // We MUST always attempt the fetch because withCredentials will send the cookie.
        set({ loading: true });

        // Safety timeout - never stay loading more than 10 seconds
        const safetyTimeout = setTimeout(() => {
            if (get().loading) {
                console.warn("Auth refresh safety timeout triggered");
                set({ loading: false });
            }
        }, 10000);

        try {

            let res: any;
            try {
                // Try fetching user profile
                res = await api.get('/users/me');
            } catch (firstErr: any) {
                // If 401/404, try with admin prefix just in case
                const status = firstErr?.status ?? firstErr?.response?.status;
                if (status === 404) {
                    res = await api.get('/admin/users/me');
                } else {
                    throw firstErr;
                }
            }

            const userPayload = res?.data ?? res;
            if (userPayload) {
                set({
                    user: userPayload,
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                throw new Error("No user data");
            }
        } catch (err: any) {
            console.error("Auth refresh failed:", err?.body?.message || err?.response?.data?.message || err.message);
            set({ isAuthenticated: false, user: null, loading: false });
        } finally {
            clearTimeout(safetyTimeout);
            set({ loading: false });
        }
    },
}));
