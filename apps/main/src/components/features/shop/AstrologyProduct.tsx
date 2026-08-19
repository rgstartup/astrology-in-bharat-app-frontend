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

  const DUMMY_PRODUCTS: Product[] = [
    {
      id: "dp1",
      name: "7 Chakra Crystal Bracelet",
      description: "Balance your energy centers and attract positivity with this authentic 7 chakra healing bracelet.",
      price: 499,
      originalPrice: 999,
      imageUrl: "/images/ser1.jpg",
      percentageOff: 50,
    },
    {
      id: "dp2",
      name: "Original Rudraksha Mala",
      description: "108+1 beads original Nepali Rudraksha mala for meditation, chanting, and spiritual growth.",
      price: 899,
      originalPrice: 1599,
      imageUrl: "/images/ser2.jpg",
      percentageOff: 43,
    },
    {
      id: "dp3",
      name: "Gomati Chakra Set",
      description: "Set of 11 Gomati Chakras for wealth, prosperity and Vastu dosh nivaran in your home.",
      price: 299,
      originalPrice: 599,
      imageUrl: "/images/ser3.jpg",
      percentageOff: 50,
    },
    {
      id: "dp4",
      name: "Parad (Mercury) Shivling",
      description: "Pure Parad Shivling for supreme blessing of Lord Shiva. Brings peace, health and wealth.",
      price: 2199,
      originalPrice: 3599,
      imageUrl: "/images/ser4.jpg",
      percentageOff: 38,
    }
  ];

  // Fallback if no products
  const productList = products?.length > 0 ? products : DUMMY_PRODUCTS;

  return (
    <section id="astrology-products" className="!bg-[#edeef1] py-6 md:py-10">
      <div className="max-w-[1320px] mx-auto px-0 md:px-8 lg:px-16">
        <div className="py-4 md:py-6">
          <ProductSection products={productList} isLoading={isLoading} />
          {/* <!-- View All Button --> */}
          <div className="mt-4 flex justify-center">
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


