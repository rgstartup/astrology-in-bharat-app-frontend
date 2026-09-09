"use client";

import React from "react";
import ProductGrid from "@/components/features/shop/ProductGrid";
import ProductSeoContent from "./product-seo.component";

const ProductPage = () => {
  return (
    <>
      <ProductGrid />
      <ProductSeoContent />
    </>
  );
};

export default ProductPage;
