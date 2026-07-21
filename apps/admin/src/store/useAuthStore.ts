import { create } from 'zustand';
import { api } from "@/lib/api";
import { getErrorMessage } from "@repo/lib";

interface User {
    id: string;
    name?: string;
    email?: string;
    role?: string;       // Single role from JWT (new format)
    roles?: string[];    // Array format (backward compat)
    // Sub-admin ke liye: allowed pages ki list. Super admin ke liye undefined/null.
    admin_permissions?: string[] | null;
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
            const { adminLogoutAction } = await import("@/actions/auth");
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
            let [userPayload, error]: [any, any] = await api.get('/users/me');
            
            if (error) {
                // If 404, try with admin prefix just in case
                if (error.status === 404) {
                    const [adminRes, adminErr] = await api.get('/admin/users/me');
                    if (adminErr) throw adminErr;
                    userPayload = adminRes;
                } else {
                    throw error;
                }
            }

            // userPayload is the data portion [0] of the result tuple
            const userData = userPayload?.data ?? userPayload;
            
            if (userData) {
                set({
                    user: userData,
                    isAuthenticated: true,
                    loading: false
                });
            } else {
                throw new Error("No user data");
            }
        } catch (err: any) {
            if (err?.status !== 401) {
                console.error("Auth refresh failed:", getErrorMessage(err));
            }
            set({ isAuthenticated: false, user: null, loading: false });
        } finally {
            clearTimeout(safetyTimeout);
            set({ loading: false });
        }
    },
}));
