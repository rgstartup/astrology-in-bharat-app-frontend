"use client";
import React from "react";
import {
  featuredCardsHeroSection,
  ListOfAllAstrologers,
  ZodiacSignsData,
  AstrologyServicesData,
  ClientsTestimoinialData,
} from "@/components/features/services/homePagaData";
import "swiper/css";
import "swiper/css/navigation";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Autoplay } from "swiper/modules";
import NextLink from "next/link";
const Link = NextLink as any;
import ProductsCarousel from "@/components/features/shop/ProductsCarousel";
import AstrologerCard from "@/components/features/astrologers/AstrologerCard";

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="banner-part ">
        <div className="overlay-hero">
          <div className="container">
            <div className="row align">
              <div className="col-lg-7 col-md-12">
                <h1>
                  Connect with
                  <span style={{ color: "#daa23e" }}>
                    Verified <br /> Astrologers{" "}
                  </span>
                  Online
                </h1>
                <h4 className="card-title mt-4 mb-4">
                  Instant Chat, Call, or Video Consultations
                </h4>
                <p>
                  At Astrology in Bharat, find trusted astrologers for love,
                  career, health, or life guidance. Connect anytime via chat,
                  audio, or video and get personalized solutions with full
                  privacy.
                </p>
                <ul className="list-check">
                  <li>
                    <i className="fa-solid fa-check"></i> Verified & Experienced
                    Astrologers
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Instant Chat, Call &
                    Video Support
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> 100% Privacy &
                    Confidentiality
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Accurate Predictions &
                    Remedies
                  </li>
                  <li>
                    <i className="fa-solid fa-check"></i> Trusted by Thousands
                    Across India
                  </li>
                </ul>
                <a href="#" className="btn-link wfc mt-4 mb-4">
                  Start Consultation
                </a>
              </div>
              <div className="col-lg-5 col-md-12">
                <div className="right-hero">
                  <img
                    src="images/Astrologer.png"
                    alt="Astrologer"
                    className="Astrologer-img"
                  />
                </div>
              </div>
            </div>

            <div className="row mt-4">
              {featuredCardsHeroSection.map((card) => (
                <div key={card.id} className="col-sm-3 col-6">
                  <a href={card.link}>
                    <div className="card-hero vert-move">
                      <img src={card.image} alt={card.altText} />
                      <h5>{card.title}</h5>
                      <p>{card.description}</p>
                    </div>
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Astrologer Listing */}
      <section className="astrologer-list">
        <div className="container">
          <h2>Find Your Astrologer</h2>

          <div className="search-box">
            <input type="text" placeholder="Search Astrologer By Name..." />
            <button>Search</button>
          </div>

          {/* <!-- Astrologer Card 1 --> */}
          <div className="astro-grid">
            {ListOfAllAstrologers.map((item) => (
              <AstrologerCard key={item.id} astrologerData={{
                ...item,
                is_available: true,
                video: item.video || ""
              }} />
            ))}
          </div>

          <div className="view-all">
            <a href="#" className="btn-link wfc m-auto">
              View All Astrologers
            </a>
          </div>
        </div>
      </section>

      {/* <!--Zodiac Signs & Horoscopes-section --> */}
      <section className="horoscopes-container">
        <div className="container">
          <div className="row">
            <h2 className="text-center mt-3 mb-2 horoscopes-heading">
              Choose Your Zodiac Sign
            </h2>
            <p className="text-center horoscopes-heading">
              Discover Your Daily, Monthly and Yearly Horoscope
            </p>

            {ZodiacSignsData.map((item) => {
              return (
                <div className="col-lg-2 col-sm-6 col-md-4 col-6" key={item.id}>
                  <a href="#">
                    <div className="horoscopes-items">
                      <img src={item.image} alt="Image Not Found" />
                      <h3>{item.title}</h3>
                      <p className="fw-normal">{item.date}</p>
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Astrology Servicees */}
      <section className="astrology-services py-5">
        <div className="container">
          <h2>Astrology Services</h2>
          <div className="row">
            {AstrologyServicesData.map((item) => {
              return (
                <div className="col-lg-3 col-md-6" key={item.id}>
                  <div className="ser-card vert-move">
                    <img
                      src={item.image}
                      alt="Kundli"
                      className="services-img"
                    />
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Prodcuts list Section */}
      <section className="product-slider-section py-50 bg-cream">
        <div className="container">
          <h2 className="text-center mb-5 heading section-title">
            🔮 Our Astrological Products
          </h2>
          <div className="product-slider-container">
            <ProductsCarousel />
          </div>
        </div>
      </section>

      {/* Why Talk to our astrologer*/}
      <section className="py-50 why-choose-us text-white">
        <div className="container">
          <h2 className="text-center  mb-5 heading text-black">
            Why Talk to Our Astrologer?
          </h2>
          <div className="row d-flex align-items-center">
            {/* Left Column of Promises */}
            <div className="col-lg-4 col-md-12 mb-4 mb-lg-0">
              <div className="d-flex flex-column gap-3">
                <div className="promise-item p-3 border border-secondary rounded-3 d-flex align-items-center">
                  <i className="fas fa-chart-line fa-2x me-3 text-sand"></i>
                  <div className="text-start">
                    <h6 className="fw-bold mb-0 text-black">
                      Accurate Predictions
                    </h6>
                    <small className="text-muted">
                      Gain clarity with precise and insightful astrological
                      readings.
                    </small>
                  </div>
                </div>
                <div className="promise-item p-3 border border-secondary rounded-3 d-flex align-items-center">
                  <i className="fas fa-lock fa-2x me-3 text-sand"></i>
                  <div className="text-start">
                    <h6 className="fw-bold mb-0 text-black">
                      100% Confidentiality
                    </h6>
                    <small className="text-muted">
                      Your conversations and data are completely private.
                    </small>
                  </div>
                </div>
                <div className="promise-item p-3 border border-secondary rounded-3 d-flex align-items-center">
                  <i className="fas fa-history fa-2x me-3 text-sand"></i>
                  <div className="text-start">
                    <h6 className="fw-bold mb-0 text-black">
                      Vedic & Modern Approach
                    </h6>
                    <small className="text-muted">
                      Our experts blend traditional wisdom with contemporary
                      insights.
                    </small>
                  </div>
                </div>
              </div>
            </div>

            {/* Center Image */}
            <div className="col-lg-4 col-md-12 text-center my-4 my-lg-0">
              <img
                src="/images/Astrologer.png" // Replace with your image path
                alt="Astrologer talking"
                className="img-fluid rounded-circle border border-gray"
                style={{ width: "300px", height: "300px", objectFit: "cover" }}
              />
            </div>

            {/* Right Column of Promises */}
            <div className="col-lg-4 col-md-12">
              <div className="d-flex flex-column gap-3">
                <div className="promise-item p-3 border border-secondary rounded-3 d-flex align-items-center">
                  <i className="fas fa-gem fa-2x me-3 text-sand"></i>
                  <div className="text-start">
                    <h6 className="fw-bold mb-0 text-black">
                      Remedial Solutions
                    </h6>
                    <small className="text-muted">
                      Receive practical solutions to mitigate planetary effects.
                    </small>
                  </div>
                </div>
                <div className="promise-item p-3 border border-secondary rounded-3 d-flex align-items-center">
                  <i className="fas fa-star fa-2x me-3 text-sand"></i>
                  <div className="text-start">
                    <h6 className="fw-bold mb-0 text-black">
                      Personalized Consultations
                    </h6>
                    <small className="text-muted">
                      Get tailored advice for your unique birth chart.
                    </small>
                  </div>
                </div>
                <div className="promise-item p-3 border border-secondary rounded-3 d-flex align-items-center">
                  <i className="fas fa-comments fa-2x me-3 text-sand"></i>
                  <div className="text-start">
                    <h6 className="fw-bold mb-0 text-black">
                      Accessible Anytime
                    </h6>
                    <small className="text-muted">
                      Connect with our astrologers on your schedule.
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section bg-cream py-50">
        <div className="container text-center">
          <h2 className="section-heading heading mb-5">What Our Clients Say</h2>
          <div className="row">
            {ClientsTestimoinialData.map((client) => (
              <div className="col-lg-4 col-md-6 mb-4" key={client.id}>
                <div className="ser-card p-4 h-100 vert-move">
                  <i
                    className="fa-solid fa-quote-left fa-2x mb-3"
                    style={{ color: "#daa23e" }}
                  ></i>
                  <p>{client.review}</p>
                  <div className="mt-3 d-flex align-items-center justify-content-center flex-column">
                    <img
                      src="/images/dummy-astrologer.jpg"
                      alt={client.name}
                      className="rounded-circle mb-2"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <strong>{client.name}</strong>
                    <div className="rating-star">
                      {"★".repeat(Math.floor(client.rating))}
                      {client.rating % 1 !== 0 ? "½" : ""}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Astrologers List */}
      <section className="featured-astrologers  py-50 ">
        <div className="container text-center">
          <h2 className="section-heading heading mb-5">
            Meet Our Trusted Astrologers
          </h2>
          <div className="row justify-content-center">
            {ListOfAllAstrologers.filter((astro) => astro.ratings >= 4.5)
              .slice(0, 3)
              .map((item) => (
                <div className="col-lg-4 col-md-6 mb-4 " key={item.id}>
                  <div
                    className="astro-card  ser-card card h-100 border border-gray shadow position-relative overflow-hidden"
                    style={{
                      borderRadius: "15px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    {/* Profile Image */}
                    <div className="position-relative p-4 pb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded-circle  border-3 border-warning shadow"
                        style={{
                          width: "120px",
                          height: "120px",
                          objectFit: "cover",
                        }}
                      />
                      <span
                        className="badge position-absolute"
                        style={{
                          background:
                            "linear-gradient(45deg, #f7d774, #e0a800)",
                          color: "#000",
                          top: "20px",
                          right: "20px",
                          fontSize: "0.8rem",
                        }}
                      >
                        ⭐ Top Rated
                      </span>
                    </div>

                    {/* Card Body */}
                    <div className="card-body mt-3">
                      <h5 className="fw-bold astro-name">{item.name}</h5>
                      <p className="card-subtitle mb-2 text-muted">
                        {item.expertise}
                      </p>

                      {/* Ratings */}
                      <div className="d-flex justify-content-center align-items-center mb-3">
                        <div
                          className="rating-star text-warning"
                          style={{ fontSize: "1.1rem" }}
                        >
                          {"★".repeat(Math.floor(item.ratings))}
                        </div>
                        <small className="ms-2 text-muted">
                          {item.ratings.toFixed(1)} / 5 ({item.ratings} reviews)
                        </small>
                      </div>

                      {/* Details */}
                      <div className="d-flex justify-content-between text-muted small mb-2">
                        <span>
                          Experience:{" "}
                          <span className="fw-bold">{item.experience}</span>
                        </span>
                        <span>
                          Consultations:{" "}
                          <span className="fw-bold">{item.ratings}</span>
                        </span>
                      </div>

                      {/* Price & Status */}
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold text-success">
                          ₹{item.price}/min
                        </h6>
                        <span className="badge bg-success">● Online</span>
                      </div>

                      {/* CTA Button */}
                      <div className="d-grid">
                        <button
                          className="btn"
                          style={{
                            background:
                              "linear-gradient(45deg, #ff9800, #f57c00)",
                            color: "white",
                            fontWeight: "600",
                            borderRadius: "25px",
                            padding: "10px",
                          }}
                        >
                          <i className="bi bi-chat-dots-fill me-2"></i> Chat Now
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default HomePage;
