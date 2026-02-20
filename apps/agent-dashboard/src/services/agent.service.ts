import { api } from "../lib/api";
import { API_ROUTES } from "../lib/api-routes";

// ── Profile ──────────────────────────────────────────────────────────────────
export const getAgentProfile = async () => {
    const res = await api.get(API_ROUTES.AGENTS.PROFILE);
    return res.data;
};

export const updateAgentProfile = async (formData: FormData) => {
    const res = await api.patch(API_ROUTES.AGENTS.PROFILE, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
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
    const res = await api.get(API_ROUTES.AGENTS.LISTINGS, { params });
    return res.data;
};

export const createListing = async (payload: CreateListingPayload) => {
    const res = await api.post(API_ROUTES.AGENTS.LISTINGS, payload);
    return res.data;
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
    const res = await api.post(API_ROUTES.AGENTS.REGISTER_USER, payload);
    return res.data;
};

// ── Dashboard Stats ──────────────────────────────────────────────────────────
export const getAgentDashboardStats = async () => {
    try {
        const res = await api.get(API_ROUTES.AGENTS.DASHBOARD_STATS);
        return res.data;
    } catch (error) {
        console.error("Dashboard stats endpoint not ready, returning empty data", error);
        return {
            totalListings: 0,
            activeListings: 0,
            pendingPayouts: 0,
            totalEarnings: 0,
            recentActivity: []
        };
    }
};
