"use client";

import React from "react";
import { createScopedStore } from "@/store/utils";
import { toast } from "@repo/design/shadcn";
import { ShopCartService } from "../services/shop-cart.service";
import { ShopWishlistService } from "../services/shop-wishlist.service";
import { ShopProductService } from "../services/shop-product.service";
import { getErrorMessage, type CartItem } from "@repo/lib";
import { authStore } from "@/store/authStore";
import type { ShopProduct } from "../types/shop.types";

export interface ShopWishlistItem {
  id: string;
  productId?: string;
  product?: ShopProduct;
}

export interface ShopDataState {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartLoading: boolean;

  wishlistItems: ShopWishlistItem[];
  isWishlistLoading: boolean;

  platformFee: number;
}

export interface ShopActions {
  // Cart
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  resetCart: () => void;

  // Wishlist
  fetchWishlist: () => Promise<void>;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string | number) => boolean;
  toggleWishlist: (productId: string | number) => Promise<void>;

  // Platform Fee
  fetchPlatformFee: () => Promise<void>;
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

export const {
  Provider: ShopProvider,
  useStore: useShopStore,
  useStoreApi: useShopStoreApi,
} = createScopedStore<ShopDataState, ShopActions>((set, get) => ({
  cartItems: [],
  cartCount: 0,
  cartTotal: 0,
  isCartLoading: false,

  wishlistItems: [],
  isWishlistLoading: false,

  platformFee: 0,

  // ─── CART ACTIONS ──────────────────────────────────────────
  fetchCart: async () => {
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
      set({ cartItems: [], cartCount: 0, cartTotal: 0 });
      return;
    }

    set({ isCartLoading: true });
    try {
      const [res, error] = await ShopCartService.getCart();
      if (error || !res) return;
      const rawItems = res.items || [];
      const { count, total } = calculateTotals(rawItems);
      set({ cartItems: rawItems, cartCount: count, cartTotal: total });
    } finally {
      set({ isCartLoading: false });
    }
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to bag");
      return;
    }

    set({ isCartLoading: true });
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
      set({ isCartLoading: false });
    }
  },

  updateQuantity: async (productId: string, quantity: number) => {
    const { removeFromCart, fetchCart } = get();

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    // Optimistic Update
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

  // ─── WISHLIST ACTIONS ──────────────────────────────────────
  fetchWishlist: async () => {
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
      set({ wishlistItems: [] });
      return;
    }

    set({ isWishlistLoading: true });
    try {
      const [res] = await ShopWishlistService.getWishlist();
      const raw = Array.isArray(res)
        ? res
        : (res as any)?.items || (res as any)?.data || [];
      set({ wishlistItems: raw.filter(Boolean) });
    } catch {
      // non-critical
    } finally {
      set({ isWishlistLoading: false });
    }
  },

  addToWishlist: async (productId: string) => {
    const { isAuthenticated } = authStore.getState();
    if (!isAuthenticated) {
      toast.error("Please sign in to save items");
      return;
    }

    try {
      await ShopWishlistService.addToWishlist(productId);
      toast.success("Saved to wishlist");
      await get().fetchWishlist();
    } catch (err: any) {
      if (err?.status === 409) {
        toast.info("Already in wishlist");
      } else {
        toast.error("Failed to add to wishlist");
      }
    }
  },

  removeFromWishlist: async (productId: string) => {
    try {
      await ShopWishlistService.removeFromWishlist(productId);
      toast.info("Removed from wishlist");
      set((state) => ({
        wishlistItems: state.wishlistItems.filter(
          (i) =>
            String(i.productId) !== String(productId) &&
            String(i.product?.id) !== String(productId),
        ),
      }));
    } catch {
      toast.error("Failed to remove item");
    }
  },

  isInWishlist: (productId: string | number) => {
    const { wishlistItems } = get();
    return wishlistItems.some(
      (item) =>
        String(item.productId) === String(productId) ||
        String(item.product?.id) === String(productId),
    );
  },

  toggleWishlist: async (productId: string | number) => {
    const idStr = String(productId);
    const { isInWishlist, removeFromWishlist, addToWishlist } = get();
    if (isInWishlist(idStr)) {
      await removeFromWishlist(idStr);
    } else {
      await addToWishlist(idStr);
    }
  },

  // ─── PLATFORM FEE ──────────────────────────────────────────
  fetchPlatformFee: async () => {
    const fee = await ShopProductService.getPlatformFee();
    set({ platformFee: fee });
  },
}));
