import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useWishlistStore } from "@/store/useWishlistStore";
import { WishlistService } from "../services/wishlist.service";
import { toast } from "react-toastify";

export type WishlistType = "expert" | "product" | "puja" | "merchant";

export const useWishlist = () => {
    const queryClient = useQueryClient();

    const toggleLikeMutation = useMutation({
        mutationFn: async ({
            id,
            type,
            isLiked,
        }: {
            id: string;
            type: WishlistType;
            isLiked: boolean;
        }) => {
            if (type === "expert") {
                return isLiked
                    ? WishlistService.removeExpertFromWishlist(id)
                    : WishlistService.addExpertToWishlist(id);
            } else if (type === "puja") {
                return isLiked
                    ? WishlistService.removePujaFromWishlist(id)
                    : WishlistService.addPujaToWishlist(id);
            } else if (type === "merchant") {
                return isLiked
                    ? WishlistService.removeMerchantFromWishlist(id)
                    : WishlistService.addMerchantToWishlist(id);
            } else {
                return isLiked
                    ? WishlistService.removeFromWishlist(id)
                    : WishlistService.addToWishlist(id);
            }
        },
        // Optimistic Update
        onMutate: async ({ id, type, isLiked }) => {
            // Cancel outgoing refetches
            let queryKey = ["wishlist", "products"];
            if (type === "expert") queryKey = ["wishlist", "experts"];
            if (type === "puja") queryKey = ["wishlist", "pujas"];
            if (type === "merchant") queryKey = ["wishlist", "merchants"];
            
            await queryClient.cancelQueries({ queryKey });

            // Snapshot previous values
            const store = useWishlistStore.getState();
            const previousState = {
                expertWishlistItems: store.expertWishlistItems,
                wishlistItems: store.wishlistItems,
                pujaWishlistItems: store.pujaWishlistItems,
                merchantWishlistItems: store.merchantWishlistItems,
            };

            // Optimistically update Zustand store
            if (type === "expert") {
                if (isLiked) {
                    useWishlistStore.setState((state) => ({
                        expertWishlistItems: state.expertWishlistItems.filter(
                            (item) => String(item.expertId || item.expert?.id) !== String(id)
                        ),
                    }));
                } else {
                    useWishlistStore.setState((state) => ({
                        expertWishlistItems: [...state.expertWishlistItems, { expertId: id, expert: { id } } as any],
                    }));
                }
            } else if (type === "puja") {
                if (isLiked) {
                    useWishlistStore.setState((state) => ({
                        pujaWishlistItems: state.pujaWishlistItems.filter(
                            (item) => String((item as any).pujaId || item.puja?.id) !== String(id)
                        ),
                    }));
                } else {
                    useWishlistStore.setState((state) => ({
                        pujaWishlistItems: [...state.pujaWishlistItems, { pujaId: id, puja: { id } } as any],
                    }));
                }
            } else if (type === "merchant") {
                if (isLiked) {
                    useWishlistStore.setState((state) => ({
                        merchantWishlistItems: state.merchantWishlistItems.filter(
                            (item) => String(item.merchantId || item.id) !== String(id)
                        ),
                    }));
                } else {
                    useWishlistStore.setState((state) => ({
                        merchantWishlistItems: [...state.merchantWishlistItems, { id, merchantId: id } as any],
                    }));
                }
            } else {
                if (isLiked) {
                    useWishlistStore.setState((state) => ({
                        wishlistItems: state.wishlistItems.filter(
                            (item) => String(item.productId || item.product?.id) !== String(id)
                        ),
                    }));
                } else {
                    useWishlistStore.setState((state) => ({
                        wishlistItems: [...state.wishlistItems, { productId: id, product: { id } } as any],
                    }));
                }
            }

            return { previousState };
        },
        onError: (err, variables, context) => {
            if (context?.previousState) {
                useWishlistStore.setState(context.previousState);
            }
        },
        onSettled: (data, error, variables) => {
            let queryKey = ["wishlist", "products"];
            if (variables.type === "expert") queryKey = ["wishlist", "experts"];
            if (variables.type === "puja") queryKey = ["wishlist", "pujas"];
            if (variables.type === "merchant") {
                queryKey = ["wishlist", "merchants"];
                // Also invalidate the main merchants listing to sync likesCount and isLiked
                queryClient.invalidateQueries({ queryKey: ["merchants"] });
            }
            
            queryClient.invalidateQueries({ queryKey });
            // Sync store
            useWishlistStore.getState().fetchWishlist(true);
        },
    });

    return {
        toggleLike: toggleLikeMutation.mutate,
        isPending: toggleLikeMutation.isPending,
    };
};
