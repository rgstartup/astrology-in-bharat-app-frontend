"use client";

import React, { useCallback, useEffect, useRef } from "react";
import ExpertCard from "./expert-slider/expert-card";
import { SkeletonCard } from "./expert-slider/SkeletonCard";
import { HiOutlineSparkles } from "react-icons/hi";
import { FaSpinner } from "react-icons/fa";
import { useTranslations } from "next-intl";
import { useExpertListStore } from "@/store/useExpertListStore";
import { useDebounce } from "@/hooks/use-debounce";
import { api } from "@/actions";
import { IFetchExpertsResponse } from "../api/fetch-expert";

const ExpertGrid = () => {
  const t = useTranslations("Home");
  const store = useExpertListStore();
  const debouncedSearch = useDebounce<string>(store.searchQuery);
  const querySignature = JSON.stringify({
    search: debouncedSearch,
    specialization: store.selectedSpecialization,
    filters: store.filterState,
  });
  const previousQuerySignature = useRef(querySignature);

  const { buildFetchParams, setExperts, setHasMore, setLoading, setPage } =
    store;

  const fetchExperts = useCallback(
    async (currentPage: number, append = false) => {
      setLoading(true);

      const params = buildFetchParams(currentPage, debouncedSearch);
      const query = new URLSearchParams(params).toString();

      const [responseData, fetchError] = await api
        .get<IFetchExpertsResponse>(`/expert/account/list?${query}`)
        .finally(() => setLoading(false));

      if (fetchError || !responseData) throw fetchError;

      setExperts((previous) =>
        append ? [...previous, ...responseData.data] : responseData.data,
      );
      setHasMore(responseData.pagination.hasMore);
    },
    [buildFetchParams, debouncedSearch, setExperts, setHasMore, setLoading],
  );

  useEffect(() => {
    if (previousQuerySignature.current === querySignature) return;

    previousQuerySignature.current = querySignature;
    setPage(1);
    void fetchExperts(1);
  }, [fetchExperts, querySignature, setPage]);

  const handleLoadMore = () => {
    const nextPage = store.page + 1;
    setPage(nextPage);
    void fetchExperts(nextPage, true);
  };

  const { loading, hasMore, experts } = store;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="relative flex items-center gap-4 px-8 py-4 bg-white/80 backdrop-blur-xl rounded-2xl border border-primary/10 shadow-lg">
            <FaSpinner className="animate-spin text-primary" />
            <span className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">
              Gathering More Profiles
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="mt-12 w-full">
        {/* Dynamic Grid System */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="w-full h-full">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-12 w-full">
      {/* Dynamic Grid System */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 justify-items-center">
        {experts.map((item, idx) => (
          <div
            key={item.id}
            className="w-full animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ animationDelay: `${idx * 50}ms` }}
          >
            <ExpertCard expertData={item} />
          </div>
        ))}
      </div>
      {/* Load More Button */}
      {hasMore && (
        <div className="flex justify-center mt-16 mb-24 relative">
          <div className="absolute top-1/2 left-0 right-0 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent -z-10"></div>
          <button
            onClick={handleLoadMore}
            className="group relative px-12 py-6 bg-white border border-slate-200 text-slate-900 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.4em] shadow-premium hover:shadow-2xl hover:bg-slate-950 hover:text-white hover:-translate-y-1 active:scale-95 transition-all duration-500"
          >
            <div className="flex items-center gap-4">
              <HiOutlineSparkles className="text-orange shadow-orange/30 shadow-2xl" />
              <span>{t("expertSection.loadMore")}</span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExpertGrid;
