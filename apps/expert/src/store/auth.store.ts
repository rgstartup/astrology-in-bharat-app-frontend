import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "@/actions/api";
import { expertLogoutAction } from "@/actions/auth";
import { type IExpert } from "@repo/lib";
import { API_ROUTES } from "@/utils/api.routes";
import { getActiveConsultationId, endConsultation } from "@/realtime/topics/consultation";

export interface AuthState {
  user: IExpert | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean;

  // Actions
  init: (force?: boolean) => Promise<void>;
  logout: (redirectUrl?: string) => Promise<string>;
  refreshAuth: () => Promise<void>;
  setUser: (user: IExpert | null) => void;
  updateUser: (data: Partial<IExpert>) => void;
  reset: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      loading: true,
      isInitialized: false,

      init: async (force: boolean = false) => {
        if (get().isInitialized && !force) return;

        set({ loading: true });

        const wasAuthenticated = get().isAuthenticated;
        const result = await api.get<IExpert>(API_ROUTES.ACCOUNT.ROOT);

        if (!result.ok) {
          get().reset();

          if (result.error?.status === 401 && typeof window !== "undefined") {
            try {
              await fetch("/api/auth/logout", { method: "POST" });
            } catch {
              // ignore
            }

            // Session died mid-use: hard-navigate so cookies, store, and
            // URL all reset together. The provider consumes `logout=1`.
            if (wasAuthenticated) {
              window.location.href = "/login?logout=1";
            }
          }
          return;
        }

        const payload = result.data;
        if (payload && (payload.id || payload.user)) {
          const fullUserData = payload;
          set({
            user: fullUserData,
            isAuthenticated: true,
            loading: false,
            isInitialized: true,
          });
        } else {
          get().reset();
        }
      },

      logout: async (redirectUrl?: string) => {
        // An auth logout must not leave a live consultation running — end it
        // server-side before the auth state resets and redirects away.
        const consultationId = getActiveConsultationId();
        if (consultationId) {
          endConsultation(consultationId, "expert_disconnected").catch(() => undefined);
        }

        const user = get().user;
        const actualUserId = user?.userId || user?.id;

        try {
          const { stopPresenceHeartbeat } = await import("@/realtime/topics/presence");
          const { disconnectRealtimeSocket } = await import("@/realtime/socket");
          const {
            disconnectChatSocket,
            disconnectCallSocket,
            disconnectNotificationSocket,
          } = await import("@/lib/socket");
          stopPresenceHeartbeat();
          disconnectRealtimeSocket();
          disconnectChatSocket();
          disconnectCallSocket();
          disconnectNotificationSocket();
        } catch {
          // ignore socket errors on logout
        }

        get().reset();
        set({ loading: true });

        try {
          await expertLogoutAction();
        } catch {
          // ignore
        }

        try {
          await api.post(API_ROUTES.AUTH.LOGOUT);
        } catch {
          // ignore
        }

        try {
          await fetch("/api/auth/logout", { method: "POST" });
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

      setUser: (user: IExpert | null) => {
        set({
          user,
          isAuthenticated: Boolean(user),
        });
      },

      updateUser: (data: Partial<IExpert>) => {
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

      reset: () => {
        set({
          user: null,
          isAuthenticated: false,
          loading: false,
          isInitialized: true,
        });
      },
    }),
    {
      name: "aib-expert-auth-storage",
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              userId: state.user.userId,
              name: state.user.name,
              email: state.user.email,
              avatar: state.user.avatar,
              profilePic: state.user.profilePic,
              isAvailable: state.user.isAvailable,
              kycStatus: state.user.kycStatus,
            }
          : null,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);

export const authStore = useAuthStore;
export default useAuthStore;
