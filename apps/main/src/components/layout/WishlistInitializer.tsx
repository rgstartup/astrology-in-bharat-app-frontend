"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import
import { useWishlistStore } from "../../store/useWishlistStore";

export const WishlistInitializer = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated } = useAuthStore(); // Changed usage
    const { fetchWishlist, resetWishlist } = useWishlistStore();

    useEffect(() => {
        if (isAuthenticated) {
            fetchWishlist(true);
        } else {
            resetWishlist();
        }
    }, [isAuthenticated, fetchWishlist]);

    return <>{children}</>;
};
