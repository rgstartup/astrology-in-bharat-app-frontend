"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { WishlistService } from "../services/wishlist.service";

export interface WishlistItem {
    id: number;
    product: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string;
        image?: string;
        description?: string;
        sale_price?: number;
    };
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    isLoading: boolean;
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    refreshWishlist: () => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
    wishlistItems: [],
    isLoading: false,
    addToWishlist: async () => { },
    removeFromWishlist: async () => { },
    isInWishlist: () => false,
    refreshWishlist: async () => { },
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const { isClientAuthenticated } = useClientAuth();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch Wishlist
    const fetchWishlist = useCallback(async () => {
        if (!isClientAuthenticated) {
            setWishlistItems([]);
            return;
        }

        try {
            setIsLoading(true);
            const data = await WishlistService.getWishlist();
            // Assuming response is { items: [...] } or just [...]
            // User said: "list of wishlist items"
            const items = Array.isArray(data) ? data : (data.items || []);
            setWishlistItems(items);
        } catch (error) {
            console.error("Failed to fetch wishlist:", error);
        } finally {
            setIsLoading(false);
        }
    }, [isClientAuthenticated]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    const addToWishlist = async (productId: number) => {
        if (!isClientAuthenticated) {
            toast.error("Please login to use wishlist");
            return;
        }

        try {
            // Optimistic Update can be tricky without full product data. 
            // We'll wait for server for now to be safe, or just toggle generic state.
            await WishlistService.addToWishlist(productId);
            toast.success("Added to wishlist");
            await fetchWishlist();
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.info("Already in wishlist");
            } else {
                console.error("Add to wishlist error:", error);
                toast.error("Failed to add to wishlist");
            }
        }
    };

    const removeFromWishlist = async (productId: number) => {
        try {
            await WishlistService.removeFromWishlist(productId);
            toast.success("Removed from wishlist");
            setWishlistItems(prev => prev.filter(item =>
                (item.product.id !== productId)
            ));
        } catch (error) {
            console.error("Remove from wishlist error:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    const isInWishlist = (productId: number) => {
        return wishlistItems.some(item => item.product.id === productId);
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                isLoading,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                refreshWishlist: fetchWishlist,
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
