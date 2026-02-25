import { create } from 'zustand';
import apiClient from '@/lib/apiClient';
import { astrologerLogoutAction } from '@/src/actions/auth';

interface User {
    id: number;
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
        try {
            const res: any = await apiClient.get('/expert');
            const payload = res?.data ?? res;
            if (payload) {
                const fullUserData = {
                    ...payload.user,
                    ...payload,
                    profileId: payload.id,
                    userId: payload.userId || payload.user?.id,
                    // Normalize snake_case to camelCase for frontend compatibility
                    kycStatus: payload.kyc_status || payload.kycStatus || payload.status,
                    rejectionReason: payload.rejection_reason || payload.rejectionReason,
                    isAvailable: payload.is_available !== undefined ? payload.is_available : payload.isAvailable,
                    experienceInYears: payload.experience_in_years || payload.experienceInYears,
                    phoneNumber: payload.phone_number || payload.phoneNumber || payload.user?.phone_number || payload.user?.phoneNumber,
                    totalReviews: payload.total_reviews || payload.totalReviews,
                    totalLikes: payload.total_likes || payload.totalLikes,
                    consultationCount: payload.consultation_count || payload.consultationCount,
                    profilePic: payload.avatar || payload.user?.avatar || payload.profilePic || payload.user?.profilePic,
                };
                set({ user: fullUserData });
            } else if (userData) {
                set({ user: userData });
            }
        } catch (err) {
            console.error("Error fetching expert profile after login:", err);
            if (userData) set({ user: userData });
        }
    },

    logout: async () => {
        set({ user: null, isAuthenticated: false });
        await astrologerLogoutAction();
    },

    refreshAuth: async () => {
        try {
            console.log("[AuthStore] Refreshing auth...");
            const res: any = await apiClient.get('/expert');
            const payload = res?.data ?? res;
            if (payload && (payload.id || payload.user)) {
                console.log("[AuthStore] Auth refresh success, expert found");
                const fullUserData = {
                    ...payload.user,
                    ...payload,
                    profileId: payload.id,
                    userId: payload.userId || payload.user?.id,
                    // Normalize snake_case to camelCase for frontend compatibility
                    kycStatus: payload.kyc_status || payload.kycStatus || payload.status,
                    rejectionReason: payload.rejection_reason || payload.rejectionReason,
                    isAvailable: payload.is_available !== undefined ? payload.is_available : payload.isAvailable,
                    experienceInYears: payload.experience_in_years || payload.experienceInYears,
                    phoneNumber: payload.phone_number || payload.phoneNumber || payload.user?.phone_number || payload.user?.phoneNumber,
                    totalReviews: payload.total_reviews || payload.totalReviews,
                    totalLikes: payload.total_likes || payload.totalLikes,
                    consultationCount: payload.consultation_count || payload.consultationCount,
                    profilePic: payload.avatar || payload.user?.avatar || payload.profilePic || payload.user?.profilePic,
                };
                set({ user: fullUserData, isAuthenticated: true, loading: false });
            } else {
                console.warn("[AuthStore] Auth refresh: No expert data in response", payload);
                set({ loading: false, isAuthenticated: false, user: null });
            }
        } catch (err: any) {
            const status = err?.status ?? err?.response?.status;
            if (status !== 401) {
                console.error("Auth refresh error:", err);
            }
            set({ loading: false, isAuthenticated: false, user: null });
        }
    },

    setUser: (user: User | null) => {
        set({ user });
    },
}));
