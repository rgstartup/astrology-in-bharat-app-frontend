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
          <div className="product-card-luxury h-100">
            <div className="product-img-luxury">
              <img src={product.image} alt={product.title} />
              <span className="product-badge-luxury">
                {index === 0
                  ? "BEST SELLER"
                  : index === 1
                    ? "NEW"
                    : "EXCLUSIVE"}
              </span>
            </div>
            <div className="product-body-luxury">
              <h4 className="product-name-luxury">{product.title}</h4>
              <p className="product-desc-luxury">{product.description}</p>
              <h5 className="product-price-luxury">{product.price}</h5>
              <button className="product-btn-luxury">
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
            </div>
          </div>
        </SwiperSlide>
      ))}
      {/* Custom Navigation Arrows */}
      <div
        className="swiper-button-prev-unique"
        style={
          {
            background: "rgba(218, 162, 62, 0.9)",
            color: "#fff",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(218, 162, 62, 0.4)",
            transition: "all 0.3s ease",
            position: "absolute",
            left: "-70px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            border: "2px solid rgba(255, 255, 255, 0.2)",
          } as React.CSSProperties
        }
      >
        <i className="fa-solid fa-arrow-left"></i>
      </div>
      <div
        className="swiper-button-next-unique"
        style={
          {
            background: "rgba(218, 162, 62, 0.9)",
            color: "#fff",
            width: "50px",
            height: "50px",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 4px 20px rgba(218, 162, 62, 0.4)",
            transition: "all 0.3s ease",
            position: "absolute",
            right: "-70px",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            border: "2px solid rgba(255, 255, 255, 0.2)",
          } as React.CSSProperties
        }
      >
        <i className="fa-solid fa-arrow-right"></i>
      </div>
    </Swiper>
  );
};

export default ProductsCarousel;
