import apiClient from "../lib/api-client";
import { API_ROUTES } from "../lib/api-routes";

// ── Profile ──────────────────────────────────────────────────────────────────
export const getAgentProfile = async () => {
    return apiClient.get(API_ROUTES.AGENTS.PROFILE);
};

export const updateAgentProfile = async (formData: FormData) => {
    return apiClient.patch(API_ROUTES.AGENTS.PROFILE, formData);
};

// ── Listings ─────────────────────────────────────────────────────────────────
export interface ListingParams {
    page?: number;
    limit?: number;
    type?: string; // 'astrologer' | 'mandir' | 'puja_shop'
    search?: string;
}

export interface CreateListingPayload {
    type: "mandir" | "astrologer" | "puja_shop";
    name: string;
    location?: string;
    phone?: string;
    deity?: string;          // mandir
    specialization?: string; // astrologer
    items?: string;          // puja_shop
}

export const getAgentListings = async (params?: ListingParams) => {
    return apiClient.get(API_ROUTES.AGENTS.LISTINGS, params as Record<string, any>);
};

export const createListing = async (payload: CreateListingPayload) => {
    return apiClient.post(API_ROUTES.AGENTS.LISTINGS, payload as Record<string, any>);
};

// ── Register User/Expert ─────────────────────────────────────────────────────
export interface RegisterUserPayload {
    name: string;
    email: string;
    phone: string;
    userType: "expert" | "client";
}

export interface RegisterUserResponse {
    success: boolean;
    message: string;
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        referredByAgentId: string;
    };
    tempPassword: string; // ⚠️ Show once only — never store
}

export const registerUserByAgent = async (payload: RegisterUserPayload): Promise<RegisterUserResponse> => {
    return apiClient.post<RegisterUserResponse>(API_ROUTES.AGENTS.REGISTER_USER, payload as Record<string, any>);
};

// ── Dashboard Stats ──────────────────────────────────────────────────────────
export const getAgentDashboardStats = async () => {
    try {
        return await apiClient.get(API_ROUTES.AGENTS.DASHBOARD_STATS);
    } catch {
        return {
            totalListings: 0,
            activeListings: 0,
            pendingPayouts: 0,
            totalEarnings: 0,
            recentActivity: []
        };
    }
};
