"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useClientAuth } from "./ClientAuthContext";

// Define Types
export interface CartItem {
    id: number;
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
const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
const cleanApiUrl = API_URL.replace(/\/api\/v1\/?$/, "");

const apiClient = axios.create({
    baseURL: `${cleanApiUrl}/api/v1`,
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
                params: { _t: new Date().getTime() } // Anti-cache
            });
            console.log("🛒 Cart API Response (Stringified):", JSON.stringify(res.data, null, 2)); // DEBUG LOG
            // Response structure is { id, items: [...], ... }
            const rawItems = res.data?.items || (Array.isArray(res.data) ? res.data : []);

            // Map items to ensure productId is present
            const items = rawItems.map((item: any) => ({
                ...item,
                productId: item.productId || item.product?.id
            }));

            console.log("🛒 Parsed Cart Items:", items); // DEBUG LOG
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
            // @ts-ignore
            toast.success("Added to cart! Click to view", {
                onClick: () => window.location.href = '/cart',
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });
            await fetchCart(); // Refresh cart
        } catch (error: any) {
            console.error("Add to cart error:", error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce Ref
    const debouncedUpdate = React.useRef<{ [key: number]: NodeJS.Timeout }>({});

    // Update Quantity with Debounce & Optimistic UI
    const updateQuantity = async (productId: number, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        // 1. Optimistic Update
        setCartItems(prev => prev.map(item =>
            (item.productId === productId || item.product?.id === productId)
                ? { ...item, quantity }
                : item
        ));

        // 2. Debounce API Call
        if (debouncedUpdate.current[productId]) {
            clearTimeout(debouncedUpdate.current[productId]);
        }

        debouncedUpdate.current[productId] = setTimeout(async () => {
            try {
                // Perform actual API call
                await apiClient.put("/cart/update", { productId, quantity });
                // We don't fetchCart here to avoid overwriting optimistic state if user is still clicking
                // But to be safe, we can fetch if successful. 
                // However, fetching might cause a jump if there's a slight mismatch. 
                // Let's rely on optimistic state and maybe background refresh.
                // For now, let's just do the call.
            } catch (error: any) {
                console.error("Update quantity error:", error);
                toast.error(error.response?.data?.message || "Failed to update quantity");
                // Revert on error (optional, but good practice. For now, just fetching cart restores truth)
                await fetchCart();
            } finally {
                delete debouncedUpdate.current[productId];
            }
        }, 500); // 500ms delay
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



