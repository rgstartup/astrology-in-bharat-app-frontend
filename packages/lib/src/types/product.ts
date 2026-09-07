export interface Product {
  id: string;
  name: string;
  sku: string;
  category: unknown;
  description: string;
  short_description: string | null;
  price: number;
  original_price: number;
  image_url: string;
  gallery: string[] | null;
  stock: number;
  merchant_id: string;
  is_shipping_chargeable: boolean;
  shipping_charge: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  percentage_off: number;
}

export interface ProductWithLikes extends Product {
  likes_count: number;
}

export interface PaginatedProductsResponse {
  success: boolean;
  data: ProductWithLikes[];
  meta: {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  };
}
