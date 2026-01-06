"use client"
import React from 'react'
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { products } from '@/components/AstrologyServices/homePagaData';

const ProductsCarousel = () => {

    return (
        <Swiper
            modules={[Navigation, Autoplay]}
            speed={1200}
            spaceBetween={30}
            slidesPerView={4}
            autoplay={{
                delay: 3000,
                disableOnInteraction: false,
            }}
            navigation={{
                nextEl: ".swiper-button-next-unique",
                prevEl: ".swiper-button-prev-unique",
            }}
            loop={true}
            breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                1024: { slidesPerView: 4, spaceBetween: 30 },
            }}
        >
            {products.map((product) => (
                <SwiperSlide key={product.id}>
                    <div className=" product-card h-100">
                        <img
                            src={product.image}
                            alt={product.title}
                            className="services-img w-100 mb-3"
                            style={{ height: "160px" }}
                        />
                        <h4>{product.title}</h4>
                        <p className="p-sm text-muted">{product.description}</p>
                        <div className=" mt-auto pt-3">
                            <h5 className="mb-0 fw-bold">{product.price}</h5>
                            <button className="btn btn-primary orderNowbtn mt-3">
                                <i className="fas fa-shopping-cart me-2"></i>
                                Order Now
                            </button>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
            {/* Custom Navigation Arrows */}
            <div className="swiper-button-prev-unique">
                <i className="fa-solid fa-arrow-left-long"></i>
            </div>
            <div className="swiper-button-next-unique">
                <i className="fa-solid fa-arrow-right"></i>
            </div>
        </Swiper>
    )
}

export default ProductsCarousel