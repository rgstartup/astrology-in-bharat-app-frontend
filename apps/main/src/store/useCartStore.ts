
import { create } from "zustand";
import { toast } from "react-toastify";
import { CartService } from "../services/cart.service";
import { getErrorMessage } from "@repo/lib";

// Local helper to preserve fallback behavior if needed
const getFormattedError = (error: any, fallback: string) => getErrorMessage(error) || fallback;

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
        image?: string; // or images array
        images?: string[];
    };
}

export interface CartState {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;

    // Actions
    fetchCart: (isAuthenticated: boolean) => Promise<void>;
    addToCart: (productId: string, quantity: number, isAuthenticated: boolean) => Promise<void>;
    updateQuantity: (productId: string, quantity: number) => Promise<void>;
    removeFromCart: (productId: string) => Promise<void>;
    refreshCart: (isAuthenticated: boolean) => Promise<void>;
    resetCart: () => void;
}

// Helper to calculate totals
const calculateTotals = (items: CartItem[]) => {
    const count = items.reduce((acc, item) => acc + item.quantity, 0);
    const total = items.reduce((acc, item) => {
        const price = item.product?.sale_price || item.product?.price || 0;
        return acc + price * item.quantity;
    }, 0);
    return { count, total };
};

// Debounce timeouts storage
let debounceTimeouts: Record<string, NodeJS.Timeout> = {};

export const useCartStore = create<CartState>((set, get) => ({
    cartItems: [],
    cartCount: 0,
    cartTotal: 0,
    isLoading: false,

    fetchCart: async (isAuthenticated: boolean) => {
        if (!isAuthenticated) {
            set({ cartItems: [], cartCount: 0, cartTotal: 0 });
            return;
        }

        set({ isLoading: true });
        try {
            const [res, error] = await CartService.getCart() as any;
            if (error) {
                console.error("Failed to fetch cart:", error);
                return;
            }
            // Response structure is { id, items: [...], ... }
            const rawItems = res?.items || (Array.isArray(res) ? res : []);

            // Filter out null/undefined items (can happen with orphaned cart entries)
            const items = rawItems.filter(Boolean).map((item: any) => ({
                ...item,
                productId: item.productId || item.product?.id
            }));

            const { count, total } = calculateTotals(items);
            set({ cartItems: items, cartCount: count, cartTotal: total });
        } catch (error) {
            console.error("Failed to fetch cart:", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addToCart: async (productId: string, quantity: number = 1, isAuthenticated: boolean) => {
        if (!isAuthenticated) {
            toast.error("Please login to add items to cart");
            return;
        }

        set({ isLoading: true });
        try {
            const [data, error] = await CartService.addToCart(productId, quantity) as any;
            if (error) throw error;

            toast.success("Added to cart! Click to view", {
                onClick: () => window.location.href = '/cart',
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });

            await get().fetchCart(true);
        } catch (error: any) {
            console.error("Add to cart error:", error);
            toast.error(getFormattedError(error, "Failed to add to cart"));
        } finally {
            set({ isLoading: false });
        }
    },

    updateQuantity: async (productId: string, quantity: number) => {
        const { removeFromCart, fetchCart } = get();

        if (quantity <= 0) {
            await removeFromCart(productId);
            return;
        }

        // 1. Optimistic Update
        set(state => {
            const newItems = state.cartItems.map(item =>
                (item.productId === productId || item.product?.id === productId)
                    ? { ...item, quantity }
                    : item
            );
            const { count, total } = calculateTotals(newItems);
            return { cartItems: newItems, cartCount: count, cartTotal: total };
        });

        // 2. Debounce API Call
        if (debounceTimeouts[productId]) {
            clearTimeout(debounceTimeouts[productId]);
        }

        debounceTimeouts[productId] = setTimeout(async () => {
            try {
                const [_, error] = await CartService.updateQuantity(productId, quantity) as any;
                if (error) throw error;
                // No fetch fetchCart() to define truth, relying on optimistic UI
            } catch (error: any) {
                console.error("Update quantity error:", error);
                toast.error(getFormattedError(error, "Failed to update quantity"));
                // Revert on error
                await fetchCart(true);
            } finally {
                delete debounceTimeouts[productId];
            }
        }, 500);
    },

    removeFromCart: async (productId: string) => {
        try {
            const [_, error] = await CartService.removeFromCart(productId) as any;
            if (error) throw error;
            toast.success("Item removed");
            
            // Manually update state instead of fetching from backend
            set(state => {
                const newItems = state.cartItems.filter(item => item.productId !== productId && item.product?.id !== productId);
                const { count, total } = calculateTotals(newItems);
                return { cartItems: newItems, cartCount: count, cartTotal: total };
            });
        } catch (error: any) {
            console.error("Remove item error:", error);
            toast.error(getFormattedError(error, "Failed to remove item"));
        }
    },

    refreshCart: async (isAuthenticated: boolean) => {
        await get().fetchCart(isAuthenticated);
    },

    resetCart: () => {
        set({ cartItems: [], cartCount: 0, cartTotal: 0 });
    }
}));
