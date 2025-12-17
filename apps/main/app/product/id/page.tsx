"use client";
import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode, Autoplay } from "swiper/modules";
import { Accordion } from "react-bootstrap";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import "swiper/css/free-mode";
import { purpose } from "@/data/homePagaData";

const Page = () => {
  const [isSticky, setIsSticky] = useState(false);

  const product = {
    title: "Crystal Healing Bracelet",
    tagline: "Unleash your inner calm and prosperity",
    price: 349,
    originalPrice: 799,
    description: "Our Celestial Healing Bracelet is meticulously crafted with natural crystals known for their profound energy-enhancing properties. This elegant piece is more than just an accessory; it's a conduit for positive energy, promoting balance, wellness, and abundance in your life. Each crystal is hand-selected and charged through ancient Vedic rituals to ensure maximum potency. Wear it daily to align your chakras and elevate your spiritual journey.",
    images: [
      "/images/product-5.jpg",
      "/images/product-4.jpg",
      "/images/product-3.jpg",
      "/images/product-1.webp",
      "/images/product-2.webp",
    ],
    details: [
      {
        title: "Material",
        text: "Natural Amethyst, Rose Quartz, and Clear Quartz beads.",
      },
      {
        title: "Craftsmanship",
        text: "Hand-strung on a durable, stretchable cord with gold-plated accents.",
      },
      {
        title: "Care Instructions",
        text: "To preserve its energy and luster, avoid prolonged contact with water and harsh chemicals. Clean with a soft, dry cloth.",
      },
      {
        title: "Dimensions",
        text: "Adjustable size, fits most wrist sizes (16-20 cm).",
      },
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
    moreDetails: {
      material: "Natural Amethyst, Rose Quartz, and Clear Quartz beads",
      care: "Avoid prolonged exposure to water. Clean with a soft, dry cloth.",
      dimensions: "Adjustable size, fits most wrist sizes.",
    },
  };


  // const relatedProducts = [
  //   { name: "Healing Stone Pendant", price: 299, image: "/images/product-6.jpg" },
  //   { name: "Aura Cleansing Kit", price: 549, image: "/images/product-6.jpg" },
  //   { name: "Zodiac Crystal Set", price: 699, image: "/images/product-6.jpg" },
  // ];

  useEffect(() => {
    const handleScroll = () => {
      const topOffset = window.scrollY;
      const productInfo = document.getElementById("product-info-section");
      if (productInfo) {
        const infoBottom =
          productInfo.getBoundingClientRect().bottom + window.scrollY;
        if (topOffset > infoBottom - 100 && topOffset < infoBottom + 500) {
          setIsSticky(true);
        } else {
          setIsSticky(false);
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  interface StarRatingInterface {
    rating: number;
  }

  const StarRating: React.FC<StarRatingInterface> = ({ rating }) =>
    Array.from({ length: 5 }, (_, i) => (
      <i
        key={i}
        className={`fas fa-star ${i < rating ? "text-warning" : "text-muted"}`}
      ></i>
    ));

  return (
    <>
      <div>
        <div className="container py-5">
          <div className="row g-5">
            {/* LEFT: Product Gallery */}
            <div className="col-md-6">
              <div className="position-relative">
                {/* Main Swiper */}
                <Swiper
                  modules={[Navigation, Thumbs]}
                  spaceBetween={10}
                  slidesPerView={1}
                  // Ab navigation ke liye custom elements ka refrence de rahe hain
                  navigation={{
                    nextEl: ".swiper-button-next-unique",
                    prevEl: ".swiper-button-prev-unique",
                  }}
                  className="mySwiper2 mb-3"
                >
                  {product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        className="w-100 rounded border border-3"
                        style={{
                          borderColor: "#d9a03d",
                          maxHeight: "500px",
                          objectFit: "cover",
                        }}
                        alt="Product"
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>

                {/* Custom Navigation Arrows */}
                <div className="swiper-button-prev-unique">
                  <i className="fa-solid fa-arrow-left-long"></i>
                </div>
                <div className="swiper-button-next-unique">
                  <i className="fa-solid fa-arrow-right"></i>
                </div>

                {/* Thumbnail Swiper */}
                <Swiper
                  spaceBetween={10}
                  slidesPerView={4}
                  freeMode={true}
                  watchSlidesProgress={true}
                  modules={[FreeMode, Navigation, Thumbs]}
                  className="mySwiper"
                >
                  {product.images.map((img, idx) => (
                    <SwiperSlide key={idx}>
                      <img
                        src={img}
                        className="w-100 rounded border"
                        style={{
                          cursor: "pointer",
                          height: "80px",
                          objectFit: "cover",
                        }}
                        alt={`Thumbnail ${idx}`}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>

            {/* RIGHT: Product Info */}
            <div className="col-md-6" id="product-info-section">
              <h1 className="fw-bold mb-3" style={{ color: "#732882" }}>
                {product.title}
              </h1>
              {/* <p className="lead text-muted mb-4">{product.tagline}</p> */}
              <div className="d-flex align-items-center mb-3">
                <span className="me-2 fw-bold" style={{ color: "#d9a03d" }}>
                  <StarRating rating={Math.round(product.avgRating)} />
                </span>
                <span className="text-muted">
                  ({product.totalRatings.toLocaleString()} ratings)
                </span>
              </div>
              <h2 className="fw-bold my-3" style={{ color: "#d9a03d" }}>
                ₹{product.price}
              </h2>

              <p className="text-secondary">{product.description}</p>

              {/* Key Points */}
              <ul className="mt-4 list-unstyled" style={{ color: "#732882" }}>
                {product.keyPoints.map((point, i) => (
                  <li key={i} className="mb-2">
                    <i
                      className="fas fa-check-circle me-2"
                      style={{ color: "#d9a03d" }}
                    ></i>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              {/* Coupon */}
              <div
                className="p-3 rounded my-4"
                style={{ background: "#fdf4e5", border: "1px dashed #d9a03d" }}
              >
                <i
                  className="fas fa-tag me-2"
                  style={{ color: "#d9a03d" }}
                ></i>
                Use code <strong>SAVE10</strong> for 10% off!
              </div>

              {/* Quantity & Buttons */}
              <div className="d-flex flex-column gap-3 mb-3">
                <div className="d-flex align-items-center">
                  <label className="me-3 fw-bold">Quantity:</label>
                  <input
                    type="number"
                    defaultValue={1}
                    min={1}
                    className="form-control"
                    style={{ width: "90px" }}
                  />
                </div>
                <button
                  className="btn fw-bold py-2"
                  style={{ background: "#d9a03d", color: "#fff" }}
                >
                  <i className="fas fa-shopping-cart me-2"></i>Add to Cart
                </button>
                <button
                  className="btn fw-bold py-2"
                  style={{ background: "#732882", color: "#fff" }}
                >
                  Buy It Now
                </button>
              </div>
            </div>
          </div>

          {/* Floating Add to Cart on scroll */}
          <div
            className="d-none d-md-block" // Hide on smaller screens
            style={{
              position: "fixed",
              bottom: isSticky ? "0" : "-150px", // Animating the bottom property
              left: 0,
              width: "100%",
              background: "rgba(252, 252, 251, 0.95)",
              borderTop: "1px solid #eee",
              padding: "1rem",
              boxShadow: "0 -4px 15px rgba(0,0,0,0.1)",
              zIndex: 1000,
              transition: "bottom 0.4s ease-in-out",
            }}
          >
            <div className="container d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <h5 className="mb-0 fw-bold me-3 text-dark">
                  {product.title}
                </h5>
                <h5 className="mb-0 fw-bold" style={{ color: "#d9a03d" }}>
                  ₹{product.price}
                </h5>
              </div>
              <div className="d-flex gap-2">
                <button
                  className="btn btn-lg fw-bold px-4"
                  style={{ background: "#d9a03d", color: "#fff" }}
                >
                  <i className="fas fa-shopping-cart me-2"></i>Add to Cart
                </button>
                <button
                  className="btn btn-lg fw-bold px-4"
                  style={{ background: "#732882", color: "#fff" }}
                >
                  Buy It Now
                </button>
              </div>
            </div>
          </div>

          <hr className="my-5" />

          {/* More Details Section */}
          {/* <section className="mb-5">
            <h3 className="fw-bold mb-4" style={{ color: "#732882" }}>
              Product Details
            </h3>
            <div className="mt-3 p-4 rounded" style={{ background: "#f8f8f8" }}>
              <div className="d-flex align-items-center mb-2">
                <strong style={{ color: "#732882" }}>Material:</strong>
                <span className="ms-2">{product.moreDetails.material}</span>
              </div>
              <div className="d-flex align-items-center mb-2">
                <strong style={{ color: "#732882" }}>Care:</strong>
                <span className="ms-2">{product.moreDetails.care}</span>
              </div>
              <div className="d-flex align-items-center">
                <strong style={{ color: "#732882" }}>Dimensions:</strong>
                <span className="ms-2">{product.moreDetails.dimensions}</span>
              </div>
            </div>
          </section> */}

          {/* Product Details Section */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4 text-center" style={{ color: "#732882" }}>
              Product Specifications
            </h3>
            <div className="row g-4 justify-content-center">
              {product.details.map((detail, idx) => (
                <div className="col-md-6 col-lg-3" key={idx}>
                  <div className="card h-100 border-0 shadow-sm rounded-lg" style={{ background: "#f8f8f8" }}>
                    <div className="card-body">
                      <h6 className="fw-bold mb-2" style={{ color: "#732882" }}>{detail.title}</h6>
                      <p className="text-muted small mb-0">{detail.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <hr className="my-5" />

          {/* FAQ Section */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4" style={{ color: "#732882" }}>
              Frequently Asked Questions
            </h3>
            <Accordion defaultActiveKey="0" flush>
              {product.faqs.map((f, i) => (
                <Accordion.Item eventKey={String(i)} key={i}>
                  <Accordion.Header>
                    <span style={{ color: "#732882" }}>{f.q}</span>
                  </Accordion.Header>
                  <Accordion.Body>{f.a}</Accordion.Body>
                </Accordion.Item>
              ))}
            </Accordion>
          </section>

          <hr className="my-5" />

          {/* Customer Reviews Section */}
          {/* Customer Reviews Section */}
          <section className="mt-5">
            <h3 className="fw-bold mb-4 text-center" style={{ color: "#732882" }}>
              Authentic Customer Reviews
            </h3>
            <div className="d-flex align-items-center justify-content-center mb-3">
              <h1 className="me-3 mb-0 display-4 fw-bold" style={{ color: "#d9a03d" }}>{product.avgRating}</h1>
              <div>
                <StarRating rating={product.avgRating} />
                <p className="ms-2 mb-0 text-muted small mt-1">{product.totalRatings.toLocaleString()} verified ratings</p>
              </div>
            </div>

            <div className="row justify-content-center">
              <div className="col-md-8">
                {product.reviewStats.map((r, idx) => (
                  <div className="d-flex align-items-center mb-2" key={idx}>
                    <span className="me-2 fw-bold" style={{ width: "50px", color: "#732882" }}>
                      {r.stars} <i className="fas fa-star text-warning"></i>
                    </span>
                    <div className="progress flex-grow-1" style={{ height: "10px", background: "#f0f0f0" }}>

                    </div>
                    <span className="ms-3 text-muted" style={{ width: "60px" }}>
                      {r.count.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center mt-4">
              <button className="btn btn-outline-secondary px-4">Write a Review</button>
            </div>
          </section>

          <hr className="my-5" />


          {/* Testimonials Section */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4 text-center" style={{ color: "#732882" }}>
              Stories from Our Customers
            </h3>
            <div className="row g-4 justify-content-center">
              {/* Swiper for testimonials to make it more dynamic */}
              <div className="col-md-10">
                <Swiper
                  modules={[Navigation, Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  navigation={true}
                  loop={true}
                  autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                  }}
                  breakpoints={{
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 3,
                    },
                  }}
                  className="mySwiper"
                >
                  {[
                    { name: "Amit Sharma", img: "/images/astro-img1.png", rating: 5, text: "The moment I put on this bracelet, I felt a shift in my energy. It's beautiful and powerful. Fast delivery and excellent quality." },
                    { name: "Priya Verma", img: "/images/astro-img1.png", rating: 4, text: "A truly beautiful product. The packaging was exquisite, and the positive vibes were immediate. Highly recommend to anyone seeking balance." },
                    { name: "Rohit Mehta", img: "/images/astro-img1.png", rating: 5, text: "Impeccable quality and authenticity. The design is so elegant, it feels like it was made just for me. A must-have for daily wear." },
                    { name: "Sneha Patel", img: "/images/astro-img1.png", rating: 5, text: "I've been wearing it for a month, and I've noticed a significant improvement in my focus and overall well-being. Thank you for this magical piece!" }
                  ].map((review, idx) => (
                    <SwiperSlide key={idx}>
                      <div className="card my-5  border border-gray shadow-sm rounded-lg" style={{ background: "#fcfcfb" }}>
                        <div className="card-body text-center d-flex flex-column justify-content-between">
                          <div>
                            <img
                              src={review.img}
                              alt={review.name}
                              className="rounded-circle mb-3 border border-3 border-warning"
                              style={{
                                width: "100px",
                                height: "100px",
                                objectFit: "cover",
                              }}
                            />
                            <h5 className="fw-bold mb-1" style={{ color: "#732882" }}>
                              {review.name}
                            </h5>
                            <div className="mb-2">
                              <StarRating rating={review.rating} />
                            </div>
                            <p className="text-muted" style={{ fontSize: "0.95rem" }}>
                              {review.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            </div>
          </section>

          <hr className="my-5" />

          {/* Related Products Section */}
          <section className="mb-5">
            <h3 className="fw-bold mb-4" style={{ color: "#732882" }}>
              Shop By Purpose
            </h3>
            <div className="product-slider-container">
              <div className="row ">
                {purpose.map((item) => (
                  <div key={item.id} className="col-lg-2 col-md-4 col-sm-6">
                    <div className=" vert-move">
                      <img
                        src={item.image}
                        alt="Image Not Found"
                        className="services-img w-100 mb-3"
                        style={{ height: "160px", objectFit: "cover" }}
                      />
                      {/* <span>{item.title}</span> */}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Why Choose Us */}
          <section className="mt-5 text-center">
            <h3 className="fw-bold mb-4" style={{ color: "#732882" }}>
              Why Choose Us
            </h3>
            <div className="row g-4 mt-3">
              {[
                {
                  icon: "fas fa-gem",
                  title: "Authentic Crystals",
                  text: "100% natural & certified products.",
                },
                {
                  icon: "fas fa-shipping-fast",
                  title: "Fast Delivery",
                  text: "Safe and quick shipping across India.",
                },
                {
                  icon: "fas fa-headset",
                  title: "Dedicated Support",
                  text: "Always here to help you with queries.",
                },
              ].map((item, i) => (
                <div className="col-md-4" key={i}>
                  <div className="card border-0 shadow-sm h-100">
                    <div className="card-body">
                      <i
                        className={`${item.icon} fa-2x mb-3`}
                        style={{ color: "#d9a03d" }}
                      ></i>
                      <h6 className="fw-bold" style={{ color: "#732882" }}>
                        {item.title}
                      </h6>
                      <p className="text-muted small">{item.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>


    </>
  );
};

export default Page;
