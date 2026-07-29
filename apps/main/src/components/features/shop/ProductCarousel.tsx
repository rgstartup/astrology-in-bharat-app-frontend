"use client";

import React from "react";
import NextImage from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Mousewheel } from "swiper/modules";
import { ProductCard } from "./ProductCard";

import "swiper/css";
import "swiper/css/navigation";

const Image = NextImage as any;
const SwiperComponent = Swiper as any;
const SwiperSlideComponent = SwiperSlide as any;

import { Product } from "@/lib/types";

interface ProductCarouselProps {
    products: Product[];
}

import { ChevronLeft, ChevronRight } from "lucide-react";

const DUMMY_PRODUCTS = [
    {
        id: "dummy-prod-1",
        name: "7 Mukhi Rudraksha",
        price: 2100,
        image: "/images/pooja/pooja1.png",
        rating: 4.8,
        description: "Original Nepali 7 Mukhi Rudraksha for wealth and prosperity",
    },
    {
        id: "dummy-prod-2",
        name: "Crystal Sphatik Mala",
        price: 1500,
        image: "/images/pooja/pooja2.png",
        rating: 4.9,
        description: "Pure sphatik mala for mental peace and focus",
    },
    {
        id: "dummy-prod-3",
        name: "Gomati Chakra Tree",
        price: 1100,
        image: "/images/pooja/pooja1.png",
        rating: 4.7,
        description: "Vastu Gomati Chakra tree for home positivity",
    },
    {
        id: "dummy-prod-4",
        name: "Parad Shivling",
        price: 3500,
        image: "/images/pooja/pooja2.png",
        rating: 5.0,
        description: "Mercury Shivling for ultimate blessings",
    }
];

const ProductCarousel: React.FC<ProductCarouselProps> = ({ products }) => {
    const [swiperInstance, setSwiperInstance] = React.useState<any>(null);

    const displayProducts = products.length > 0 && products.length < 4
        ? [...products, ...DUMMY_PRODUCTS.slice(0, 4 - products.length)]
        : products.length === 0
            ? DUMMY_PRODUCTS
            : products;

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
            <SwiperComponent
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
                    nextEl: '.product-next',
                    prevEl: '.product-prev',
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
                    <SwiperSlideComponent key={product.id || (product as any)._id} className="h-auto">
                        <div className="mx-auto w-full h-full">
                            <ProductCard product={product} />
                        </div>
                    </SwiperSlideComponent>
                ))}
            </SwiperComponent>

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



