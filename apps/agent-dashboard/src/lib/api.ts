import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
    withCredentials: true,
});

// Auto-attach agent JWT token from localStorage
api.interceptors.request.use((config) => {
    if (typeof window !== "undefined") {
        try {
            const raw = localStorage.getItem("agent-auth");
            if (raw) {
                const { state } = JSON.parse(raw);
                if (state?.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
            }
        } catch {
            // ignore parse errors
        }
    }
    return config;
});
