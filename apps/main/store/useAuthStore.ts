import { create } from "zustand";
import { authClient } from "@repo/auth-client";
import { AuthService, ClientUser } from "../services/auth.service";

interface AuthState {
    clientUser: ClientUser | null;
    clientBalance: number;
    clientLoading: boolean;
    isClientAuthenticated: boolean;
    isLoggingOut: boolean;

    // Actions
    clientLogin: (userData?: ClientUser) => void;
    clientLogout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    refreshBalance: () => Promise<void>;
    updateClientUser: (data: Partial<ClientUser>) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    clientUser: null,
    clientBalance: 0,
    clientLoading: true,
    isClientAuthenticated: false,
    isLoggingOut: false,

    clientLogin: (userData?: ClientUser) => {
        if (userData) {
            set({ clientUser: userData, isClientAuthenticated: true, clientLoading: false });
            get().refreshBalance();
            return;
        }

        // For Better Auth client sign-in, wait for the session cookie to be
        // readable through getSession() before marking the client authenticated.
        set({ clientLoading: true });
        get().refreshAuth();
    },

    clientLogout: async () => {
        // Guard to prevent multiple simultaneous logout calls or redundant loops
        if (get().isLoggingOut || (!get().isClientAuthenticated && !get().clientUser)) {
            return;
        }

        // Reset Zustand state IMMEDIATELY — prevents interceptors from triggering logout again
        set({
            clientUser: null,
            isClientAuthenticated: false,
            clientLoading: false,
            clientBalance: 0,
            isLoggingOut: true,
        });

        try {
            await authClient.signOut();
        } catch {
            // Silently fail logout cleanup
        }

        // Full page redirect — forces server to re-render with cleared cookies
        if (typeof window !== "undefined") {
            window.location.href = "/?_logout=1"; // cache-busting param
        }
    },

    refreshBalance: async () => {
        const [res, error] = await AuthService.fetchBalance();
        if (error) {
            // Silently fail — balance is non-critical
            return;
        }

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

        set({ clientBalance: parsed });
    },

    refreshAuth: async () => {
        if (!get().isClientAuthenticated) {
            set({ clientLoading: true });
        }

        const result = await authClient.getSession();
        const session = result?.data;

        if (session?.user) {
            const su = session.user as any;
            const betterAuthUser: ClientUser = {
                id: su.id,
                uid: su.id,
                name: su.name || "User",
                email: su.email || "",
                roles: su.role ? [su.role] : [],
                profile_picture: su.image || su.avatar,
                avatar: su.image || su.avatar,
            };
            set({
                clientUser: { ...(get().clientUser || {}), ...betterAuthUser } as ClientUser,
                isClientAuthenticated: true,
                clientLoading: false,
                isLoggingOut: false,
            });
            get().refreshBalance();
            return;
        }

        set({
            isClientAuthenticated: false,
            clientUser: null,
            clientLoading: false,
            isLoggingOut: false,
        });
    },

    updateClientUser: (data: Partial<ClientUser>) => {
        const current = get().clientUser;
        if (current) {
            set({ clientUser: { ...current, ...data } });
        }
    },
}));
