import { api } from "@/actions";
import { applyCoupon } from "@/libs/api-profile";
import type { ShopShippingAddress } from "../types/shop.types";

export interface CreateShopOrderPayload {
  shipping_address: ShopShippingAddress;
  product_id?: string;
  quantity?: number;
  coupon_code?: string;
}

export const ShopOrderService = {
  getMyOrders: async () => {
    return await api.get<any>("/orders/my-orders");
  },

  createOrder: async (payload: CreateShopOrderPayload) => {
    return await api.post<any>("/order", payload);
  },

  createPaymentOrder: async (payload: {
    amount: number;
    type: "product";
    coupon_code?: string;
    notes?: Record<string, any>;
  }) => {
    return await api.post<any>("/payment/orders/create", payload);
  },

  verifyPaymentOrder: async (payload: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    shipping_address?: ShopShippingAddress;
  }) => {
    return await api.post<any>("/payment/orders/verify", payload);
  },

  applyCoupon: async (couponCode: string, total: number) => {
    return await applyCoupon(couponCode, total, "product");
  },
};
