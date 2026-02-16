"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import
import { useWishlistStore } from "../../store/useWishlistStore";

export const WishlistInitializer = ({ children }: { children: React.ReactNode }) => {
    const { isClientAuthenticated } = useAuthStore(); // Changed usage
    const { fetchWishlist, resetWishlist } = useWishlistStore();

    useEffect(() => {
        if (isClientAuthenticated) {
            fetchWishlist(true);
        } else {
            resetWishlist();
        }
    }, [isClientAuthenticated, fetchWishlist]);

    return <>{children}</>;
};
