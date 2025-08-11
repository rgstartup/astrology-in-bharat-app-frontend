"use client";
import React from "react";
import "swiper/css";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { products } from "@/data/homePagaData";

const ProductsList: React.FC = () => {
  return (
    <section className="products-section py-50 bg-cream  ">
      <div className="container">
        <h2 className="text-center mb-5 heading section-title">
          🔮 Our Astrological Products
        </h2>

        <Swiper
          modules={[Navigation]}
          spaceBetween={30}
          slidesPerView={4}
          navigation
          loop={true}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 20 },
            768: { slidesPerView: 2, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 30 },
          }}
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <div className="product-card d-flex flex-column h-100 my-3 shadow-sm border border-gray rounded overflow-hidden bg-white">
                <div className="product-img-wrapper">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="product-img"
                  />
                </div>
                <div className="card-body flex-fill d-flex flex-column justify-content-between p-4">
                  <div>
                    <h5 className="text-sand fw-semibold mb-2">
                      {product.title}
                    </h5>
                    <p className="card-text small text-muted">
                      {product.description}
                    </p>
                  </div>
                  <div>
                    <p className="card-text price fw-bold mb-3 ">
                      {product.price}
                    </p>
                    <button className="orderNowbtn bg-sand text-white fw-semibold w-100">
                      <i className="fas fa-shopping-cart me-2"></i>
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          {/* Custom Navigation Arrows */}
          <div className="swiper-button-prev-unique"></div>
          <div className="swiper-button-next-unique"></div>
        </Swiper>
      </div>
    </section>
  );
};

export default ProductsList;
