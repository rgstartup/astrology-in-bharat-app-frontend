import { api } from "../lib/api";

// ── Profile ──────────────────────────────────────────────────────────────────
export const getAgentProfile = async () => {
    const res = await api.get("/agent/profile");
    return res.data;
};

export const updateAgentProfile = async (formData: FormData) => {
    const res = await api.patch("/agent/profile", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

// ── Listings ─────────────────────────────────────────────────────────────────
export interface ListingParams {
    page?: number;
    limit?: number;
    type?: string; // 'astrologer', 'mandir', 'puja_shop'
    search?: string;
}

export const getAgentListings = async (params?: ListingParams) => {
    const res = await api.get("/agent/listings", { params });
    return res.data;
};

export const createListing = async (formData: FormData) => {
    const res = await api.post("/agent/listings", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

// ── Dashboard Stats ──────────────────────────────────────────────────────────
export const getAgentDashboardStats = async () => {
    const res = await api.get("/agent/dashboard/stats");
    return res.data;
};
