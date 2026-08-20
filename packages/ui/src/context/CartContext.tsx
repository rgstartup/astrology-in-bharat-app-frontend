"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "@repo/store";
import { getErrorMessage } from "@repo/lib";
import { SafeFetchInstance } from "@repo/safe-fetch";

// Define Types
export interface CartItem {
    id: string;
    productId: string;
    quantity: number;
    product?: {
        id: string;
        name: string;
        price: number;
        sale_price?: number;
        image?: string;
        images?: string[];
    };
}

interface CartContextType {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;
    addToCart: (productId: string, quantity?: number) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    refreshCart: () => Promise<void>;
}

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

export const CartProvider = ({ children, api }: { children: React.ReactNode, api: SafeFetchInstance }) => {
    const { isAuthenticated } = useAuthStore();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartTotal = cartItems.reduce((acc, item) => {
        const price = item.product?.sale_price || item.product?.price || 0;
        return acc + price * item.quantity;
    }, 0);

    // Fetch Cart
    const fetchCart = useCallback(async () => {
        if (!isAuthenticated) {
            setCartItems([]);
            return;
        }
        try {
            setIsLoading(true);
            const [res, error] = await api.get<any>("/cart", { params: { _t: new Date().getTime() } });
            if (error) throw error;
            const rawItems = res?.items || (Array.isArray(res) ? res : []);
            const items = rawItems.map((item: any) => ({
                ...item,
                productId: item.productId || item.product?.id,
            }));
            setCartItems(items);
        } catch (_) {
            // Silent on fetch error to avoid spamming user on load
        } finally {
            setIsLoading(false);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add to Cart
    const addToCart = async (productId: string, quantity: number = 1) => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            return;
        }
        try {
            setIsLoading(true);
            const [_, error] = await api.post("/cart/add", { productId, quantity });
            if (error) throw error;
            // @ts-ignore
            toast.success("Added to cart! Click to view", {
                onClick: () => window.location.href = '/cart',
                autoClose: 3000,
                style: { cursor: 'pointer' },
            });
            await fetchCart();
        } catch (error: any) {
            toast.error(getErrorMessage(error) || "Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce ref for quantity updates
    const debouncedUpdate = React.useRef<{ [key: string]: NodeJS.Timeout }>({});

    // Update Quantity with Debounce & Optimistic UI
    const updateQuantity = async (productId: string, quantity: number) => {
        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        // Optimistic Update
        setCartItems(prev => prev.map(item =>
            (item.productId === productId || item.product?.id === productId)
                ? { ...item, quantity }
                : item
        ));

        if (debouncedUpdate.current[productId]) {
            clearTimeout(debouncedUpdate.current[productId]);
        }

        debouncedUpdate.current[productId] = setTimeout(async () => {
            try {
                const [_, error] = await api.put("/cart/update", { productId, quantity });
                if (error) throw error;
            } catch (error: any) {
                toast.error(getErrorMessage(error) || "Failed to update quantity");
                await fetchCart(); // Revert on error
            } finally {
                delete debouncedUpdate.current[productId];
            }
        }, 500);
    };

    // Remove Item
    const removeFromCart = async (productId: string) => {
        try {
            const [_, error] = await api.delete(`/cart/remove/${productId}`);
            if (error) throw error;
            toast.success("Item removed");
            await fetchCart();
        } catch (error: any) {
            toast.error(getErrorMessage(error) || "Failed to remove item");
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
