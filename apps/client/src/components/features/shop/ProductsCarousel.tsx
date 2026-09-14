"use client";
import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { getProducts } from "@/libs/api-products";
import { ProductCard } from "./ProductCard";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useProductListStore } from "@/store/useProductListStore";

const ProductsCarousel = () => {
  const { products, isLoading, setProducts, setIsLoading } =
    useProductListStore();

  useEffect(() => {
    if (products.length === 0) {
      setIsLoading(true);
      getProducts()
        .then((data) => {
          if (data && data.length > 0) {
            setProducts(data);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, []);

  const productList = products;
  const loading = isLoading;

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-2">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-white rounded-[2rem] p-6 shadow-premium border border-gray-50 h-full animate-pulse"
          >
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
          <SwiperSlide
            key={product.id || (product as any)?._id}
            className="h-auto"
          >
            <div className="h-full px-2 py-4">
              <ProductCard product={product} />
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
