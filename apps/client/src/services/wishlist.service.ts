import { clientAPI } from "@/actions";
import { ApiError } from "@repo/safe-fetch";

export const WishlistService = {

    getWishlist: async () => {
        return await clientAPI.get("/product-like");
    },

    addToWishlist: async (productId: string) => {
        return await clientAPI.post("/product-like/add", { productId });
    },

    removeFromWishlist: async (productId: string) => {
        return await clientAPI.delete(`/product-like/remove/${productId}`);
    },

    getExpertWishlist: async () => {
        return await clientAPI.get("/expert-like");
    },

    addExpertToWishlist: async (expertId: string) => {
        return await clientAPI.post("/expert-like/add", { expert_id: expertId });
    },

    removeExpertFromWishlist: async (expertId: string) => {
        return await clientAPI.delete(`/expert-like/remove/${expertId}`);
    },
    
    getPujaWishlist: async () => {
        return await clientAPI.get("/puja-like");
    },

    addPujaToWishlist: async (pujaId: string) => {
        return await clientAPI.post("/puja-like/add", { pujaId });
    },

    removePujaFromWishlist: async (pujaId: string) => {
        return await clientAPI.delete(`/puja-like/remove/${pujaId}`);
    },

    getMerchantWishlist: async () => {
        return await clientAPI.get("/merchant-like");
    },

    addMerchantToWishlist: async (merchantId: string) => {
        return await clientAPI.post("/merchant-like/add", { merchantId });
    },

    removeMerchantFromWishlist: async (merchantId: string) => {
        return await clientAPI.delete(`/merchant-like/remove/${merchantId}`);
    }
};
