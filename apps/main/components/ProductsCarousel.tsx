"use client";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import { products } from "@/data/homePagaData";

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
      {products.map((product, index) => (
        <SwiperSlide key={product.id}>
          <div className="cosmic-product-card">
            <div className="cosmic-product-img">
              <img src={product.image} alt={product.title} />
              <span className="cosmic-product-badge">
                {index === 0 ? "Bestseller" : index === 1 ? "New" : "Premium"}
              </span>
            </div>
            <div className="cosmic-product-body">
              <h4 className="cosmic-product-name">{product.title}</h4>
              <p className="cosmic-product-desc">{product.description}</p>
              <h5 className="cosmic-product-price">{product.price}</h5>
              <button className="cosmic-product-btn">
                <i className="fas fa-shopping-cart"></i> Buy Now
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
      {/* Custom Navigation Arrows - Cosmic Style */}
      <div
        className="swiper-button-prev-unique swiper-nav-cosmic"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "50%",
          position: "absolute",
          left: "-25px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <i className="fa-solid fa-chevron-left"></i>
      </div>
      <div
        className="swiper-button-next-unique swiper-nav-cosmic"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          borderRadius: "50%",
          position: "absolute",
          right: "-25px",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
        }}
      >
        <i className="fa-solid fa-chevron-right"></i>
      </div>
    </Swiper>
  );
};

export default ProductsCarousel;
