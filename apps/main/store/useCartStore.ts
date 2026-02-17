
import { create } from "zustand";
import { toast } from "react-toastify";
import { CartService } from "../services/cart.service";

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

interface CartState {
    cartItems: CartItem[];
    cartCount: number;
    cartTotal: number;
    isLoading: boolean;

    // Actions
    fetchCart: (isClientAuthenticated: boolean) => Promise<void>;
    addToCart: (productId: number, quantity: number, isClientAuthenticated: boolean) => Promise<void>;
    updateQuantity: (productId: number, quantity: number) => Promise<void>;
    removeFromCart: (productId: number) => Promise<void>;
    refreshCart: (isClientAuthenticated: boolean) => Promise<void>;
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

    fetchCart: async (isClientAuthenticated: boolean) => {
        if (!isClientAuthenticated) {
            set({ cartItems: [], cartCount: 0, cartTotal: 0 });
            return;
        }

        set({ isLoading: true });
        try {
            const res = await CartService.getCart();
            // Response structure is { id, items: [...], ... }
            const rawItems = res?.items || (Array.isArray(res) ? res : []);

            // Map items to ensure productId is present
            const items = rawItems.map((item: any) => ({
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

    addToCart: async (productId: number, quantity: number = 1, isClientAuthenticated: boolean) => {
        if (!isClientAuthenticated) {
            toast.error("Please login to add items to cart");
            return;
        }

        set({ isLoading: true });
        try {
            await CartService.addToCart(productId, quantity);

            toast.success("Added to cart! Click to view", {
                onClick: () => window.location.href = '/cart',
                autoClose: 3000,
                style: { cursor: 'pointer' }
            });

            await get().fetchCart(true);
        } catch (error: any) {
            console.error("Add to cart error:", error);
            toast.error(error.response?.data?.message || "Failed to add to cart");
        } finally {
            set({ isLoading: false });
        }
    },

    updateQuantity: async (productId: number, quantity: number) => {
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
                await CartService.updateQuantity(productId, quantity);
                // No fetch fetchCart() to define truth, relying on optimistic UI
            } catch (error: any) {
                console.error("Update quantity error:", error);
                toast.error(error.response?.data?.message || "Failed to update quantity");
                // Revert on error
                await fetchCart(true);
            } finally {
                delete debounceTimeouts[productId];
            }
        }, 500);
    },

    removeFromCart: async (productId: number) => {
        try {
            await CartService.removeFromCart(productId);
            toast.success("Item removed");
            await get().fetchCart(true);
        } catch (error: any) {
            console.error("Remove item error:", error);
            toast.error(error.response?.data?.message || "Failed to remove item");
        }
    },

    refreshCart: async (isClientAuthenticated: boolean) => {
        await get().fetchCart(isClientAuthenticated);
    },

    resetCart: () => {
        set({ cartItems: [], cartCount: 0, cartTotal: 0 });
    }
}));
