import { api } from "../lib/api";

export const agentLoginAction = async (data: any) => {
    try {
        const response = await api.post("/agent/login", data);
        if (response.data.success) {
            return {
                success: true,
                user: response.data.agent,
                token: response.data.token
            };
        }
        return { success: false, error: "Unexpected response from server" };
    } catch (error: any) {
        console.error("Agent Login Error:", error);
        return {
            success: false,
            error: error.response?.data?.message || "Invalid credentials or server error"
        };
    }
};

export const agentRefreshAction = async () => {
    try {
        const response = await api.post("/agent/refresh");
        return response.data;
    } catch (error) {
        return { success: false };
    }
};
