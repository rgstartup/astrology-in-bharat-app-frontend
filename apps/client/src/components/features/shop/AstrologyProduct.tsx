"use client";
import React, { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { getProducts } from "@/libs/api-products";
import ProductSection from "./ProductSection";
import { useHomeTranslations } from "@/i18n/useHomeTranslations";
import { useProductListStore } from "@/store/useProductListStore";

const AstrologyProduct = () => {
  const { t } = useHomeTranslations();
  const { setProducts, setIsLoading } = useProductListStore();

  useEffect(() => {
    setIsLoading(true);
    getProducts()
      .then((data) => {
        setProducts(data);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [setProducts, setIsLoading]);

  return (
    <section id="astrology-products" className="!bg-[#edeef1] py-6 md:py-10">
      <div className="max-w-[1320px] mx-auto px-0 md:px-8 lg:px-16">
        <div className="py-4 md:py-6">
          <ProductSection />
          {/* <!-- View All Button --> */}
          <div className="mt-4 flex justify-center">
            <Link
              href="/product"
              className="bg-orange hover:opacity-90 text-white px-8 py-3 rounded-full font-bold shadow-lg transition-all flex items-center gap-2 w-fit no-underline"
            >
              {t.products.viewAll}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AstrologyProduct;
