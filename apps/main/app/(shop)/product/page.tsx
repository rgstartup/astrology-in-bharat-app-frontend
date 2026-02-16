import React from "react";
import ProductGrid from "@/components/features/shop/ProductGrid";

interface Product {
  id?: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
}

async function getProducts(): Promise<Product[]> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
  try {
    const res = await fetch(`${apiUrl}/api/v1/products`, { cache: "no-store" });
    if (!res.ok) {
      console.error("Failed to fetch products", res.status);
      return [];
    }
    const data = await res.json();
    return Array.isArray(data) ? data : (data.data || []);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
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


