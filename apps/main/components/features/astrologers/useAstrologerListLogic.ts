"use client";

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "react-toastify";
import { api } from "@/lib/api";
import { socket } from "@/libs/socket";
import { ExpertProfile, ClientExpertProfile } from "@/lib/types";

const getImageUrl = (path?: string) => {
  if (!path) return "/images/dummy-astrologer.jpg";
  if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
  return `http://localhost:6543/uploads/${path}`;
};

const mapExpert = (item: any): ClientExpertProfile => {
  const id = item.id;
  const userId = item.user?.id || item.userId || item.user_id;
  const name = item.user?.name || item.name || "Astrologer";
  const avatar = item.user?.avatar || item.avatar || item.image;
  const specialization = item.specialization || item.expertise || "";
  const experience = item.experience_in_years !== undefined ? item.experience_in_years : (item.experience || 0);
  const rating = item.rating !== undefined ? item.rating : (item.ratings || 0);
  const isAvailable = item.is_available !== undefined ? item.is_available : (item.isAvailable || false);

  return {
    id: id,
    userId: userId,
    image: getImageUrl(avatar),
    ratings: rating,
    name: name,
    expertise: specialization,
    experience: experience,
    language: Array.isArray(item.languages)
      ? item.languages.join(", ")
      : item.user?.language || item.language || "Hindi",
    price: item.price || 0,
    chat_price: item.chat_price || item.chatPrice,
    call_price: item.call_price || item.callPrice,
    video_call_price: item.video_call_price || item.videoCallPrice,
    report_price: item.report_price || item.reportPrice,
    horoscope_price: item.horoscope_price || item.horoscopePrice,
    video: item.video || "",
    modalId: `home-modal-${id}`,
    is_available: isAvailable,
    total_likes: item.total_likes || item.totalLikes || 0,
    custom_services: Array.isArray(item.custom_services)
      ? item.custom_services
      : typeof item.custom_services === "string"
        ? (() => { try { return JSON.parse(item.custom_services); } catch { return []; } })()
        : [],
  };
};

export const useAstrologerListLogic = (
  initialExperts: ExpertProfile[],
  initialPagination?: { total: number; hasMore: boolean },
  initialError?: string,
  lang: string = "en",
  t: any = {}
) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [astrologers, setAstrologers] = useState<ClientExpertProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const limit = 20;

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
  const [debouncedSearch, setDebouncedSearch] = useState(searchParams.get("q") || "");
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

  const [localFilter, setLocalFilter] = useState({ ...filterState });

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

  useEffect(() => {
    const handleStatusUpdate = (data: any) => {
      const expertId = data.expert_id || data.userId || data.id;
      const isAvailable = data.is_available !== undefined ? data.is_available : data.status === "online";
      if (!expertId) return;
      setAstrologers((prev) =>
        prev.map((astro) =>
          String(astro.id) === String(expertId) || String(astro.userId) === String(expertId)
            ? { ...astro, is_available: isAvailable }
            : astro
        )
      );
    };
    socket.on("expert_status_changed", handleStatusUpdate);
    return () => { socket.off("expert_status_changed", handleStatusUpdate); };
  }, []);

  useEffect(() => {
    if (initialError) {
      toast.error(
        initialError === "server_unreachable"
          ? (lang === "hi" ? "सर्वर तक नहीं पहुँचा जा सकता।" : "Server is unreachable.")
          : (lang === "hi" ? "विशेषज्ञों को लोड करने में विफल" : "Failed to load experts")
      );
    }
    if (initialExperts && offset === 0) {
      setAstrologers(initialExperts.map(mapExpert));
      if (initialExperts.length < limit) setHasMore(false);
      else if (initialPagination) setHasMore(initialPagination.hasMore);
    }
  }, [initialExperts, initialPagination, initialError, offset, lang]);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 1000);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) { isFirstRun.current = false; return; }
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
    const nextParams = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value === "" || value === 0 || value === undefined || value === null) nextParams.delete(key);
      else nextParams.set(key, String(value));
    });
    if (nextParams.toString() !== searchParams.toString()) {
      router.replace(`${window.location.pathname}?${nextParams.toString()}`, { scroll: false });
      setOffset(0);
    }
  }, [debouncedSearch, selectedSpecialization, filterState, router, searchParams]);

  const fetchMoreAstrologers = useCallback(
    async (currentOffset: number) => {
      try {
        setLoading(true);
        const params: any = {
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
        };
        const query = new URLSearchParams(params).toString();
        const [responseData, fetchErr] = await api.get<any>(`/expert/list?${query}`);
        if (fetchErr || !responseData) throw fetchErr;
        setAstrologers((prev) => [...prev, ...responseData.data.map(mapExpert)]);
        setHasMore(responseData.pagination.hasMore);
      } catch (error) {
        toast.error(lang === "hi" ? "और ज्योतिषी लोड करने में विफल" : "Failed to load more astrologers");
      } finally {
        setLoading(false);
      }
    },
    [debouncedSearch, selectedSpecialization, filterState, lang]
  );

  const handleLoadMore = () => {
    const nextOffset = offset + limit;
    setOffset(nextOffset);
    fetchMoreAstrologers(nextOffset);
  };

  const applyFilters = () => setFilterState(localFilter);
  const resetFilters = () => {
    const init = {
      language: "", minPrice: 0, maxPrice: 1000, addressState: "",
      serviceType: "all", minRating: 0, onlyOnline: false, sortBy: "newest",
    };
    setFilterState(init);
    setLocalFilter(init);
    setSelectedSpecialization("");
    setSearchQuery("");
  };

  const scrollTabs = (direction: "left" | "right") => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const children = Array.from(container.children) as HTMLElement[];
    if (children.length === 0) return;
    const containerLeft = container.getBoundingClientRect().left;
    const containerWidth = container.clientWidth;
    if (direction === "right") {
      for (const child of children) {
        const childRight = child.getBoundingClientRect().right - containerLeft + container.scrollLeft;
        if (childRight > container.scrollLeft + containerWidth + 1) {
          container.scrollTo({ left: child.getBoundingClientRect().left - containerLeft + container.scrollLeft, behavior: "smooth" });
          return;
        }
      }
    } else {
      for (let i = children.length - 1; i >= 0; i--) {
        const childL = children[i]!.getBoundingClientRect().left - containerLeft + container.scrollLeft;
        if (childL < container.scrollLeft - 1) {
          container.scrollTo({ left: childL, behavior: "smooth" });
          return;
        }
      }
      container.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  return {
    astrologers, loading, hasMore, searchQuery, setSearchQuery,
    selectedSpecialization, setSelectedSpecialization, filterState, setFilterState,
    localFilter, setLocalFilter, hasActiveFilters, scrollTabs, scrollContainerRef,
    handleLoadMore, applyFilters, resetFilters
  };
};
