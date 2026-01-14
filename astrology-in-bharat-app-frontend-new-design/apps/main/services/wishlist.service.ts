import axios from "axios";
import { getAuthHeaders } from "@packages/ui/src/utils/auth-utils"; // Making assumption this exists or similar

const API_Base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
const API_URL = `${API_Base.replace(/\/api\/v1\/?$/, "")}/api/v1/wishlist`;

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

// Helper to get headers (if auth-utils doesn't exist, we can implement logic here)
// For now, relying on axios interceptors or explicit token if stored. 
// Assuming the CartContext approach where token might be in cookies or handled by `withCredentials`.
// If `Authorization: Bearer` is explicitly needed:
const getHeaders = () => {
    // Check localStorage/Cookies for token if needed.
    // However, user said "Backend automatically handles user association via Auth Token".
    // Usually implies Cookie or Bearer. User message said "Auth: Requires Bearer Token".
    // So we need to retrieve the token.
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('accessToken') || localStorage.getItem('token');
        if (token) {
            return {
                Authorization: `Bearer ${token}`
            };
        }
    }
    return {};
};

export const WishlistService = {
    getWishlist: async () => {
        const response = await apiClient.get("/", { headers: getHeaders() });
        return response.data;
    },

    addToWishlist: async (productId: number) => {
        const response = await apiClient.post("/add", { productId }, { headers: getHeaders() });
        return response.data;
    },

    removeFromWishlist: async (productId: number) => {
        const response = await apiClient.delete(`/remove/${productId}`, { headers: getHeaders() });
        return response.data;
    }
};
