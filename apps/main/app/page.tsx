"use client";
import React, { useState, useEffect } from "react";
import {
  AstrologyServicesData,
  ClientsTestimoinialData,
  ListOfAllAstrologers,
  ZodiacSignsData,
  featuredCardsHeroSection,
} from "@/data/homePagaData";
import AstrologerCard from "@/components/AstrologerCard";
import SearchBar from "@/components/SearchBar";
import ProductsCarousel from "@/components/ProductsCarousel";
import FilterModal from "@/components/FilterModal";
import SortModal from "@/components/SortModal";
import SpecializationCarousel from "@/components/SpecializationCarousel";

interface FilterState {
  location: string;
  language: string;
  rating: number;
  price: number;
}

const Page: React.FC = () => {
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(8);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);

  // Modal visibility states
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterState>>(
    {}
  );
  const [appliedSort, setAppliedSort] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setOffset(0);
    setIsFilterOpen(false);
  };

  const handleApplySorts = (sortOption: string) => {
    // Sort logic handled by backend API param
    setAppliedSort(sortOption);
    setOffset(0);
    setIsSortOpen(false);
  };

  const handleSpecializationChange = (spec: string) => {
    setSelectedSpecialization(spec);
    setOffset(0);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 800);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearchChange = (query: string) => {
    setSearchInput(query);
  };

  const buildQueryString = () => {
    const params: Record<string, any> = {};
    params.limit = limit;
    params.offset = offset;

    if (selectedSpecialization) params.specializations = selectedSpecialization;
    if (appliedFilters.location) params.location = appliedFilters.location;
    if (appliedFilters.language) params.languages = appliedFilters.language;
    if (appliedFilters.rating) params.minRating = appliedFilters.rating;
    if (appliedFilters.price) params.maxPrice = appliedFilters.price;
    if (appliedSort) params.sort = appliedSort;

    const esc = encodeURIComponent;
    return Object.keys(params)
      .map((k) => `${esc(k)}=${esc(params[k])}`)
      .join("&");
  };

  const fetchExperts = async () => {
    setLoading(true);
    setError(null);
    try {
      const qs = buildQueryString();
      const url = `http://localhost:4000/api/v1/expert/profile/list?${qs}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);
      const json = await res.json();
      const data = json.data || [];
      setTotal(json.pagination?.total ?? null);

      const mapped = data.map((p: any) => ({
        image: p.user?.avatar || "/images/astro-img1.png",
        name: p.user?.name || p.name || "Unknown",
        expertise: p.specialization || p.expertise || "",
        experience: p.experience_in_years ?? p.experience ?? 0,
        language: Array.isArray(p.languages)
          ? p.languages.join(", ")
          : p.languages || p.user?.language || "",
        price: p.price_per_minute ?? p.price ?? 0,
        video: p.video || "",
        ratings: p.rating ?? p.ratings ?? 0,
      }));

      setExperts((prev) => (offset === 0 ? mapped : [...prev, ...mapped]));
      console.log("Fetched experts:", mapped);
    } catch (err: any) {
      setError(err.message || "Failed to fetch experts");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExperts = () => {
    if (!searchQuery.trim()) {
      return experts;
    }

    const query = searchQuery.toLowerCase();
    return experts.filter((expert) => {
      const name = expert.name?.toLowerCase() || "";
      const language = expert.language?.toLowerCase() || "";
      const expertise = expert.expertise?.toLowerCase() || "";

      return (
        name.includes(query) ||
        language.includes(query) ||
        expertise.includes(query)
      );
    });
  };

  useEffect(() => {
    fetchExperts();
  }, [appliedFilters, appliedSort, limit, offset, selectedSpecialization]);
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
                  <span className="color-primary">
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
                <a href="#" className="btn-link wfc mt-4 mb-4 w-40">
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

      {/* Find Your Astrologer */}
      <section className="astrologer-list">
        <div className="container">
          <div
            className="talk-to-astrologer-banner position-relative rounded-4 overflow-hidden mb-5 text-white"
            style={{
              background: "linear-gradient(90deg, #1a1a2e 0%, #16213e 100%)",
              minHeight: "200px",
              display: "flex",
              alignItems: "center",
            }}
          >
            <div
              className="position-absolute w-100 h-100"
              style={{
                background: "url('/images/stars-pattern.png')",
                opacity: 0.1,
              }}
            ></div>
            <div className="p-5 position-relative z-10">
              <h2 className="fw-bold mb-2 text-warning display-6">
                Chat with Astrologer
              </h2>
              <p className="mb-0 text-white-50">
                Get instant guidance from India&apos;s best vedic experts.
              </p>
            </div>
          </div>

          <div
            className="sticky-md-top bg-white py-3 z-3 shadow-none"
            style={{ top: "0px" }}
          >
            <div className="row g-2 align-items-center">
              <div className="col-lg-8 col-md-6">
                <SearchBar
                  searchQuery={searchInput}
                  onSearchChange={handleSearchChange}
                />
              </div>
              <div className="col-lg-2 col-md-3 col-6">
                <button
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill fw-medium"
                  onClick={() => setIsFilterOpen(true)}
                  style={{ height: "52px", borderColor: "#e0e0e0" }}
                >
                  <i className="fa-solid fa-sliders text-warning"></i> Filter
                </button>
              </div>
              <div className="col-lg-2 col-md-3 col-6">
                <button
                  className="btn btn-outline-secondary w-100 d-flex align-items-center justify-content-center gap-2 py-2 rounded-pill fw-medium"
                  onClick={() => setIsSortOpen(true)}
                  style={{ height: "52px", borderColor: "#e0e0e0" }}
                >
                  <i className="fa-solid fa-arrow-down-short-wide text-warning"></i>{" "}
                  Sort
                </button>
              </div>
            </div>

            {/* Specialization Carousel */}
            <SpecializationCarousel
              selectedSpecialization={selectedSpecialization}
              onSpecializationChange={handleSpecializationChange}
            />
          </div>

          <FilterModal
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            onApply={handleApplyFilters}
          />
          <SortModal
            isOpen={isSortOpen}
            onClose={() => setIsSortOpen(false)}
            onApply={handleApplySorts}
          />

          {/* <!-- Astrologer Grid --> */}
          <div className="astro-grid mt-4">
            {loading && offset === 0 && (
              <div className="col-12 text-center py-5">
                <i className="fa-solid fa-spinner fa-spin fa-3x text-warning"></i>
                <p className="mt-3">Loading astrologers...</p>
              </div>
            )}

            {error && (
              <div className="col-12 text-center py-5">
                <i className="fa-regular fa-face-frown fa-4x text-muted mb-3"></i>
                <h4 className="text-muted">Oops! Something went wrong.</h4>
                <p className="text-muted">{error}</p>
                <button
                  className="btn btn-outline-warning mt-3"
                  onClick={() => {
                    setOffset(0);
                    fetchExperts();
                  }}
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !error && getFilteredExperts().length === 0 && (
              <div className="col-12 text-center py-5">
                <p className="text-muted">
                  No astrologers found matching your criteria.
                </p>
              </div>
            )}

            {!loading &&
              !error &&
              getFilteredExperts().map((item, idx) => {
                return <AstrologerCard astrologerData={item} key={idx} />;
              })}
          </div>

          {/* Pagination Loader or Load More */}
          <div className="view-all text-center mt-5">
            {loading && offset > 0 && (
              <div className="text-center">
                <i className="fa-solid fa-spinner fa-spin text-warning fa-2x"></i>
              </div>
            )}

            {(total === null || experts.length < total) &&
              !loading &&
              !error && (
                <button
                  className="btn-global btn-secondary wfc m-auto"
                  onClick={() => setOffset((prev) => prev + limit)}
                  style={{
                    boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                  }}
                >
                  Load More Astrologers
                </button>
              )}
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

      {/* Products Listing page */}
      <section className="product-slider-section py-50 bg-cream">
        <div className="container">
          <h2 className="text-center mb-5 heading section-title">
            Our Astrological Products
          </h2>
          <div className="product-slider-container">
            <ProductsCarousel />
          </div>
        </div>
      </section>

      {/* Why Talk to our astrologer*/}
      {/* Why Talk to our astrologer - PREMIUM REDESIGN */}
      <section className="why-choose-us text-white">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="heading text-white title-secondary mb-2">
              Why Choose Astrology in Bharat?
            </h2>
            <p className="text-white-50">
              Experience the difference with our premium astrological services.
            </p>
          </div>

          <div className="row g-4 justify-content-center">
            {/* Feature 1 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card-premium text-center">
                <div className="feature-icon-wrapper mx-auto">
                  <i className="fas fa-chart-line"></i>
                </div>
                <h5 className="feature-title">Accurate Predictions</h5>
                <p className="feature-desc">
                  Gain clarity with precise and insightful astrological readings
                  rooted in Vedic wisdom.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card-premium text-center">
                <div className="feature-icon-wrapper mx-auto">
                  <i className="fas fa-user-shield"></i>
                </div>
                <h5 className="feature-title">100% Confidentiality</h5>
                <p className="feature-desc">
                  Your privacy is our priority. Talk freely in a secure and
                  private environment.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card-premium text-center">
                <div className="feature-icon-wrapper mx-auto">
                  <i className="fas fa-gem"></i>
                </div>
                <h5 className="feature-title">Premium Remedies</h5>
                <p className="feature-desc">
                  Get effective, practical solutions to mitigate planetary
                  effects and enhance your life.
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card-premium text-center">
                <div className="feature-icon-wrapper mx-auto">
                  <i className="fas fa-star"></i>
                </div>
                <h5 className="feature-title">Verified Experts</h5>
                <p className="feature-desc">
                  Connect with India&apos;s most trusted and experienced
                  astrologers, verified for quality.
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div className="col-lg-4 col-md-6">
              <div className="feature-card-premium text-center">
                <div className="feature-icon-wrapper mx-auto">
                  <i className="fas fa-comments"></i>
                </div>
                <h5 className="feature-title">Instant Access</h5>
                <p className="feature-desc">
                  Chat, call, or video consult with astrologers anytime,
                  anywhere on your schedule.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Clients Testimonials Section */}
      {/* Clients Testimonials Section - PREMIUM REDESIGN */}
      <section className="testimonials-section">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="heading title-secondary color-primary">
              Stories of Transformation
            </h2>
            <p className="text-muted">
              Hear from those who found clarity and direction.
            </p>
          </div>

          <div className="row">
            {ClientsTestimoinialData.map((client) => (
              <div className="col-lg-4 col-md-6 mb-4" key={client.id}>
                <div className="testimonial-card-premium h-100">
                  <i className="fas fa-quote-right quote-icon-large"></i>

                  <div className="text-center">
                    <div className="rating-star mb-3">
                      {"★".repeat(Math.floor(client.rating))}
                      {client.rating % 1 !== 0 ? "½" : ""}
                    </div>
                  </div>

                  <p className="testimonial-text text-center">
                    &quot;{client.review}&quot;
                  </p>

                  <div className="client-info justify-content-center">
                    <img
                      src="images/astro-img1.png"
                      alt={client.name}
                      className="client-avatar"
                    />
                    <div className="client-details text-start">
                      <h5>{client.name}</h5>
                      <small className="text-muted">Verified Client</small>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Astrologers List - ELITE GOLD EDITION */}
      <section className="featured-astrologers-elite py-5">
        <div className="container">
          <div className="text-center mb-5">
            <h2 className="title-secondary color-primary mb-2">
              Connect with India&apos;s Elite Astrologers
            </h2>
            <p className="color-dark fw-medium">
              Experience the wisdom of top-tier verified spiritual guides.
            </p>
          </div>

          <div className="row justify-content-center">
            {ListOfAllAstrologers.filter((astro) => astro.ratings >= 4.5)
              .slice(0, 3)
              .map((item) => (
                <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
                  <div className="astro-card-elite">
                    <div className="price-chip">
                      ₹{item.price}
                      <span>/min</span>
                    </div>

                    <div className="profile-section-elite">
                      <div className="img-frame-elite">
                        <img src={item.image} alt={item.name} />
                        <div className="online-dot-elite"></div>
                      </div>
                      <div className="name-info-elite">
                        <h3>{item.name}</h3>
                        <span className="expertise-elite">
                          {item.expertise}
                        </span>
                        <div className="badge-verified-elite">
                          <i className="fas fa-check-circle"></i> Verified
                          Expert
                        </div>
                      </div>
                    </div>

                    <div className="elite-tagline">
                      Specializes in solving complex life problems through
                      accurate Vedic analysis and traditional cosmic wisdom.
                    </div>

                    <div className="divider-gold"></div>

                    <div className="details-grid-elite">
                      <div className="detail-item-elite">
                        <div className="icon-box-elite">
                          <i className="fas fa-history"></i>
                        </div>
                        <div className="detail-text-elite">
                          <strong>{item.experience}+ Yr</strong>
                          <span>Exp</span>
                        </div>
                      </div>
                      <div className="detail-item-elite">
                        <div className="icon-box-elite">
                          <i className="fas fa-star"></i>
                        </div>
                        <div className="detail-text-elite">
                          <strong>{item.ratings}</strong>
                          <span>Ratings</span>
                        </div>
                      </div>
                      <div className="detail-item-elite">
                        <div className="icon-box-elite">
                          <i className="fas fa-globe"></i>
                        </div>
                        <div className="detail-text-elite">
                          <strong>{item.language.split(",")[0]}</strong>
                          <span>Language</span>
                        </div>
                      </div>
                      <div className="detail-item-elite">
                        <div className="icon-box-elite">
                          <i className="fas fa-users"></i>
                        </div>
                        <div className="detail-text-elite">
                          <strong>12K+</strong>
                          <span>Consults</span>
                        </div>
                      </div>
                    </div>

                    <div className="topics-container">
                      <span className="topic-pill">Love</span>
                      <span className="topic-pill">Career</span>
                      <span className="topic-pill">Marriage</span>
                      <span className="topic-pill">Vastu</span>
                    </div>

                    <div className="actions-elite">
                      <button className="btn-elite btn-elite-gold">
                        <i className="bi bi-chat-dots"></i> Chat
                      </button>
                      <button className="btn-elite btn-elite-dark">
                        <i className="bi bi-telephone"></i> Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="text-center mt-5">
            <a href="#" className="btn-link wfc m-auto w-30">
              Explore All Experts <i className="fas fa-arrow-right ms-2"></i>
            </a>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
