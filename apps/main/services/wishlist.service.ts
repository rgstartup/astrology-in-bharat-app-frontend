import { apiClient } from "../lib/api-client";
import { API_CONFIG } from "../lib/api-config";

export const WishlistService = {

    getWishlist: async () => {
        const response = await apiClient.request(API_CONFIG.PRODUCT_LIKE.LIST);
        return response.data;
    },

    addToWishlist: async (productId: number) => {
        const response = await apiClient.request({
            ...API_CONFIG.PRODUCT_LIKE.ADD,
            data: { productId }
        });
        return response.data;
    },

    removeFromWishlist: async (productId: number) => {
        const response = await apiClient.request({
            ...API_CONFIG.PRODUCT_LIKE.REMOVE,
            url: `${API_CONFIG.PRODUCT_LIKE.REMOVE.url}/${productId}`
        });
        return response.data;
    },


    getExpertWishlist: async () => {
        const response = await apiClient.request(API_CONFIG.EXPERT_LIKE.LIST);
        return response.data;
    },

    addExpertToWishlist: async (expertId: number) => {
        const response = await apiClient.request({
            ...API_CONFIG.EXPERT_LIKE.ADD,
            data: { expertId }
        });
        return response.data;
    },

    removeExpertFromWishlist: async (expertId: number) => {
        const response = await apiClient.request({
            ...API_CONFIG.EXPERT_LIKE.REMOVE,
            url: `${API_CONFIG.EXPERT_LIKE.REMOVE.url}/${expertId}`
        });
        return response.data;
    }
};


