import { api } from "@/src/lib/api";
import type { Agent, AgentListing, Commission } from "@/app/components/agent/agent";
import {
    MOCK_AGENTS,
    MOCK_LISTINGS,
    MOCK_COMMISSIONS,
} from "@/app/components/agent/agentMockData";

// ─── Helpers ──────────────────────────────────────────────────────────────────
/**
 * When the real API is ready, replace the mock return with the api.* call.
 * Keeping both here so switching is a one-liner.
 */

// ─── Agents ───────────────────────────────────────────────────────────────────
export const getAgents = async (params?: {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
}) => {
    const res = await api.get("/admin/agents", {
        params: {
            page: params?.page,
            limit: params?.limit,
            search: params?.search,
            status: params?.status === "" ? undefined : params?.status
        }
    });
    return res.data; // Expected { data: Agent[], total: number }
};

export const getAgentStats = async () => {
    const res = await api.get("/admin/agents/stats");
    return res.data; // Expected { totalAgents: number, activeAgents: number, ... }
};

export const getAgentById = async (id: string | number) => {
    const res = await api.get(`/admin/agents/${id}`);
    return res.data as Agent;
};

export const createAgent = async (formData: FormData) => {
    const res = await api.post("/admin/agents", formData, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    return res.data;
};

export const updateAgentStatus = async (
    id: string | number,
    status: Agent["status"]
) => {
    const res = await api.patch(`/admin/agents/${id}`, { status });
    return res.data;
};

// ─── OTP Verification ─────────────────────────────────────────────────────────
export const sendAgentOtp = async (email: string) => {
    const res = await api.post("/admin/agents/send-otp", { email });
    return res.data;
};

export const verifyAgentOtp = async (email: string, otp: string) => {
    const res = await api.post("/admin/agents/verify-otp", { email, otp });
    return res.data;
};

// ─── Listings ─────────────────────────────────────────────────────────────────
export const getListingsByAgent = async (agent_id: string) => {
    const res = await api.get(`/admin/agents/${agent_id}/listings`);
    return res.data as AgentListing[];
};

export const getAllListings = async (params?: {
    type?: string;
    search?: string;
}) => {
    const res = await api.get("/admin/listings", {
        params: {
            type: params?.type === "" ? undefined : params?.type,
            search: params?.search
        }
    });
    return res.data;
};

// ─── Commissions ──────────────────────────────────────────────────────────────
export const getCommissions = async (params?: {
    agent_id?: string;
    status?: string;
}) => {
    const res = await api.get("/admin/commissions", { params });
    return res.data;
};

export const markCommissionPaid = async (id: number) => {
    const res = await api.patch(`/admin/commissions/${id}/pay`);
    return res.data;
};
