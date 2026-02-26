"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { safeFetch } from "@repo/safe-fetch";
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
        image?: string;
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

// Resolve to relative API paths (proxied via Next.js rewrite)
function cartUrl(path: string): string {
    return `/api/v1${path.startsWith("/") ? "" : "/"}${path}`;
}

async function cartFetch<T>(
    path: string,
    method: "GET" | "POST" | "PUT" | "DELETE" = "GET",
    body?: Record<string, unknown>,
    params?: Record<string, string | number>
): Promise<T> {
    let url = cartUrl(path);
    if (params) {
        const qs = new URLSearchParams(
            Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)]))
        ).toString();
        url = `${url}?${qs}`;
    }

    const [data, error] = await safeFetch<T>(url, {
        method,
        credentials: "include",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        ...(body ? { body: JSON.stringify(body) } : {}),
    } as any);

    if (error) throw error;
    return data as T;
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
    const { isClientAuthenticated } = useClientAuth();
    const [cartItems, setCartItems] = useState<CartItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
            const res = await cartFetch<any>("/cart", "GET", undefined, { _t: new Date().getTime() });
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
    }, [isClientAuthenticated]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    // Add to Cart
    const addToCart = async (productId: number, quantity: number = 1) => {
        if (!isClientAuthenticated) {
            toast.error("Please login to add items to cart");
            return;
        }
        try {
            setIsLoading(true);
            await cartFetch("/cart/add", "POST", { productId, quantity });
            // @ts-ignore
            toast.success("Added to cart! Click to view", {
                onClick: () => window.location.href = '/cart',
                autoClose: 3000,
                style: { cursor: 'pointer' },
            });
            await fetchCart();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to add to cart");
        } finally {
            setIsLoading(false);
        }
    };

    // Debounce ref for quantity updates
    const debouncedUpdate = React.useRef<{ [key: number]: NodeJS.Timeout }>({});

    // Update Quantity with Debounce & Optimistic UI
    const updateQuantity = async (productId: number, quantity: number) => {
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
                await cartFetch("/cart/update", "PUT", { productId, quantity });
            } catch (error: any) {
                toast.error(error?.data?.message || "Failed to update quantity");
                await fetchCart(); // Revert on error
            } finally {
                delete debouncedUpdate.current[productId];
            }
        }, 500);
    };

    // Remove Item
    const removeFromCart = async (productId: number) => {
        try {
            await cartFetch(`/cart/remove/${productId}`, "DELETE");
            toast.success("Item removed");
            await fetchCart();
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to remove item");
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
