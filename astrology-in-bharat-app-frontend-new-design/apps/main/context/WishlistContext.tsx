"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useClientAuth } from "@packages/ui/src/context/ClientAuthContext";
import { WishlistService } from "../services/wishlist.service";

export interface WishlistItem {
    id: number;
    productId?: number;
    expertId?: number;
    product?: {
        id: number;
        name: string;
        price: number;
        imageUrl?: string;
        image?: string;
        description?: string;
        sale_price?: number;
    };
    expert?: {
        id: number;
        user: {
            name: string;
            avatar?: string;
        };
        specialization: string;
        experience_in_years: number;
        rating: number;
    };
}

interface WishlistContextType {
    wishlistItems: WishlistItem[];
    expertWishlistItems: WishlistItem[];
    isLoading: boolean;
    addToWishlist: (productId: number) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;
    refreshWishlist: () => Promise<void>;

    // Expert Wishlist
    addExpertToWishlist: (expertId: number) => Promise<void>;
    removeExpertFromWishlist: (expertId: number) => Promise<void>;
    isExpertInWishlist: (expertId: number) => boolean;
    toggleExpertWishlist: (expertId: number) => Promise<void>;
}

const WishlistContext = createContext<WishlistContextType>({
    wishlistItems: [],
    expertWishlistItems: [],
    isLoading: false,
    addToWishlist: async () => { },
    removeFromWishlist: async () => { },
    isInWishlist: () => false,
    refreshWishlist: async () => { },
    addExpertToWishlist: async () => { },
    removeExpertFromWishlist: async () => { },
    isExpertInWishlist: () => false,
    toggleExpertWishlist: async () => { },
});

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const { isClientAuthenticated } = useClientAuth();
    const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
    const [expertWishlistItems, setExpertWishlistItems] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch Wishlist
    const fetchWishlist = useCallback(async () => {
        if (!isClientAuthenticated) {
            setWishlistItems([]);
            setExpertWishlistItems([]);
            return;
        }

        try {
            setIsLoading(true);
            const [productsData, expertsData] = await Promise.all([
                WishlistService.getWishlist(),
                WishlistService.getExpertWishlist()
            ]);

            console.log("Fetched Wishlist Data:", { productsData, expertsData });

            const pItems = Array.isArray(productsData) ? productsData : (productsData.items || productsData.data || productsData.wishlist || []);
            const eItems = Array.isArray(expertsData) ? expertsData : (expertsData.items || expertsData.data || expertsData.wishlist || []);

            setWishlistItems(pItems);
            setExpertWishlistItems(eItems);
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
            await WishlistService.addToWishlist(productId);
            toast.success("Added to wishlist");
            await fetchWishlist();
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.info("Already in wishlist");
                await fetchWishlist(); // Sync state if already exists
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
            await fetchWishlist();
        } catch (error) {
            console.error("Remove from wishlist error:", error);
            toast.error("Failed to remove from wishlist");
        }
    };

    const isInWishlist = (productId: number) => {
        return wishlistItems.some(item => (Number(item.productId) === Number(productId) || Number(item.product?.id) === Number(productId)));
    };

    // Expert Wishlist Handlers
    const addExpertToWishlist = async (expertId: number) => {
        if (!isClientAuthenticated) {
            toast.error("Please login to use wishlist");
            return;
        }

        try {
            await WishlistService.addExpertToWishlist(expertId);
            toast.success("Added to liked astrologers");
            await fetchWishlist();
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.info("Already in liked list");
                await fetchWishlist(); // Sync state if already exists
            } else {
                console.error("Add expert wishlist error:", error);
                toast.error("Failed to add to liked list");
            }
        }
    };

    const removeExpertFromWishlist = async (expertId: number) => {
        try {
            await WishlistService.removeExpertFromWishlist(expertId);
            toast.success("Removed from liked list");
            await fetchWishlist();
        } catch (error) {
            console.error("Remove expert wishlist error:", error);
            toast.error("Failed to remove from liked list");
        }
    };

    const isExpertInWishlist = (expertId: number) => {
        return expertWishlistItems.some(item => (
            Number(item.expertId) === Number(expertId) ||
            Number(item.expert?.id) === Number(expertId) ||
            (item.expert?.user && Number((item.expert.user as any).id) === Number(expertId)) // Check nested User ID
        ));
    };

    const toggleExpertWishlist = async (expertId: number) => {
        if (isExpertInWishlist(expertId)) {
            await removeExpertFromWishlist(expertId);
        } else {
            await addExpertToWishlist(expertId);
        }
    };

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                expertWishlistItems,
                isLoading,
                addToWishlist,
                removeFromWishlist,
                isInWishlist,
                refreshWishlist: fetchWishlist,
                addExpertToWishlist,
                removeExpertFromWishlist,
                isExpertInWishlist,
                toggleExpertWishlist
            }}
        >
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => useContext(WishlistContext);
