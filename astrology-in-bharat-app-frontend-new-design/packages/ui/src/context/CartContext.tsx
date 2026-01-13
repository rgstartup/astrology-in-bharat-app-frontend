"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useClientAuth } from "./ClientAuthContext";

// Define Types
export interface CartItem {
    id: number; // Cart Item ID (optional, depending on backend) or Product ID reference? 
    // Based on API docs, operations use productId. Let's assume response includes product details.
    productId: number;
    quantity: number;
    product?: {
        id: number;
        name: string;
        price: number;
        sale_price?: number;
        image?: string; // or images array
        images?: string[];
    };
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;
    addToCart: (productId: number, quantity?: number) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    refreshCart: () => Promise<void>;
}

// Create Context
const CartContext = createContext<CartContextType>({
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
    isLoading: false,
    addToCart: async () => { },
    updateQuantity: async () => { },
    removeFromCart: async () => { },
    refreshCart: async () => { },
});

// API Client
const apiClient = axios.create({
    baseURL: "/api/v1",
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
    },
});

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isClientAuthenticated } = useClientAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Calculate derived state
    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => {
        const price = item.product?.sale_price || item.product?.price || 0;
        return acc + price * item.quantity;
    }, 0);

    // Fetch Cart
    const fetchCart = useCallback(async () => {
        if (!isClientAuthenticated) {
            setCartItems([]);
            return;
        }

        try {
            setIsLoading(true);
            const res = await apiClient.get("/cart", {
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                    'Pragma': 'no-cache',
                    'Expires': '0'
                },
                params: { _t: new Date().getTime() } // Anti-cache
            });
            // Assuming response.data is the array of items or { data: items }
            // Adjust based on actual response structure. API doc says "List of cart items"
            const items = Array.isArray(res.data) ? res.data : (res.data.data || []);
            setCartItems(items);
        } catch (error) {
            console.error("Failed to fetch cart:", error);
            // Don't toast on fetch error to avoid spamming user on load
        } finally {
            setIsLoading(false);
        }
    }, [isClientAuthenticated]);

    // Initial Fetch
    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add to Cart
    const addToCart = async (productId: number, quantity: number = 1) => {
        if (!isClientAuthenticated) {
            toast.error("Please login to add items to cart");
            // Optionally redirect
            return;
        }

        try {
            setIsLoading(true);
            await apiClient.post("/cart/add", { productId, quantity });
            toast.success("Added to cart!");
            await fetchCart(); // Refresh cart
        } catch (error: any) {
            console.error("Add to cart error:", error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    };

    // Update Quantity
    const updateQuantity = async (productId: number, quantity: number) => {
        try {
            if (quantity <= 0) {
                await removeFromCart(productId);
                return;
            }
            // Optimistic update could go here
            await apiClient.put("/cart/update", { productId, quantity });
            await fetchCart();
        } catch (error: any) {
            console.error("Update quantity error:", error);
            toast.error(error.response?.data?.message || "Failed to update quantity");
        }
    };

    // Remove Item
    const removeFromCart = async (productId: number) => {
        try {
            await apiClient.delete(`/cart/remove/${productId}`);
            toast.success("Item removed");
            await fetchCart();
        } catch (error: any) {
            console.error("Remove item error:", error);
            toast.error(error.response?.data?.message || "Failed to remove item");
        }
    };

    return (
        <CartContext.Provider
            value={{
                cartItems,
                cartCount,
                cartTotal,
                isLoading,
                addToCart,
                updateQuantity,
                removeFromCart,
                refreshCart: fetchCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
