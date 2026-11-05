import type { CartItem, Product as BaseProduct, ProductWithLikes } from "@repo/lib";

export interface ShopProductVariant {
  id?: string | number;
  name?: string;
  sku?: string;
  pricing?: Array<{ amount: number | string }>;
  promotions?: Array<{ discount_value: number | string }>;
}

export interface ShopProduct {
  id: string | number;
  name: string;
  description?: string;
  price?: number | string;
  sale_price?: number | string;
  original_price?: number | string;
  image?: string;
  imageUrl?: string;
  images?: string[];
  gallery?: string[];
  category?: string;
  likes_count?: number;
  variants?: ShopProductVariant[];
  details?: Array<{ title: string; text: string }>;
  faqs?: Array<{ q: string; a: string }>;
  keyPoints?: string[];
  avgRating?: number;
  totalRatings?: number;
  reviewStats?: Array<{ stars: number; count: number }>;
  is_shipping_chargeable?: boolean;
  shipping_charge?: number | string;
  merchant_id?: string;
}

export interface ShopShippingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone: string;
  alternate_phone?: string;
}

export interface ShopOrderSummary {
  subtotal: number;
  shipping: number;
  platformFee: number;
  discount: number;
  total: number;
}
