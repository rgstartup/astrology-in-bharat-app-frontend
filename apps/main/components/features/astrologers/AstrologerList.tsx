"use client";
import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import NextLink from "next/link";
import NextImage from "next/image";
const NextImageComp = NextImage as any;
const Link = NextLink as any;
import { useRouter, useSearchParams } from "next/navigation";
import safeFetch from "@packages/safe-fetch/safeFetch";
import { toast } from "react-toastify";
import { SkeletonCard } from "./SkeletonCard";
import AstrologerCard from "./AstrologerCard";
import { socket } from "@/libs/socket";

import AstrologerListHeader from "./AstrologerListHeader";
import AstrologerFilterModal from "./AstrologerFilterModal";


const apiEnvVar = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "");
const API_BASE_URL = apiEnvVar ? `${apiEnvVar}/api/v1` : (process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6543/api/v1");

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
  layout?: 'slider' | 'grid';
  title?: string;
}

// Map helper
const getImageUrl = (path?: string) => {
  if (!path) return "/images/dummy-astrologer.jpg";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
  return `${API_BASE_URL.replace(/\/api\/v1\/?$/i, "")}/uploads/${path}`;
};

const mapExpert = (item: ExpertProfile): ClientExpertProfile => ({
  id: item.id,
  userId: item.user?.id, // Map User ID
  image: getImageUrl(item.user?.avatar),
  ratings: item.rating || 0,
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
  layout = 'slider',
  title = "Find Your Astrologer",
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
    searchParams.get("specializations") || searchParams.get("specialization") || ""
  );

  const [filterState, setFilterState] = useState({
    language: searchParams.get("languages") || "",
    minPrice: Number(searchParams.get("minPrice")) || 0,
    maxPrice: Number(searchParams.get("maxPrice")) || 1000,
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
      filterState.maxPrice !== 1000 ||
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
      maxPrice: filterState.maxPrice === 1000 ? undefined : filterState.maxPrice,
      state: filterState.addressState,
      service: filterState.serviceType === "all" ? undefined : filterState.serviceType,
      rating: filterState.minRating === 0 ? undefined : filterState.minRating,
      online: filterState.onlyOnline ? "true" : undefined,
    };

    // Robust loop prevention: Compare final stringified params
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === 0 || value === undefined || value === null) {
        nextParams.delete(key);
      } else {
        nextParams.set(key, String(value));
      }
    });

    if (nextParams.toString() !== searchParams.toString()) {
      router.replace(`${window.location.pathname}?${nextParams.toString()}`, { scroll: false });
      setOffset(0);
    }
  }, [
    debouncedSearch,
    selectedSpecialization,
    filterState,
    router,
    searchParams
  ]);

  // Infinite Scroll Fetcher
  const isFetchingRef = useRef(false);
  const fetchMoreAstrologers = useCallback(
    async (currentOffset: number) => {
      if (isFetchingRef.current) return;
      try {
        isFetchingRef.current = true;
        setLoading(true);

        const queryString = new URLSearchParams(Object.entries({
          limit: String(limit),
          offset: String(currentOffset),
          ...(debouncedSearch && { q: debouncedSearch }),
          ...(selectedSpecialization && { specializations: selectedSpecialization }),
          sort: filterState.sortBy,
          ...(filterState.language && { languages: filterState.language }),
          minPrice: String(filterState.minPrice),
          ...(filterState.maxPrice < 1000 && { maxPrice: String(filterState.maxPrice) }),
          ...(filterState.addressState && { state: filterState.addressState }),
          ...(filterState.serviceType !== "all" && { service: filterState.serviceType }),
          ...(filterState.minRating > 0 && { rating: String(filterState.minRating) }),
          ...(filterState.onlyOnline && { online: "true" }),
        }).filter(([, v]) => v !== undefined)).toString();

        const [responseData, fetchErr] = await safeFetch<{ data: ExpertProfile[]; pagination: { hasMore: boolean } }>(
          `${API_BASE_URL}/expert/list?${queryString}`
        );
        if (fetchErr || !responseData) throw fetchErr;
        const { data, pagination } = responseData;
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
    if (layout === 'grid') return; // Only for slider layout
    if (!cardScrollRef.current || isFetchingRef.current || !hasMore) return;

    const { scrollLeft, scrollWidth, clientWidth } = cardScrollRef.current;
    if (scrollLeft + clientWidth >= scrollWidth - 300) {
      const nextOffset = offset + limit;
      setOffset(nextOffset);
      fetchMoreAstrologers(nextOffset);
    }
  }, [offset, hasMore, fetchMoreAstrologers, layout]);

  useEffect(() => {
    const scrollEl = cardScrollRef.current;
    if (scrollEl && layout === 'slider') {
      scrollEl.addEventListener("scroll", handleScroll);
      return () => scrollEl.removeEventListener("scroll", handleScroll);
    }
  }, [handleScroll, layout]);

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchMoreAstrologers(nextOffset);
  };

  // UI Handlers
  const applyFilters = () => {
    setFilterState(localFilter);
  };

  const resetFilters = () => {
    const initialState = {
      language: "",
      minPrice: 0,
      maxPrice: 1000,
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

  const filterModalId = "astrologerListFilterModal";
  const sortModalId = "astrologerListSortModal";

  return (
    <section className={`astrologer-list ${layout === 'slider' ? 'back-img' : ''}`}>
      <div className="container">
        <h2 className={`title-line ${layout === 'slider' ? 'color-light' : 'mt-4'}`}>
          <span>{title}</span>
        </h2>

        {/* Header / Top Controls */}
        <AstrologerListHeader
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedSpecialization={selectedSpecialization}
          setSelectedSpecialization={setSelectedSpecialization}
          hasActiveFilters={hasActiveFilters}
          filterModalId={filterModalId}
          sortModalId={sortModalId}
          resetFilters={resetFilters}
          scrollTabs={scrollTabs}
          scrollContainerRef={scrollContainerRef}
        />

        {/* Filter Modal */}
        <AstrologerFilterModal
          modalId={filterModalId}
          localFilter={localFilter}
          setLocalFilter={setLocalFilter}
          applyFilters={applyFilters}
          resetFilters={resetFilters}
        />



        {/* Astrologer List Content */}
        {layout === 'slider' ? (
          <div className="flex items-center relative mt-4">
            <button
              onClick={() => scrollCards("left")}
              className="shrink-0 w-10 h-10 flex items-center justify-center text-primary hover:scale-110 transition cursor-pointer z-10"
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
                  <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-full text-sm">Retry</button>
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
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => scrollCards("right")}
              className="shrink-0 w-10 h-10 flex items-center justify-center text-primary hover:scale-110 transition cursor-pointer z-10"
              style={{ background: "transparent" }}
            >
              <i className="fa-solid fa-chevron-right fa-2x"></i>
            </button>
          </div>
        ) : (
          <div className="mt-4">
            <div className="row g-4 justify-content-center">
              {astrologers.length > 0 ? (
                astrologers.map((item) => (
                  <div key={item.id} className="col-xl-3 col-lg-4 col-md-6">
                    <AstrologerCard astrologerData={item} />
                  </div>
                ))
              ) : !loading && initialError ? (
                <div className="col-12 text-center py-10">
                  <p className="text-red-500 font-semibold mb-2">Failed to load astrologers</p>
                  <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded-full text-sm">Retry</button>
                </div>
              ) : !loading && astrologers.length === 0 ? (
                <div className="col-12 text-center py-10">
                  <p className="text-gray-500 font-medium">No astrologers found matching your criteria.</p>
                </div>
              ) : (
                Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="col-xl-3 col-lg-4 col-md-6">
                    <SkeletonCard />
                  </div>
                ))
              )}
            </div>

            {loading && astrologers.length > 0 && (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            )}

            {hasMore && !loading && (
              <div className="view-all mt-4 mb-4 text-center">
                <button
                  onClick={handleLoadMore}
                  className="btn bg-white border border-primary text-primary px-5 py-2.5 rounded-full font-bold hover:bg-primary hover:text-white transition duration-300 shadow-sm mx-auto"
                >
                  Load More Experts
                </button>
              </div>
            )}
          </div>
        )}

        {layout === 'slider' && (
          <div className="view-all mt-4">
            <Link href="/our-astrologers" className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-full font-bold shadow-lg transition-all mx-auto flex items-center justify-center gap-2 w-fit">
              <i className="fa-regular fa-user"></i> View All Astrologers
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default AstrologerList;


