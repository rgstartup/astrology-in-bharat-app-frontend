import axios from "axios";

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, "") ? `${process.env.NEXT_PUBLIC_API_URL.replace(/\/api\/v1\/?$/, "")}/api/v1` : "http://localhost:6543/api/v1",
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        // Handle global errors here (e.g., 401 Unauthorized)
        return Promise.reject(error);
    }
);
