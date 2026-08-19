import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCartStore } from "@/store/useCartStore";
import { CartService } from "../services/cart.service";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib/utils/error";

export const useCart = () => {
    const queryClient = useQueryClient();
    const fetchCart = useCartStore((state) => state.fetchCart);

    const addToCartMutation = useMutation({
        mutationFn: async ({ productId, quantity }: { productId: string; quantity: number }) => {
            const [data, error] = await CartService.addToCart(productId, quantity) as any;
            if (error) throw error;
            return data;
        },
        // Optimistic Update
        onMutate: async ({ productId, quantity }) => {
            // Cancel outgoing refetches so they don't overwrite our optimistic update
            await queryClient.cancelQueries({ queryKey: ["cart"] });

            // Snapshot the previous value
            const previousState = useCartStore.getState();

            // Show instant success toast
            toast.success("Added to cart! Click to view", {
                onClick: () => (window.location.href = "/cart"),
                autoClose: 3000,
                style: { cursor: "pointer" },
            });

            // Optimistically update the Zustand store
            useCartStore.setState((state) => {
                const existingItemIndex = state.cartItems.findIndex(
                    (item) => (item.productId === productId || item.product?.id === productId)
                );

                const newItems = [...state.cartItems];
                if (existingItemIndex > -1) {
                    newItems[existingItemIndex] = {
                        ...newItems[existingItemIndex],
                        quantity: (newItems[existingItemIndex]?.quantity || 0) + quantity,
                    } as any;
                } else {
                    newItems.push({
                        id: Math.random(),
                        productId,
                        quantity,
                        product: { id: productId, name: "Loading...", price: 0 }
                    } as any);
                }

                return {
                    cartItems: newItems,
                    cartCount: state.cartCount + quantity,
                };
            });

            return { previousState };
        },
        onError: (err, variables, context) => {
            if (context?.previousState) {
                useCartStore.setState(context.previousState);
            }
            toast.error(getErrorMessage(err) || "Failed to add item to cart");
        },
        onSuccess: () => {
            // Success handled optimistically in onMutate
        },
        onSettled: () => {
            // Always refetch after error or success to sync with server
            queryClient.invalidateQueries({ queryKey: ["cart"] });
            fetchCart(true);
        },
    });

    return {
        addToCart: addToCartMutation.mutate,
        isAdding: addToCartMutation.isPending,
    };
};
