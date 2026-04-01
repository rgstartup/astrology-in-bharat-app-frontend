import { api } from "../lib/api";
import { ApiError } from "@repo/safe-fetch";

export const WishlistService = {

    getWishlist: async (): Promise<[any | null, ApiError | null]> => {
        return await api.get("/product-like");
    },

    addToWishlist: async (productId: number): Promise<[any | null, ApiError | null]> => {
        return await api.post("/product-like/add", { productId });
    },

    removeFromWishlist: async (productId: number): Promise<[any | null, ApiError | null]> => {
        return await api.delete(`/product-like/remove/${productId}`);
    },

    getExpertWishlist: async (): Promise<[any | null, ApiError | null]> => {
        return await api.get("/expert-like");
    },

    addExpertToWishlist: async (expertId: number): Promise<[any | null, ApiError | null]> => {
        return await api.post("/expert-like/add", { expertId });
    },

    removeExpertFromWishlist: async (expertId: number): Promise<[any | null, ApiError | null]> => {
        return await api.delete(`/expert-like/remove/${expertId}`);
    },
    
    getPujaWishlist: async (): Promise<[any | null, ApiError | null]> => {
        return await api.get("/puja-like");
    },

    addPujaToWishlist: async (pujaId: number): Promise<[any | null, ApiError | null]> => {
        return await api.post("/puja-like/add", { pujaId });
    },

    removePujaFromWishlist: async (pujaId: number): Promise<[any | null, ApiError | null]> => {
        return await api.delete(`/puja-like/remove/${pujaId}`);
    }
};
