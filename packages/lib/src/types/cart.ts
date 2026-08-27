import { Client } from "./client";
import { Product } from "./product";

export interface Cart {
  id: string;
  created_at: Date;
  updated_at: Date;
  items: CartItem[];
  client: Client;
}

export interface CartItem {
  id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
  product: Product;
}
