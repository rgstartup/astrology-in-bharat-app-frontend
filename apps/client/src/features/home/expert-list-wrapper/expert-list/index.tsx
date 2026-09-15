"use client";

import React, { useEffect, useMemo, useRef, useCallback } from "react";
import ExpertListHeader from "./components/ExpertListHeader";
import dummyExperts from "./data/dummy-experts.json";
import { useExpertListStore } from "@/store/useExpertListStore";
import { useDebounce } from "@/hooks/use-debounce";
import { api, API_ROUTES } from "@/actions";
import { toast } from "@/hooks/use-toast";
import { Expert } from "@repo/lib";
import { IFetchExpertsResponse } from "./api/fetch-expert";

const fallbackExperts: Expert[] = dummyExperts.map((item: any) => ({
  id: item.id,
  name: item.user?.name || item.name || "Acharya Rajesh Sharma",
  avatar: item.user?.avatar || item.avatar || "/images/dummy-expert.jpg",
  about:
    item.about ||
    "Celebrated Vedic Astrologer providing profound insights on horoscope, love compatibility, and career.",
  languages: Array.isArray(item.languages)
    ? item.languages.join(", ")
    : item.languages || "Hindi, English",
  experience_in_years: item.experience_in_years || 8,
  rating: item.rating || 4.9,
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
          specialization: { id: "s1", title: "Vedic Astrology", slug: "vedic" },
        },
        {
          id: "spec-2",
          specialization: { id: "s2", title: "Kundli", slug: "kundli" },
        },
      ],
  pricing: {
    id: `pricing-${item.id}`,
    chat_price: item.price || 31,
    call_price: item.price || 35,
    video_call_price: (item.price || 31) * 2,
    report_price: (item.price || 31) * 5,
    horoscope_price: (item.price || 31) * 3,
    currency: "INR",
  },
  price: item.price || 31,
  chat_price: item.price || 31,
  call_price: item.price || 35,
  video_call_price: (item.price || 31) * 2,
  is_available: item.is_available ?? true,
  total_likes: item.total_likes || 42,
}));

interface ExpertListProps {
  initialExperts: Expert[];
  initialPagination?: {
    total: number;
    hasMore: boolean;
    page?: number;
    limit?: number;
    totalPages?: number;
  };
  initialError?: string;
  title?: string;
  children: React.ReactNode;
}

const ExpertList: React.FC<ExpertListProps> = ({
  initialExperts,
  initialPagination,
  initialError,
  title,
  children,
}) => {
  const store = useExpertListStore();
  const { filterState, setExperts, setHasMore, setLoading, buildFetchParams } =
    store;

  const debouncedSearch = useDebounce<string>(store.searchQuery, 400);

  const querySignature = JSON.stringify({
    search: debouncedSearch,
    specialization: store.selectedSpecialization,
    filters: filterState,
  });
  const previousQuerySignature = useRef<string | null>(null);

  const isFiltered = useMemo(() => {
    return (
      store.searchQuery.trim() !== "" ||
      store.selectedSpecialization !== "" ||
      filterState.language !== "" ||
      filterState.minPrice !== 0 ||
      filterState.maxPrice !== 1000 ||
      filterState.minRating !== 0 ||
      filterState.onlyOnline !== false ||
      filterState.sortBy !== "newest"
    );
  }, [filterState, store.searchQuery, store.selectedSpecialization]);

  const defaultList = useMemo(
    () => (initialExperts.length > 0 ? initialExperts : fallbackExperts),
    [initialExperts],
  );

  // Live filter / fetch handler
  const fetchFilteredExperts = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildFetchParams(1, debouncedSearch);
      const query = new URLSearchParams(params).toString();

      const [responseData, fetchError] = await api
        .get<IFetchExpertsResponse>(`${API_ROUTES.EXPERT.LIST}?${query}`)
        .finally(() => setLoading(false));

      if (fetchError || !responseData) {
        // If API fails or backend is unreachable, filter fallback locally
        let filtered = [...defaultList];
        if (debouncedSearch) {
          filtered = filtered.filter((e) =>
            e.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
          );
        }
        if (filterState.onlyOnline) {
          filtered = filtered.filter((e) => e.is_available);
        }
        if (filterState.minRating > 0) {
          filtered = filtered.filter(
            (e) => (e.rating || 5) >= filterState.minRating,
          );
        }
        if (filterState.language) {
          filtered = filtered.filter((e) =>
            String(e.languages)
              .toLowerCase()
              .includes(filterState.language.toLowerCase()),
          );
        }
        setExperts(filtered.length > 0 ? filtered : defaultList);
        return;
      }

      const list = responseData.data || [];
      setExperts(list.length > 0 ? list : defaultList);
      setHasMore(Boolean(responseData.meta?.hasNextPage));
    } catch {
      setLoading(false);
      setExperts(defaultList);
    }
  }, [
    buildFetchParams,
    debouncedSearch,
    defaultList,
    filterState,
    setExperts,
    setHasMore,
    setLoading,
  ]);

  // Handle live search / filter changes
  useEffect(() => {
    if (previousQuerySignature.current === null) {
      // First mount: set initial experts
      previousQuerySignature.current = querySignature;
      setExperts(defaultList);
      setHasMore(initialPagination?.hasMore ?? false);
      return;
    }

    if (previousQuerySignature.current === querySignature) return;
    previousQuerySignature.current = querySignature;

    if (!isFiltered) {
      setExperts(defaultList);
      return;
    }

    void fetchFilteredExperts();
  }, [
    defaultList,
    fetchFilteredExperts,
    initialPagination?.hasMore,
    isFiltered,
    querySignature,
    setExperts,
    setHasMore,
  ]);

  useEffect(() => {
    if (!initialError) return;
    toast.error(initialError, {
      toastId: `expert-list-${initialError}`,
    });
  }, [initialError]);

  return (
    <section
      id="our-experts"
      className="pt-6 pb-12 relative overflow-hidden"
      style={{
        // backgroundImage: "url(/images/bg-dark.png)",
        backgroundColor: "#301118",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="max-w-[1360px] mx-auto px-4 md:px-8 lg:px-12">
        {/* Redesigned Top Filter Menu */}
        <ExpertListHeader title={title} />

        {/* Carousel / Grid Content */}
        {children}
      </div>
    </section>
  );
};

export default ExpertList;
