import React from "react";
import ProductGrid from "@/components/features/shop/ProductGrid";
import { api } from "@/lib/api";
import { Product } from "@/lib/types";

async function getProducts(): Promise<Product[]> {
  const [data, fetchError] = await api.get<any>(`/products`, { cache: "no-store" });
  
  if (fetchError) {
    console.error("Failed to fetch products:", fetchError);
    return [];
  }
  
  return Array.isArray(data) ? data : (data.data || []);
}

const ProductPage = async () => {
  const products = await getProducts();

  return (
    <>
      <ProductGrid products={products} />
    </>
  );
};

export default ProductPage;
