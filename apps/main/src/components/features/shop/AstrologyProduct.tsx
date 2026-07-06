"use client";
import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import Link from "next/link";
import { getProducts } from "../../../libs/api-products";
import ProductSection from "./ProductSection";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";
import { Product } from "@/lib/types";

const Image = NextImage as any;
const LinkComponent = Link as any;

const AstrologyProduct = () => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getProducts().then((data) => {
      setProducts(data);
      setIsLoading(false);
    });
  }, []);

  // Fallback if no products
  const productList = products || [];

  return (
    <section className="!bg-[#edeef1] py-10 md:py-16">
      <div className="max-w-[1320px] mx-auto px-0 md:px-8 lg:px-16">
        <div className="md:bg-white py-4 md:p-6 md:rounded-[3px] md:shadow-[0_4px_9px_0_rgba(0,0,0,0.08)]">
          <ProductSection products={productList} isLoading={isLoading} />
          {/* <!-- View All Button --> */}
          <div className="mt-8 mb-3 flex justify-center">
            <LinkComponent href="/product" className="bg-orange hover:opacity-90 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 w-fit no-underline">
              {t.products.viewAll}
            </LinkComponent>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyProduct;


