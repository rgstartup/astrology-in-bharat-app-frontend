import { apiClient } from "../lib/api-client";

const unwrap = <T = any>(response: any): T => (response as any)?.data ?? response;

export const WishlistService = {

    getWishlist: async () => {
        const response = await apiClient.get("/product-like");
        return unwrap(response);
    },

    addToWishlist: async (productId: number) => {
        const response = await apiClient.post("/product-like/add", { productId });
        return unwrap(response);
    },

    removeFromWishlist: async (productId: number) => {
        const response = await apiClient.delete(`/product-like/remove/${productId}`);
        return unwrap(response);
    },


    getExpertWishlist: async () => {
        const response = await apiClient.get("/expert-like");
        return unwrap(response);
    },

    addExpertToWishlist: async (expertId: number) => {
        const response = await apiClient.post("/expert-like/add", { expertId });
        return unwrap(response);
    },

    removeExpertFromWishlist: async (expertId: number) => {
        const response = await apiClient.delete(`/expert-like/remove/${expertId}`);
        return unwrap(response);
    }
};


