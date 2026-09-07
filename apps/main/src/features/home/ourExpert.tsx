"use client";

import { api } from "@/actions";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import {
  ExpertGridSkeleton,
  SkeletonCard,
} from "@/components/features/experts/SkeletonCard";
import ExpertCard from "@/components/features/experts/ExpertCard";

import { useTranslations } from "next-intl";
import { IFetchExpertsResponse } from "./expert-list-wrapper/expert-list/api/fetch-expert";

const DUMMY_EXPERTS = [
  {
    id: "dummy-1",
    user: {
      id: "d1",
      name: "Astrology Ravi Rai",
      avatar: "/images/dummy-expert.jpg",
    },
    specialization: "Vedic, Numerology",
    experience_in_years: 5,
    languages: ["English", "Hindi"],
    price: 51,
    rating: 5,
    is_available: true,
    isDummy: true,
  },
  {
    id: "dummy-2",
    user: {
      id: "d2",
      name: "Astrologer Shanti",
      avatar: "/images/dummy-expert.jpg",
    },
    specialization: "Tarot, Vastu",
    experience_in_years: 8,
    languages: ["English", "Hindi", "Marathi"],
    price: 101,
    rating: 4.8,
    is_available: false,
    isDummy: true,
  },
  {
    id: "dummy-3",
    user: {
      id: "d3",
      name: "Pandit Sharma",
      avatar: "/images/dummy-expert.jpg",
    },
    specialization: "Kundli, Palmistry",
    experience_in_years: 12,
    languages: ["Hindi", "Sanskrit"],
    price: 21,
    rating: 4.9,
    is_available: true,
    isDummy: true,
  },
  {
    id: "dummy-4",
    user: { id: "d4", name: "Astro Dev", avatar: "/images/dummy-expert.jpg" },
    specialization: "Numerology, Nadi",
    experience_in_years: 3,
    languages: ["English", "Gujarati"],
    price: 51,
    rating: 4.7,
    is_available: true,
    isDummy: true,
  },
];

const OurExpert = () => {
  const t = useTranslations("Home");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const spec = searchParams.get("specialization");
  const [experts, setExperts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const limit = 20;

  // Filter & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState(
    spec || "",
  );
  const [sortOption, setSortOption] = useState("newest");
  const [filterState, setFilterState] = useState({
    language: "",
    minPrice: 0,
    maxPrice: 1000,
    addressState: "",
    onlineOnly: false,
  });

  // Local state for Filter Modal inputs (to apply on click)
  const [localFilter, setLocalFilter] = useState({ ...filterState });

  // Synchronization when central filterState changes (e.g. on Reset)
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

  const fetchExperts = useCallback(
    async (
      currentPage: number,
      isLoadMore: boolean = false,
      isSilent: boolean = false,
    ) => {
      try {
        if (!isSilent) setLoading(true);
        const [responseData, fetchErr] = await api.get<IFetchExpertsResponse>(
          `/expert/list?${new URLSearchParams(
            Object.entries({
              limit: String(limit),
              page: String(currentPage),
              ...(debouncedSearch && { q: debouncedSearch }),
              ...(selectedSpecialization && {
                specializations: selectedSpecialization,
              }),
              ...(sortOption && { sort: sortOption }),
              ...(filterState.language && { languages: filterState.language }),
              minPrice: String(filterState.minPrice),
              ...(filterState.maxPrice < 1000 && {
                maxPrice: String(filterState.maxPrice),
              }),
              ...(filterState.addressState && {
                state: filterState.addressState,
              }),
              ...(filterState.onlineOnly && { onlineOnly: "true" }),
            }).filter(([, v]) => v !== undefined),
          ).toString()}`,
        );

        if (fetchErr || !responseData) throw fetchErr;
        const { data, pagination } = responseData;

        const getImageUrl = (path?: string) => {
          if (!path) return "/images/dummy-expert.jpg";
          if (
            path.startsWith("http") ||
            path.startsWith("data:") ||
            path.startsWith("/")
          )
            return path;

          if (typeof window === "undefined") {
            // Server-side: MUST use absolute URL (otherwise fetch fails)
            const baseUrl = (
              process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543"
            ).replace(/\/api\/v1\/?$/i, "");
            return `${baseUrl}/uploads/${path}`;
          }

          // Client-side: ALWAYS use relative path to utilize Next.js rewrites/proxy.
          return `/uploads/${path}`;
        };

        const mappedData = data.map((item: any) => ({
          id: item.id,
          userId: item.userId || item.user?.id,
          image: getImageUrl(item.user?.avatar),
          ratings: item.ratings || 5,
          name: item.user?.name || "Expert",
          expertise: item.specialization || "",
          experience: item.experience_in_years || 0,
          language: Array.isArray(item.languages)
            ? item.languages.join(", ")
            : "Hindi",
          price: item.price,
          chat_price: item.chat_price,
          call_price: item.call_price,
          video_call_price: item.video_call_price,
          is_available: item.is_available,
          video: item.video,
          modalId: `modal-${item.id}`,
        }));

        if (isLoadMore) {
          setExperts((prev) => [...prev, ...mappedData]);
        } else {
          setExperts(mappedData);
        }
        setHasMore(pagination.hasMore);
      } catch (error) {
        console.error("Error fetching experts:", error);
      } finally {
        if (!isSilent) setLoading(false);
      }
    },
    [debouncedSearch, selectedSpecialization, sortOption, filterState],
  );

  useEffect(() => {
    setPage(1);
    setExperts([]); // Clear list to show skeletons during filter/search change
    fetchExperts(1);
  }, [
    debouncedSearch,
    selectedSpecialization,
    sortOption,
    filterState,
    fetchExperts,
  ]);

  // Real-time status update polling
  useEffect(() => {
    const interval = setInterval(() => {
      // Background update to reflect status changes without a showing a loading overlay
      fetchExperts(page, false, true);
    }, 10000); // 10 seconds polling

    return () => clearInterval(interval);
  }, [fetchExperts, page]);

  useEffect(() => {
    setSelectedSpecialization(spec || "");
  }, [spec]);

  const handleLoadMore = (e: React.MouseEvent) => {
    e.preventDefault();
    const nextPage = page + 1;
    setPage(nextPage);
    fetchExperts(nextPage, true);
  };

  const scroll = (direction: string) => {
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

  const specializations = [
    { key: "numerology", value: "Numerology" },
    { key: "vedic", value: "Vedic" },
    { key: "zodiacCompatibility", value: "Zodiac Compatibility" },
    { key: "astrocartography", value: "Astrocartography" },
    { key: "lunarNodeAnalysis", value: "Lunar Node Analysis" },
    { key: "loveProblem", value: "Love Problem Solution" },
    { key: "marriageProblem", value: "Marriage Problem" },
    { key: "divorceProblem", value: "Divorce Problem Solution" },
    { key: "breakupProblem", value: "Breakup Problem Solution" },
    { key: "exLoveBack", value: "Get Your Ex Love Back" },
    { key: "familyProblem", value: "Family Problem Solution" },
    { key: "disputeSolution", value: "Dispute Solution" },
    { key: "childlessCouple", value: "Childless Couple Solution" },
  ] as const;

  const applyFilters = () => {
    setFilterState(localFilter);
  };

  const resetFilters = () => {
    const initialState = {
      language: "",
      minPrice: 0,
      maxPrice: 1000,
      addressState: "",
      onlineOnly: false,
    };
    setFilterState(initialState);
    setLocalFilter(initialState);
  };

  return (
    <section
      className="py-[50px] relative overflow-hidden"
      style={{
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
        <div
          className="relative mb-10 text-white"
          style={{ "--heading-border-color": "rgba(255,255,255,0.2)" } as any}
        >
          <h2 className="section-heading-premium">
            <span>{t("expertSection.title")}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10 text-white">
          {/* Search Box */}
          <div className="lg:col-span-5 text-black">
            <div className="flex w-full shadow-lg">
              <input
                type="text"
                className="w-full px-6 py-3 border-0 rounded-l-full outline-none text-base bg-white text-black"
                placeholder={t("expertSection.searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                type="button"
                className="px-8 py-3 bg-orange text-white rounded-r-full font-bold text-base hover:opacity-90 transition-all"
              >
                {t("expertSection.searchBtn")}
              </button>
            </div>
          </div>

          {/* Filter & Sort Buttons */}
          <div className="lg:col-span-3 flex justify-center lg:justify-end gap-6">
            <button
              type="button"
              className="flex items-center gap-2 text-white font-medium hover:text-orange transition-all"
              data-bs-toggle="modal"
              data-bs-target="#filterModal"
            >
              <i className="fa-solid fa-filter text-orange"></i>{" "}
              {t("expertSection.filterBtn")}
            </button>
            <button
              type="button"
              className="flex items-center gap-2 text-white font-medium hover:text-orange transition-all"
              data-bs-toggle="modal"
              data-bs-target="#sortModal"
            >
              <i className="fa-solid fa-sort text-orange"></i>{" "}
              {t("expertSection.sortBtn")}
            </button>
          </div>

          {/* Specialization Slider */}
          <div className="lg:col-span-4 flex items-center gap-2">
            <button
              onClick={() => scroll("left")}
              className="text-orange hover:scale-110 transition-transform"
            >
              <i className="fa-solid fa-chevron-left text-xl"></i>
            </button>
            <div
              className="flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden whitespace-nowrap py-2 w-full px-2"
              id="list-slider"
              ref={scrollContainerRef}
            >
              <div
                onClick={() => setSelectedSpecialization("")}
                className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 shadow-md ${selectedSpecialization === "" ? "bg-orange text-white" : "bg-white text-gray-800 hover:bg-orange hover:text-white"}`}
              >
                {t("expertSection.all")}
              </div>
              {specializations.map((spec) => (
                <div
                  key={spec.key}
                  onClick={() => setSelectedSpecialization(spec.value)}
                  className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 shadow-md ${selectedSpecialization === spec.value ? "bg-orange text-white" : "bg-white text-gray-800 hover:bg-orange hover:text-white"}`}
                >
                  {t(`expertSection.specializations.${spec.key}`)}
                </div>
              ))}
            </div>
            <button
              onClick={() => scroll("right")}
              className="text-orange hover:scale-110 transition-transform"
            >
              <i className="fa-solid fa-chevron-right text-xl"></i>
            </button>
          </div>
        </div>

        {/* Sort Modal */}
        <div
          className="modal fade"
          id="sortModal"
          tabIndex={-1}
          aria-hidden="true"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark border-0 shadow-lg rounded-3">
              <div className="modal-header bg-linear-to-r from-orange-50 to-white border-0 py-3 px-4">
                <h5 className="modal-title font-bold text-lg">
                  <i className="fa-solid fa-sort mr-2 text-primary"></i>
                  {t("expertSection.sortByTitle")}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  X
                </button>
              </div>
              <div className="modal-body p-4">
                <div className="space-y-3">
                  <label
                    className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50"
                    style={{
                      borderColor:
                        sortOption === "none" ? "primary" : "#e5e7eb",
                      backgroundColor:
                        sortOption === "none" ? "#fff7ed" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="sortOption"
                      value="none"
                      checked={sortOption === "none"}
                      onChange={() => setSortOption("none")}
                      className="form-check-input me-3"
                      style={{ accentColor: "primary" }}
                    />
                    <i className="fa-solid fa-ban text-primary mr-3"></i>
                    <span className="font-medium">
                      {t("expertSection.sortOptions.none")}
                    </span>
                  </label>
                  <label
                    className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50"
                    style={{
                      borderColor:
                        sortOption === "rating" ? "primary" : "#e5e7eb",
                      backgroundColor:
                        sortOption === "rating" ? "#fff7ed" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="sortOption"
                      value="rating"
                      checked={sortOption === "rating"}
                      onChange={() => setSortOption("rating")}
                      className="form-check-input me-3"
                      style={{ accentColor: "primary" }}
                    />
                    <i className="fa-solid fa-star text-primary mr-3"></i>
                    <span className="font-medium">
                      {t("expertSection.sortOptions.rating")}
                    </span>
                  </label>
                  <label
                    className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50"
                    style={{
                      borderColor:
                        sortOption === "experience" ? "primary" : "#e5e7eb",
                      backgroundColor:
                        sortOption === "experience" ? "#fff7ed" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="sortOption"
                      value="experience"
                      checked={sortOption === "experience"}
                      onChange={() => setSortOption("experience")}
                      className="form-check-input me-3"
                      style={{ accentColor: "primary" }}
                    />
                    <i className="fa-solid fa-briefcase text-primary mr-3"></i>
                    <span className="font-medium">
                      {t("expertSection.sortOptions.experience")}
                    </span>
                  </label>
                  <label
                    className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50"
                    style={{
                      borderColor:
                        sortOption === "price_desc" ? "primary" : "#e5e7eb",
                      backgroundColor:
                        sortOption === "price_desc" ? "#fff7ed" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="sortOption"
                      value="price_desc"
                      checked={sortOption === "price_desc"}
                      onChange={() => setSortOption("price_desc")}
                      className="form-check-input me-3"
                      style={{ accentColor: "primary" }}
                    />
                    <i className="fa-solid fa-arrow-down-9-1 text-primary mr-3"></i>
                    <span className="font-medium">
                      {t("expertSection.sortOptions.priceDesc")}
                    </span>
                  </label>
                  <label
                    className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50"
                    style={{
                      borderColor:
                        sortOption === "price_asc" ? "primary" : "#e5e7eb",
                      backgroundColor:
                        sortOption === "price_asc" ? "#fff7ed" : "white",
                    }}
                  >
                    <input
                      type="radio"
                      name="sortOption"
                      value="price_asc"
                      checked={sortOption === "price_asc"}
                      onChange={() => setSortOption("price_asc")}
                      className="form-check-input me-3"
                      style={{ accentColor: "primary" }}
                    />
                    <i className="fa-solid fa-arrow-up-1-9 text-primary mr-3"></i>
                    <span className="font-medium">
                      {t("expertSection.sortOptions.priceAsc")}
                    </span>
                  </label>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0">
                <button
                  type="button"
                  className="btn bg-black text-white w-100 font-semibold py-2.5 shadow-sm rounded-lg"
                  data-bs-dismiss="modal"
                >
                  {t("expertSection.applyBtns.applySort")}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Modal */}
        <div
          className="modal fade"
          id="filterModal"
          tabIndex={-1}
          aria-hidden="true"
          style={{ zIndex: 1060 }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark border-0 shadow-lg rounded-3">
              <div className="modal-header bg-linear-to-r from-orange-50 to-white border-0 py-3 px-4">
                <h5 className="modal-title font-bold text-lg">
                  <i className="fa-solid fa-filter mr-2 text-primary"></i>
                  {t("expertSection.filterTitle")}
                </h5>
                <button
                  type="button"
                  className="btn-close shadow-none text-red-500"
                  data-bs-dismiss="modal"
                  aria-label="Close "
                >
                  X
                </button>
              </div>
              <div className="modal-body p-4">
                {/* Language Input */}
                <div className="mb-4">
                  <label className="form-label font-bold text-gray-700 mb-2">
                    {t("expertSection.filterLabels.language")}
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-lg">
                      <i className="fa-solid fa-language text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 shadow-none rounded-end-lg"
                      placeholder={t(
                        "expertSection.filterLabels.languagePlaceholder",
                      )}
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

                {/* State Input */}
                <div className="mb-4">
                  <label className="form-label font-bold text-gray-700 mb-2">
                    {t("expertSection.filterLabels.state")}
                  </label>
                  <div className="input-group">
                    <span className="input-group-text bg-white border-end-0 rounded-start-lg">
                      <i className="fa-solid fa-location-dot text-primary"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 shadow-none rounded-end-lg"
                      placeholder={t(
                        "expertSection.filterLabels.statePlaceholder",
                      )}
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

                {/* Price Range Slider */}
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <label className="form-label font-bold text-gray-700 mb-0">
                      {t("expertSection.filterLabels.priceRange")}
                    </label>
                    <span className="badge bg-primary text-white px-3 py-1.5 rounded-full">
                      {t("expertSection.filterLabels.upTo")} ₹
                      {localFilter.maxPrice}
                      {t("expertSection.filterLabels.perMin")}
                    </span>
                  </div>
                  <input
                    type="range"
                    className="form-range w-100"
                    min="0"
                    max="1000"
                    step="10"
                    value={localFilter.maxPrice}
                    onChange={(e) =>
                      setLocalFilter({
                        ...localFilter,
                        maxPrice: parseInt(e.target.value),
                      })
                    }
                    style={{ accentColor: "primary" }}
                  />
                  <div className="d-flex justify-content-between text-xs text-gray-500 mt-1 px-1">
                    <span>₹0</span>
                    <span>₹250</span>
                    <span>₹500</span>
                    <span>₹750</span>
                    <span>₹1000+</span>
                  </div>
                </div>

                {/* Online Only Toggle */}
                <div className="p-3 rounded-lg border bg-linear-to-r from-green-50 to-white">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="w-10 h-10 rounded-full bg-green-100 d-flex align-items-center justify-content-center mr-3">
                        <i className="fa-solid fa-circle text-green-500 text-xs"></i>
                      </div>
                      <div>
                        <span className="font-bold text-gray-800">
                          {t("expertSection.filterLabels.showOnlineOnly")}
                        </span>
                        <p className="text-xs text-gray-500 mb-0">
                          {t("expertSection.filterLabels.availableOnly")}
                        </p>
                      </div>
                    </div>
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        role="switch"
                        id="onlineOnlySwitch"
                        checked={localFilter.onlineOnly}
                        onChange={(e) =>
                          setLocalFilter({
                            ...localFilter,
                            onlineOnly: e.target.checked,
                          })
                        }
                        style={{
                          width: "3rem",
                          height: "1.5rem",
                          accentColor: "#22c55e",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 p-4 pt-0 gap-2">
                <button
                  type="button"
                  className="btn btn-outline-secondary grow font-semibold py-2.5 rounded-lg"
                  onClick={resetFilters}
                >
                  {t("expertSection.applyBtns.resetAll")}
                </button>
                <button
                  type="button"
                  className="btn bg-black text-white grow font-semibold py-2.5 shadow-sm rounded-lg"
                  data-bs-dismiss="modal"
                  onClick={applyFilters}
                >
                  {t("expertSection.applyBtns.applyFilters")}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-4">
          {loading && experts.length === 0 ? (
            <ExpertGridSkeleton count={4} />
          ) : (
            (() => {
              const displayExperts =
                !loading && experts.length > 0 && experts.length < 4
                  ? [...experts, ...DUMMY_EXPERTS.slice(0, 4 - experts.length)]
                  : !loading && experts.length === 0
                    ? DUMMY_EXPERTS
                    : experts;

              return displayExperts.map((item) => (
                <ExpertCard key={item.id} expertData={item} />
              ));
            })()
          )}
        </div>

        {loading && experts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={`more-${i}`} />
            ))}
          </div>
        )}

        {hasMore && !loading && (
          <div className="flex justify-center mt-8 mb-8">
            <button
              onClick={handleLoadMore}
              className="bg-white border border-orange text-orange px-8 py-2.5 rounded-full font-bold hover:bg-orange hover:text-white transition-all duration-300 shadow-md"
            >
              {t("expertSection.loadMore")}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurExpert;
