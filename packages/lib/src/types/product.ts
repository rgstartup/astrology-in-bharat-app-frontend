import { PaginatedResponse } from "./paginated.response";
import {
  ProductType,
  ProductGroup,
  MediaRole,
  FulfillmentType,
  DiscountType,
  DeliveryType,
  ExpertProductRelationType,
} from "../enums";
import { Media } from "./media";

export interface ProductCategory {
  id: number | string;
  name: string;
  slug: string;
  created_at: string | Date;
  updated_at: string | Date;
  [key: string]: any;
}

export interface ProductVariantAttribute {
  channel?: string;
  call_type?: string;
  duration_mins?: number;
  [key: string]: any;
}

export interface ProductVariantFulfillment {
  id: number | string;
  variant_id: number | string;
  fulfillment_type: FulfillmentType;
  delivery_type: DeliveryType;
  shipping_fee: number;
  processing_time: number;
  estimated_delivery_min: number;
  estimated_delivery_max: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductVariantPricing {
  id: number | string;
  variant_id: number | string;
  amount: number;
  target_audience: string;
  currency: string;
  is_active: boolean;
  status: string;
  effective_from: string | Date;
  effective_to: string | Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface ProductVariantInventory {
  id: number;
  variant_id: number;
  stock: number;
  reserved_stock: number;
  available_stock: number;
}

export interface ProductPromotion {
  id: number;
  name: string;
  discount_type: DiscountType;
  discount_value: number;
  is_active: boolean;
  created_at: Date;
}

export interface ProductMedia {
  id: number;
  media: Media;
  role: MediaRole;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ProductVariant {
  id: number | string;
  product_id: number | string;
  name: string;
  sku: string;
  attributes: Record<string, unknown> | ProductVariantAttribute;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  inventory?: ProductVariantInventory | null;
  fulfillment?: ProductVariantFulfillment | null;
  pricing: ProductVariantPricing[];
  promotions: ProductPromotion[];
  media?: ProductMedia[];
}

export interface ProductDetail {
  id: number | string;
  name: string;
  description: string | null;
  type: ProductType;
  product_group: ProductGroup;
  merchant_id: number | string;
  created_at: string | Date;
  updated_at: string | Date;
  categories: ProductCategory[];
  variants: ProductVariant[];
}

export interface Product {
  id: string | number;
  name: string;
  categories?: ProductCategory[];
  description: string | null;
  is_active?: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  type?: ProductType;
  product_group?: ProductGroup;
  variants: ProductVariant[];
  media?: ProductMedia[];
}

export interface ProductWithLikes extends Product {
  likes_count: number;
}

export interface PaginatedProductsResponse extends PaginatedResponse<ProductWithLikes> {}

export interface ExpertProductRelation {
  id: number | string;
  expert_id: number | string;
  product_id: number | string;
  relation_type: ExpertProductRelationType;
  product: ProductDetail | Product;
  created_at?: string | Date;
  updated_at?: string | Date;
}

export type ExpertProduct = ExpertProductRelation;

export interface PaginatedExpertProductResponse extends PaginatedResponse<ExpertProductRelation> {}
