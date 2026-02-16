
import axios from "axios";

// API Client
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

const apiClient = axios.create({
    baseURL: `${cleanApiUrl}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const CartService = {
    getCart: async () => {
        const response = await apiClient.get("/cart", {
            params: { _t: new Date().getTime() } // Anti-cache
        });
        return response.data;
    },

    addToCart: async (productId: number, quantity: number) => {
        const response = await apiClient.post("/cart/add", { productId, quantity });
        return response.data;
    },

    updateQuantity: async (productId: number, quantity: number) => {
        const response = await apiClient.put("/cart/update", { productId, quantity });
        return response.data;
    },

    removeFromCart: async (productId: number) => {
        const response = await apiClient.delete(`/cart/remove/${productId}`);
        return response.data;
    }
};
