import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "react-toastify";
import { api } from "@/actions";
import { AuthService } from "@/services/auth.service";
import type { Client } from "@repo/lib";
import { getProfileImageUrl } from "@/utils/image-utils";

interface AuthState {
  user: (Client & Record<string, any>) | null;
  balance: number;
  loading: boolean;
  isAuthenticated: boolean;
  isInitialized: boolean;
  showImageModal: boolean;

  // Actions
  init: (force?: boolean) => Promise<void>;
  login: (userData?: any) => void;
  logout: (redirectUrl?: string) => Promise<string>;
  refreshAuth: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  updateUser: (data: Partial<Client> & Record<string, any>) => void;
  closeImageModal: () => void;
  openImageModal: () => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      balance: 0,
      loading: true,
      isAuthenticated: false,
      isInitialized: false,
      showImageModal: false,

      init: async (force: boolean = false) => {
        if (get().isInitialized && !force) return;

        const [client, error] = await AuthService.fetchProfile();

        if (error || !client) {
          get().reset();

          if ((error as any)?.status === 401) {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
            } catch {
              // ignore
            }
          }
          return;
        }

        set({
          user: {
            ...client,
            avatar: getProfileImageUrl(client.avatar, client.name),
          },
          loading: false,
          isAuthenticated: true,
          isInitialized: true,
        });
      },

      login: (userData?: Client) => {
        if (userData) {
          set({
            user: {
              ...userData,
              avatar: getProfileImageUrl(userData.avatar, userData.name),
            },
            isAuthenticated: true,
            loading: false,
            isInitialized: true,
          });
        } else {
          set({
            isAuthenticated: true,
            loading: false,
            isInitialized: true,
          });
        }
        get().refreshBalance();
      },

      logout: async (redirectUrl?: string) => {
        get().reset();
        set({ loading: true });
        await api.post("/auth/logout");

        await fetch("/api/auth/logout", { method: "POST" });

        set({ loading: false });
        redirectUrl ||= "/?_logout=1";
        return redirectUrl;
      },

      refreshAuth: async () => {
        await get().init(true);
      },

      refreshBalance: async () => {
        const [res, error] = await api.get<any>("/wallet/balance");
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

      updateUser: (data: Partial<Client>) => {
        const current = get().user;

        if (current) {
          const updatedUser = {
            ...current,
            ...data,
          };

          set({
            user: {
              ...updatedUser,
              avatar: getProfileImageUrl(updatedUser.avatar, updatedUser.name),
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
    }),
    {
      name: "astrology-auth-storage",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const useAuth = useAuthStore;
