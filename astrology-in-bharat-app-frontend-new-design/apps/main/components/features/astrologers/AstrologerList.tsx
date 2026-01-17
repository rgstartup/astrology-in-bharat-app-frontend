"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
const NextImageComp = NextImage as any;
const Link = NextLink as any;
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { SkeletonCard } from "./SkeletonCard";
import AstrologerCard from "./AstrologerCard";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6543/api/v1";

interface ExpertProfile {
  id: number;
  user: {
    id: number;
    name: string;
    avatar?: string;
    language?: string;
  };
  name?: string; // Fallback
  image?: string; // Fallback
  specialization: string;
  expertise?: string; // Fallback
  experience_in_years: number;
  experience?: number; // Fallback
  languages: string[];
  price: number;
  rating: number;
  ratings?: number; // Fallback
  is_available: boolean;
  video?: string;
  total_likes?: number; // ADDED
}

interface ClientExpertProfile {
  id: number;
  userId: number; // ADDED
  image: string;
  ratings: number;
  name: string;
  expertise: string;
  experience: number;
  language: string;
  price: number;
  video: string;
  modalId: string;
  is_available: boolean;
  total_likes?: number; // ADDED
}

interface AstrologerListProps {
  initialExperts: ExpertProfile[];
  initialPagination?: {
    total: number;
    hasMore: boolean;
  };
  initialError?: string;
}

// Map helper
const getImageUrl = (path?: string) => {
  if (!path) return "/images/astro-img1.png";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
  return `${API_BASE_URL.replace("/api/v1", "")}/uploads/${path}`;
};

const mapExpert = (item: ExpertProfile): ClientExpertProfile => ({
  id: item.id,
  userId: item.user?.id, // Map User ID
  image: getImageUrl(item.user?.avatar),
  ratings: Math.round(item.rating || 0) || 5,
  name: item.user?.name || "Astrologer",
  expertise: item.specialization || "Vedic Astrology",
  experience: item.experience_in_years || 0,
  language: Array.isArray(item.languages)
    ? item.languages.join(", ")
    : item.user?.language || "Hindi",
  price: item.price || 0,
  video: item.video || "https://www.youtube.com/embed/INoPh_oRooU",
  modalId: `home-modal-${item.id}`,
  is_available: item.is_available,
  total_likes: item.total_likes || 0, // ADDED
});

const AstrologerList: React.FC<AstrologerListProps> = ({
  initialExperts,
  initialPagination,
  initialError,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardScrollRef = useRef<HTMLDivElement>(null);

  // State
  const [astrologers, setAstrologers] = useState<ClientExpertProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const limit = 20;

  // Filter State from URL or local defaults
  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(
    searchParams.get("q") || ""
  );
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    searchParams.get("specializations") || ""
  );
  const [sortOption, setSortOption] = useState(
    searchParams.get("sort") || "newest"
  );

  const [filterState, setFilterState] = useState({
    language: searchParams.get("languages") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 100,
    addressState: searchParams.get("state") || "",
  });

  const [localFilter, setLocalFilter] = useState({ ...filterState });
  // Initialize from Server Data
  useEffect(() => {
    if (initialError) {
      toast.error(
        initialError === "server_unreachable"
          ? "Server is unreachable. Please check your connection."
          : "Failed to load experts"
      );
    }

    if (initialExperts && offset === 0) {
      setAstrologers(initialExperts.map(mapExpert));
      // If server returned fewer items than limit, set hasMore false
      if (initialExperts.length < limit) {
        setHasMore(false);
      } else if (initialPagination) {
        setHasMore(initialPagination.hasMore);
      }
    }
  }, [initialExperts, initialPagination, initialError, offset]);
  // NOTE: We do not depend on `offset` here to avoid loop reset.
  // We only set initial data when provided and we are at start.

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Update URL when filters change (Client -> URL -> Server -> Client)
  // But for "Load More" we want client side appending.
  // For filters, we want full refresh (or effectively refetch).

  const updateUrl = useCallback(
    (updates: Record<string, string | number | undefined | null>) => {
      const params = new URLSearchParams(searchParams.toString());

      Object.entries(updates).forEach(([key, value]) => {
        if (
          value === "" ||
          value === 0 ||
          value === undefined ||
          value === null
        ) {
          params.delete(key);
        } else {
          params.set(key, String(value));
        }
      });

      // Reset offset when filters change
      // params.delete("offset");
      // We don't put offset in URL for infinite scroll usually,
      // but if we did, we'd reset it.

      router.push(`/?${params.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );

  // Effect to sync state changes to URL
  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }

    const updates = {
      q: debouncedSearch,
      specializations: selectedSpecialization,
      sort: sortOption === "newest" ? undefined : sortOption,
      languages: filterState.language,
      minPrice: filterState.minPrice,
      maxPrice: filterState.maxPrice === 100 ? undefined : filterState.maxPrice,
      state: filterState.addressState,
    };

    updateUrl(updates);
    // When filters change, reset offset and local list so new props can take over?
    // Actually, when URL changes, Parent re-renders, passes new `initialExperts`.
    // We need to reset `offset` to 0.
    setOffset(0);
  }, [
    debouncedSearch,
    selectedSpecialization,
    sortOption,
    filterState,
    updateUrl,
  ]);

  // Infinite Scroll Fetcher
  const isFetchingRef = useRef(false);
  const fetchMoreAstrologers = useCallback(
    async (currentOffset: number) => {
      if (isFetchingRef.current) return;
      try {
        isFetchingRef.current = true;
        setLoading(true);

        const params = {
          limit,
          offset: currentOffset,
          q: debouncedSearch,
          specializations: selectedSpecialization,
          sort: sortOption,
          languages: filterState.language,
          minPrice: filterState.minPrice,
          maxPrice: filterState.maxPrice,
          state: filterState.addressState,
        };

        const response = await axios.get(
          `${API_BASE_URL}/expert/list`,
          { params }
        );
        const { data, pagination } = response.data;
        console.log("Client Side - Astrologer Data Fetch (Infinite Scroll):", data);

        const mappedData = data.map(mapExpert);

        setAstrologers((prev) => [...prev, ...mappedData]);
        setHasMore(pagination.hasMore);
      } catch (error) {
        toast.error("Failed to load more astrologers");
        console.error(error);
      } finally {
        setLoading(false);
        isFetchingRef.current = false;
      }
    },
    [debouncedSearch, selectedSpecialization, sortOption, filterState]
  );

  const handleScroll = useCallback(() => {
    if (!cardScrollRef.current || isFetchingRef.current || !hasMore) return;

    const { scrollLeft, scrollWidth, clientWidth } = cardScrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 300) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchMoreAstrologers(nextOffset);
    }
  }, [offset, hasMore, fetchMoreAstrologers]);

  useEffect(() => {
    const scrollEl = cardScrollRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
      return () => scrollEl.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll]);

  // UI Handlers
  const applyFilters = () => {
    setFilterState(localFilter);
  };

  const resetFilters = () => {
    const initialState = {
      language: "",
      minPrice: 0,
      maxPrice: 100,
      addressState: "",
    };
    setFilterState(initialState);
    setLocalFilter(initialState);
    setSelectedSpecialization("");
    setSortOption("newest");
    setSearchQuery("");
  };

  const specializations = [
    "Numerology",
    "Vedic",
    "Zodiac Compatibility",
    "Astrocartography",
    "Lunar Node Analysis",
    "Love Problem Solution",
    "Marriage Problem",

    "Divorce Problem Solution", "Breakup Problem Solution",
    "Get Your Ex Love Back",
    "Family Problem Solution",
    "Dispute Solution",
    "Childless Couple Solution"
  ];

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

  const scrollTabs = (direction: "left" | "right") => {
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
              onClick={() => scrollTabs("left")}
              className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full mr-2 hover:bg-[#fd64101a] transition shrink-0"
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
              <div
                onClick={() => setSelectedSpecialization("")}
                className={`px-[15px] py-2 rounded-[20px] text-sm font-medium border border-[#fd6410] cursor-pointer transition duration-300 ${selectedSpecialization === "" ? "bg-[#fd6410] text-white" : "bg-white text-[#1e0b0f] hover:bg-[#fd6410] hover:text-white"}`}
              >
                All
              </div>
              {specializations.map((spec) => (
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
              onClick={() => scrollTabs("right")}
              className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full ml-2 hover:bg-[#fd64101a] transition shrink-0"
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

        {/* Home Sort Modal */}
        <div
          className="modal fade"
          id="homeSortModal"
          tabIndex={-1}
          aria-hidden="true"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark border-0 shadow-lg">
              <div className="modal-header bg-light border-0">
                <h5 className="modal-title font-bold">Sort By</h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="list-group list-group-flush">
                  <button
                    onClick={() => setSortOption("rating")}
                    className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "rating" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`}
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-star mr-2"></i> Rating: High to
                    Low
                  </button>
                  <button
                    onClick={() => setSortOption("price_asc")}
                    className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "price_asc" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`}
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-arrow-up-1-9 mr-2"></i> Price: Low
                    to High
                  </button>
                  <button
                    onClick={() => setSortOption("price_desc")}
                    className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "price_desc" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`}
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-arrow-down-9-1 mr-2"></i> Price:
                    High to Low
                  </button>
                  <button
                    onClick={() => setSortOption("experience")}
                    className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "experience" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`}
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-briefcase mr-2"></i> Experience:
                    High to Low
                  </button>
                  <button
                    onClick={() => setSortOption("newest")}
                    className={`list-group-item list-group-item-action border-0 py-3 ${sortOption === "newest" ? "bg-orange-50 text-[#fd6410] font-semibold" : ""}`}
                    data-bs-dismiss="modal"
                  >
                    <i className="fa-solid fa-clock mr-2"></i> Newest First
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Home Filter Modal */}
        <div
          className="modal fade"
          id="homeFilterModal"
          tabIndex={-1}
          aria-hidden="true"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark border-0 shadow-lg">
              <div className="modal-header bg-light border-0">
                <h5 className="modal-title font-bold">Customize Filters</h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-4">
                <div className="mb-4">
                  <label className="form-label font-bold text-gray-700">
                    Language
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fa-solid fa-language text-gray-400"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 shadow-none px-0"
                      placeholder="e.g. Hindi, English"
                      value={localFilter.language}
                      onChange={(e) =>
                        setLocalFilter({
                          ...localFilter,
                          language: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <label className="form-label font-bold text-gray-700">
                      Price Range
                    </label>
                    <span className="badge bg-orange-100 text-[#fd6410] px-2 py-1">
                      Up to ₹{localFilter.maxPrice}/min
                    </span>
                  </div>
                  <input
                    type="range"
                    className="form-range custom-range"
                    min="0"
                    max="100"
                    step="5"
                    value={localFilter.maxPrice}
                    onChange={(e) =>
                      setLocalFilter({
                        ...localFilter,
                        maxPrice: parseInt(e.target.value),
                      })
                    }
                  />
                  <div className="d-flex justify-content-between text-xs text-gray-400 mt-1">
                    <span>₹0</span>
                    <span>₹50</span>
                    <span>₹100+</span>
                  </div>
                </div>
                <div className="mb-2">
                  <label className="form-label font-bold text-gray-700">
                    State
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0">
                      <i className="fa-solid fa-location-dot text-gray-400"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 shadow-none px-0"
                      placeholder="e.g. Maharashtra"
                      value={localFilter.addressState}
                      onChange={(e) =>
                        setLocalFilter({
                          ...localFilter,
                          addressState: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0 gap-2">
                <button
                  type="button"
                  className="btn btn-light grow font-semibold py-2"
                  onClick={resetFilters}
                >
                  Reset All
                </button>
                <button
                  type="button"
                  className="btn bg-[#fd6410] text-white grow font-semibold py-2 shadow-sm"
                  data-bs-dismiss="modal"
                  onClick={applyFilters}
                >
                  Apply Changes
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center relative mt-4">
          <button
            onClick={() => scrollCards("left")}
            className="shrink-0 w-10 h-10 flex items-center justify-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
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
                <AstrologerCard
                  key={item.id}
                  astrologerData={item}
                  cardClassName="min-w-[300px]"
                />
              ))
            ) : (
              Array.from({ length: 4 }).map((_, i) => (
                <div className="min-w-[300px]" key={i}>
                  <SkeletonCard />
                </div>
              ))
            )}

            {loading && astrologers.length > 0 && (
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
          <Link href="/our-astrologers" className="btn-link wfc mt-4 mb-4 mx-auto">
            <i className="fa-regular fa-user mr-2"></i> View All Astrologers
          </Link>
        </div>
      </div>
    </section>
  );
};

export default AstrologerList;
