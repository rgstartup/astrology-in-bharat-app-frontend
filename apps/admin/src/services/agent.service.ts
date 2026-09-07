import { api } from "@/lib/api";
import type { Agent, AgentListing, Commission, AgentStats } from "@/app/components/agent/agent";
import {
    MOCK_AGENTS,
    MOCK_LISTINGS,
    MOCK_COMMISSIONS,
} from "@/app/components/agent/agentMockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * Normalizes agent data from the backend format to the frontend Agent interface.
 */
const normalizeAgent = (raw: any): Agent => {
    if (!raw) return raw;

    let addressVal = "";
    let cityVal = "";
    let stateVal = "";

    if (raw.address) {
        if (typeof raw.address === "object") {
            addressVal = raw.address.address || "";
            cityVal = raw.address.city || "";
            stateVal = raw.address.state || "";
        } else {
            addressVal = String(raw.address);
        }
    }

    return {
        ...raw,
        address: addressVal || undefined,
        city: cityVal || raw.city || undefined,
        state: stateVal || raw.state || undefined,
        aadhaar_no: raw.kyc?.aadhaar_no || raw.aadhaar_no,
        pan_no: raw.kyc?.pan_no || raw.pan_no,
        aadhaar_doc: raw.kyc?.aadhaar_doc || raw.aadhaar_doc,
        pan_doc: raw.kyc?.pan_doc || raw.pan_doc,
        created_at: raw.created_at || raw.createdAt || new Date().toISOString(),
    };
};

// ─── Agents ───────────────────────────────────────────────────────────────────
export const getAgents = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    const [data, error] = await api.get<{ data: Agent[]; total: number }>("/admin/agents", {
        params: {
            page: params?.page,
            limit: params?.limit,
            search: params?.search,
            status: params?.status === "" ? undefined : params?.status
        }
    });
    if (error) throw error;

    return {
        data: (data?.data || []).map(normalizeAgent),
        total: data?.total || 0
    } as { data: Agent[]; total: number };
};

export const getAgentStats = async () => {
    const [data, error] = await api.get<AgentStats>("/admin/agents/stats");
    if (error) throw error;
    return data as AgentStats;
};

export const getAgentById = async (id: string) => {
    const [data, error] = await api.get<Agent>(`/admin/agents/${id}`);
    if (error) throw error;
    return normalizeAgent(data);
};

export const createAgent = async (formData: FormData) => {
    const [data, error] = await api.upload<any>("/admin/agents", formData);
    if (error) throw error;
    return data;
};

export const updateAgentStatus = async (
    id: string,
    status: Agent["status"]
) => {
    const [data, error] = await api.patch<any>(`/admin/agents/${id}`, { status });
    if (error) throw error;
    return data;
};

// ─── OTP Verification ─────────────────────────────────────────────────────────
export const sendAgentOtp = async (email: string) => {
    const [data, error] = await api.post<any>("/admin/agents/send-otp", { email });
    if (error) throw error;
    return data;
};

export const verifyAgentOtp = async (email: string, otp: string) => {
    const [data, error] = await api.post<any>("/admin/agents/verify-otp", { email, otp });
    if (error) throw error;
    return data;
};

// ─── Listings ─────────────────────────────────────────────────────────────────
export const getListingsByAgent = async (agent_id: string) => {
    const [data, error] = await api.get<AgentListing[]>(`/admin/agents/${agent_id}/listings`);
    if (error) throw error;
    return data as AgentListing[];
};

export const getAllListings = async (params?: {
    type?: string;
    search?: string;
    page?: number;
    limit?: number;
}) => {
    const [data, error] = await api.get<{ data: AgentListing[]; total: number; stats: any }>("/admin/listings", {
        params: {
            type: params?.type === "" ? undefined : params?.type,
            search: params?.search,
            page: params?.page,
            limit: params?.limit
        }
    });
    if (error) throw error;
    return data;
};

export const updateListingStatus = async (
    id: string,
    status: "approved" | "rejected" | "pending",
    reason?: string
) => {
    const [data, error] = await api.patch<any>(`/admin/listings/${id}/status`, { status, reason });
    if (error) throw error;
    return data;
};

// ─── Commissions ──────────────────────────────────────────────────────────────
export const getCommissions = async (params?: {
    agent_id?: string;
    status?: string;
}) => {
    const [data, error] = await api.get<{ data: Commission[] }>("/admin/commissions", { params });
    if (error) throw error;
    return data as { data: Commission[] };
};

export const markCommissionPaid = async (id: string) => {
    const [data, error] = await api.patch<any>(`/admin/commissions/${id}/pay`);
    if (error) throw error;
    return data;
};

// ─── Self-Registered Merchants ────────────────────────────────────────────────
export const getAdminMerchantProfiles = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    const [data, error] = await api.get<{ merchants: any[]; total: number }>("/admin/merchants", {
        params: {
            page: params?.page || 1,
            limit: params?.limit || 10,
            search: params?.search,
            status: params?.status === "" ? undefined : params?.status
        }
    });
    if (error) throw error;
    // Return unified structure
    return {
        data: (data as any)?.merchants || (data as any)?.data || [],
        total: (data as any)?.total || 0
    };
};

export const updateMerchantProfileStatus = async (
    id: string,
    status: string
) => {
    const [data, error] = await api.patch<any>(`/admin/merchants/${id}/status`, { status });
    if (error) throw error;
    return data;
};
