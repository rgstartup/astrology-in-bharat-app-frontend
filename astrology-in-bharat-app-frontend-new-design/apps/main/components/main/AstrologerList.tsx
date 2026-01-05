"use client";
import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link';
import axios from 'axios';

const API_BASE_URL = "http://localhost:4000/api/v1";

interface ExpertProfile {
  id: number;
  user: {
    id: number;
    name: string;
  };
  specialization: string;
  experience_in_years: number;
  languages: string[];
  price: number;
  rating: number;
  is_available: boolean;
}

const AstrologerList = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardScrollRef = useRef<HTMLDivElement>(null);
  const [astrologers, setAstrologers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [filterState, setFilterState] = useState({
    language: "",
    minPrice: 0,
    maxPrice: 100,
    addressState: ""
  });

  // Local state for Filter Modal inputs
  const [localFilter, setLocalFilter] = useState({ ...filterState });

  useEffect(() => {
    setLocalFilter({ ...filterState });
  }, [filterState]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);


  // Let's implement the Ref pattern properly in the full replacement.
  const isFetchingRef = useRef(false);

  const fetchAstrologers = useCallback(async (currentOffset: number, isLoadMore: boolean = false) => {
    if (isFetchingRef.current) return;

    // For 'hasMore', if we are loading more, we should ideally check it.
    // But since we can't easily access the fresh state without deps, 
    // we will rely on values passed or just proceed. 
    // The scroll handler checks hasMore before calling this! 
    // So we don't strictly need to check it here if the caller is responsible.

    try {
      isFetchingRef.current = true;
      setLoading(true);

      const response = await axios.get(`${API_BASE_URL}/expert/profile/list`, {
        params: {
          limit,
          offset: currentOffset,
          q: debouncedSearch,
          specializations: selectedSpecialization,
          sort: sortOption,
          languages: filterState.language,
          minPrice: filterState.minPrice,
          maxPrice: filterState.maxPrice,
          state: filterState.addressState
        },
      });

      const { data, pagination } = response.data;

      const mappedData = data.map((item: ExpertProfile) => ({
        id: item.id,
        image: "/images/astro-img1.png",
        ratings: Math.round(item.rating) || 5,
        name: item.user.name || "Astrologer",
        expertise: item.specialization || "Vedic Astrology",
        experience: item.experience_in_years || 0,
        language: item.languages.join(", ") || "Hindi",
        price: item.price || 0,
        video: "https://www.youtube.com/embed/INoPh_oRooU",
        modalId: `home-modal-${item.id}`,
      }));

      if (isLoadMore) {
        setAstrologers((prev) => [...prev, ...mappedData]);
      } else {
        setAstrologers(mappedData);
      }
      setHasMore(pagination.hasMore);
    } catch (error) {
      console.error("Error fetching astrologers:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [debouncedSearch, selectedSpecialization, sortOption, filterState]);

  useEffect(() => {
    setOffset(0);
    fetchAstrologers(0);
  }, [debouncedSearch, selectedSpecialization, sortOption, filterState, fetchAstrologers]);

  const handleScroll = useCallback(() => {
    if (!cardScrollRef.current || isFetchingRef.current || !hasMore) return;

    const { scrollLeft, scrollWidth, clientWidth } = cardScrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 300) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchAstrologers(nextOffset, true);
    }
  }, [offset, hasMore, fetchAstrologers]);

  useEffect(() => {
    const scrollEl = cardScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener('scroll', handleScroll);
      return () => scrollEl.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

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

  const scrollCards = (direction: "left" | "right") => {
    if (cardScrollRef.current) {
      const { current } = cardScrollRef;
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  const specializations = [
    "Numerology", "Vedic", "Zodiac Compatibility", "Astrocartography", "Lunar Node Analysis"
  ];

  const applyFilters = () => {
    setFilterState(localFilter);
  };

  const resetFilters = () => {
    const initialState = {
      language: "",
      minPrice: 0,
      maxPrice: 100,
      addressState: ""
    };
    setFilterState(initialState);
    setLocalFilter(initialState);
  };

  return (
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
                placeholder="Search Astrologer by Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button type="button">Search</button>
            </div>
          </div>
          <div className="col-sm-3 text-end">
            <button
              type="button"
              className="filter-btn border-0 bg-transparent cursor-pointer hover:text-[#fd6410] transition-colors"
              data-bs-toggle="modal"
              data-bs-target="#homeFilterModal"
            >
              <i className="fa-solid fa-filter"></i> Filter
            </button>
            <button
              type="button"
              className="filter-btn sort-btn border-0 bg-transparent cursor-pointer hover:text-[#fd6410] transition-colors"
              data-bs-toggle="modal"
              data-bs-target="#homeSortModal"
            >
              <i className="fa-solid fa-sort"></i> Sort
            </button>
          </div>
          <div className="col-sm-4 d-flex align-items-center">
            <button
              onClick={() => scroll("left")}
              className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full mr-2 hover:bg-[#fd64101a] transition shrink-0"
              style={{ width: "30px", height: "30px", border: "none", background: "transparent" }}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            <div
              className="flex gap-2.5 overflow-x-auto overflow-y-hidden whitespace-nowrap pb-2.5 [&::-webkit-scrollbar]:hidden w-full px-1"
              id="list-slider"
              ref={scrollContainerRef}
            >
              <div
                onClick={() => setSelectedSpecialization("")}
                className={`px-[15px] py-2 rounded-[20px] text-sm font-medium border border-[#fd6410] cursor-pointer transition duration-300 ${selectedSpecialization === "" ? "bg-[#fd6410] text-white" : "bg-white text-[#1e0b0f] hover:bg-[#fd6410] hover:text-white"}`}
              >
                All
              </div>
              {specializations.map(spec => (
                <div
                  key={spec}
                  onClick={() => setSelectedSpecialization(spec)}
                  className={`px-[15px] py-2 rounded-[20px] text-sm font-medium border border-[#fd6410] cursor-pointer transition duration-300 ${selectedSpecialization === spec ? "bg-[#fd6410] text-white" : "bg-white text-[#1e0b0f] hover:bg-[#fd6410] hover:text-white"}`}
                >
                  {spec}
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll("right")}
              className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full ml-2 hover:bg-[#fd64101a] transition shrink-0"
              style={{ width: "30px", height: "30px", border: "none", background: "transparent" }}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        </div>

        {/* Home Sort Modal */}
        <div className="modal fade" id="homeSortModal" tabIndex={-1} aria-hidden="true" style={{ zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark border-0 shadow-lg">
              <div className="modal-header bg-light border-0">
                <h5 className="modal-title font-bold">Sort By</h5>
                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-0">
                <div className="list-group list-group-flush">
                  <button onClick={() => setSortOption("rating")} className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "rating" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`} data-bs-dismiss="modal">
                    <i className="fa-solid fa-star mr-2"></i> Rating: High to Low
                  </button>
                  <button onClick={() => setSortOption("price_asc")} className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "price_asc" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`} data-bs-dismiss="modal">
                    <i className="fa-solid fa-arrow-up-1-9 mr-2"></i> Price: Low to High
                  </button>
                  <button onClick={() => setSortOption("price_desc")} className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "price_desc" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`} data-bs-dismiss="modal">
                    <i className="fa-solid fa-arrow-down-9-1 mr-2"></i> Price: High to Low
                  </button>
                  <button onClick={() => setSortOption("experience")} className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "experience" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`} data-bs-dismiss="modal">
                    <i className="fa-solid fa-briefcase mr-2"></i> Experience: High to Low
                  </button>
                  <button onClick={() => setSortOption("newest")} className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "newest" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`} data-bs-dismiss="modal">
                    <i className="fa-solid fa-clock mr-2"></i> Newest First
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Filter Modal */}
        <div className="modal fade" id="homeFilterModal" tabIndex={-1} aria-hidden="true" style={{ zIndex: 1060 }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark border-0 shadow-lg">
              <div className="modal-header bg-light border-0">
                <h5 className="modal-title font-bold">Customize Filters</h5>
                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <label className="form-label font-bold text-gray-700">Language</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="fa-solid fa-language text-gray-400"></i></span>
                    <input type="text" className="form-control border-start-0 shadow-none px-0" placeholder="e.g. Hindi, English" value={localFilter.language} onChange={(e) => setLocalFilter({ ...localFilter, language: e.target.value })} />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <label className="form-label font-bold text-gray-700">Price Range</label>
                    <span className="badge bg-orange-100 text-[#fd6410] px-2 py-1">Up to ₹{localFilter.maxPrice}/min</span>
                  </div>
                  <input type="range" className="form-range custom-range" min="0" max="100" step="5" value={localFilter.maxPrice} onChange={(e) => setLocalFilter({ ...localFilter, maxPrice: parseInt(e.target.value) })} />
                  <div className="d-flex justify-content-between text-xs text-gray-400 mt-1">
                    <span>₹0</span>
                    <span>₹50</span>
                    <span>₹100+</span>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label font-bold text-gray-700">State</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0"><i className="fa-solid fa-location-dot text-gray-400"></i></span>
                    <input type="text" className="form-control border-start-0 shadow-none px-0" placeholder="e.g. Maharashtra" value={localFilter.addressState} onChange={(e) => setLocalFilter({ ...localFilter, addressState: e.target.value })} />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0 gap-2">
                <button type="button" className="btn btn-light grow font-semibold py-2" onClick={resetFilters}>Reset All</button>
                <button type="button" className="btn bg-[#fd6410] text-white grow font-semibold py-2 shadow-sm" data-bs-dismiss="modal" onClick={applyFilters}>Apply Changes</button>
              </div>
            </div>
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
            {astrologers.length > 0 ? (
              astrologers.map((item) => (
                <React.Fragment key={item.id}>
                  <div className="grid-item">
                    <Link href={{ pathname: "/astrologer-details", query: { id: item.id } }} className="text-decoration-none">
                      <div className="astro-card min-w-[300px]">
                        <div className="vid-part">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="astro-profile-img"
                          />
                          <span
                            className="play-vid fa-beat"
                            data-bs-toggle="modal"
                            data-bs-target={`#${item.modalId}`}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <i className="fa-solid fa-circle-play"></i>
                          </span>
                        </div>
                        <div className="rating-star">{"★".repeat(item.ratings)}</div>
                        <div className="astro-name">{item.name}</div>
                        <div className="astro-tags">{item.expertise}</div>
                        <div className="astro-info">
                          <strong>Exp:</strong> {item.experience} Years
                        </div>
                        <div className="astro-info">
                          <strong>Lang:</strong> {item.language}
                        </div>
                        <div className="astro-info">
                          <strong>Price:</strong> ₹{item.price}/min
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
                    </Link>
                  </div>

                  {/* Modal Video */}
                  <div
                    className="modal fade"
                    id={item.modalId}
                    tabIndex={-1}
                    aria-hidden="true"
                    style={{ zIndex: 1070 }}
                  >
                    <div className="modal-dialog modal-dialog-centered modal-xl">
                      <div className="modal-content text-dark border-0 shadow-2xl">
                        <div className="modal-header border-0 pb-0">
                          <h4 className="modal-title-astro-about">
                            Meet {item.name}
                          </h4>
                          <button
                            type="button"
                            className="btn-close shadow-none"
                            data-bs-dismiss="modal"
                          >
                            <i className="fa-solid fa-xmark"></i>
                          </button>
                        </div>
                        <div className="modal-body p-4">
                          <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                            <iframe
                              width="100%"
                              height="500"
                              src={item.video}
                              title={`${item.name} Video`}
                              frameBorder="0"
                              allowFullScreen
                            ></iframe>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              ))
            ) : !loading && (
              <div className="w-full text-center py-10 text-white">
                <i className="fa-solid fa-magnifying-glass fa-3x mb-3 text-[#fd641055]"></i>
                <h4>No Astrologers Found</h4>
                <p>Adjust your filters or search terms.</p>
              </div>
            )}

            {loading && (
              <div className="d-flex align-items-center justify-content-center min-w-[200px]">
                <div className="spinner-border text-[#fd6410]" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={() => scrollCards("right")}
            className="shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
            style={{ background: "transparent" }}
          >
            <i className="fa-solid fa-chevron-right fa-2x"></i>
          </button>
        </div>

        <div className="view-all mt-4">
          <Link href="/our-astrologers" className="btn bg-white border border-[#fd6410] text-[#fd6410] px-5 py-2.5 rounded-full font-bold hover:bg-[#fd6410] hover:text-white transition duration-300 shadow-sm m-auto block w-max">
            <i className="fa-regular fa-user mr-2"></i> View All Astrologers
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AstrologerList
