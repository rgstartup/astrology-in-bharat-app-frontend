"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";

export const CartInitializer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { isAuthenticated } = useAuthStore(); // Changed usage
  const { fetchCart, resetCart } = useCartStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
      return;
    }

    resetCart();
  }, [isAuthenticated, fetchCart, resetCart]);

  return <>{children}</>;
};
