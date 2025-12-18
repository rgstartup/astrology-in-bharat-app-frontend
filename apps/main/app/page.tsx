"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  AstrologyServicesData,
  ClientsTestimoinialData,
  ListOfAllAstrologers,
  ZodiacSignsData,
  featuredCardsHeroSection,
} from "@/data/homePagaData";
import ProductsCarousel from "@/components/ProductsCarousel";
import FilterModal from "@/components/FilterModal";
import SortModal from "@/components/SortModal";
import CompleteProfileModal from "@/components/CompleteProfileModal";
import SpecializationCarousel from "@/components/SpecializationCarousel";

interface FilterState {
  location: string;
  language: string;
  rating: number;
  price: number;
}

const Page: React.FC = () => {
  const pathname = usePathname();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterState>>(
    {}
  );
  const [appliedSort, setAppliedSort] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 800);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleApplyFilters = (filters: FilterState) => {
    setAppliedFilters(filters);
    setOffset(0);
    setIsFilterOpen(false);
  };

  const handleApplySorts = (sorts: {
    experience: string;
    price: string;
    rating: string;
  }) => {
    const sortKey =
      sorts.experience && sorts.experience !== "none"
        ? "experience"
        : sorts.rating && sorts.rating !== "none"
          ? "rating"
          : null;
    setAppliedSort(sortKey);
    setOffset(0);
    setIsSortOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchInput(query);
  };

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setOffset(0);
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
    } catch (err: any) {
      setError(err.message || "Failed to fetch experts");
    } finally {
      setLoading(false);
    }
  };

  const getFilteredExperts = () => {
    if (!searchQuery.trim()) return experts;
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
    if (pathname === "/") {
      const hasSeenModal = localStorage.getItem("completeProfileModalShown");
      if (!hasSeenModal) {
        const timer = setTimeout(() => {
          setShowCompleteProfile(true);
        }, 10000);
        return () => clearTimeout(timer);
      }
    } else {
      setShowCompleteProfile(false);
    }
  }, [pathname]);

  const handleCloseCompleteProfile = () => {
    setShowCompleteProfile(false);
    localStorage.setItem("completeProfileModalShown", "true");
  };

  const handleSkipCompleteProfile = () => {
    setShowCompleteProfile(false);
    localStorage.setItem("completeProfileModalShown", "true");
  };

  React.useEffect(() => {
    fetchExperts();
  }, [appliedFilters, appliedSort, limit, offset, selectedSpecialization]);

  return (
    <>
      {/* Hero Section */}
      <section className="banner-part">
        <div className="overlay-hero">
          <div className="container">
            <div className="row align">
              <div className="col-lg-7 col-md-12">
                <h1 className="title-xl">
                  Connect with
                  <span className="color-secondary">
                    {" "}
                    Verified <br /> Astrologers{" "}
                  </span>
                  Online
                </h1>
                <h4 className="card-title title-md mt-4 mb-4">
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
                <a href="#" className="btn-global btn-primary wfc mt-4 mb-4">
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

      {/* Find Your Astrologer - REDESIGNED */}
      <section className="find-astrologer-section">
        <div className="container">
          <div className="find-astrologer-header">
            <h2 className="find-astrologer-title">Find Your Astrologer</h2>

            {/* Search Box */}
            <div className="search-box-container">
              <input
                type="text"
                className="search-input-astro"
                placeholder="Search Astrologer, Type, Language..."
                value={searchInput}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              <button className="search-btn-astro">Search</button>
            </div>

            {/* Filter & Sort Combined Dropdown */}
            <div className="filter-sort-bar">
              <div className="filter-sort-dropdown">
                <button
                  className="filter-sort-trigger"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                  <i className="fa-solid fa-sliders"></i>
                  <span>Options</span>
                  <i
                    className={`fa-solid fa-chevron-down ${isDropdownOpen ? "rotate-180" : ""}`}
                    style={{ transition: "transform 0.3s" }}
                  ></i>
                </button>
                <div
                  className={`filter-sort-menu ${isDropdownOpen ? "show" : ""}`}
                >
                  <button
                    onClick={() => {
                      setIsFilterOpen(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <i className="fa-solid fa-filter"></i> Filter
                  </button>
                  <button
                    onClick={() => {
                      setIsSortOpen(true);
                      setIsDropdownOpen(false);
                    }}
                  >
                    <i className="fa-solid fa-sort"></i> Sort
                  </button>
                </div>
              </div>
            </div>

            <SpecializationCarousel
              selectedSpecialization={selectedSpecialization}
              onSpecializationChange={handleSpecializationChange}
            />
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
          </div>

          {/* Loading State - Skeleton */}
          {loading && (
            <div className="row g-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="skeleton-card-new">
                    <div className="skeleton skeleton-circle"></div>
                    <div className="skeleton skeleton-line short"></div>
                    <div className="skeleton skeleton-badge"></div>
                    <div className="skeleton skeleton-line medium"></div>
                    <div className="skeleton skeleton-line medium"></div>
                    <div className="skeleton skeleton-line medium"></div>
                    <div className="row g-2">
                      <div className="col-6">
                        <div className="skeleton skeleton-action-btn"></div>
                      </div>
                      <div className="col-6">
                        <div className="skeleton skeleton-action-btn"></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Error State */}
          {error && !loading && (
            <div className="error-state mt-4">
              <div className="error-state-icon">
                <i className="fas fa-exclamation-triangle"></i>
              </div>
              <h3 className="error-state-title">Oops! Something Went Wrong</h3>
              <p className="error-state-message">
                We couldn&apos;t connect to our astrologers at the moment.
                <br />
                Please check your internet connection and try again.
              </p>
              <button className="retry-btn" onClick={() => fetchExperts()}>
                <i className="fas fa-redo-alt me-2"></i>
                Try Again
              </button>
            </div>
          )}

          {/* No Results State */}
          {!loading && !error && getFilteredExperts().length === 0 && (
            <div
              className="error-state mt-4"
              style={{
                background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)",
                borderColor: "#3b82f6",
              }}
            >
              <div className="error-state-icon" style={{ color: "#3b82f6" }}>
                <i className="fas fa-search"></i>
              </div>
              <h3 className="error-state-title">No Astrologers Found</h3>
              <p className="error-state-message">
                We couldn&apos;t find any astrologers matching your criteria.
                <br />
                Try adjusting your filters or search terms.
              </p>
            </div>
          )}

          {/* Astrologer Cards */}
          {!loading && !error && getFilteredExperts().length > 0 && (
            <div className="row g-4">
              {getFilteredExperts().map((astrologer, idx) => (
                <div key={idx} className="col-lg-3 col-md-4 col-sm-6">
                  <div className="astrologer-card-new">
                    {/* Profile Image with Play Icon */}
                    <div className="astro-profile-wrapper">
                      <img
                        src={astrologer.image}
                        alt={astrologer.name}
                        className="astro-profile-new"
                      />
                      {astrologer.video && (
                        <div className="astro-play-icon">
                          <i className="fas fa-play"></i>
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="astro-rating-new">
                      {"★".repeat(Math.floor(astrologer.ratings || 0))}
                    </div>

                    {/* Name */}
                    <h4 className="astro-name-new">{astrologer.name}</h4>

                    {/* Specialization Badge */}
                    <div className="astro-specialization-badge">
                      {astrologer.expertise || "Vedic | Numerology"}
                    </div>

                    {/* Details */}
                    <div className="astro-details-new">
                      Exp: <span>{astrologer.experience} Years</span>
                    </div>
                    <div className="astro-details-new">
                      Lang: <span>{astrologer.language}</span>
                    </div>
                    <div className="astro-details-new">
                      Price: <span>₹{astrologer.price}/min</span>
                    </div>

                    {/* Action Buttons */}
                    <div className="astro-actions-new">
                      <button className="astro-btn-new astro-chat-btn">
                        <i className="far fa-comment-dots"></i> Chat
                      </button>
                      <button className="astro-btn-new astro-call-btn">
                        <i className="fas fa-phone"></i> Call
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Load More Button */}
          {!loading && !error && (total === null || experts.length < total) && (
            <div className="text-center mt-5">
              <button
                className="btn-global btn-secondary wfc"
                onClick={() => setOffset((prev) => prev + limit)}
                disabled={loading}
                style={{
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                }}
              >
                {loading ? "Loading..." : "Load More Astrologers"}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Zodiac Signs & Horoscopes */}
      <section className="horoscopes-container">
        <div className="container">
          <div className="row">
            <h2 className="text-center mt-3 mb-2 horoscopes-heading title-lg">
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

      {/* Astrology Services - ULTRA PREMIUM WOW DESIGN */}
      <section className="services-premium-section">
        <div className="container position-relative py-5" style={{ zIndex: 1 }}>
          <div className="services-header-premium">
            <h2 className="text-center mt-3 mb-2 horoscopes-heading title-lg">Astrology Services</h2>
            <p>
              Discover the ancient wisdom of Vedic astrology combined with
              modern precision. Our expert astrologers provide transformative
              insights to guide your life's journey.
            </p>
          </div>
          <div className="row g-4">
            {AstrologyServicesData.map((item, index) => {
              const icons = [
                "fa-star-and-crescent",
                "fa-scroll",
                "fa-infinity",
                "fa-om",
                "fa-heart",
                "fa-book-open",
                "fa-moon",
                "fa-sun",
              ];
              return (
                <div className="col-lg-3 col-md-6" key={item.id}>
                  <div
                    className="service-card-premium"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="service-img-premium">
                      <img src={item.image} alt={item.title} />
                    </div>
                    <div className="service-body-premium">
                      <div className="service-icon-badge">
                        <i className={`fas ${icons[index % icons.length]}`}></i>
                      </div>
                      <h4 className="service-title-premium">{item.title}</h4>
                      <p className="service-desc-premium">{item.description}</p>
                      <button className="service-cta-premium">
                        Explore Now
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Products Listing - LUXURY COSMIC DESIGN */}
      <section className="products-luxury-section">
        <div className="stars-bg"></div>
        <div className="cosmic-glow"></div>
        <div className="container position-relative" style={{ zIndex: 1 }}>
          <div className="products-header-luxury">
            <h2>Our Astrological Products</h2>
            <p>
              Sacred tools and divine artifacts to enhance your spiritual
              journey
            </p>
          </div>
          <div className="product-slider-container">
            <ProductsCarousel />
          </div>
        </div>
      </section>

      {/* Why Talk to our astrologer */}
      <section className="py-50 why-choose-us text-white">
        <div className="container">
          <h2 className="text-center mb-5 heading text-black title-lg">
            Why Talk to Our Astrologer?
          </h2>
          <div className="row d-flex align-items-center">
            {/* Left Column */}
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
                src="/images/Astrologer.png"
                alt="Astrologer talking"
                className="img-fluid rounded-circle border border-gray"
                style={{ width: "300px", height: "300px", objectFit: "cover" }}
              />
            </div>

            {/* Right Column */}
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

      {/* Clients Testimonials */}
      <section className="testimonials-section bg-cream py-50">
        <div className="container text-center">
          <h2 className="section-heading heading mb-5 title-lg">
            What Our Clients Say
          </h2>
          <div className="row">
            {ClientsTestimoinialData.map((client) => (
              <div className="col-lg-4 col-md-6 mb-4" key={client.id}>
                <div className="ser-card p-4 h-100 vert-move">
                  <i className="fa-solid fa-quote-left fa-2x mb-3 color-secondary"></i>
                  <p>{client.review}</p>
                  <div className="mt-3 d-flex align-items-center justify-content-center flex-column">
                    <img
                      src="images/astro-img1.png"
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
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Astrologers */}
      <section className="featured-astrologers py-50">
        <div className="container text-center">
          <h2 className="section-heading heading mb-5 title-lg">
            Meet Our Trusted Astrologers
          </h2>
          <div className="row justify-content-center">
            {ListOfAllAstrologers.filter((astro) => astro.ratings >= 4.5)
              .slice(0, 3)
              .map((item) => (
                <div className="col-lg-4 col-md-6 mb-4" key={item.id}>
                  <div
                    className="astro-card ser-card card h-100 border border-gray shadow position-relative overflow-hidden"
                    style={{
                      borderRadius: "15px",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    }}
                  >
                    <div className="position-relative p-4 pb-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded-circle border-3 border-warning shadow"
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

                    <div className="card-body mt-3">
                      <h5 className="fw-bold astro-name">{item.name}</h5>
                      <p className="card-subtitle mb-2 text-muted">
                        {item.expertise}
                      </p>

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

                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <h6 className="mb-0 fw-bold text-success">
                          ₹{item.price}/min
                        </h6>
                        <span className="badge bg-success">● Online</span>
                      </div>

                      <div className="d-grid">
                        <button className="btn-global btn-primary w-100">
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

      <CompleteProfileModal
        isOpen={showCompleteProfile}
        onClose={handleCloseCompleteProfile}
        onSkip={handleSkipCompleteProfile}
      />
    </>
  );
};

export default Page;
