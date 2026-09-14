import { api } from "@/actions";
import type { Cart, BooleanMessage } from "@repo/lib";

export const CartService = {
  getCart: async () => {
    return await api
      .extend({
        headers: { "Cache-Control": "no-cache" },
      })
      .get<Cart>("/client/cart");
  },

  addToCart: async (productId: string, quantity: number) => {
    return api.post<BooleanMessage>("/client/cart", { productId, quantity });
  },

  updateQuantity: async (productId: string, quantity: number) => {
    return api.put<BooleanMessage>("/client/cart", { productId, quantity });
  },

  removeFromCart: async (productId: string) => {
    return api.delete<BooleanMessage>(`client/cart/${productId}`);
  },
};
