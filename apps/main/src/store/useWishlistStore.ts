import { create } from "zustand";
import { toast } from "react-toastify";
import { WishlistService } from "../services/wishlist.service";

export interface WishlistItem {
    id: string;
    productId?: string;
    expertId?: string;
    product?: {
        id: string;
        name: string;
        price: number;
        imageUrl?: string;
        image?: string;
        image_url?: string;
        description?: string;
        sale_price?: number;
        original_price?: number;
    };
    expert?: {
        id: string;
        user: {
            id: string;
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
    puja?: {
        id: string;
        name: string;
        total_likes: number;
    };
    merchantId?: string;
    merchant?: {
        id: string;
        name: string;
        image?: string;
        city?: string;
    };
}

interface WishlistState {
    wishlistItems: WishlistItem[];
    expertWishlistItems: WishlistItem[];
    pujaWishlistItems: WishlistItem[];
    merchantWishlistItems: WishlistItem[];
    isLoading: boolean;

    // Actions
    fetchWishlist: (isAuthenticated: boolean) => Promise<void>;
    addToWishlist: (productId: string, isAuthenticated: boolean) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;

    // Expert Actions
    addExpertToWishlist: (expertId: string, isAuthenticated: boolean) => Promise<void>;
    removeExpertFromWishlist: (expertId: string) => Promise<void>;
    isExpertInWishlist: (expertId: string) => boolean;
    toggleExpertWishlist: (expertId: string, isAuthenticated: boolean) => Promise<void>;

    // Puja Actions
    isPujaInWishlist: (pujaId: string) => boolean;
    togglePujaWishlist: (pujaId: string, isAuthenticated: boolean) => Promise<void>;

    // Merchant Actions
    isMerchantInWishlist: (merchantId: string) => boolean;
    addMerchantToWishlist: (merchantId: string, isAuthenticated: boolean) => Promise<void>;
    removeMerchantFromWishlist: (merchantId: string) => Promise<void>;
    toggleMerchantWishlist: (merchantId: string, isAuthenticated: boolean) => Promise<void>;

    // Reset
    resetWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>((set, get) => ({
    wishlistItems: [],
    expertWishlistItems: [],
    pujaWishlistItems: [],
    merchantWishlistItems: [],
    isLoading: false,

    fetchWishlist: async (isAuthenticated: boolean) => {
        if (!isAuthenticated) {
            set({ wishlistItems: [], expertWishlistItems: [], pujaWishlistItems: [], merchantWishlistItems: [] });
            return;
        }

        set({ isLoading: true });
        try {
            const [[pData], [eData], [pujaData], [merchantData]] = await Promise.all([
                WishlistService.getWishlist(),
                WishlistService.getExpertWishlist(),
                WishlistService.getPujaWishlist(),
                WishlistService.getMerchantWishlist()
            ]);

            const pItems = (Array.isArray(pData) ? pData : ((pData as any)?.items || (pData as any)?.data || (pData as any)?.wishlist || [])).filter(Boolean);
            const eItems = (Array.isArray(eData) ? eData : ((eData as any)?.items || (eData as any)?.data || (eData as any)?.wishlist || [])).filter(Boolean);
            const pujaItems = (Array.isArray(pujaData) ? pujaData : ((pujaData as any)?.items || (pujaData as any)?.data || (pujaData as any)?.wishlist || [])).filter(Boolean);
            const mItems = (Array.isArray(merchantData) ? merchantData : ((merchantData as any)?.merchants || (merchantData as any)?.data || (merchantData as any)?.items || [])).filter(Boolean);

            set({
                wishlistItems: pItems,
                expertWishlistItems: eItems,
                pujaWishlistItems: pujaItems,
                merchantWishlistItems: mItems
            });
        } catch {
            // Silent fail — wishlist is non-critical
        } finally {
            set({ isLoading: false });
        }
    },

    addToWishlist: async (productId: string, isAuthenticated: boolean) => {
        if (!isAuthenticated) {
            toast.error("Please login to use wishlist");
            return;
        }

        try {
            await WishlistService.addToWishlist(productId);
            toast.success("Added to wishlist");
            await get().fetchWishlist(true);
        } catch (error: any) {
            if (error.status === 409) {
                toast.info("Already in wishlist");
                await get().fetchWishlist(true);
            } else {
                toast.error("Failed to add to wishlist");
            }
        }
    },

    removeFromWishlist: async (productId: string) => {
        try {
            await WishlistService.removeFromWishlist(productId);
            toast.success("Removed from wishlist");
            set(state => ({
                wishlistItems: state.wishlistItems.filter(item => String(item.productId) !== String(productId) && String(item.product?.id) !== String(productId))
            }));
        } catch {
            toast.error("Failed to remove from wishlist");
        }
    },

    isInWishlist: (productId: string | string) => {
        const { wishlistItems } = get();
        return wishlistItems.some(item => (String(item.productId) === String(productId) || String(item.product?.id) === String(productId)));
    },

    addExpertToWishlist: async (expertId: string, isAuthenticated: boolean) => {
        if (!isAuthenticated) {
            toast.error("Please login to use wishlist");
            return;
        }

        try {
            await WishlistService.addExpertToWishlist(expertId);
            toast.success("Added to liked experts");
            await get().fetchWishlist(true);
        } catch (error: any) {
            if (error.status === 409) {
                toast.info("Already in liked list");
                await get().fetchWishlist(true);
            } else {
                toast.error("Failed to add to liked list");
            }
        }
    },

    removeExpertFromWishlist: async (expertId: string) => {
        try {
            await WishlistService.removeExpertFromWishlist(expertId);
            toast.success("Removed from liked list");
            set(state => ({
                expertWishlistItems: state.expertWishlistItems.filter(item => 
                    String(item.expertId) !== String(expertId) && 
                    String(item.expert?.id) !== String(expertId) && 
                    String((item.expert?.user as any)?.id) !== String(expertId)
                )
            }));
        } catch {
            toast.error("Failed to remove from liked list");
        }
    },

    isExpertInWishlist: (expertId: string | string) => {
        const { expertWishlistItems } = get();
        return expertWishlistItems.some(item =>
            item != null && (
                String(item.expertId) === String(expertId) ||
                String(item.expert?.id) === String(expertId) ||
                (item.expert?.user && String((item.expert.user as any).id) === String(expertId))
            )
        );
    },

    toggleExpertWishlist: async (expertId: string, isAuthenticated: boolean) => {
        const { isExpertInWishlist, removeExpertFromWishlist, addExpertToWishlist } = get();
        if (isExpertInWishlist(expertId)) {
            await removeExpertFromWishlist(expertId);
        } else {
            await addExpertToWishlist(expertId, isAuthenticated);
        }
    },

    isPujaInWishlist: (pujaId: string | string) => {
        const { pujaWishlistItems } = get();
        return pujaWishlistItems.some(item => (String((item as any).pujaId) === String(pujaId) || String((item as any).puja?.id) === String(pujaId)));
    },

    togglePujaWishlist: async (pujaId: string, isAuthenticated: boolean) => {
        const { isPujaInWishlist, fetchWishlist } = get();
        if (!isAuthenticated) {
            toast.error("Please login to like puja");
            return;
        }

        try {
            if (isPujaInWishlist(pujaId)) {
                await WishlistService.removePujaFromWishlist(pujaId);
                toast.success("Removed from liked pujas");
                set(state => ({
                    pujaWishlistItems: state.pujaWishlistItems.filter((item: any) => 
                        String(item.pujaId) !== String(pujaId) && String(item.puja?.id) !== String(pujaId)
                    )
                }));
            } else {
                await WishlistService.addPujaToWishlist(pujaId);
                toast.success("Added to liked pujas");
                await fetchWishlist(true);
            }
        } catch (error: any) {
            if (error.status === 409) {
                toast.info("Already liked");
                await fetchWishlist(true);
            } else {
                toast.error("Failed to update liked pujas");
            }
        }
    },

    isMerchantInWishlist: (merchantId: string | string) => {
        const { merchantWishlistItems } = get();
        return merchantWishlistItems.some(item =>
            item != null && (
                String(item.merchantId) === String(merchantId) ||
                String(item.merchant?.id) === String(merchantId) ||
                String(item.id) === String(merchantId) // Backend might return direct merchant objects
            )
        );
    },

    addMerchantToWishlist: async (merchantId: string, isAuthenticated: boolean) => {
        if (!isAuthenticated) {
            toast.error("Please login to like this store");
            return;
        }

        try {
            await WishlistService.addMerchantToWishlist(merchantId);
            toast.success("Store added to your favorites");
            await get().fetchWishlist(true);
        } catch (error: any) {
            if (error.status === 409) {
                toast.info("Already in your favorites");
                await get().fetchWishlist(true);
            } else {
                toast.error("Failed to like store");
            }
        }
    },

    removeMerchantFromWishlist: async (merchantId: string) => {
        try {
            await WishlistService.removeMerchantFromWishlist(merchantId);
            toast.success("Store removed from favorites");
            set(state => ({
                merchantWishlistItems: state.merchantWishlistItems.filter(item => 
                    String(item.merchantId) !== String(merchantId) && 
                    String(item.merchant?.id) !== String(merchantId) &&
                    String(item.id) !== String(merchantId)
                )
            }));
        } catch {
            toast.error("Failed to unlike store");
        }
    },

    toggleMerchantWishlist: async (merchantId: string, isAuthenticated: boolean) => {
        const { isMerchantInWishlist, removeMerchantFromWishlist, addMerchantToWishlist } = get();
        if (isMerchantInWishlist(merchantId)) {
            await removeMerchantFromWishlist(merchantId);
        } else {
            await addMerchantToWishlist(merchantId, isAuthenticated);
        }
    },

    resetWishlist: () => {
        set({ wishlistItems: [], expertWishlistItems: [], pujaWishlistItems: [], merchantWishlistItems: [] });
    }
}));
