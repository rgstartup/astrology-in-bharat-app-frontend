export interface Product {
  id: string;
  name: string;
  sku: string;
  category: unknown;
  description: string;
  price: number;
  original_price: number;
  image_url: string;
  gallery: unknown;
  short_description: string;
  stock: number;
  merchant_id: string;
  is_shipping_chargeable: boolean;
  shipping_charge: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  percentage_off: number;
}
