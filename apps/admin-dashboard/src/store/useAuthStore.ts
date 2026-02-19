import { create } from 'zustand';
import { api } from "@/src/lib/api";

// Cookie helpers
const getCookie = (name: string) => {
    if (typeof document === 'undefined') return null;
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop()?.split(';').shift();
    return null;
};

const setCookie = (name: string, value: string, days: number = 30) => {
    if (typeof document === 'undefined') return;
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

const deleteCookie = (name: string) => {
    if (typeof document === 'undefined') return;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

interface User {
    id: number;
    name?: string;
    email?: string;
    roles?: string[];
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, userData?: User) => void;
    logout: () => void;
    refreshAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    login: (newToken: string, userData?: User) => {
        // If newToken is provided, we set it (for non-server action flows if any)
        if (newToken) setCookie('accessToken', newToken);
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
            console.log("Refreshing admin auth...");
            let res;
            try {
                // Try fetching user profile
                res = await api.get('/users/me');
            } catch (firstErr: any) {
                // If 401/404, try with admin prefix just in case
                if (firstErr.response?.status === 404) {
                    res = await api.get('/admin/users/me');
                } else {
                    throw firstErr;
                }
            }

            if (res?.data) {
                console.log("Admin auth successful", res.data);
                set({
                    user: res.data,
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                throw new Error("No user data");
            }
        } catch (err: any) {
            console.error("Auth refresh failed:", err.response?.data?.message || err.message);
            set({ isAuthenticated: false, user: null, loading: false });
        } finally {
            clearTimeout(safetyTimeout);
            set({ loading: false });
        }
    },
}));
