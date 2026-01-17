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
  const [appliedFilters, setAppliedFilters] = useState<Partial<FilterState>>(
    {}
  );
  const [appliedSort, setAppliedSort] = useState<string | null>(null);
  const [searchInput, setSearchInput] = useState<string>(""); // Immediate input value
  const [searchQuery, setSearchQuery] = useState<string>(""); // Debounced search query
  const [selectedSpecialization, setSelectedSpecialization] =
    useState<string>("");

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const { current } = scrollContainerRef;
      const scrollAmount = 200;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

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

  const cardScrollRef = React.useRef<HTMLDivElement>(null);

  const scrollCards = (direction: "left" | "right") => {
    if (cardScrollRef.current) {
      const { current } = cardScrollRef;
      const scrollAmount = 300; // Scrolls approximately one card width
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const handleApplySorts = (sorts: {
    experience: string;
    price: string;
    rating: string;
  }) => {
    // sorts is a SortState-like object with one field set

    // determine which sort is applied
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
      const url = `http://localhost:4000/api/v1/expert/list?${qs}`;
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
        language: Array.isArray(p.languages)
          ? p.languages.join(", ")
          : p.languages || p.user?.language || "",
        price: p.price_per_minute ?? p.price ?? 0,
        video: p.video || "",
        ratings: p.rating ?? p.ratings ?? 0,
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

  React.useEffect(() => {
    fetchExperts();
  }, [appliedFilters, appliedSort, limit, offset, selectedSpecialization]);
  return (
    <>
      <section className="banner-part light-back">
        <div className="overlay-hero">
          <div className="container">
            <div className="contant-hero">
              <div className="row align column-reverse">
                <div className="col-lg-7 col-md-12">
                  <div className="hero-card shine">
                    <div className="card-z">
                      <span className="aib-trust-badge">
                        India’s Trusted Astrology Platform
                      </span>
                      <h1>Connect with Verified Astrologers Online</h1>
                      <h4 className="card-title ">
                        Instant Chat, Call, or Video Consultations
                      </h4>
                      <p>
                        At Astrology in Bharat, find trusted astrologers for
                        love, career, health, or life guidance. Connect anytime
                        via chat, audio, or video and get personalized solutions
                        with full privacy.
                      </p>
                      <ul className="list-check">
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Verified &amp;
                          Experienced Astrologers
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Instant Chat,
                          Call &amp; Video Support
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> 100% Privacy
                          &amp; Confidentiality{" "}
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Accurate
                          Predictions &amp; Remedies
                        </li>
                        <li>
                          {" "}
                          <i className="fa-solid fa-check"></i> Trusted by
                          Thousands Across India
                        </li>
                      </ul>
                      <a href="#" className="btn-link wfc mt-4 mb-4">
                        Start Consultation
                      </a>
                    </div>
                  </div>
                </div>
                <div className="col-lg-5 col-md-12">
                  <div className="right-illus">
                    <img
                      src="images/Astrologer-h.png"
                      alt="Astrologer"
                      className="Astrologer-img-h fa-spin"
                    />
                    <img
                      src="images/Astrologer.png"
                      alt="Astrologer"
                      className="Astrologer-img"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="row mt-2">
              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero text-center">
                    <img
                      src="images/icon1.png"
                      alt="icon1.png"
                      className="mx-auto"
                    />
                    <h5>Live Chat Support</h5>
                    <p className="color-light">
                      Get instant answers from expert astrologers through live
                      chat sessions.
                    </p>
                  </div>
                </a>
              </div>

              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero flex flex-col items-center text-center">
                    <img src="images/icon2.png" alt="icon2.png" />
                    <h5 className="mt-2">Speak with Astrologer</h5>
                    <p className="color-light">
                      Connect via phone call for personal guidance on your life
                      questions.
                    </p>
                  </div>
                </a>
              </div>

              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero flex flex-col items-center text-center">
                    <img src="images/icon3.png" alt="icon3.png" />
                    <h5 className="mt-2">Astrology Product Store</h5>
                    <p className="color-light">
                      Shop gemstones, yantras, and spiritual items recommended
                      by experts.
                    </p>
                  </div>
                </a>
              </div>

              <div className="col-sm-3 col-6">
                <a href="#">
                  <div className="card-hero flex flex-col items-center text-center">
                    <img src="images/icon4.png" alt="icon4.png" />
                    <h5 className="mt-2">Book A Pooja</h5>
                    <p className="color-light">
                      Book religious ceremonies & rituals performed by
                      experienced priests.
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="astrologer-list back-img">
        <div className="container">
          <h2 className="title-line color-light">
            <span>Find Your Astrologer</span>
          </h2>
          <div className="row align  ">
            <div className="col-sm-5">
              <div className="search-box">
                <input
                  type="text"
                  className="bg-white"
                  placeholder="Search Astrologer, Type, Language..."
                />
                <button>Search</button>
              </div>
            </div>
            <div className="col-sm-3 text-end">
              <a href="#" className="filter-btn">
                <i className="fa-solid fa-filter"></i> Filter
              </a>
              <a href="#" className="filter-btn sort-btn">
                <i className="fa-solid fa-sort"></i> Sort
              </a>
            </div>
            <div className="col-sm-4 d-flex align-items-center">
              <button
                onClick={() => scroll("left")}
                className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full mr-2 hover:bg-[#fd64101a] transition flex-shrink-0"
                style={{
                  width: "30px",
                  height: "30px",
                  border: "none",
                  background: "transparent",
                }}
              >
                <i className="fa-solid fa-chevron-left"></i>
              </button>
              <div
                className="flex gap-2.5 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2.5 [&::-webkit-scrollbar]:hidden w-full px-1"
                id="list-slider"
                ref={scrollContainerRef}
              >
                <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                  Numerology
                </div>
                <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                  Vedic
                </div>
                <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                  Zodiac Compatibility
                </div>
                <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                  Astrocartography
                </div>
                <div className="bg-white px-[15px] py-2 rounded-[20px] text-sm font-medium text-[#1e0b0f] border border-[#fd6410] cursor-pointer transition duration-300 hover:bg-[#fd6410] hover:text-white">
                  Lunar Node Analysis
                </div>
              </div>
              <button
                onClick={() => scroll("right")}
                className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full ml-2 hover:bg-[#fd64101a] transition flex-shrink-0"
                style={{
                  width: "30px",
                  height: "30px",
                  border: "none",
                  background: "transparent",
                }}
              >
                <i className="fa-solid fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <div className="flex items-center relative mt-4">
            <button
              onClick={() => scrollCards("left")}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
              style={{ background: "transparent" }}
            >
              <i className="fa-solid fa-chevron-left fa-2x"></i>
            </button>

            <div
              className="flex-1 min-w-0 flex overflow-x-auto gap-4 scroll-smooth [&::-webkit-scrollbar]:hidden py-4"
              ref={cardScrollRef}
            >
              <div className="astro-card min-w-[300px]">
                <div className="vid-part">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="astro-profile-img"
                  />
                  <span
                    className="play-vid fa-beat"
                    data-bs-toggle="modal"
                    data-bs-target="#exampleModal"
                  >
                    {" "}
                    <i className="fa-solid fa-circle-play "></i>{" "}
                  </span>
                </div>
                <div className="rating-star">★★★★★</div>
                <div className="astro-name">Parbhat Sharma</div>
                <div className="astro-tags">Vedic | Numerology</div>
                <div className="astro-info">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="astro-info">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="astro-info">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="astro-actions">
                  <button>
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="call">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>

              <div
                className="modal fade "
                id="exampleModal"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
              >
                <div className="modal-dialog modal-dialog-centered modal-xl">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h4
                        className="modal-title-astro-about "
                        id="exampleModalLabel"
                      >
                        Meet Astrologer Parbhata Giri Introduction Video
                      </h4>
                      <button
                        type="button"
                        className="btn-close"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                      >
                        <i className="fa-solid fa-xmark"></i>
                      </button>
                    </div>
                    <div className="modal-body">
                      <iframe
                        width="100%"
                        height="500"
                        src="https://www.youtube.com/embed/INoPh_oRooU"
                        title="शिव जी ने माता पार्वती को क्यों दिया ये भयंकर श्राप 😱😱 ?  #shivshankar #mataparvati"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        referrerPolicy="strict-origin-when-cross-origin"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-xl shadow-[0_0_10px_rgba(0,0,0,0.1)] text-center transition-transform duration-300 border border-[#fd6410] bg-white p-3 hover:-translate-y-1 relative items-center min-w-[300px]">
                <div className="relative w-[150px] mx-auto">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="w-[120px] h-[120px] object-cover rounded-full mb-2 border border-[#daa23e]"
                  />
                </div>
                <div className="text-[#fd6410] text-[22px]">★★★★★</div>
                <div className="text-[18px] font-semibold mb-0.5 text-[#301118]">
                  Pandit Sharma
                </div>
                <div className="inline-block bg-[#fd6410] text-white text-sm px-2.5 py-1 rounded-[20px] mt-1.5 mb-0">
                  Vedic | Numerology
                </div>
                <div className="text-base my-2 text-[#1a1a1a]">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="text-base my-2 text-[#1a1a1a]">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="text-base my-2 text-[#1a1a1a]">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="flex justify-center gap-2.5 mt-4">
                  <button className="flex-1 py-2 px-3 rounded-[25px] border border-[#fd6410] text-sm bg-[#fd6410] text-white hover:bg-[#301118] transition-all cursor-pointer">
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="flex-1 py-2 px-3 rounded-[25px] border border-[#fd6410] text-sm bg-white text-black hover:bg-[#301118] hover:text-white transition-all cursor-pointer">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>

              <div className="astro-card min-w-[300px]">
                <div className="vid-part">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="astro-profile-img"
                  />
                </div>
                <div className="rating-star">★★★★★</div>
                <div className="astro-name">Pandit Sharma</div>
                <div className="astro-tags">Vedic | Numerology</div>
                <div className="astro-info">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="astro-info">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="astro-info">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="astro-actions">
                  <button>
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="call">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>

              <div className="astro-card min-w-[300px]">
                <div className="vid-part">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="astro-profile-img"
                  />
                </div>
                <div className="rating-star">★★★★★</div>
                <div className="astro-name">Pandit Sharma</div>
                <div className="astro-tags">Vedic | Numerology</div>
                <div className="astro-info">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="astro-info">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="astro-info">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="astro-actions">
                  <button>
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="call">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>

              <div className="astro-card min-w-[300px]">
                <div className="vid-part">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="astro-profile-img"
                  />
                </div>
                <div className="rating-star">★★★★★</div>
                <div className="astro-name">Pandit Sharma</div>
                <div className="astro-tags">Vedic | Numerology</div>
                <div className="astro-info">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="astro-info">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="astro-info">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="astro-actions">
                  <button>
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="call">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>

              <div className="astro-card min-w-[300px]">
                <div className="vid-part">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="astro-profile-img"
                  />
                </div>
                <div className="rating-star">★★★★★</div>
                <div className="astro-name">Pandit Sharma</div>
                <div className="astro-tags">Vedic | Numerology</div>
                <div className="astro-info">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="astro-info">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="astro-info">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="astro-actions">
                  <button>
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="call">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>

              <div className="astro-card min-w-[300px]">
                <div className="vid-part">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="astro-profile-img"
                  />
                </div>
                <div className="rating-star">★★★★★</div>
                <div className="astro-name">Pandit Sharma</div>
                <div className="astro-tags">Vedic | Numerology</div>
                <div className="astro-info">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="astro-info">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="astro-info">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="astro-actions">
                  <button>
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="call">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>

              <div className="astro-card min-w-[300px]">
                <div className="vid-part">
                  <img
                    src="images/astro-img1.png"
                    alt="Pandit Sharma"
                    className="astro-profile-img"
                  />
                </div>
                <div className="rating-star">★★★★★</div>
                <div className="astro-name">Pandit Sharma</div>
                <div className="astro-tags">Vedic | Numerology</div>
                <div className="astro-info">
                  <strong>Exp:</strong> 21 Years
                </div>
                <div className="astro-info">
                  <strong>Lang:</strong> Hindi, English
                </div>
                <div className="astro-info">
                  <strong>Price:</strong> ₹25/min
                </div>
                <div className="astro-actions">
                  <button>
                    <i className="fa-regular fa-comment-dots"></i> Chat
                  </button>
                  <button className="call">
                    <i className="fa-solid fa-phone-volume"></i> Call
                  </button>
                </div>
              </div>
            </div>

            <button
              onClick={() => scrollCards("right")}
              className="flex-shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
              style={{ background: "transparent" }}
            >
              <i className="fa-solid fa-chevron-right fa-2x"></i>
            </button>
          </div>

          <div className="view-all">
            <a href="#" className="btn-link wfc m-auto">
              <i className="fa-regular fa-user"></i> View All Astrologers
            </a>
          </div>
        </div>
      </section>

      <section className="bg-edeef1 space-section">
        <div className="container">
          <div className="light-card mt-4">
            <h2 className="title-line mb-3 c-1e0b0f">
              <span>Astrology Services </span>
            </h2>
            <div className="overflow-hidden">
              <div className="h-[550px] overflow-y-auto pr-2 custom-scrollbar">
                <div className="row mx-0">
                  {AstrologyServicesData.map((service) => (
                    <div
                      className="col-lg-3 col-md-4 px-2 mb-4"
                      key={service.id}
                    >
                      <div className="bg-white overflow-hidden shadow-[0_2px_4px_rgba(0,0,0,0.08)] border-[0.5px] border-[#fd6410] text-center p-2 rounded-[8px] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_4px_8px_rgba(0,0,0,0.1)] h-full flex flex-col">
                        <div className="flex-grow">
                          <img
                            src={service.image}
                            alt={service.title}
                            className="rounded-[6px] border border-[#daa23ea1] w-full h-[150px] object-cover mb-2"
                          />
                        </div>
                        <h4 className="font-medium text-xs text-[#1e0b0f] truncate mt-2 px-1">
                          {service.title}
                        </h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <br className="mobile-none" />

          <div className="light-card">
            <h2 className="title-line mb-4 c-1e0b0f">
              <span>Consult The Right Astrologer For You</span>
            </h2>
            <div className="row">
              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services1.jpg"
                    alt="Love Problem Solution"
                  />
                  <h4>Love Problem Solution</h4>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services2.jpg"
                    alt="Marriage Problem"
                  />
                  <h4>Marriage Problem</h4>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services3.jpg"
                    alt="Divorce Problem Solution"
                  />
                  <h4>Divorce Problem Solution</h4>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services4.jpg"
                    alt="Breakup Problem Solution"
                  />
                  <h4>Breakup Problem Solution</h4>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services5.jpg"
                    alt="Get Your Ex Love Back"
                  />
                  <h4>Get Your Ex Love Back</h4>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services6.jpg"
                    alt="Family Problem Solution"
                  />
                  <h4>Family Problem Solution</h4>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services8.jpg"
                    alt="Dispute Solution"
                  />
                  <h4>Dispute Solution</h4>
                </div>
              </div>

              <div className="col-sm-3">
                <div className="services-card">
                  <img
                    src="images/services/services9.jpg"
                    alt="Childless Couple Solution"
                  />
                  <h4>Childless Couple Solution</h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="horoscopes-container light-back">
        <div className="container">
          <div className="light-card">
            <h2 className="title-line mb-3 c-1e0b0f">
              <span>Choose Your Zodiac Sign </span>
            </h2>
            <p className="text-center text-[#1a1a1a] mb-8 text-base font-medium">
              Discover Your Daily, Monthly and Yearly Horoscope
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {ZodiacSignsData.map((sign) => (
                <a href="#" key={sign.id} className="block h-full group">
                  <div
                    className="bg-white overflow-hidden shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-center p-3 rounded-[10px] transition-all duration-300 ease-in-out text-[#1a1a1a] hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(0,0,0,0.2)] h-full flex flex-col items-center justify-center cursor-pointer"
                    style={{ border: "1px solid #daa23e73" }}
                  >
                    <img
                      src={sign.image}
                      alt={sign.title}
                      className="w-20 h-20 object-contain transition-transform duration-300 group-hover:scale-110 mb-2"
                    />
                    <h3 className="text-lg font-semibold mb-0.5 text-[#1e0b0f]">
                      {sign.title}
                    </h3>
                    <p className="text-xs text-[#666] mb-0">{sign.date}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="aib-products-section bg-edeef1  space-section">
        <div className="container">
          <div className="light-card">
            {/* <!-- Section Heading --> */}
            <div className="row mb-4">
              <div className="col-12">
                <h2 className="title-line mb-4 c-1e0b0f">
                  <span>Astrology Products</span>
                </h2>
                <p className="aib-products-subtitle c-1e0b0f m-0">
                  Energized & Expert-Recommended Astrology Products for Positive
                  Life Changes
                </p>
              </div>
            </div>

            {/* <!-- Products Grid --> */}
            <div className="row">
              {/* <!-- Product Card --> */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="bg-white rounded-2xl p-2 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 mb-[30px] border border-[#fd641047] hover:-translate-y-1.5">
                  <div className="mb-[15px]">
                    <img
                      src="images/product/product1.jpg"
                      alt="Rudraksha Mala"
                      className="w-full object-contain mb-[15px]"
                    />
                  </div>
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Rudraksha Mala
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    Energized for peace & spiritual growth
                  </p>
                  <div className="mb-[15px]">
                    <span className="text-lg font-bold text-[#fd6410] mr-2">
                      ₹1,499
                    </span>
                    <span className="text-sm text-[#1e0b0f9e] line-through">
                      ₹1,999
                    </span>
                  </div>
                  <a
                    href="#"
                    className="inline-block py-2.5 px-6 bg-[#fd6410] text-white rounded-[25px] no-underline font-semibold hover:bg-[#e5670d] hover:text-white"
                  >
                    Buy Now
                  </a>
                </div>
              </div>

              {/* <!-- Product Card --> */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="bg-white rounded-2xl p-2 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 mb-[30px] border border-[#fd641047] hover:-translate-y-1.5">
                  <div className="mb-[15px]">
                    <img
                      src="images/product/product2.jpg"
                      alt="Gemstone Ring"
                      className="w-full object-contain mb-[15px]"
                    />
                  </div>
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Gemstone Ring
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    Recommended as per kundli analysis
                  </p>
                  <div className="mb-[15px]">
                    <span className="text-lg font-bold text-[#fd6410] mr-2">
                      ₹2,999
                    </span>
                    <span className="text-sm text-[#1e0b0f9e] line-through">
                      ₹3,499
                    </span>
                  </div>
                  <a
                    href="#"
                    className="inline-block py-2.5 px-6 bg-[#fd6410] text-white rounded-[25px] no-underline font-semibold hover:bg-[#e5670d] hover:text-white"
                  >
                    Buy Now
                  </a>
                </div>
              </div>

              {/* <!-- Product Card --> */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="bg-white rounded-2xl p-2 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 mb-[30px] border border-[#fd641047] hover:-translate-y-1.5">
                  <div className="mb-[15px]">
                    <img
                      src="images/product/product3.jpg"
                      alt="Yantra"
                      className="w-full object-contain mb-[15px]"
                    />
                  </div>
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Shree Yantra
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    For wealth, success & prosperity
                  </p>
                  <div className="mb-[15px]">
                    <span className="text-lg font-bold text-[#fd6410] mr-2">
                      ₹1,199
                    </span>
                    <span className="text-sm text-[#1e0b0f9e] line-through">
                      ₹1,699
                    </span>
                  </div>
                  <a
                    href="#"
                    className="inline-block py-2.5 px-6 bg-[#fd6410] text-white rounded-[25px] no-underline font-semibold hover:bg-[#e5670d] hover:text-white"
                  >
                    Buy Now
                  </a>
                </div>
              </div>

              {/* <!-- Product Card --> */}
              <div className="col-lg-3 col-md-6 col-sm-12">
                <div className="bg-white rounded-2xl p-2 text-center shadow-[0_10px_25px_rgba(0,0,0,0.08)] transition duration-300 mb-[30px] border border-[#fd641047] hover:-translate-y-1.5">
                  <div className="mb-[15px]">
                    <img
                      src="images/product/product4.jpg"
                      alt="Astrology Bracelet"
                      className="w-full object-contain mb-[15px]"
                    />
                  </div>
                  <h4 className="text-[22px] font-semibold text-[#1e0b0f] mb-1.5">
                    Astrology Bracelet
                  </h4>
                  <p className="text-base text-[#1a1a1a] mb-3">
                    Balances planetary energies
                  </p>
                  <div className="mb-[15px]">
                    <span className="text-lg font-bold text-[#fd6410] mr-2">
                      ₹899
                    </span>
                    <span className="text-sm text-[#1e0b0f9e] line-through">
                      ₹1,299
                    </span>
                  </div>
                  <a
                    href="#"
                    className="inline-block py-2.5 px-6 bg-[#fd6410] text-white rounded-[25px] no-underline font-semibold hover:bg-[#e5670d] hover:text-white"
                  >
                    Buy Now
                  </a>
                </div>
              </div>
            </div>

            {/* <!-- View All Button -->  */}
            <div className="view-all mt-1 mb-3">
              <a href="#" className="btn-link wfc m-auto">
                <i className="fa-solid fa-cart-shopping"></i> View All Products
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="why-section back-img">
        <div className="container">
          <h2 className="title-line mb-3 color-light">
            <span>Why Choose Astrology in Bharat</span>
          </h2>
          <p className="aib-products-subtitle  color-light m-0">
            Trusted Astrology. Accurate Guidance. Complete Privacy.
          </p>
          <div className="row align-items-center text-center">
            {/* <!-- Left column --> */}
            <div className="col-md-4">
              <div className="border border-[#fd641054] rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className="fa-solid fa-user-check bg-gradient-to-r from-[#fd6410] to-[#c34500] text-white w-[70px] h-[70px] rounded-full text-[40px] py-3.5 mb-3.5 inline-block"></i>
                <div className="choose-text">
                  <h4 className="text-[22px] font-semibold text-white">
                    Verified & Experienced Astrologers
                  </h4>
                </div>
              </div>

              <div className="border border-[#fd641054] rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className="fa-solid fa-comments bg-gradient-to-r from-[#fd6410] to-[#c34500] text-white w-[70px] h-[70px] rounded-full text-[40px] py-3.5 mb-3.5 inline-block"></i>
                <div className="choose-text">
                  <h4 className="text-[22px] font-semibold text-white">
                    Instant Chat, Call & Video Support
                  </h4>
                </div>
              </div>

              <div className="border border-[#fd641054] rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className="fa-solid fa-shield-halved bg-gradient-to-r from-[#fd6410] to-[#c34500] text-white w-[70px] h-[70px] rounded-full text-[40px] py-3.5 mb-3.5 inline-block"></i>
                <div className="choose-text">
                  <h4 className="text-[22px] font-semibold text-white">
                    100% Privacy & Confidentiality
                  </h4>
                </div>
              </div>
            </div>
            {/* <!-- Center Image --> */}
            <div className="col-md-4 text-center">
              <div className="overflow-hidden relative">
                <img
                  src="images/horoscope-round2.png"
                  className="w-[90%] mx-auto absolute z-10 left-[10%] top-0 animate-[spin_10s_linear_infinite]"
                  alt="horoscope"
                />
                <img
                  src="images/astro.png"
                  alt="astro"
                  className="relative z-20 bottom-[22px]"
                />
              </div>
            </div>
            {/* <!-- Right column --> */}
            <div className="col-md-4">
              <div className="border border-[#fd641054] rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className="fa-solid fa-bullseye bg-gradient-to-r from-[#fd6410] to-[#c34500] text-white w-[70px] h-[70px] rounded-full text-[40px] py-3.5 mb-3.5 inline-block"></i>
                <div className="choose-text">
                  <h4 className="text-[22px] font-semibold text-white">
                    Accurate Predictions & Effective Remedies
                  </h4>
                </div>
              </div>
              <div className="border border-[#fd641054] rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className="fa-solid fa-user-gear bg-gradient-to-r from-[#fd6410] to-[#c34500] text-white w-[70px] h-[70px] rounded-full text-[40px] py-3.5 mb-3.5 inline-block"></i>
                <div className="choose-text">
                  <h4 className="text-[22px] font-semibold text-white">
                    Personalized Astrology Consultations
                  </h4>
                </div>
              </div>
              <div className="border border-[#fd641054] rounded-xl my-5 p-6 bg-[#1e0b0f6e]">
                <i className="fa-solid fa-hand-holding-heart bg-gradient-to-r from-[#fd6410] to-[#c34500] text-white w-[70px] h-[70px] rounded-full text-[40px] py-3.5 mb-3.5 inline-block"></i>
                <div className="choose-text">
                  <h4 className="text-[22px] font-semibold text-white">
                    Expert Guidance for Life Problems
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="testimonial-section-cards bg-edeef1  space-section">
        <div className="container">
          <div className="light-card">
            <h2 className="title-line mb-3 c-1e0b0f">
              <span>What Our Users Say </span>
            </h2>
            <div className="row">
              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Testimonial Card --> */}
                <div className="bg-white rounded-[18px] p-6 max-w-[360px] transition duration-300 border border-[#fd641047] shadow-[0_10px_25px_rgba(0,0,0,0.08)] my-2.5 hover:-translate-y-1.5 mx-auto">
                  <div className="flex items-center mb-3">
                    <div className="mr-3">
                      <img
                        src="images/t1.png"
                        alt="User Review"
                        className="w-[55px] h-[55px] rounded-full object-cover border-[3px] border-[#ff7a18]"
                      />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-[#32131a] m-0">
                        Rahul Sharma
                      </h5>
                      <span className="text-[15px] text-[#1a1a1a]">
                        Delhi, India
                      </span>
                    </div>
                  </div>
                  <div className="text-[#fd6410] text-[25px] mb-1 tracking-[3px]">
                    ★★★★★
                  </div>
                  <p className="text-base text-[#311219] leading-[1.6]">
                    I had a great experience with Astrology in Bharat. The
                    astrologer was very accurate and guided me properly about my
                    career and future decisions.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Testimonial Card --> */}
                <div className="bg-white rounded-[18px] p-6 max-w-[360px] transition duration-300 border border-[#fd641047] shadow-[0_10px_25px_rgba(0,0,0,0.08)] my-2.5 hover:-translate-y-1.5 mx-auto">
                  <div className="flex items-center mb-3">
                    <div className="mr-3">
                      <img
                        src="images/t1.png"
                        alt="User Review"
                        className="w-[55px] h-[55px] rounded-full object-cover border-[3px] border-[#ff7a18]"
                      />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-[#32131a] m-0">
                        Rahul Sharma
                      </h5>
                      <span className="text-[15px] text-[#1a1a1a]">
                        Delhi, India
                      </span>
                    </div>
                  </div>
                  <div className="text-[#fd6410] text-[25px] mb-1 tracking-[3px]">
                    ★★★★★
                  </div>
                  <p className="text-base text-[#311219] leading-[1.6]">
                    I had a great experience with Astrology in Bharat. The
                    astrologer was very accurate and guided me properly about my
                    career and future decisions.
                  </p>
                </div>
              </div>

              <div className="col-lg-4 col-md-6 col-12">
                {/* <!-- Testimonial Card --> */}
                <div className="bg-white rounded-[18px] p-6 max-w-[360px] transition duration-300 border border-[#fd641047] shadow-[0_10px_25px_rgba(0,0,0,0.08)] my-2.5 hover:-translate-y-1.5 mx-auto">
                  <div className="flex items-center mb-3">
                    <div className="mr-3">
                      <img
                        src="images/t1.png"
                        alt="User Review"
                        className="w-[55px] h-[55px] rounded-full object-cover border-[3px] border-[#ff7a18]"
                      />
                    </div>
                    <div>
                      <h5 className="text-lg font-semibold text-[#32131a] m-0">
                        Rahul Sharma
                      </h5>
                      <span className="text-[15px] text-[#1a1a1a]">
                        Delhi, India
                      </span>
                    </div>
                  </div>
                  <div className="text-[#fd6410] text-[25px] mb-1 tracking-[3px]">
                    ★★★★★
                  </div>
                  <p className="text-base text-[#311219] leading-[1.6]">
                    I had a great experience with Astrology in Bharat. The
                    astrologer was very accurate and guided me properly about my
                    career and future decisions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* <!-- Astrology in Bharat : CTA Section --> */}
      <section className="py-[50px] bg-cover bg-center bg-no-repeat relative bg-[#301118] bg-[url('/images/back-over.jpg')] bg-fixed">
        {/* Overlay if needed, or assuming the background image is dark. Using a dark fallback just in case */}
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container relative z-10">
          <div className="row align-items-center">
            <div className="col-lg-8 col-md-12 text-center text-lg-start">
              <h2 className="text-[32px] font-bold mb-[15px] text-white">
                Ready to Get Accurate Astrology Guidance?
              </h2>
              <p className="text-lg text-[#ffdcb2] mb-[30px] lg:mb-0 max-w-[700px] mx-auto lg:mx-0">
                Connect with verified astrologers today and get personalized
                solutions for love, career, health, and life problems.
              </p>
            </div>

            <div className="col-lg-4 col-md-12 text-center text-lg-end">
              <a
                href="#"
                className="inline-block py-3 px-[40px] bg-[#fd6410] text-white rounded-[30px] text-lg font-semibold hover:bg-[#e5670d] hover:text-white hover:-translate-y-1 transition-all shadow-[0_4px_15px_rgba(253,100,16,0.4)]"
              >
                Consult Now
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
