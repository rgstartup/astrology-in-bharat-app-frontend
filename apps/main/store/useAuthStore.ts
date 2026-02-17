
import { create } from "zustand";
import { AuthService, ClientUser } from "../services/auth.service";
import { setCookie, deleteCookie } from "../utils/cookie";

interface AuthState {
    clientUser: ClientUser | null;
    clientBalance: number;
    clientLoading: boolean;
    isClientAuthenticated: boolean;

    // Actions
    clientLogin: (token: string, userData?: ClientUser) => void;
    clientLogout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    refreshBalance: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    clientUser: null,
    clientBalance: 0,
    clientLoading: true,
    isClientAuthenticated: false,

    clientLogin: (newToken: string, userData?: ClientUser) => {
        setCookie('clientAccessToken', newToken);
        if (userData) {
            set({ clientUser: userData });
        }
        set({ isClientAuthenticated: true });
        get().refreshBalance();
        // Trigger generic refresh to load profile if missing
        if (!userData) {
            get().refreshAuth();
        }
    },

    clientLogout: async () => {
        console.log("🚪 Starting logout process...");

        try {
            // 1. Call server action to clear httpOnly cookies
            const { logoutAction } = await import("../actions/auth");
            await logoutAction();

            // 2. Clear backend session (optional)
            await AuthService.logout();
            console.log("✅ Logout successful");
        } catch (err) {
            console.error("❌ Logout error:", err);
        }

        // 3. Reset local state
        set({
            clientUser: null,
            isClientAuthenticated: false,
            clientLoading: false,
            clientBalance: 0
        });

        if (typeof window !== 'undefined') {
            window.location.href = '/';
        }
    },

    refreshBalance: async () => {
        try {
            const balance = await AuthService.fetchBalance();
            set({ clientBalance: balance });
        } catch (err) {
            console.error("❌ Error fetching balance:", err);
        }
    },

    refreshAuth: async () => {
        // Only set loading if not already authenticated to avoid flickering
        if (!get().isClientAuthenticated) {
            set({ clientLoading: true });
        }

        try {
            const res = await AuthService.fetchProfile();
            console.log("📊 Profile response:", res.data);

            if (res.status === 200) {
                let user: ClientUser | null = null;

                if (res.data && res.data.user) {
                    user = res.data.user;
                } else if (res.data && res.data.id) {
                    user = {
                        id: res.data.user?.id || res.data.id,
                        name: res.data.user?.name || res.data.full_name,
                        email: res.data.user?.email,
                        roles: res.data.user?.roles || [],
                        avatar: res.data.user?.avatar || res.data.profile_picture
                    };
                } else {
                    // Minimal user object
                    user = {
                        id: 0,
                        name: "User",
                        email: "",
                        roles: []
                    };
                }

                set({
                    clientUser: user,
                    isClientAuthenticated: true
                });

                // Fetch balance after successful auth
                get().refreshBalance();
            } else {
                set({
                    isClientAuthenticated: false,
                    clientUser: null
                });
            }
        } catch (err: any) {
            console.error("❌ Refresh auth error:", err);

            // If 401 (Unauthorized) OR if we were trying to authenticate initially and failed
            // We should clear the corrupted state/cookies to allow re-login.
            if (err.response?.status === 401 || !get().isClientAuthenticated) {
                console.log("⚠️ Auth verification failed. Clearing session.");
                set({ isClientAuthenticated: false, clientUser: null });
                deleteCookie('clientAccessToken');
                // Also optionally clear refreshToken if needed, but clientAccessToken is the gatekeeper
            } else if (err.response?.status === 404) {
                // Profile not found but authenticated
                set({
                    isClientAuthenticated: true,
                    clientUser: {
                        id: 0,
                        name: "New Cosmic Explorer",
                        email: "",
                        roles: []
                    }
                });
            }
            // Other errors (e.g. 500, network) -> Keep previous state if it was authenticated, 
            // but if we were unauthenticated, we remain so (and cleared cookie above).
        } finally {
            set({ clientLoading: false });
        }
    }
}));
