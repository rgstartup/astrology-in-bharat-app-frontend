"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import
import { useCartStore } from "@/store/useCartStore";

export const CartInitializer = ({ children }: { children: React.ReactNode }) => {
    const { isClientAuthenticated } = useAuthStore(); // Changed usage
    const { fetchCart, resetCart } = useCartStore();

    useEffect(() => {
        if (isClientAuthenticated) {
            fetchCart(true);
        } else {
            resetCart();
        }
    }, [isClientAuthenticated, fetchCart, resetCart]);

    return <>{children}</>;
};
