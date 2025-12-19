"use client"
import React from 'react'
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { products } from '@/data/homePagaData';

const ProductsCarousel = () => {

    return (
        <div className="position-relative">
            <Swiper
                modules={[Navigation, Autoplay]}
                speed={1200}
                spaceBetween={24}
                slidesPerView={4}
                autoplay={{
                    delay: 3200,
                    disableOnInteraction: false,
                }}
                navigation={{
                    nextEl: ".swiper-button-next-unique",
                    prevEl: ".swiper-button-prev-unique",
                }}
                loop={true}
                breakpoints={{
                    320: { slidesPerView: 1, spaceBetween: 16 },
                    640: { slidesPerView: 2, spaceBetween: 20 },
                    1024: { slidesPerView: 4, spaceBetween: 24 },
                }}
            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <div className="product-card h-100 d-flex flex-column text-start">
                            {/* <div className="product-card__badge subtle-tag">Top Pick</div> */}
                            <div className="product-card__media">
                                <img
                                    src={product.image}
                                    alt={product.title}
                                    className="product-card__image"
                                />
                            </div>
                            <h4 className="mt-3 mb-2">{product.title}</h4>
                            <p className="p-sm text-muted mb-3">{product.description}</p>
                            <div className="product-card__footer mt-auto">
                                <div>
                                    <div className="product-card__price">{product.price}</div>
                                    <div className="card-meta">Ships across India</div>
                                </div>
                                <button className="btn orderNowbtn d-inline-flex align-items-center">
                                    <i className="fas fa-shopping-cart me-2"></i>
                                    Add
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button className="swiper-button-prev-unique" aria-label="Previous products">
                <i className="fa-solid fa-arrow-left-long"></i>
            </button>
            <button className="swiper-button-next-unique" aria-label="Next products">
                <i className="fa-solid fa-arrow-right"></i>
            </button>
        </div>
    )
}

export default ProductsCarousel