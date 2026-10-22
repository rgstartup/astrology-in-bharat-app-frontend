import { create } from "zustand";
import { persist } from "zustand/middleware";
import { apiV2, API_ROUTES } from "@/actions";
import { getMeAction, getWalletBalanceAction } from "@/actions/auth";
import type { Client, ClientWallet } from "@repo/lib";

export interface IAuthUser extends Client {
  wallet?: ClientWallet;
  [key: string]: any;
}

interface AuthState {
  user: IAuthUser | null;
  balance: number;
  loading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  showImageModal: boolean;

  // Actions
  setInitialUser: (user: IAuthUser | null) => void;
  init: (force?: boolean) => Promise<void>;
  login: (userData?: any) => void;
  logout: (redirectUrl?: string) => Promise<string>;
  refreshAuth: () => Promise<void>;

  /**
   * @deprecated
   */
  refreshBalance: () => Promise<void>;

  updateBalance: (balance: number) => void;
  updateUser: (data: Partial<IAuthUser>) => void;
  closeImageModal: () => void;
  openImageModal: () => void;
  reset: () => void;
}

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      balance: 0,
      loading: true,
      isAuthenticated: false,
      isInitialized: false,
      showImageModal: false,

      setInitialUser: (user: IAuthUser | null) => {
        if (user && (user.id || user.public_id)) {
          set({
            user,
            isAuthenticated: true,
            loading: false,
            isInitialized: true,
            balance: Number(user.wallet?.balance) || 0,
          });
          return;
        }

        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          isInitialized: true,
          balance: 0,
        });
      },

      init: async (force: boolean = false) => {
        if (get().isInitialized && !force) return;

        const wasAuthenticated = get().isAuthenticated;
        const result = await getMeAction();

        if (!result.ok) {
          get().reset();

          if (result.error.status === 401) {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
            } catch {
              // ignore
            }
          }

          // Session died mid-use (not a logged-out visitor on a public
          // page): hard-navigate so cookies, store, and URL all reset
          // together. The initializer consumes `logout=1` and strips it.
          if (
            wasAuthenticated &&
            result.error.status === 401 &&
            typeof window !== "undefined"
          ) {
            window.location.href = "/login?logout=1";
          }
          return;
        }

        const payload = result.data;
        if (payload && (payload.id || payload.public_id)) {
          set({
            user: payload,
            isAuthenticated: true,
            loading: false,
            isInitialized: true,
            balance: Number(payload.wallet?.balance) || 0,
          });
        } else {
          get().reset();
        }
      },

      login: (userData?: any) => {
        if (userData) {
          set({
            user: userData,
            isAuthenticated: true,
            loading: false,
            isInitialized: true,
            balance: Number(userData.wallet?.balance) || 0,
          });
        } else {
          get().init(true);
        }
      },

      logout: async (redirectUrl?: string) => {
        get().reset();
        set({ loading: true });

        try {
          await fetch("/api/auth/logout", { method: "POST" });
        } catch {
          // ignore
        }

        try {
          await apiV2.post(API_ROUTES.AUTH.LOGOUT);
        } catch {
          // ignore
        }

        set({ loading: false });

        const target = redirectUrl || "/?_logout=1";
        return target;
      },

      refreshAuth: async () => {
        await get().init(true);
      },

      refreshBalance: async () => {
        const result = await getWalletBalanceAction();
        if (result.ok && result.data) {
          get().updateBalance(result.data.balance);
        }
      },

      updateUser: (data: Partial<IAuthUser>) => {
        const current = get().user;
        if (current) {
          set({
            user: {
              ...current,
              ...data,
            },
          });
        }
      },

      closeImageModal: () => {
        set({ showImageModal: false });
      },

      openImageModal: () => {
        set({ showImageModal: true });
      },

      reset: () => {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          isInitialized: false,
          balance: 0,
        });
      },

      updateBalance: (balance: number) => {
        set({ balance: Number(balance) || 0 });
      },
    }),
    {
      name: "astrology-auth-storage",
      partialize: (state) => ({
        user: state.user
          ? {
              public_id: state.user.public_id,
              first_name: state.user.first_name,
              last_name: state.user.last_name,
              email: state.user.email,
              avatar_media: {
                id: state.user.avatar_media?.id,
                url: state.user.avatar_media?.url,
              },
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useAuthStore = authStore;
export const useAuth = authStore;
export default authStore;
