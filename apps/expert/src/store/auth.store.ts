import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';
import { expertLogoutAction } from '@/actions/auth';

export interface ExpertUser {
  id?: number | string;
  public_id?: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone_number?: string;
  phoneNumber?: string;
  roles?: string[];
  is_available?: boolean;
  isAvailable?: boolean;
  profileId?: number | string;
  userId?: number | string;
  kycStatus?: string;
  rejectionReason?: string;
  experienceInYears?: number;
  totalReviews?: number;
  totalLikes?: number;
  consultationCount?: number;
  avatar?: string;
  profilePic?: string;
  [key: string]: any;
}

export interface AuthState {
  user: ExpertUser | null;
  isAuthenticated: boolean;
  loading: boolean;
  isInitialized: boolean;

  // Actions
  init: (force?: boolean) => Promise<void>;
  login: (tokenOrUserData?: string | ExpertUser | null, maybeUserData?: ExpertUser) => Promise<void>;
  logout: (redirectUrl?: string) => Promise<string>;
  refreshAuth: () => Promise<void>;
  setUser: (user: ExpertUser | null) => void;
  updateUser: (data: Partial<ExpertUser>) => void;
  reset: () => void;
}

function normalizeExpertData(payload: any): ExpertUser {
  if (!payload) return {} as ExpertUser;

  const userData = payload.user || {};
  const combined = { ...userData, ...payload };

  return {
    ...combined,
    profileId: payload.id ?? combined.profileId,
    userId: payload.user_id || payload.userId || userData.id || combined.id || 0,
    kycStatus: payload.kyc_status || payload.status || combined.kycStatus || 'pending',
    rejectionReason: payload.rejection_reason || combined.rejectionReason || '',
    isAvailable: payload.is_available ?? combined.isAvailable ?? false,
    experienceInYears: payload.experience_in_years || combined.experienceInYears || 0,
    phoneNumber: payload.phone_number || userData.phone_number || combined.phoneNumber || '',
    totalReviews: payload.total_reviews || combined.totalReviews || 0,
    totalLikes: payload.total_likes || combined.totalLikes || 0,
    consultationCount: payload.consultation_count || combined.consultationCount || 0,
    profilePic: payload.avatar || userData.avatar || combined.profilePic || '',
    avatar: payload.avatar || userData.avatar || combined.avatar || '',
  };
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

        const [res, error] = await api.get<any>('/expert');

        if (error || !res) {
          get().reset();

          if (error?.status === 401 && typeof window !== 'undefined') {
            try {
              await fetch('/api/auth/logout', { method: 'POST' });
            } catch {
              // ignore
            }
          }
          return;
        }

        const payload = res?.data ?? res;
        if (payload && (payload.id || payload.user)) {
          const fullUserData = normalizeExpertData(payload);
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

      login: async (tokenOrUserData?: string | ExpertUser | null, maybeUserData?: ExpertUser) => {
        let directUserData: ExpertUser | null = null;

        if (typeof tokenOrUserData === 'string') {
          directUserData = maybeUserData || null;
        } else if (tokenOrUserData && typeof tokenOrUserData === 'object') {
          directUserData = tokenOrUserData;
        }

        if (directUserData) {
          const normalized = normalizeExpertData(directUserData);
          set({
            user: normalized,
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

        // Background profile sync
        const [res, error] = await api.get<any>('/expert');
        if (!error && res) {
          const payload = res?.data ?? res;
          if (payload && (payload.id || payload.user)) {
            const fullUserData = normalizeExpertData(payload);
            set({ user: fullUserData });
          }
        }
      },

      logout: async (redirectUrl?: string) => {
        const user = get().user;
        const actualUserId = user?.userId || user?.id;

        if (actualUserId) {
          try {
            const { socket } = await import('@/lib/socket');
            socket.emit('expert_offline', { userId: String(actualUserId) });
          } catch {
            // ignore socket errors on logout
          }
        }

        get().reset();
        set({ loading: true });

        try {
          await expertLogoutAction();
        } catch {
          // ignore
        }

        try {
          await api.post('/auth/logout');
        } catch {
          // ignore
        }

        try {
          await fetch('/api/auth/logout', { method: 'POST' });
        } catch {
          // ignore
        }

        set({ loading: false });

        const target = redirectUrl || '/?_logout=1';
        return target;
      },

      refreshAuth: async () => {
        await get().init(true);
      },

      setUser: (user: ExpertUser | null) => {
        set({
          user: user ? normalizeExpertData(user) : null,
          isAuthenticated: Boolean(user),
        });
      },

      updateUser: (data: Partial<ExpertUser>) => {
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
      name: 'aib-expert-auth-storage',
      partialize: (state) => ({
        user: state.user
          ? {
              id: state.user.id,
              userId: state.user.userId,
              profileId: state.user.profileId,
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
    }
  )
);

export const authStore = useAuthStore;
export default useAuthStore;
