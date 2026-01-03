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
import AstrologerCard from "@/components/AstrologerCard";
import SearchBar from "@/components/SearchBar";
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
  const [showCompleteProfile, setShowCompleteProfile] = useState(false);
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  const [total, setTotal] = useState<number | null>(null);
  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterState>>({});
  const [appliedSort, setAppliedSort] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // Immediate input value
  const [searchQuery, setSearchQuery] = useState<string>(""); // Debounced search query
  const [selectedSpecialization, setSelectedSpecialization] = useState<string>("");

  // Debounce search input with 0.8 second delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 800); // 0.8 seconds

    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleApplyFilters = (filters: FilterState) => {
    // store applied filters and reset pagination
    setAppliedFilters(filters);
    setOffset(0);
    setIsFilterOpen(false);
  };

  const handleApplySorts = (sorts: { experience: string; price: string; rating: string }) => {
    // sorts is a SortState-like object with one field set
    console.log("Applied sorts:", sorts);
    // determine which sort is applied
    const sortKey = sorts.experience && sorts.experience !== "none" ? "experience"
      : sorts.rating && sorts.rating !== "none" ? "rating"
        : null;
    setAppliedSort(sortKey);
    setOffset(0);
    setIsSortOpen(false);
  };

  const handleSearchChange = (query: string) => {
    setSearchInput(query); // Update input immediately for responsive typing
    // Debounced search query will update after 0.8s via useEffect
  };

  const handleSpecializationChange = (specialization: string) => {
    setSelectedSpecialization(specialization);
    setOffset(0); // Reset pagination when specialization changes
  };

  const buildQueryString = () => {
    const params: Record<string, any> = {};
    params.limit = limit;
    params.offset = offset;

    // Specialization from carousel (backend supports this)
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

      // Map backend profile -> AstrologerCard shape
      const mapped = data.map((p: any) => ({
        image: p.user?.avatar || "/images/astro-img1.png",
        name: p.user?.name || p.name || "Unknown",
        expertise: p.specialization || p.expertise || "",
        experience: p.experience_in_years ?? p.experience ?? 0,
        language: Array.isArray(p.languages) ? p.languages.join(", ") : p.languages || p.user?.language || "",
        price: p.price_per_minute ?? p.price ?? 0,
        video: p.video || "",
        ratings: p.rating ?? p.ratings ?? 0,
        userId: p.userId,
        isAvailable: p.isAvailable ?? false,
      }));

      // If offset is zero replace list, otherwise append for "Load more" behavior
      setExperts((prev) => (offset === 0 ? mapped : [...prev, ...mapped]));
      console.log("Fetched experts:", mapped);
    } catch (err: any) {
      setError(err.message || "Failed to fetch experts");
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering for search query
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

  // Check if user should see the complete profile modal
  useEffect(() => {
    // Only show on the root route "/"
    if (pathname === "/") {
      // Check if modal was already shown (stored in localStorage)
      const hasSeenModal = localStorage.getItem("completeProfileModalShown");

      if (!hasSeenModal) {
        // Set a timeout to show the modal after 10 seconds
        const timer = setTimeout(() => {
          setShowCompleteProfile(true);
        }, 10000); // 10 seconds

        // Cleanup timer on unmount or pathname change
        return () => clearTimeout(timer);
      }
    } else {
      // Reset state when navigating away
      setShowCompleteProfile(false);
    }
  }, [pathname]);

  // Handle modal close
  const handleCloseCompleteProfile = () => {
    setShowCompleteProfile(false);
    // Mark as shown so it doesn't appear again
    localStorage.setItem("completeProfileModalShown", "true");
  };

  // Handle skip button
  const handleSkipCompleteProfile = () => {
    setShowCompleteProfile(false);
    // Mark as shown so it doesn't appear again
    localStorage.setItem("completeProfileModalShown", "true");
  };

  React.useEffect(() => {
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
                <h1 className="title-xl">
                  Connect with
                  <span className="color-secondary">
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

      {/* Find Your Astrologer */}
      <section className="astrologer-list">
        <div className="container">
          {/* Image placeholder with text */}
          <div className="talk-to-astrologer-banner">
            <div className="banner-image-placeholder">
              {/* User will paste their image here */}
              <h2 className="banner-text">Talk to Astrologer</h2>
            </div>
          </div>

          <div style={{ position: "relative" }}>
            {/* Search, Filter, and Sort Row */}
            <div className="search-filter-row">
              <div className="search-wrapper">
                <SearchBar
                  searchQuery={searchInput}
                  onSearchChange={handleSearchChange}
                />
              </div>

              <button
                className="btn btn-filter"
                onClick={() => setIsFilterOpen(true)}
              >
                <i className="fa-solid fa-filter"></i>
                Filter
              </button>

              <button
                className="btn btn-sort"
                onClick={() => setIsSortOpen(true)}
              >
                <i className="fa-solid fa-sort"></i>
                Sort
              </button>
            </div>

            {/* Specialization Carousel */}
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

          {/* <!-- Astrologer Card 1 --> */}
          <div className="astro-grid">
            {loading && <div>Loading...</div>}
            {error && <div className="text-danger">{error}</div>}
            {!loading && !error && getFilteredExperts().length === 0 && (
              <div>No astrologers found.</div>
            )}
            {!loading && getFilteredExperts().map((item, idx) => {
              return <AstrologerCard astrologerData={item} key={idx} />;
            })}
          </div>

          <div className="view-all">
            {(total === null || experts.length < total) && (
              <button
                className="btn-global btn-secondary wfc m-auto"
                onClick={() => setOffset((prev) => prev + limit)}
                disabled={loading}
                aria-label="Load more astrologers"
                style={{
                  boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
                }}
              >
                {loading ? "Loading..." : "Load More Astrologers"}
              </button>
            )}
          </div>
        </div>
      </section>

      {/* <!--Zodiac Signs & Horoscopes-section --> */}
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

      {/* Astrology Servicees */}
      <section className="astrology-services py-5">
        <div className="container">
          <h2 className="title-lg">Astrology Services</h2>
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
          <h2 className="text-center mb-5 heading text-black title-lg">
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

      {/* Clients Testimonials Section */}
      <section className="testimonials-section bg-cream py-50">
        <div className="container text-center">
          <h2 className="section-heading heading mb-5 title-lg">What Our Clients Say</h2>
          <div className="row">
            {ClientsTestimoinialData.map((client) => (
              <div className="col-lg-4 col-md-6 mb-4" key={client.id}>
                <div className="ser-card p-4 h-100 vert-move">
                  <i
                    className="fa-solid fa-quote-left fa-2x mb-3 color-secondary"
                  ></i>
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

      {/* Featured Astrologers List */}
      <section className="featured-astrologers  py-50 ">
        <div className="container text-center">
          <h2 className="section-heading heading mb-5 title-lg">
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
                        <span className={`badge ${item.isAvailable ? "bg-success" : "bg-danger"}`}>
                          ● {item.isAvailable ? "Online" : "Offline"}
                        </span>
                      </div>

                      {/* CTA Button */}
                      <div className="d-grid">
                        <button
                          className="btn-global btn-primary w-100"
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

      {/* Complete Profile Modal */}
      <CompleteProfileModal
        isOpen={showCompleteProfile}
        onClose={handleCloseCompleteProfile}
        onSkip={handleSkipCompleteProfile}
      />
    </>
  );
};

export default Page;
