"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
const NextImageComp = NextImage as any;
const Link = NextLink as any;
import { useRouter, useSearchParams } from "next/navigation";
import axios from "axios";
import { toast } from "react-toastify";
import { SkeletonCard } from "./SkeletonCard";
import AstrologerCard from "./AstrologerCard";
import { socket } from "@/libs/socket";

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
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  total_likes?: number; // ADDED
  custom_services?: { id: string; name: string; price: number; unit: string }[] | string;
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
  chat_price?: number;
  call_price?: number;
  video_call_price?: number;
  report_price?: number;
  horoscope_price?: number;
  video?: string;
  modalId: string;
  is_available: boolean;
  total_likes?: number; // ADDED
  custom_services?: { id: string; name: string; price: number; unit: string }[];
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
  chat_price: item.chat_price,
  call_price: item.call_price,
  video_call_price: item.video_call_price,
  report_price: item.report_price,
  horoscope_price: item.horoscope_price,
  video: item.video || "",
  modalId: `home-modal-${item.id}`,
  is_available: item.is_available,
  total_likes: item.total_likes || 0, // ADDED
  custom_services: Array.isArray(item.custom_services)
    ? item.custom_services
    : typeof item.custom_services === 'string'
      ? (() => { try { return JSON.parse(item.custom_services); } catch { return []; } })()
      : [],
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

  const [filterState, setFilterState] = useState({
    language: searchParams.get("languages") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 100,
    addressState: searchParams.get("state") || "",
    serviceType: searchParams.get("service") || "all",
    minRating: Number(searchParams.get("rating")) || 0,
    onlyOnline: searchParams.get("online") === "true",
    sortBy: searchParams.get("sort") || "newest",
  });

  const hasActiveFilters = useMemo(() => {
    return (
      filterState.language !== "" ||
      filterState.minPrice !== 0 ||
      filterState.maxPrice !== 100 ||
      filterState.addressState !== "" ||
      filterState.serviceType !== "all" ||
      filterState.minRating !== 0 ||
      filterState.onlyOnline !== false ||
      filterState.sortBy !== "newest"
    );
  }, [filterState]);

  const [localFilter, setLocalFilter] = useState({ ...filterState });

  // WebSocket Listener for real-time status updates - RESTORED
  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      console.log("[Socket] 🔔 Status Event Detected:", data);

      // Map flexible payload formats from backend
      const expertId = data.expert_id || data.userId || data.id;
      const isAvailable = data.is_available !== undefined
        ? data.is_available
        : (data.status === 'online');

      if (!expertId) return;

      setAstrologers((prev) =>
        prev.map((astro) => {
          const isMatch = String(astro.id) === String(expertId) || String(astro.userId) === String(expertId);
          if (isMatch) {
            console.log(`[Socket] 🔄 Updating Expert: ${astro.name} to ${isAvailable ? 'Online' : 'Offline'}`);
            return { ...astro, is_available: isAvailable };
          }
          return astro;
        })
      );
    };

    socket.on("expert_status_changed", handleStatusUpdate);

    return () => {
      socket.off("expert_status_changed", handleStatusUpdate);
    };
  }, []);

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
      sort: filterState.sortBy === "newest" ? undefined : filterState.sortBy,
      languages: filterState.language,
      minPrice: filterState.minPrice,
      maxPrice: filterState.maxPrice === 100 ? undefined : filterState.maxPrice,
      state: filterState.addressState,
      service: filterState.serviceType === "all" ? undefined : filterState.serviceType,
      rating: filterState.minRating === 0 ? undefined : filterState.minRating,
      online: filterState.onlyOnline ? "true" : undefined,
    };

    updateUrl(updates);
    // When filters change, reset offset and local list so new props can take over?
    // Actually, when URL changes, Parent re-renders, passes new `initialExperts`.
    // We need to reset `offset` to 0.
    setOffset(0);
  }, [
    debouncedSearch,
    selectedSpecialization,
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
          sort: filterState.sortBy,
          languages: filterState.language,
          minPrice: filterState.minPrice,
          maxPrice: filterState.maxPrice,
          state: filterState.addressState,
          service: filterState.serviceType,
          rating: filterState.minRating,
          online: filterState.onlyOnline,
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
    [debouncedSearch, selectedSpecialization, filterState]
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
      serviceType: "all",
      minRating: 0,
      onlyOnline: false,
      sortBy: "newest",
    };
    setFilterState(initialState);
    setLocalFilter(initialState);
    setSelectedSpecialization("");
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

        {/* Header / Top Controls */}
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
              {hasActiveFilters && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-[#fd6410] rounded-full translate-x-1/2 -translate-y-1/2"></span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                type="button"
                className="filter-btn text-red-500 border-0 bg-transparent cursor-pointer hover:text-red-700 transition-colors ml-3 text-sm font-medium"
                onClick={resetFilters}
              >
                <i className="fa-solid fa-xmark mr-1"></i> Reset
              </button>
            )}
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
              <div className="modal-header bg-light border-0 d-flex justify-content-between align-items-center w-100">
                <h5 className="modal-title font-bold">Customize Filters</h5>
                <button
                  type="button"
                  className="btn shadow-none p-0 border-0"
                  style={{
                    backgroundColor: "#e2e8f0",
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer"
                  }}
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="fa-solid fa-xmark" style={{ fontSize: "16px", color: "#1e293b" }}></i>
                </button>
              </div>
              <div className="modal-body p-4 custom-scrollbar" style={{ maxHeight: "70vh", overflowY: "auto" }}>

                {/* 1. Availability */}
                <div className="mb-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${localFilter.onlyOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                    <span className="font-bold text-gray-700">Online Astrologers Only</span>
                  </div>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input cursor-pointer"
                      type="checkbox"
                      checked={localFilter.onlyOnline}
                      onChange={(e) => setLocalFilter({ ...localFilter, onlyOnline: e.target.checked })}
                    />
                  </div>
                </div>

                {/* 2. Service Type */}
                <div className="mb-4">
                  <label className="form-label font-bold text-gray-700 mb-2 block">Service Type</label>
                  <div className="grid grid-cols-2 gap-2">
                    {["all", "chat", "call", "video_call"].map((type) => (
                      <label key={type} className={`cursor-pointer border rounded-lg p-2 text-center transition ${localFilter.serviceType === type ? 'bg-orange-50 border-[#fd6410] text-[#fd6410] font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}>
                        <input
                          type="radio"
                          name="serviceType"
                          className="hidden"
                          checked={localFilter.serviceType === type}
                          onChange={() => setLocalFilter({ ...localFilter, serviceType: type })}
                        />
                        {type === "all" ? "All Services" : type === "video_call" ? "Video Call" : type.charAt(0).toUpperCase() + type.slice(1)}
                      </label>
                    ))}
                  </div>
                </div>

                {/* 3. Sort Order */}
                <div className="mb-4">
                  <label className="form-label font-bold text-gray-700 mb-2 block">Sort By</label>
                  <select
                    className="form-select border-gray-200 shadow-sm"
                    value={localFilter.sortBy}
                    onChange={(e) => setLocalFilter({ ...localFilter, sortBy: e.target.value })}
                  >
                    <option value="newest">Newest First</option>
                    <option value="rating">Rating: High to Low</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="experience">Experience: High to Low</option>
                  </select>
                </div>

                {/* 4. Rating Filter */}
                <div className="mb-4">
                  <label className="form-label font-bold text-gray-700 mb-2 block">Minimum Rating</label>
                  <div className="flex gap-2">
                    {[0, 3, 4, 5].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setLocalFilter({ ...localFilter, minRating: rating })}
                        className={`flex-1 py-1.5 rounded-md border text-sm transition ${localFilter.minRating === rating
                          ? 'bg-[#fd6410] text-white border-[#fd6410]'
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                          }`}
                      >
                        {rating === 0 ? 'Any' : <><i className="fa-solid fa-star text-xs mr-1" />{rating}+</>}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Price Range */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between mb-2">
                    <label className="form-label font-bold text-gray-700">Price Range</label>
                    <span className="px-3 py-1 rounded-full font-bold text-sm shadow-sm" style={{ backgroundColor: "#fd6410", color: "#fff" }}>
                      Up to ₹{localFilter.maxPrice}/min
                    </span>
                  </div>
                  <input
                    type="range"
                    className="form-range w-full h-2 rounded-lg appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, #fd6410 ${(localFilter.maxPrice / 500) * 100}%, #e5e7eb ${(localFilter.maxPrice / 500) * 100}%)`
                    }}
                    min="0"
                    max="500"
                    step="10"
                    value={localFilter.maxPrice}
                    onChange={(e) => setLocalFilter({ ...localFilter, maxPrice: parseInt(e.target.value) })}
                  />
                  <div className="d-flex justify-content-between text-xs mt-2 font-medium">
                    <span
                      className={`cursor-pointer transition-colors ${localFilter.maxPrice < 50 ? 'text-[#fd6410] font-bold' : 'text-gray-400 hover:text-orange-500'}`}
                      onClick={() => setLocalFilter({ ...localFilter, maxPrice: 0 })}
                    >
                      Free
                    </span>
                    <span
                      className={`cursor-pointer transition-colors ${localFilter.maxPrice >= 50 && localFilter.maxPrice < 100 ? 'text-[#fd6410] font-bold' : 'text-gray-400 hover:text-orange-500'}`}
                      onClick={() => setLocalFilter({ ...localFilter, maxPrice: 50 })}
                    >
                      ₹50
                    </span>
                    <span
                      className={`cursor-pointer transition-colors ${localFilter.maxPrice >= 100 && localFilter.maxPrice < 500 ? 'text-[#fd6410] font-bold' : 'text-gray-400 hover:text-orange-500'}`}
                      onClick={() => setLocalFilter({ ...localFilter, maxPrice: 100 })}
                    >
                      ₹100
                    </span>
                    <span
                      className={`cursor-pointer transition-colors ${localFilter.maxPrice >= 500 ? 'text-[#fd6410] font-bold' : 'text-gray-400 hover:text-orange-500'}`}
                      onClick={() => setLocalFilter({ ...localFilter, maxPrice: 500 })}
                    >
                      ₹500+
                    </span>
                  </div>
                </div>

                {/* 6. Language & State */}
                <div className="grid grid-cols-2 gap-3 mb-2">
                  <div>
                    <label className="form-label font-bold text-gray-700 text-sm">Language</label>
                    <input
                      type="text"
                      className="form-control form-control-sm border-gray-200"
                      placeholder="e.g. Hindi"
                      value={localFilter.language}
                      onChange={(e) => setLocalFilter({ ...localFilter, language: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="form-label font-bold text-gray-700 text-sm">State</label>
                    <input
                      type="text"
                      className="form-control form-control-sm border-gray-200"
                      placeholder="e.g. Delhi"
                      value={localFilter.addressState}
                      onChange={(e) => setLocalFilter({ ...localFilter, addressState: e.target.value })}
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
                  className="btn text-white grow font-semibold py-2 shadow-sm"
                  style={{ backgroundColor: "#fd6410", borderColor: "#fd6410" }}
                  data-bs-dismiss="modal"
                  onClick={applyFilters}
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Astrologer List Scroll */}
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
            ) : !loading && initialError ? (
              <div className="w-full text-center py-10 flex flex-col items-center justify-center">
                <p className="text-red-500 font-semibold mb-2">Failed to load astrologers</p>
                <button onClick={() => window.location.reload()} className="px-4 py-2 bg-[#fd6410] text-white rounded-full text-sm">Retry</button>
              </div>
            ) : !loading && astrologers.length === 0 ? (
              <div className="w-full text-center py-10">
                <p className="text-gray-500 font-medium">No astrologers found matching your criteria.</p>
              </div>
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
            className="shrink-0 w-10 h-10 flex items-center justify-content-center text-[#fd6410] hover:scale-110 transition cursor-pointer z-10"
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
