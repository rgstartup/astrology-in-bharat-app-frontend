"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import { Accordion } from "react-bootstrap";

import "swiper/css";
import "swiper/css/navigation";

const Page = () => {
  const product = {
    title: "Crystal Healing Bracelet",
    price: 349,
    description:
      "Enhance health and wealth with crystal healing energy. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus vel accumsan elit.",
    images: [
      "/images/product-5.jpg",
      "/images/product-4.jpg",
      "/images/product-3.jpg",
      "/images/product-1.webp",
      "/images/product-2.webp",
    ],
    keyPoints: [
      "100% Natural & Authentic",
      "Energy charged by Vedic rituals",
      "Certified quality",
      "Free delivery across India",
    ],
    faqs: [
      {
        q: "Is it real crystal?",
        a: "Yes, all our crystals are 100% natural and certified.",
      },
      {
        q: "How long will it take to see results?",
        a: "It depends on personal energy alignment; usually weeks.",
      },
      {
        q: "Can I wear it daily?",
        a: "Yes, you can wear it every day for best effects.",
      },
    ],
    reviewStats: [
      { stars: 5, count: 64083 },
      { stars: 4, count: 20219 },
      { stars: 3, count: 5300 },
      { stars: 2, count: 2009 },
      { stars: 1, count: 4201 },
    ],
    totalRatings: 95812,
    avgRating: 4.4,
  };

  return (
    <div style={{ background: "#fcfcfb" }}>
      <div className="container py-5">
        <div className="row g-5">
          {/* LEFT: Swiper Carousel */}
          <div className="col-md-6">
            <div className="position-relative">
              <Swiper
                modules={[Navigation]}
                navigation={{
                  nextEl: ".custom-next",
                  prevEl: ".custom-prev",
                }}
                spaceBetween={10}
                slidesPerView={1}
              >
                {product.images.map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <img
                      src={img}
                      className="w-100 rounded border border-3"
                      style={{
                        borderColor: "#d9a03d",
                        maxHeight: "450px",
                        objectFit: "cover",
                      }}
                      alt="Product"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              {/* Custom Navigation */}
              <div
                className="custom-prev btn btn-light rounded-circle shadow position-absolute top-50 start-0 translate-middle-y"
                style={{ zIndex: 5 }}
              >
                <i className="fas fa-chevron-left"></i>
              </div>
              <div
                className="custom-next btn btn-light rounded-circle shadow position-absolute top-50 end-0 translate-middle-y"
                style={{ zIndex: 5 }}
              >
                <i className="fas fa-chevron-right"></i>
              </div>
            </div>
          </div>

          {/* RIGHT: Product Info */}
          <div className="col-md-6">
            <h2 style={{ color: "#732882", fontWeight: "bold" }}>
              {product.title}
            </h2>
            <p className="text-muted">{product.description}</p>
            <h3 style={{ color: "#d9a03d" }}>₹{product.price}</h3>

            {/* Quantity */}
            <div className="d-flex align-items-center mb-3">
              <label className="me-2 fw-bold">Quantity:</label>
              <input
                type="number"
                defaultValue={1}
                min={1}
                className="form-control"
                style={{ width: "90px" }}
              />
            </div>

            {/* Buttons */}
            <div className="d-flex gap-3 mb-3">
              <button
                className="btn fw-bold"
                style={{ background: "#d9a03d", color: "#fff" }}
              >
                <i className="fas fa-shopping-cart me-2"></i>Add to Cart
              </button>
              <button
                className="btn fw-bold"
                style={{ background: "#732882", color: "#fff" }}
              >
                Buy It Now
              </button>
            </div>

            {/* Coupon */}
            <div
              className="p-3 rounded"
              style={{ background: "#fdf4e5", border: "1px dashed #d9a03d" }}
            >
              <i className="fas fa-tag me-2" style={{ color: "#d9a03d" }}></i>
              Use code <strong>SAVE10</strong> for 10% off!
            </div>

            {/* Key Points */}
            <ul className="mt-4 list-unstyled">
              {product.keyPoints.map((point, i) => (
                <li key={i} className="mb-2">
                  <i
                    className="fas fa-check-circle me-2"
                    style={{ color: "#d9a03d" }}
                  ></i>
                  <span style={{ color: "#732882" }}>{point}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="mt-5">
          <h4 style={{ color: "#732882" }}>FAQs</h4>
          <Accordion defaultActiveKey="0" flush>
            {product.faqs.map((f, i) => (
              <Accordion.Item eventKey={String(i)} key={i}>
                <Accordion.Header>{f.q}</Accordion.Header>
                <Accordion.Body>{f.a}</Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </section>

        {/* Customer Reviews Section */}
        <section className="mt-5">
          <h4 style={{ color: "#732882" }}>Customer Reviews</h4>
          <div className="d-flex align-items-center mb-3">
            <h1 className="me-2 mb-0">{product.avgRating}</h1>
            <i className="fas fa-star text-warning fs-3"></i>
            <span className="ms-2 text-muted">
              {product.totalRatings.toLocaleString()} Ratings
            </span>
          </div>

          {product.reviewStats.map((r, idx) => (
            <div className="d-flex align-items-center mb-2" key={idx}>
              <span className="me-2" style={{ width: "50px" }}>
                {r.stars} <i className="fas fa-star text-warning"></i>
              </span>
              <div className="progress flex-grow-1" style={{ height: "8px" }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${(r.count / product.totalRatings) * 100}%`,
                    background: "#d9a03d",
                  }}
                ></div>
              </div>
              <span className="ms-2 text-muted">
                {r.count.toLocaleString()}
              </span>
            </div>
          ))}
        </section>

        {/* Client Testimonials Section */}
        <section className="mt-5">
          <h4 style={{ color: "#732882" }}>What Our Customers Say</h4>
          <div className="row g-4 mt-3">
            {[
              {
                name: "Amit Sharma",
                img: "/images/astro-img1.png",
                rating: 5,
                text: "Absolutely love this crystal bracelet! It feels high quality and the energy is amazing. Delivery was super fast too.",
              },
              {
                name: "Priya Verma",
                img: "/images/astro-img1.png",
                rating: 4,
                text: "Beautiful product. Packaging was nice and I could feel the positive vibes right away. Would recommend to friends.",
              },
              {
                name: "Rohit Mehta",
                img: "/images/astro-img1.png",
                rating: 5,
                text: "Excellent quality and authenticity. The design is elegant and fits comfortably on the wrist.",
              },
            ].map((review, idx) => (
              <div className="col-md-4" key={idx}>
                <div className="card border-0 shadow-sm h-100">
                  <div className="card-body text-center">
                    <img
                      src={review.img}
                      alt={review.name}
                      className="rounded-circle mb-3"
                      style={{
                        width: "80px",
                        height: "80px",
                        objectFit: "cover",
                      }}
                    />
                    <h6 className="fw-bold mb-1">{review.name}</h6>
                    <div className="mb-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star ${
                            i < review.rating ? "text-warning" : "text-muted"
                          }`}
                        ></i>
                      ))}
                    </div>
                    <p className="text-muted" style={{ fontSize: "0.95rem" }}>
                      "{review.text}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Page;
