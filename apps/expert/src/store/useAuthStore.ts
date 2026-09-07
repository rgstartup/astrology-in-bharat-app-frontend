import { create } from 'zustand';
import { api } from '@/lib/api';
import { expertLogoutAction } from '@/actions/auth';

interface User {
    id: string;
    name?: string;
    email?: string;
    roles?: string[];
    is_available?: boolean;
    [key: string]: any;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (token: string, userData?: User) => Promise<void>;
    logout: () => Promise<void>;
    refreshAuth: () => Promise<void>;
    setUser: (user: User | null) => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
    user: null,
    isAuthenticated: false,
    loading: true,

    login: async (newToken: string, userData?: User) => {
        // Token is already set as httpOnly cookie by server action
        set({ isAuthenticated: true, loading: false });

        // Fetch full profile
        const [res, error] = await api.get<any>('/expert');
        
        if (error) {
            console.error("Error fetching expert profile after login:", error);
            if (userData) set({ user: userData });
            return;
        }

        const payload = res?.data ?? res;
        if (payload) {
            const fullUserData = {
                ...payload.user,
                ...payload,
                profileId: payload.id,
                userId: payload.user_id || payload.user?.id || 0,
                kycStatus: payload.kyc_status || payload.status || "pending",
                rejectionReason: payload.rejection_reason || "",
                isAvailable: payload.is_available ?? false,
                experienceInYears: payload.experience_in_years || 0,
                phoneNumber: payload.phone_number || payload.user?.phone_number || "",
                totalReviews: payload.total_reviews || 0,
                totalLikes: payload.total_likes || 0,
                consultationCount: payload.consultation_count || 0,
                profilePic: payload.avatar || payload.user?.avatar || "",
            };
            set({ user: fullUserData });
        } else if (userData) {
            set({ user: userData });
        }
    },

    logout: async () => {
        const user = get().user;
        const actualUserId = user?.userId || user?.id;
        
        if (actualUserId) {
            const { socket } = await import('@/lib/socket');
            socket.emit("expert_offline", { userId: actualUserId });
        }

        set({ user: null, isAuthenticated: false });
        await expertLogoutAction();
    },

    refreshAuth: async () => {
        set({ loading: true });
        
        const [res, error] = await api.get<any>('/expert');
        
        if (error) {
            const status = error.status;
            if (status !== 401) {
                console.error("Auth refresh error:", error);
            }
            set({ loading: false, isAuthenticated: false, user: null });
            return;
        }

        const payload = res?.data ?? res;
        if (payload && (payload.id || payload.user)) {
            const fullUserData = {
                ...payload.user,
                ...payload,
                profileId: payload.id,
                userId: payload.user_id || payload.user?.id || 0,
                kycStatus: payload.kyc_status || payload.status || "pending",
                rejectionReason: payload.rejection_reason || "",
                isAvailable: payload.is_available ?? false,
                experienceInYears: payload.experience_in_years || 0,
                phoneNumber: payload.phone_number || payload.user?.phone_number || "",
                totalReviews: payload.total_reviews || 0,
                totalLikes: payload.total_likes || 0,
                consultationCount: payload.consultation_count || 0,
                profilePic: payload.avatar || payload.user?.avatar || "",
            };
            set({ user: fullUserData, isAuthenticated: true, loading: false });
        } else {
            console.warn("[AuthStore] Auth refresh: No expert data in response", payload);
            set({ loading: false, isAuthenticated: false, user: null });
        }
    },


    setUser: (user: User | null) => {
        set({ user });
    },
}));
