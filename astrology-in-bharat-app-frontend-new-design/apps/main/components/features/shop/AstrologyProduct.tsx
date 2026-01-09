import React from "react";
import NextImage from "next/image";
import Link from "next/link";
import { getProducts } from "../../../libs/api-products";
import ProductSection from "./ProductSection";

const Image = NextImage as any;
const LinkComponent = Link as any;

const AstrologyProduct = async () => {
  const products = await getProducts();

  // Fallback if no products
  const productList = products || [];

  return (
    <section className="aib-products-section bg-edeef1 space-section">
      <div className="container">
        <div className="light-card">
          <ProductSection products={productList} />
          {/* <!-- View All Button --> */}
          <div className="view-all mt-4 mb-3">
            <LinkComponent href="/product" className="btn-link wfc m-auto text-decoration-none">
              View All Products
            </LinkComponent>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyProduct;
