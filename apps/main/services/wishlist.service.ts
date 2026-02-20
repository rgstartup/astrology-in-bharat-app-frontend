import { apiClient } from "../lib/api-client";

export const WishlistService = {
    // Product Likes APIs - /api/v1/product-like
    getWishlist: async () => {
        const response = await apiClient.get('/product-like');
        return response.data;
    },

    addToWishlist: async (productId: number) => {
        const response = await apiClient.post('/product-like/add', { productId });
        return response.data;
    },

    removeFromWishlist: async (productId: number) => {
        const response = await apiClient.delete(`/product-like/remove/${productId}`);
        return response.data;
    },


    getExpertWishlist: async () => {
        const response = await apiClient.get('/expert-like');
        return response.data;
    },

    addExpertToWishlist: async (expertId: number) => {
        const response = await apiClient.post('/expert-like/add', { expertId });
        return response.data;
    },

    removeExpertFromWishlist: async (expertId: number) => {
        const response = await apiClient.delete(`/expert-like/remove/${expertId}`);
        return response.data;
    }
};


