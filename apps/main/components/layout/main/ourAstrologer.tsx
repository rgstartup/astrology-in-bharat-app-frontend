"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { SkeletonCard } from "../../features/astrologers/SkeletonCard";
import AstrologerCard from "@/components/features/astrologers/AstrologerCard";

import { useLanguageStore } from "../../../store/languageStore";
import { homeTranslations } from "../../../lib/translations/home";

interface ExpertProfile {
    id: number;
    user: {
        id: number;
        name: string;
        avatar?: string;
    };
    specialization: string;
    experience_in_years: number;
    languages: string[];
    price: number;
    rating: number;
    is_available: boolean;
}

interface PaginationInfo {
    limit: number;
    offset: number;
    total: number;
    hasMore: boolean;
}

const OurAstrologer = () => {
    const { lang } = useLanguageStore();
    const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams();
    const spec = searchParams.get("specialization");
    const [astrologers, setAstrologers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(false);
    const limit = 20;

    // Filter & Search State
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedSpecialization, setSelectedSpecialization] = useState(spec || "");
    const [sortOption, setSortOption] = useState("newest");
    const [filterState, setFilterState] = useState({
        language: "",
        minPrice: 0,
        maxPrice: 1000,
        addressState: "",
        onlineOnly: false
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

    const fetchAstrologers = useCallback(async (currentOffset: number, isLoadMore: boolean = false, isSilent: boolean = false) => {
        try {
            if (!isSilent) setLoading(true);
            const [responseData, fetchErr] = await api.get<any>(
                `/expert/list?${new URLSearchParams(Object.entries({
                    limit: String(limit),
                    offset: String(currentOffset),
                    ...(debouncedSearch && { q: debouncedSearch }),
                    ...(selectedSpecialization && { specializations: selectedSpecialization }),
                    ...(sortOption && { sort: sortOption }),
                    ...(filterState.language && { languages: filterState.language }),
                    minPrice: String(filterState.minPrice),
                    ...(filterState.maxPrice < 1000 && { maxPrice: String(filterState.maxPrice) }),
                    ...(filterState.addressState && { state: filterState.addressState }),
                    ...(filterState.onlineOnly && { onlineOnly: 'true' }),
                }).filter(([, v]) => v !== undefined)).toString()}`
            );

            if (fetchErr || !responseData) throw fetchErr;
            const { data, pagination }: { data: ExpertProfile[]; pagination: PaginationInfo } = responseData;

            const getImageUrl = (path?: string) => {
                if (!path) return "/images/dummy-astrologer.jpg";
                if (path.startsWith("http") || path.startsWith("data:") || path.startsWith("/")) return path;
                const baseUrl = "http://localhost:6543/api/v1";
                return `${baseUrl}/uploads/${path}`;
            };

            const mappedData = data.map((item: any) => ({
                id: item.id,
                userId: item.user?.id,
                image: getImageUrl(item.user?.avatar),
                ratings: Math.round(item.rating) || 5,
                name: item.user?.name || "Astrologer",
                expertise: item.specialization || "",
                experience: item.experience_in_years || 0,
                language: Array.isArray(item.languages) ? item.languages.join(", ") : (item.languages || "Hindi"),
                price: item.price ?? item.chat_price ?? 0,
                chat_price: item.chat_price,
                call_price: item.call_price,
                video_call_price: item.video_call_price,
                is_available: item.is_available,
                video: "https://www.youtube.com/embed/INoPh_oRooU",
                modalId: `modal-${item.id}`,
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
            if (!isSilent) setLoading(false);
        }
    }, [debouncedSearch, selectedSpecialization, sortOption, filterState]);

    useEffect(() => {
        setOffset(0);
        fetchAstrologers(0);
    }, [debouncedSearch, selectedSpecialization, sortOption, filterState, fetchAstrologers]);

    // Real-time status update polling
    useEffect(() => {
        const interval = setInterval(() => {
            // Background update to reflect status changes without a showing a loading overlay
            fetchAstrologers(offset, false, true);
        }, 10000); // 10 seconds polling

        return () => clearInterval(interval);
    }, [fetchAstrologers, offset]);

    useEffect(() => {
        setSelectedSpecialization(spec || "");
    }, [spec]);

    const handleLoadMore = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextOffset = offset + limit;
        setOffset(nextOffset);
        fetchAstrologers(nextOffset, true);
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
        { key: "childlessCouple", value: "Childless Couple Solution" }
    ];

    const applyFilters = () => {
        setFilterState(localFilter);
    };

    const resetFilters = () => {
        const initialState = {
            language: "",
            minPrice: 0,
            maxPrice: 1000,
            addressState: "",
            onlineOnly: false
        };
        setFilterState(initialState);
        setLocalFilter(initialState);
    };

    return (
        <section
            className="py-[50px] relative overflow-hidden"
            style={{
                backgroundColor: '#301118',
                backgroundImage: 'url(/images/bg-dark.png)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundAttachment: 'fixed',
                backgroundRepeat: 'no-repeat'
            }}
        >
            <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
                <div className="relative mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {t.astrologerSection.title}
                    </h2>
                    <div className="w-48 h-1 bg-orange"></div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center mb-10 text-white">
                    {/* Search Box */}
                    <div className="lg:col-span-5 text-black">
                        <div className="flex w-full shadow-lg">
                            <input
                                type="text"
                                className="w-full px-6 py-3 border-0 rounded-l-full outline-none text-base bg-white text-black"
                                placeholder={t.astrologerSection.searchPlaceholder}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button type="button" className="px-8 py-3 bg-orange text-white rounded-r-full font-bold text-base hover:opacity-90 transition-all">{t.astrologerSection.searchBtn}</button>
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
                            <i className="fa-solid fa-filter text-orange"></i> {t.astrologerSection.filterBtn}
                        </button>
                        <button
                            type="button"
                            className="flex items-center gap-2 text-white font-medium hover:text-orange transition-all"
                            data-bs-toggle="modal"
                            data-bs-target="#sortModal"
                        >
                            <i className="fa-solid fa-sort text-orange"></i> {t.astrologerSection.sortBtn}
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
                                {t.astrologerSection.all}
                            </div>
                            {specializations.map(spec => (
                                <div
                                    key={spec.key}
                                    onClick={() => setSelectedSpecialization(spec.value)}
                                    className={`px-6 py-2 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 shadow-md ${selectedSpecialization === spec.value ? "bg-orange text-white" : "bg-white text-gray-800 hover:bg-orange hover:text-white"}`}
                                >
                                    {(t.astrologerSection as any).specializations?.[spec.key] || spec.value}
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
                <div className="modal fade" id="sortModal" tabIndex={-1} aria-hidden="true" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-dark border-0 shadow-lg rounded-3">
                            <div className="modal-header bg-linear-to-r from-orange-50 to-white border-0 py-3 px-4">
                                <h5 className="modal-title font-bold text-lg"><i className="fa-solid fa-sort mr-2 text-primary"></i>{t.astrologerSection.sortByTitle}</h5>
                                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close">X</button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="space-y-3">
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50" style={{ borderColor: sortOption === "none" ? "primary" : "#e5e7eb", backgroundColor: sortOption === "none" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="none" checked={sortOption === "none"} onChange={() => setSortOption("none")} className="form-check-input me-3" style={{ accentColor: "primary" }} />
                                        <i className="fa-solid fa-ban text-primary mr-3"></i>
                                        <span className="font-medium">{t.astrologerSection.sortOptions.none}</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50" style={{ borderColor: sortOption === "rating" ? "primary" : "#e5e7eb", backgroundColor: sortOption === "rating" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="rating" checked={sortOption === "rating"} onChange={() => setSortOption("rating")} className="form-check-input me-3" style={{ accentColor: "primary" }} />
                                        <i className="fa-solid fa-star text-primary mr-3"></i>
                                        <span className="font-medium">{t.astrologerSection.sortOptions.rating}</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50" style={{ borderColor: sortOption === "experience" ? "primary" : "#e5e7eb", backgroundColor: sortOption === "experience" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="experience" checked={sortOption === "experience"} onChange={() => setSortOption("experience")} className="form-check-input me-3" style={{ accentColor: "primary" }} />
                                        <i className="fa-solid fa-briefcase text-primary mr-3"></i>
                                        <span className="font-medium">{t.astrologerSection.sortOptions.experience}</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50" style={{ borderColor: sortOption === "price_desc" ? "primary" : "#e5e7eb", backgroundColor: sortOption === "price_desc" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="price_desc" checked={sortOption === "price_desc"} onChange={() => setSortOption("price_desc")} className="form-check-input me-3" style={{ accentColor: "primary" }} />
                                        <i className="fa-solid fa-arrow-down-9-1 text-primary mr-3"></i>
                                        <span className="font-medium">{t.astrologerSection.sortOptions.priceDesc}</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-orange-50" style={{ borderColor: sortOption === "price_asc" ? "primary" : "#e5e7eb", backgroundColor: sortOption === "price_asc" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="price_asc" checked={sortOption === "price_asc"} onChange={() => setSortOption("price_asc")} className="form-check-input me-3" style={{ accentColor: "primary" }} />
                                        <i className="fa-solid fa-arrow-up-1-9 text-primary mr-3"></i>
                                        <span className="font-medium">{t.astrologerSection.sortOptions.priceAsc}</span>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="button" className="btn bg-black text-white w-100 font-semibold py-2.5 shadow-sm rounded-lg" data-bs-dismiss="modal">{t.astrologerSection.applyBtns.applySort}</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Modal */}
                <div className="modal fade" id="filterModal" tabIndex={-1} aria-hidden="true" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-dark border-0 shadow-lg rounded-3">
                            <div className="modal-header bg-linear-to-r from-orange-50 to-white border-0 py-3 px-4">
                                <h5 className="modal-title font-bold text-lg"><i className="fa-solid fa-filter mr-2 text-primary"></i>{t.astrologerSection.filterTitle}</h5>
                                <button type="button" className="btn-close shadow-none text-red-500" data-bs-dismiss="modal" aria-label="Close ">X</button>
                            </div>
                            <div className="modal-body p-4">
                                {/* Language Input */}
                                <div className="mb-4">
                                    <label className="form-label font-bold text-gray-700 mb-2">{t.astrologerSection.filterLabels.language}</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 rounded-start-lg"><i className="fa-solid fa-language text-primary"></i></span>
                                        <input type="text" className="form-control border-start-0 shadow-none rounded-end-lg" placeholder={t.astrologerSection.filterLabels.languagePlaceholder} value={localFilter.language} onChange={(e) => setLocalFilter({ ...localFilter, language: e.target.value })} />
                                    </div>
                                </div>

                                {/* State Input */}
                                <div className="mb-4">
                                    <label className="form-label font-bold text-gray-700 mb-2">{t.astrologerSection.filterLabels.state}</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 rounded-start-lg"><i className="fa-solid fa-location-dot text-primary"></i></span>
                                        <input type="text" className="form-control border-start-0 shadow-none rounded-end-lg" placeholder={t.astrologerSection.filterLabels.statePlaceholder} value={localFilter.addressState} onChange={(e) => setLocalFilter({ ...localFilter, addressState: e.target.value })} />
                                    </div>
                                </div>

                                {/* Price Range Slider */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label font-bold text-gray-700 mb-0">{t.astrologerSection.filterLabels.priceRange}</label>
                                        <span className="badge bg-primary text-white px-3 py-1.5 rounded-full">{t.astrologerSection.filterLabels.upTo} ₹{localFilter.maxPrice}{t.astrologerSection.filterLabels.perMin}</span>
                                    </div>
                                    <input type="range" className="form-range w-100" min="0" max="1000" step="10" value={localFilter.maxPrice} onChange={(e) => setLocalFilter({ ...localFilter, maxPrice: parseInt(e.target.value) })} style={{ accentColor: "primary" }} />
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
                                                <span className="font-bold text-gray-800">{t.astrologerSection.filterLabels.showOnlineOnly}</span>
                                                <p className="text-xs text-gray-500 mb-0">{t.astrologerSection.filterLabels.availableOnly}</p>
                                            </div>
                                        </div>
                                        <div className="form-check form-switch">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                role="switch"
                                                id="onlineOnlySwitch"
                                                checked={localFilter.onlineOnly}
                                                onChange={(e) => setLocalFilter({ ...localFilter, onlineOnly: e.target.checked })}
                                                style={{ width: "3rem", height: "1.5rem", accentColor: "#22c55e" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0 gap-2">
                                <button type="button" className="btn btn-outline-secondary grow font-semibold py-2.5 rounded-lg" onClick={resetFilters}>{t.astrologerSection.applyBtns.resetAll}</button>
                                <button type="button" className="btn bg-black text-white grow font-semibold py-2.5 shadow-sm rounded-lg" data-bs-dismiss="modal" onClick={applyFilters}>{t.astrologerSection.applyBtns.applyFilters}</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8 mt-4">
                    {loading && astrologers.length === 0 ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <SkeletonCard key={i} />
                        ))
                    ) : (
                        astrologers.map((item) => (
                            <AstrologerCard key={item.id} astrologerData={item} />
                        ))
                    )}
                </div>

                {loading && astrologers.length > 0 && (
                    <div className="text-center my-4">
                        <div className="spinner-border text-primary" role="status"><span className="visually-hidden">Loading...</span></div>
                    </div>
                )}

                {!loading && astrologers.length === 0 && (
                    <div className="text-center my-10 py-10 bg-orange-50 rounded-2xl border border-dashed border-primary/20">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <i className="fa-solid fa-magnifying-glass fa-2x text-primary/30"></i>
                        </div>
                        <h4 className="text-[#13070b] font-bold">{t.astrologerSection.noResults.title}</h4>
                        <p className="text-gray-500 mb-4">{t.astrologerSection.noResults.desc}</p>
                        <button onClick={() => { setSearchQuery(""); setSelectedSpecialization(""); resetFilters(); setSortOption("newest"); }} className="btn bg-primary text-white px-4 py-2 font-semibold rounded-lg shadow-md hover:opacity-90 transition">{t.astrologerSection.noResults.resetBtn}</button>
                    </div>
                )}

                {hasMore && !loading && (
                    <div className="flex justify-center mt-8 mb-8">
                        <button onClick={handleLoadMore} className="bg-white border border-orange text-orange px-8 py-2.5 rounded-full font-bold hover:bg-orange hover:text-white transition-all duration-300 shadow-md">
                            {t.astrologerSection.loadMore}
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurAstrologer;
