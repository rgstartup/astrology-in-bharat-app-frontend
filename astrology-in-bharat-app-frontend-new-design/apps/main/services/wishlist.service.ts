import axios from "axios";
// import { getAuthHeaders } from "@packages/ui/src/utils/auth-utils"; // Removed unused import to fix lint error


const API_Base = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
// Base URL handled dynamically in methods


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
    // Product Likes APIs - /api/v1/product-like
    getWishlist: async () => {
        const response = await axios.get(`${API_Base}/api/v1/product-like`, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data;
    },

    addToWishlist: async (productId: number) => {
        const response = await axios.post(`${API_Base}/api/v1/product-like/add`, { productId }, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data;
    },

    removeFromWishlist: async (productId: number) => {
        const response = await axios.delete(`${API_Base}/api/v1/product-like/remove/${productId}`, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data;
    },

    // Expert Likes APIs - /api/v1/expert-like
    getExpertWishlist: async () => {
        const response = await axios.get(`${API_Base}/api/v1/expert-like`, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data;
    },

    addExpertToWishlist: async (expertId: number) => {
        const response = await axios.post(`${API_Base}/api/v1/expert-like/add`, { expertId }, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data;
    },

    removeExpertFromWishlist: async (expertId: number) => {
        const response = await axios.delete(`${API_Base}/api/v1/expert-like/remove/${expertId}`, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data;
    }
};
