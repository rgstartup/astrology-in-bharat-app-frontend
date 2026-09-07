"use client";

import { create } from "zustand";
import { toast } from "react-toastify";
import { CartService } from "../services/cart.service";
import { getErrorMessage, type CartItem } from "@repo/lib";
import { useAuthStore } from "@repo/store";

// Local helper to preserve fallback behavior if needed
const getFormattedError = (error: any, fallback: string) =>
  getErrorMessage(error) || fallback;

export interface CartState {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;

  // Actions
  fetchCart: () => Promise<void>;
  addToCart: (
    productId: string,
    quantity: number,
    isAuthenticated: boolean,
  ) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  refreshCart: (isAuthenticated: boolean) => Promise<void>;
  resetCart: () => void;
}

// Helper to calculate totals
const calculateTotals = (items: CartItem[]) => {
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => {
    const price = item.product.price;
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

  fetchCart: async () => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      set({ cartItems: [], cartCount: 0, cartTotal: 0 });
      return;
    }

    set({ isLoading: true });

    const [res, error] = await CartService.getCart().finally(() =>
      set({ isLoading: false }),
    );

    if (error || !res) {
      console.error("Failed to fetch cart:", error);
      return;
    }
    const rawItems = res.items ? res.items : [];
    const { count, total } = calculateTotals(rawItems);
    set({ cartItems: rawItems, cartCount: count, cartTotal: total });
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      toast.error("Please login to add items to cart");
      return;
    }

    set({ isLoading: true });
    try {
      const [_, error] = await CartService.addToCart(productId, quantity);
      if (error) throw error;

      toast.success("Added to cart! Click to view", {
        onClick: () => (window.location.href = "/cart"),
        autoClose: 3000,
        style: { cursor: "pointer" },
      });

      // await get().fetchCart(true);
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
    set((state) => {
      const newItems = state.cartItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item,
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
        const [res, error] = await CartService.updateQuantity(
          productId,
          quantity,
        );

        if (error || !res) throw error;
        // No fetch fetchCart() to define truth, relying on optimistic UI
      } catch (error: any) {
        console.error("Update quantity error:", error);
        toast.error(getFormattedError(error, "Failed to update quantity"));
        // Revert on error
        await fetchCart();
      } finally {
        delete debounceTimeouts[productId];
      }
    }, 500);
  },

  removeFromCart: async (productId: string) => {
    try {
      const [_, error] = await CartService.removeFromCart(productId);

      if (error) throw error;
      toast.success("Item removed");

      // Manually update state instead of fetching from backend
      set((state) => {
        const newItems = state.cartItems.filter(
          (item) => item.product.id !== productId,
        );
        const { count, total } = calculateTotals(newItems);
        return { cartItems: newItems, cartCount: count, cartTotal: total };
      });
    } catch (error: any) {
      console.error("Remove item error:", error);
      toast.error(getFormattedError(error, "Failed to remove item"));
    }
  },

  refreshCart: async () => {
    await get().fetchCart();
  },

  resetCart: () => {
    set({ cartItems: [], cartCount: 0, cartTotal: 0 });
  },
}));
