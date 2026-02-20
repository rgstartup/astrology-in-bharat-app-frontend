import { create } from "zustand";
import { toast } from "react-toastify";
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
            id: number;
            name: string;
            avatar?: string;
        };
        specialization: string;
        experience_in_years: number;
        rating: number;
        languages?: string[];
        price?: number;
        chat_price?: number;
        call_price?: number;
        video_call_price?: number;
        video?: string;
        is_available?: boolean;
        total_likes?: number;
    };
}

interface WishlistState {
    wishlistItems: WishlistItem[];
    expertWishlistItems: WishlistItem[];
    isLoading: boolean;

    // Actions
    fetchWishlist: (isClientAuthenticated: boolean) => Promise<void>;
    addToWishlist: (productId: number, isClientAuthenticated: boolean) => Promise<void>;
    removeFromWishlist: (productId: number) => Promise<void>;
    isInWishlist: (productId: number) => boolean;

    // Expert Actions
    addExpertToWishlist: (expertId: number, isClientAuthenticated: boolean) => Promise<void>;
    removeExpertFromWishlist: (expertId: number) => Promise<void>;
    isExpertInWishlist: (expertId: number) => boolean;
    toggleExpertWishlist: (expertId: number, isClientAuthenticated: boolean) => Promise<void>;

    // Reset
    resetWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    wishlistItems: [],
    expertWishlistItems: [],
    isLoading: false,

    fetchWishlist: async (isClientAuthenticated: boolean) => {
        if (!isClientAuthenticated) {
            set({ wishlistItems: [], expertWishlistItems: [] });
            return;
        }

        set({ isLoading: true });
        try {
            const [productsData, expertsData] = await Promise.all([
                WishlistService.getWishlist(),
                WishlistService.getExpertWishlist()
            ]);

            const pItems = Array.isArray(productsData) ? productsData : (productsData.items || productsData.data || productsData.wishlist || []);
            const eItems = Array.isArray(expertsData) ? expertsData : (expertsData.items || expertsData.data || expertsData.wishlist || []);

            set({ wishlistItems: pItems, expertWishlistItems: eItems });
        } catch {
            // Silent fail — wishlist is non-critical
        } finally {
            set({ isLoading: false });
        }
    },

    addToWishlist: async (productId: number, isClientAuthenticated: boolean) => {
        if (!isClientAuthenticated) {
            toast.error("Please login to use wishlist");
            return;
        }

        try {
            await WishlistService.addToWishlist(productId);
            toast.success("Added to wishlist");
            await get().fetchWishlist(true);
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.info("Already in wishlist");
                await get().fetchWishlist(true);
            } else {
                toast.error("Failed to add to wishlist");
            }
        }
    },

    removeFromWishlist: async (productId: number) => {
        try {
            await WishlistService.removeFromWishlist(productId);
            toast.success("Removed from wishlist");
            await get().fetchWishlist(true);
        } catch {
            toast.error("Failed to remove from wishlist");
        }
    },

    isInWishlist: (productId: number) => {
        const { wishlistItems } = get();
        return wishlistItems.some(item => (Number(item.productId) === Number(productId) || Number(item.product?.id) === Number(productId)));
    },

    addExpertToWishlist: async (expertId: number, isClientAuthenticated: boolean) => {
        if (!isClientAuthenticated) {
            toast.error("Please login to use wishlist");
            return;
        }

        try {
            await WishlistService.addExpertToWishlist(expertId);
            toast.success("Added to liked astrologers");
            await get().fetchWishlist(true);
        } catch (error: any) {
            if (error.response?.status === 409) {
                toast.info("Already in liked list");
                await get().fetchWishlist(true);
            } else {
                toast.error("Failed to add to liked list");
            }
        }
    },

    removeExpertFromWishlist: async (expertId: number) => {
        try {
            await WishlistService.removeExpertFromWishlist(expertId);
            toast.success("Removed from liked list");
            await get().fetchWishlist(true);
        } catch {
            toast.error("Failed to remove from liked list");
        }
    },

    isExpertInWishlist: (expertId: number) => {
        const { expertWishlistItems } = get();
        return expertWishlistItems.some(item => (
            Number(item.expertId) === Number(expertId) ||
            Number(item.expert?.id) === Number(expertId) ||
            (item.expert?.user && Number((item.expert.user as any).id) === Number(expertId))
        ));
    },

    toggleExpertWishlist: async (expertId: number, isClientAuthenticated: boolean) => {
        const { isExpertInWishlist, removeExpertFromWishlist, addExpertToWishlist } = get();
        if (isExpertInWishlist(expertId)) {
            await removeExpertFromWishlist(expertId);
        } else {
            await addExpertToWishlist(expertId, isClientAuthenticated);
        }
    },

    resetWishlist: () => {
        set({ wishlistItems: [], expertWishlistItems: [] });
    }
}));
