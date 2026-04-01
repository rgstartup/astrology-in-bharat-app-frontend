import { api } from "../lib/api";
import { ApiError } from "@repo/safe-fetch";

export const CartService = {
    getCart: async (): Promise<[any | null, ApiError | null]> => {
        return await api.get("/cart", {
            headers: { "Cache-Control": "no-cache" }
        });
    },

    addToCart: async (productId: number, quantity: number): Promise<[any | null, ApiError | null]> => {
        return await api.post("/cart/add", { productId, quantity });
    },

    updateQuantity: async (productId: number, quantity: number): Promise<[any | null, ApiError | null]> => {
        return await api.put("/cart/update", { productId, quantity });
    },

    removeFromCart: async (productId: number): Promise<[any | null, ApiError | null]> => {
        return await api.delete(`/cart/remove/${productId}`);
    }
};
