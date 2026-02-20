import axios from "axios";
import { API_ROUTES } from "./api-config";

// Use environment variable or default to localhost
const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";

export const api = axios.create({
    baseURL: BASE,
    headers: { "Content-Type": "application/json" },
    timeout: 15000,
    withCredentials: true, // Send HttpOnly cookies
});

// Request interceptor for Auth Token
api.interceptors.request.use((config) => {
    if (typeof document !== "undefined") {
        const token = document.cookie
            .split("; ")
            .find((row) => row.startsWith("agentAccessToken="))
            ?.split("=")[1];

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
});

// Handle 401 globally with refresh logic
let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: any = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// ✅ Only redirect to login if we are on a PROTECTED page, not on login itself
// Login page is "/" for agent dashboard
const isOnLoginPage = () =>
    typeof window !== "undefined" && window.location.pathname === "/";

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and NOT a retry and NOT the refresh endpoint itself
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH)
        ) {
            // ✅ Already on login page — just reject, do NOT redirect (prevents infinite loop)
            if (isOnLoginPage()) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => {
                        return api(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Attempt refresh
                await api.post(API_ROUTES.AUTH.REFRESH);

                // Refresh successful
                processQueue(null);
                isRefreshing = false;

                // Retry original request
                return api(originalRequest);
            } catch (_error) {
                // Refresh failed - logout user (only if not already on login)
                processQueue(_error, null);
                isRefreshing = false;
                if (!isOnLoginPage()) {
                    window.location.href = "/";
                }
                return Promise.reject(_error);
            }
        }

        // If 401 on refresh endpoint or retry failed -> redirect to login immediately
        if (
            error.response?.status === 401 &&
            (originalRequest._retry || originalRequest.url?.includes(API_ROUTES.AUTH.REFRESH))
        ) {
            if (!isOnLoginPage()) {
                window.location.href = "/";
            }
        }

        return Promise.reject(error);
    }
);
