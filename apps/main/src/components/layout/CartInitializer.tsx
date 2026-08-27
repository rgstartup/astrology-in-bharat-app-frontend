"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useCartStore } from "@/store/useCartStore";

export const CartInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuthStore(); // Changed usage
  const { fetchCart, resetCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart(true);
      return;
    }

    resetCart();
  }, [isAuthenticated, fetchCart, resetCart]);

  return <>{children}</>;
};
