"use client";

import React, { useEffect } from "react";
import { useShopStore } from "./shop.store";
import { useAuthStore } from "@/store/authStore";

export const ShopInitializer: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated } = useAuthStore();
  const fetchCart = useShopStore((state) => state.fetchCart);
  const fetchWishlist = useShopStore((state) => state.fetchWishlist);
  const fetchPlatformFee = useShopStore((state) => state.fetchPlatformFee);

  useEffect(() => {
    fetchPlatformFee();
    if (isAuthenticated) {
      fetchCart();
      fetchWishlist();
    }
  }, [isAuthenticated, fetchCart, fetchWishlist, fetchPlatformFee]);

  return <>{children}</>;
};
