"use client";
import React, { useEffect, useState } from "react";
import "swiper/css";
import "swiper/css/navigation";
import {
  Swiper as SwiperComp,
  SwiperSlide as SwiperSlideComp,
} from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import axios from "axios";
import { ProductCard } from "./ProductCard";

const Swiper = SwiperComp as any;
const SwiperSlide = SwiperSlideComp as any;

const ProductsCarousel = () => {
  const [productList, setProductList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/v1/products`);
        const data = Array.isArray(res.data) ? res.data : (res.data.data || []);
        setProductList(data);
      } catch (error) {
        console.error("Error fetching products for carousel:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="row">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="col-lg-3 col-md-6 mb-4">
            <div className="bg-white rounded-xl p-3 shadow-sm h-full animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-xl mb-3"></div>
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (productList.length === 0) {
    return null;
  }

  return (
    <div className="relative product-carousel-wrapper px-2">
      <Swiper
        modules={[Navigation, Autoplay]}
        speed={1000}
        spaceBetween={24}
        slidesPerView={1}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        navigation={{
          nextEl: ".swiper-button-next-unique",
          prevEl: ".swiper-button-prev-unique",
        }}
        loop={productList.length >= 4}
        breakpoints={{
          640: { slidesPerView: 2 },
          992: { slidesPerView: 3 },
          1200: { slidesPerView: 3 },
        }}
        className="product-swiper-container !py-4"
      >
        {productList.map((product) => (
          <SwiperSlide key={product.id || product._id} className="h-auto">
            <ProductCard product={{
              id: product.id || product._id,
              name: product.name,
              description: product.description,
              price: product.price,
              originalPrice: product.originalPrice || product.price,
              imageUrl: product.image || product.imageUrl || (product.images && product.images[0]),
              percentageOff: product.percentageOff
            }} />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Arrows */}
      <div className="swiper-button-prev-unique absolute top-1/2 -translate-y-1/2 !-left-4 !w-10 !h-10 !bg-white !rounded-full !shadow-lg !text-primary hover:!bg-primary hover:!text-white transition-all flex items-center justify-center cursor-pointer z-10">
        <i className="fa-solid fa-chevron-left"></i>
      </div>
      <div className="swiper-button-next-unique absolute top-1/2 -translate-y-1/2 !-right-4 !w-10 !h-10 !bg-white !rounded-full !shadow-lg !text-primary hover:!bg-primary hover:!text-white transition-all flex items-center justify-center cursor-pointer z-10">
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </div>
  );
};

export default ProductsCarousel;


