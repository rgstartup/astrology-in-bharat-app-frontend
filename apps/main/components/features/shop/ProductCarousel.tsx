"use client";

import React from "react";
import NextImage from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import { ProductCard } from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";

const Image = NextImage as any;
const SwiperComponent = Swiper as any;
const SwiperSlideComponent = SwiperSlide as any;

interface Product {
    id?: string;
    _id?: string;
    imageUrl?: string;
    name: string;
    description: string;
    originalPrice: number | string;
    price: number | string;
    percentageOff?: number | string;
}

interface ProductCarouselProps {
    products: Product[];
}

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
    const [swiperInstance, setSwiperInstance] = React.useState<any>(null);

    return (
        <div
            className="w-full"
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
            {/*
            // @ts-ignore */}
            <style jsx global>{`
                .product-swiper .swiper-wrapper {
                    transition-timing-function: linear !important;
                }
            `}</style>

            <SwiperComponent
                onSwiper={setSwiperInstance}
                modules={[Autoplay, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                speed={3000}
                autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                }}
                loop={products.length > 4}
                navigation={{
                    nextEl: '.swiper-button-next-custom',
                    prevEl: '.swiper-button-prev-custom',
                }}
                breakpoints={{
                    640: {
                        slidesPerView: 2,
                    },
                    992: {
                        slidesPerView: 3,
                    },
                    1200: {
                        slidesPerView: 4,
                    },
                }}
                className="product-swiper py-5 px-1 structure-swiper"
            >
                {products.map((product) => (
                    <SwiperSlideComponent key={product.id || product._id} className="h-auto">
                        <ProductCard product={product} />
                    </SwiperSlideComponent>
                ))}
            </SwiperComponent>
        </div>
    );
};

export default ProductCarousel;



