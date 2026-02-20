import { create } from "zustand";
import { AuthService, ClientUser } from "../services/auth.service";

interface AuthState {
    clientUser: ClientUser | null;
    clientBalance: number;
    clientLoading: boolean;
    isClientAuthenticated: boolean;

    // Actions
    clientLogin: (userData?: ClientUser) => void;
    clientLogout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    refreshBalance: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    clientUser: null,
    clientBalance: 0,
    clientLoading: true,
    isClientAuthenticated: false,

    // ── NOTE: Token is NEVER passed here. ──────────────────────────────
    // HttpOnly cookie is already set by the Server Action (actions/auth.ts).
    // Frontend's job: just update UI state.
    // ───────────────────────────────────────────────────────────────────
    clientLogin: (userData?: ClientUser) => {
        if (userData) {
            set({ clientUser: userData, isClientAuthenticated: true });
        }
        set({ isClientAuthenticated: true });

        // Fetch balance after login
        get().refreshBalance();

        // Load full profile if user data is incomplete
        if (!userData) {
            get().refreshAuth();
        }
    },

    clientLogout: async () => {
        // 1. Tell the backend to invalidate the session (best-effort)
        try {
            await AuthService.logout();
        } catch {
            // Backend logout failed — continue anyway to clear local state
        }

        // 2. Clear HttpOnly cookies via a dedicated API route
        //    (Server Actions can't be reliably dynamic-imported from client stores)
        try {
            await fetch("/api/auth/logout", { method: "POST" });
        } catch {
            // If the route fails, cookies may persist until expiry
            // But we still clear local state so UI reflects logout
            console.warn("[Logout] Failed to clear server cookies.");
        }

        // 3. Reset Zustand state — always happens regardless of above failures
        set({
            clientUser: null,
            isClientAuthenticated: false,
            clientLoading: false,
            clientBalance: 0,
        });

        // 4. Full page redirect — forces server to re-render with cleared cookies
        if (typeof window !== "undefined") {
            window.location.href = "/?_logout=1"; // cache-busting param
        }
    },

    refreshBalance: async () => {
        try {
            const balance = await AuthService.fetchBalance();
            set({ clientBalance: balance });
        } catch {
            // Silently fail — balance is non-critical
        }
    },

    refreshAuth: async () => {
        if (!get().isClientAuthenticated) {
            set({ clientLoading: true });
        }

        try {
            const res = await AuthService.fetchProfile();

            if (res.status === 200) {
                const raw = res.data;
                let user: ClientUser | null = null;

                if (raw?.user) {
                    user = {
                        id: raw.user.id,
                        name: raw.user.name,
                        email: raw.user.email,
                        roles: raw.user.roles || [],
                        avatar: raw.user.avatar,
                    };
                } else if (raw?.id) {
                    user = {
                        id: raw.id,
                        name: raw.full_name || "User",
                        email: raw.email || "",
                        roles: [],
                        avatar: raw.profile_picture,
                    };
                }

                set({ clientUser: user, isClientAuthenticated: true });
                get().refreshBalance();
            } else {
                set({ isClientAuthenticated: false, clientUser: null });
            }
        } catch (err: any) {
            if (err.response?.status === 401 || !get().isClientAuthenticated) {
                // Session invalid — clear state silently (no popup)
                set({ isClientAuthenticated: false, clientUser: null });
            } else if (err.response?.status === 404) {
                // Authenticated but no profile yet (new user)
                set({
                    isClientAuthenticated: true,
                    clientUser: { id: 0, name: "New Cosmic Explorer", email: "", roles: [] },
                });
            }
            // Network / 500 errors: keep existing state
        } finally {
            set({ clientLoading: false });
        }
    },
}));
