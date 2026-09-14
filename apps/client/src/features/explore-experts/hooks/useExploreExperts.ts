"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/actions";
import socket from "@/lib/socket";
import type { Expert, Specialization } from "@repo/lib";
import { fetchSpecializations } from "@/features/home/expert-list-wrapper/expert-list/api/fetch-specializations";
import dummyExperts from "@/features/home/expert-list-wrapper/expert-list/data/dummy-experts.json";
import { ExploreFilterState, SortOption, ConsultationMode } from "../types";

export const defaultFilters: ExploreFilterState = {
  searchQuery: "",
  selectedSpecializations: [],
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  minExperience: 0,
  languages: [],
  onlyOnline: false,
  serviceType: "all",
  sortBy: "recommended",
};

const fallbackExperts: Expert[] = dummyExperts.map(
  (item: any, index: number) => ({
    id: item.id || `dummy-${index}`,
    name: item.user?.name || item.name || "Astrologer Guru",
    avatar: item.user?.avatar || item.avatar || "/images/dummy-expert.jpg",
    about:
      item.about ||
      "Distinguished Vedic Astrologer, Tarot Master and Spiritual Counselor providing deep transformational guidance.",
    languages: Array.isArray(item.languages)
      ? item.languages.join(", ")
      : item.languages || "Hindi, English",
    experience_in_years: item.experience_in_years || index * 3 + 5,
    rating: item.rating || 4.9,
    total_reviews: 120 + index * 45,
    specializations: item.specialization
      ? item.specialization.split(",").map((s: string, idx: number) => ({
          id: `spec-${idx}`,
          specialization: {
            id: `spec2-${idx}`,
            title: s.trim(),
            slug: s.trim().toLowerCase().replace(/\s+/g, "-"),
          },
        }))
      : [
          {
            id: "spec-1",
            specialization: { id: "s-1", title: "Vedic", slug: "vedic" },
          },
          {
            id: "spec-2",
            specialization: { id: "s-2", title: "Kundli", slug: "kundli" },
          },
        ],
    pricing: {
      id: `pricing-${item.id || index}`,
      chat_price: item.price || 25 + index * 10,
      call_price: item.price || 30 + index * 10,
      video_call_price: (item.price || 35 + index * 10) * 1.5,
      report_price: (item.price || 50) * 4,
      horoscope_price: (item.price || 50) * 3,
      currency: "INR",
    },
    price: item.price || 25 + index * 10,
    chat_price: item.price || 25 + index * 10,
    call_price: item.price || 30 + index * 10,
    video_call_price: (item.price || 35 + index * 10) * 1.5,
    is_available: item.is_available ?? true,
    is_busy: false,
    total_likes: 24 + index * 8,
  }),
);

export function useExploreExperts(initialExperts?: Expert[]) {
  const [filters, setFilters] = useState<ExploreFilterState>(defaultFilters);
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [experts, setExperts] = useState<Expert[]>(
    initialExperts && initialExperts.length > 0
      ? initialExperts
      : fallbackExperts,
  );
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number>(experts.length);
  const [specializationsList, setSpecializationsList] = useState<
    Specialization[]
  >([]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Debounce search query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(filters.searchQuery.trim());
    }, 350);
    return () => clearTimeout(handler);
  }, [filters.searchQuery]);

  // Fetch available specializations on mount
  useEffect(() => {
    fetchSpecializations().then(([res]) => {
      if (res?.data && res.data.length > 0) {
        setSpecializationsList(res.data);
      }
    });
  }, []);

  // Realtime availability updates
  useEffect(() => {
    const onStatus = (data: any) => {
      const expertId = String(data.expert_id || data.id || data.userId);
      setExperts((prev) =>
        prev.map((exp) =>
          String(exp.id) === expertId
            ? { ...exp, is_available: data.is_available }
            : exp,
        ),
      );
    };

    const onBusy = (data: any) => {
      const expertId = String(data.expert_id || data.id);
      setExperts((prev) =>
        prev.map((exp) =>
          String(exp.id) === expertId ? { ...exp, is_busy: data.is_busy } : exp,
        ),
      );
    };

    socket.on("expert_status_changed", onStatus);
    socket.on("expert_busy_changed", onBusy);

    return () => {
      socket.off("expert_status_changed", onStatus);
      socket.off("expert_busy_changed", onBusy);
    };
  }, []);

  // Keep refs to avoid unnecessary recreations of fetchExperts
  const filtersRef = useRef(filters);
  useEffect(() => {
    filtersRef.current = filters;
  }, [filters]);

  const debouncedSearchRef = useRef(debouncedSearch);
  useEffect(() => {
    debouncedSearchRef.current = debouncedSearch;
  }, [debouncedSearch]);

  // Build query string for API
  const buildQuery = useCallback((currentPage: number) => {
    const currentFilters = filtersRef.current;
    const currentSearch = debouncedSearchRef.current;
    const params = new URLSearchParams();
    params.append("limit", "18");
    params.append("page", String(currentPage));

    if (currentSearch) {
      params.append("q", currentSearch);
    }
    if (currentFilters.selectedSpecializations.length > 0) {
      params.append(
        "specializations",
        currentFilters.selectedSpecializations.join(","),
      );
    }
    if (currentFilters.onlyOnline) {
      params.append("online", "true");
    }
    if (currentFilters.minRating > 0) {
      params.append("minRating", String(currentFilters.minRating));
    }
    if (currentFilters.minExperience > 0) {
      params.append("minExperience", String(currentFilters.minExperience));
    }
    if (currentFilters.minPrice > 0) {
      params.append("minPrice", String(currentFilters.minPrice));
    }
    if (currentFilters.maxPrice < 1000) {
      params.append("maxPrice", String(currentFilters.maxPrice));
    }
    if (currentFilters.languages.length > 0) {
      params.append("languages", currentFilters.languages.join(","));
    }
    if (currentFilters.serviceType !== "all") {
      params.append("service", currentFilters.serviceType);
    }
    if (currentFilters.sortBy !== "recommended") {
      params.append("sort", currentFilters.sortBy);
    }

    return params.toString();
  }, []);

  // Fetch experts from backend
  const fetchExperts = useCallback(
    async (targetPage: number, append = false) => {
      setLoading(true);
      try {
        const query = buildQuery(targetPage);
        const [res, err] = await api.get<any>(`/expert/account/list?${query}`);

        if (err || !res?.data) {
          // If error or empty response on first load, use client-side filtered fallback
          if (!append) {
            const currentFilters = filtersRef.current;
            const currentSearch = debouncedSearchRef.current;
            let filteredFallback = [...fallbackExperts];

            if (currentSearch) {
              const queryLower = currentSearch.toLowerCase();
              filteredFallback = filteredFallback.filter(
                (e) =>
                  e.name.toLowerCase().includes(queryLower) ||
                  e.about?.toLowerCase().includes(queryLower) ||
                  e.specializations?.some((s) =>
                    s.specialization.title.toLowerCase().includes(queryLower),
                  ),
              );
            }

            if (currentFilters.selectedSpecializations.length > 0) {
              filteredFallback = filteredFallback.filter((e) =>
                e.specializations?.some(
                  (s) =>
                    currentFilters.selectedSpecializations.includes(
                      s.specialization.title,
                    ) ||
                    currentFilters.selectedSpecializations.includes(
                      s.specialization.id,
                    ),
                ),
              );
            }

            if (currentFilters.onlyOnline) {
              filteredFallback = filteredFallback.filter((e) => e.is_available);
            }

            if (currentFilters.minRating > 0) {
              filteredFallback = filteredFallback.filter(
                (e) => (e.rating || 0) >= currentFilters.minRating,
              );
            }

            if (currentFilters.maxPrice < 1000) {
              filteredFallback = filteredFallback.filter(
                (e) =>
                  (e.price || e.chat_price || 0) <= currentFilters.maxPrice,
              );
            }

            if (currentFilters.languages.length > 0) {
              filteredFallback = filteredFallback.filter((e) =>
                currentFilters.languages.some((l) =>
                  (e.languages || "").toLowerCase().includes(l.toLowerCase()),
                ),
              );
            }

            setExperts(filteredFallback);
            setTotalCount(filteredFallback.length);
            setHasMore(false);
          }
          return;
        }

        const newItems: Expert[] = res.data || [];
        setExperts((prev) => {
          const updated = append ? [...prev, ...newItems] : newItems;
          const total = res.meta?.total !== undefined ? res.meta.total : updated.length;
          setTotalCount(total);
          const nextListLength = updated.length;
          setHasMore(nextListLength < total);
          return updated;
        });
      } catch (error) {
        console.error("Failed to load experts:", error);
      } finally {
        setLoading(false);
      }
    },
    [buildQuery],
  );

  // Re-fetch ONLY when debounced search or non-search filters change
  const queryFingerprint = useMemo(() => {
    const { searchQuery: _ignored, ...nonSearchFilters } = filters;
    return JSON.stringify({
      search: debouncedSearch,
      filters: nonSearchFilters,
    });
  }, [debouncedSearch, filters]);

  const prevFingerprint = useRef(queryFingerprint);

  useEffect(() => {
    if (prevFingerprint.current === queryFingerprint) return;
    prevFingerprint.current = queryFingerprint;
    setPage(1);
    fetchExperts(1, false);
  }, [fetchExperts, queryFingerprint]);

  // Load more
  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchExperts(nextPage, true);
  };

  // Filter modifiers
  const setSearchQuery = (q: string) => {
    setFilters((prev) => ({ ...prev, searchQuery: q }));
  };

  const toggleSpecialization = (specTitle: string) => {
    setFilters((prev) => {
      const exists = prev.selectedSpecializations.includes(specTitle);
      return {
        ...prev,
        selectedSpecializations: exists
          ? prev.selectedSpecializations.filter((s) => s !== specTitle)
          : [...prev.selectedSpecializations, specTitle],
      };
    });
  };

  const toggleLanguage = (lang: string) => {
    setFilters((prev) => {
      const exists = prev.languages.includes(lang);
      return {
        ...prev,
        languages: exists
          ? prev.languages.filter((l) => l !== lang)
          : [...prev.languages, lang],
      };
    });
  };

  const setPriceRange = (maxPrice: number) => {
    setFilters((prev) => ({ ...prev, maxPrice }));
  };

  const setMinRating = (minRating: number) => {
    setFilters((prev) => ({ ...prev, minRating }));
  };

  const setMinExperience = (minExperience: number) => {
    setFilters((prev) => ({ ...prev, minExperience }));
  };

  const setOnlyOnline = (onlyOnline: boolean) => {
    setFilters((prev) => ({ ...prev, onlyOnline }));
  };

  const setServiceType = (serviceType: ConsultationMode) => {
    setFilters((prev) => ({ ...prev, serviceType }));
  };

  const setSortBy = (sortBy: SortOption) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  // Active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.onlyOnline) count++;
    if (filters.selectedSpecializations.length > 0)
      count += filters.selectedSpecializations.length;
    if (filters.maxPrice < 1000) count++;
    if (filters.minRating > 0) count++;
    if (filters.minExperience > 0) count++;
    if (filters.languages.length > 0) count += filters.languages.length;
    if (filters.serviceType !== "all") count++;
    if (filters.sortBy !== "recommended") count++;
    return count;
  }, [filters]);

  return {
    filters,
    experts,
    loading,
    hasMore,
    totalCount,
    specializationsList,
    activeFiltersCount,
    isMobileFiltersOpen,
    setIsMobileFiltersOpen,
    handleLoadMore,
    setSearchQuery,
    toggleSpecialization,
    toggleLanguage,
    setPriceRange,
    setMinRating,
    setMinExperience,
    setOnlyOnline,
    setServiceType,
    setSortBy,
    resetFilters,
  };
}
