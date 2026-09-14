"use client";

import React from "react";
import { Swiper, SwiperSlide, type SwiperClass } from "swiper/react";
import { Autoplay, Navigation, Mousewheel } from "swiper/modules";
import { ProductCard } from "./ProductCard";

import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  useProductListStore,
  type ProductItem,
} from "@/store/useProductListStore";

interface ProductCarouselProps {
  products?: ProductItem[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({
  products: propProducts,
}) => {
  const [swiperInstance, setSwiperInstance] =
    React.useState<SwiperClass | null>(null);

  const products = useProductListStore((state) => state.products);
  const displayProducts = propProducts || products;
  return (
    <div
      className="w-full relative px-6 md:px-12"
      onMouseEnter={() => {
        if (swiperInstance) {
          swiperInstance.autoplay.stop();
        }
      }}
      onMouseLeave={() => {
        if (swiperInstance) {
          swiperInstance.autoplay.start();
        }
      }}
    >
      <Swiper
        onSwiper={setSwiperInstance}
        modules={[Autoplay, Navigation, Mousewheel]}
        spaceBetween={24}
        slidesPerView={1}
        speed={800}
        mousewheel={{
          forceToAxis: false,
          releaseOnEdges: true,
        }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
        }}
        loop={false}
        navigation={{
          nextEl: ".product-next",
          prevEl: ".product-prev",
        }}
        breakpoints={{
          480: {
            slidesPerView: 2,
            spaceBetween: 12,
          },
          768: {
            slidesPerView: 3,
            spaceBetween: 16,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
          1280: {
            slidesPerView: 4,
            spaceBetween: 24,
          },
        }}
        className="product-swiper py-5 structure-swiper px-2 md:px-4"
      >
        {displayProducts.map((product) => (
          <SwiperSlide key={product.id} className="h-auto">
            <div className="mx-auto w-full h-full">
              <ProductCard product={product} />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {displayProducts.length > 0 && (
        <>
          <button className="product-prev absolute top-1/2 -translate-y-1/2 left-0 w-10 h-10 rounded-full bg-white shadow-xl hidden md:flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white hover:scale-110 transition-all duration-300 z-20 active:scale-90 border-0">
            <ChevronLeft className="w-5 h-5 stroke-[3]" />
          </button>
          <button className="product-next absolute top-1/2 -translate-y-1/2 right-0 w-10 h-10 rounded-full bg-white shadow-xl hidden md:flex items-center justify-center text-orange-600 hover:bg-orange-600 hover:text-white hover:scale-110 transition-all duration-300 z-20 active:scale-90 border-0">
            <ChevronRight className="w-5 h-5 stroke-[3]" />
          </button>
        </>
      )}
    </div>
  );
};

export default ProductCarousel;
