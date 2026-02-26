import { create } from "zustand";
import { AuthService, ClientUser } from "../services/auth.service";
const authDebug = (...args: unknown[]) => {
    if (process.env.NODE_ENV !== "production") {
        console.log("[AuthDebug][store]", ...args);
    }
};

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
            set({ clientUser: userData, isClientAuthenticated: true, clientLoading: false });
        }
        set({ isClientAuthenticated: true, clientLoading: false });

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
            const balanceRes: any = await AuthService.fetchBalance();
            const raw = balanceRes?.data ?? balanceRes;

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

            set({ clientBalance: parsed });
        } catch {
            // Silently fail — balance is non-critical
        }
    },

    refreshAuth: async () => {
        if (!get().isClientAuthenticated) {
            set({ clientLoading: true });
        }
        authDebug("refreshAuth:start", {
            isClientAuthenticated: get().isClientAuthenticated,
            hasClientUser: Boolean(get().clientUser),
        });

        try {
            const res: any = await AuthService.fetchProfile();
            // Support both shapes:
            // 1) direct payload (safeFetch-based apiClient)
            // 2) wrapped payload { status, data }
            const raw = res?.data ?? res;
            let user: ClientUser | null = null;
            authDebug("refreshAuth:response", {
                hasResponse: Boolean(res),
                isNullRaw: raw == null,
                rawType: typeof raw,
                hasRawUser: Boolean(raw?.user),
                hasRawId: Boolean(raw?.id),
            });

            if (raw?.user?.id) {
                user = {
                    id: raw.user.id,
                    name: raw.user.name,
                    email: raw.user.email,
                    roles: raw.user.roles || [],
                    avatar: raw.profile_picture || raw.user.avatar,
                };
            } else if (raw?.id) {
                user = {
                    id: raw.id,
                    name: raw.full_name || raw.name || "User",
                    email: raw.email || "",
                    roles: raw.roles || [],
                    avatar: raw.profile_picture || raw.avatar,
                };
            }

            if (user) {
                set({ clientUser: user, isClientAuthenticated: true });
                authDebug("refreshAuth:user resolved", { id: user.id, name: user.name });
                get().refreshBalance();
            } else {
                set({
                    isClientAuthenticated: false,
                    clientUser: null,
                });
                authDebug("refreshAuth:2xx with non-user payload -> unauthenticated");
            }
        } catch (err: any) {
            const status = err?.status ?? err?.response?.status;
            authDebug("refreshAuth:error", {
                status,
                message: err?.message,
            });

            // On ANY error, we assume unauthenticated for safety.
            set({
                isClientAuthenticated: false,
                clientUser: null,
            });
        } finally {
            set({ clientLoading: false });
            authDebug("refreshAuth:final", {
                isClientAuthenticated: get().isClientAuthenticated,
                hasClientUser: Boolean(get().clientUser),
            });
        }
    },
}));
