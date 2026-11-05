"use client";

import { create } from "zustand";
import { toast } from "@repo/design/shadcn";
import { ShopCartService } from "../services/shop-cart.service";
import { getErrorMessage, type CartItem } from "@repo/lib";
import { authStore } from "@/store/authStore";

export interface ShopCartState {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;

  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  resetCart: () => void;
}

const calculateTotals = (items: CartItem[]) => {
  const count = items.reduce((acc, item) => acc + item.quantity, 0);
  const total = items.reduce((acc, item) => {
    const price =
      Number((item.product as any)?.sale_price) ||
      Number((item.product as any)?.price) ||
      0;
    return acc + price * item.quantity;
  }, 0);
  return { count, total };
};

let debounceTimeouts: Record<string, NodeJS.Timeout> = {};

export const useShopCartStore = create<ShopCartState>((set, get) => ({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  isLoading: false,

  fetchCart: async () => {
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
      set({ cartItems: [], cartCount: 0, cartTotal: 0 });
      return;
    }

    set({ isLoading: true });
    try {
      const [res, error] = await ShopCartService.getCart();
      if (error || !res) {
        return;
      }
      const rawItems = res.items || [];
      const { count, total } = calculateTotals(rawItems);
      set({ cartItems: rawItems, cartCount: count, cartTotal: total });
    } finally {
      set({ isLoading: false });
    }
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to bag");
      return;
    }

    set({ isLoading: true });
    try {
      const [_, error] = await ShopCartService.addToCart(productId, quantity);
      if (error) throw error;

      toast.success("Added to shopping bag", {
        onClick: () => {
          if (typeof window !== "undefined") {
            window.location.href = "/shop/cart";
          }
        },
        autoClose: 3000,
        style: { cursor: "pointer" },
      });
      await get().fetchCart();
    } catch (error: any) {
      toast.error(getErrorMessage(error) || "Failed to add to bag");
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

    // Optimistic update
    set((state) => {
      const newItems = state.cartItems.map((item) =>
        String(item.product?.id) === String(productId)
          ? { ...item, quantity }
          : item,
      );
      const { count, total } = calculateTotals(newItems);
      return { cartItems: newItems, cartCount: count, cartTotal: total };
    });

    if (debounceTimeouts[productId]) {
      clearTimeout(debounceTimeouts[productId]);
    }

    debounceTimeouts[productId] = setTimeout(async () => {
      try {
        const [res, error] = await ShopCartService.updateQuantity(
          productId,
          quantity,
        );
        if (error || !res) throw error;
      } catch (error: any) {
        toast.error(getErrorMessage(error) || "Failed to update quantity");
        await fetchCart();
      } finally {
        delete debounceTimeouts[productId];
      }
    }, 400);
  },

  removeFromCart: async (productId: string) => {
    try {
      const [_, error] = await ShopCartService.removeFromCart(productId);
      if (error) throw error;
      toast.info("Item removed from bag");

      set((state) => {
        const newItems = state.cartItems.filter(
          (item) => String(item.product?.id) !== String(productId),
        );
        const { count, total } = calculateTotals(newItems);
        return { cartItems: newItems, cartCount: count, cartTotal: total };
      });
    } catch (error: any) {
      toast.error(getErrorMessage(error) || "Failed to remove item");
    }
  },

  resetCart: () => {
    set({ cartItems: [], cartCount: 0, cartTotal: 0 });
  },
}));
