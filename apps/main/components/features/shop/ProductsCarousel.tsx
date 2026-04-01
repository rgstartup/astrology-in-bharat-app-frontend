"use client";
import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import {
  Swiper as SwiperComp,
  SwiperSlide as SwiperSlideComp,
} from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { api } from "@/lib/api";
import { ProductCard } from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Swiper = SwiperComp as any;
const SwiperSlide = SwiperSlideComp as any;

const ProductsCarousel = () => {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const [data, err] = await api.get<any>(`/products`);
        if (err || !data) {
          console.error("Error fetching products for carousel:", err);
        } else {
          const list = Array.isArray(data) ? data : (data.data || []);
          setProductList(list);
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-[2rem] p-6 shadow-premium border border-gray-50 h-full animate-pulse">
            <div className="aspect-square bg-slate-100 rounded-3xl mb-6"></div>
            <div className="h-6 bg-slate-100 rounded-full w-3/4 mb-4"></div>
            <div className="h-4 bg-slate-100 rounded-full w-full mb-6"></div>
            <div className="h-14 bg-slate-100 rounded-2xl w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  if (productList.length === 0) {
    return null;
  }

  return (
    <div className="relative product-carousel-wrapper p-4">
      <Swiper
        modules={[Navigation, Autoplay]}
        speed={1000}
        spaceBetween={2}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next-unique",
          prevEl: ".swiper-button-prev-unique",
        }}
        loop={productList.length >= 4}
        breakpoints={{
          640: { slidesPerView: 2, spaceBetween: 24 },
          992: { slidesPerView: 3, spaceBetween: 24 },
          1200: { slidesPerView: 3, spaceBetween: 32 },
          1400: { slidesPerView: 4, spaceBetween: 32 },
        }}
        className="product-swiper-container !py-8 !px-4"
      >
        {productList.map((product) => (
          <SwiperSlide key={product.id || product._id} className="h-auto">
            <div className="h-full px-2 py-4">
              <ProductCard product={{
                id: product.id || product._id,
                name: product.name,
                description: product.description,
                price: product.price,
                originalPrice: product.originalPrice || product.price,
                imageUrl: product.image || product.imageUrl || (product.images && product.images[0]),
                percentageOff: product.percentageOff
              }} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <button className="swiper-button-prev-unique absolute top-1/2 -translate-y-1/2 -left-4 w-14 h-14 bg-white rounded-full shadow-premium border border-gray-100 text-slate-900 hover:bg-slate-950 hover:text-white transition-all duration-500 flex items-center justify-center cursor-pointer z-20 active:scale-90 group">
        <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
      </button>
      <button className="swiper-button-next-unique absolute top-1/2 -translate-y-1/2 -right-4 w-14 h-14 bg-white rounded-full shadow-premium border border-gray-100 text-slate-900 hover:bg-slate-950 hover:text-white transition-all duration-500 flex items-center justify-center cursor-pointer z-20 active:scale-90 group">
        <FaChevronRight className="group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );
};

export default ProductsCarousel;
