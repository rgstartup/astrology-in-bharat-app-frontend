import { clientAPI } from "@/actions";
import type { Cart, BooleanMessage } from "@repo/lib";

export const CartService = {
  getCart: async () => {
    return await clientAPI
      .extend({
        headers: { "Cache-Control": "no-cache" },
      })
      .get<Cart>("/client/cart");
  },

  addToCart: async (productId: string, quantity: number) => {
    return clientAPI.post<BooleanMessage>("/client/cart", { productId, quantity });
  },

  updateQuantity: async (productId: string, quantity: number) => {
    return clientAPI.put<BooleanMessage>("/client/cart", { productId, quantity });
  },

  removeFromCart: async (productId: string) => {
    return clientAPI.delete<BooleanMessage>(`client/cart/${productId}`);
  },
};
