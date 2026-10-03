"use client";

import React, { useEffect, useMemo, useRef, useCallback } from "react";
import ExpertListHeader from "./components/ExpertListHeader";
import { useExpertListStore } from "@/store/expertListStore";
import { useDebounce } from "@/hooks/use-debounce";
import { apiV2, API_ROUTES } from "@/actions";
import { toast } from "@/hooks/use-toast";
import { IExpert, PaginationMeta } from "@repo/lib";
import { IFetchExpertsResponse } from "./api/fetch-expert";

interface ExpertListProps {
  initialExperts: IExpert[];
  initialPagination?: PaginationMeta;
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
  const { filterState, setExperts, setHasMore, setLoading, buildFetchParams } = store;

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

  const defaultList = useMemo(() => initialExperts, [initialExperts]);

  // Live filter / fetch handler
  const fetchFilteredExperts = useCallback(async () => {
    setLoading(true);
    try {
      const params = buildFetchParams(1, debouncedSearch);
      const query = new URLSearchParams(params).toString();

      const result = await apiV2
        .get<IFetchExpertsResponse>(`${API_ROUTES.EXPERTS.LIST}?${query}`)
        .finally(() => setLoading(false));

      if (!result.ok) {
        // If API fails or backend is unreachable, filter fallback locally
        let filtered = [...defaultList];
        if (debouncedSearch) {
          filtered = filtered.filter((e) =>
            e.name.toLowerCase().includes(debouncedSearch.toLowerCase()),
          );
        }
        if (filterState.onlyOnline) {
          filtered = filtered.filter(
            (e) =>
              e.isAvailableForConsultation ??
              e.status === "online" ??
              e.is_available,
          );
        }
        if (filterState.minRating > 0) {
          filtered = filtered.filter((e) => (e.rating || 5) >= filterState.minRating);
        }
        if (filterState.language) {
          filtered = filtered.filter((e) =>
            String(e.languages).toLowerCase().includes(filterState.language.toLowerCase()),
          );
        }
        setExperts(filtered.length > 0 ? filtered : defaultList);
        return;
      }

      const list = result.data.data || [];
      setExperts(list.length > 0 ? list : defaultList);
      setHasMore(Boolean(result.data.meta?.hasNextPage));
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
      setHasMore(initialPagination?.hasNextPage ?? false);
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
    initialPagination?.hasNextPage,
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
        backgroundColor: "#301118",
        backgroundImage: "url(/images/bg-dark.png)",
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
