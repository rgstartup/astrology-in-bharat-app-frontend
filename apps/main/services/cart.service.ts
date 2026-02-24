
import { apiClient } from "../lib/api-client";

const unwrap = <T = any>(response: any): T => (response as any)?.data ?? response;

export const CartService = {
    getCart: async () => {
        const response = await apiClient.get("/cart", {
            params: { _t: new Date().getTime() } // Anti-cache
        });
        return unwrap(response);
    },

    addToCart: async (productId: number, quantity: number) => {
        const response = await apiClient.post("/cart/add", { productId, quantity });
        return unwrap(response);
    },

    updateQuantity: async (productId: number, quantity: number) => {
        const response = await apiClient.put("/cart/update", { productId, quantity });
        return unwrap(response);
    },

    removeFromCart: async (productId: number) => {
        const response = await apiClient.delete(`/cart/remove/${productId}`);
        return unwrap(response);
    }
};
