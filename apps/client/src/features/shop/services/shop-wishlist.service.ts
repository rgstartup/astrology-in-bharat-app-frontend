import { api } from "@/actions";
import { ApiError } from "@repo/safe-fetch";

export const ShopWishlistService = {
  getWishlist: async (): Promise<[any | null, ApiError | null]> => {
    return (await api.get("/product-like")) as any;
  },

  addToWishlist: async (
    productId: string,
  ): Promise<[any | null, ApiError | null]> => {
    return (await api.post("/product-like/add", { productId })) as any;
  },

  removeFromWishlist: async (
    productId: string,
  ): Promise<[any | null, ApiError | null]> => {
    return (await api.delete(`/product-like/remove/${productId}`)) as any;
  },
};
