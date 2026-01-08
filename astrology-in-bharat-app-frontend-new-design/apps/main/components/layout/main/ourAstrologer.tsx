"use client";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

interface ExpertProfile {
    id: number;
    user: {
        id: number;
        name: string;
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
        maxPrice: 100,
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
            const response = await axios.get(`${API_BASE_URL}/expert/profile/list`, {
                params: {
                    limit,
                    offset: currentOffset,
                    q: debouncedSearch,
                    specializations: selectedSpecialization,
                    sort: sortOption,
                    languages: filterState.language,
                    minPrice: filterState.minPrice,
                    maxPrice: filterState.maxPrice,
                    state: filterState.addressState,
                    onlineOnly: filterState.onlineOnly ? 'true' : undefined
                },
            });

            const { data, pagination }: { data: ExpertProfile[]; pagination: PaginationInfo } = response.data;

            const mappedData = data.map((item) => ({
                id: item.id,
                image: "/images/astro-img1.png",
                ratings: Math.round(item.rating) || 5,
                name: item.user.name || "Astrologer",
                expertise: item.specialization || "Vedic Astrology",
                experience: item.experience_in_years || 0,
                language: item.languages.join(", ") || "Hindi",
                price: item.price || 0,
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
        if (spec) {
            setSelectedSpecialization(spec);
        }
    }, [spec]);

    const handleLoadMore = (e: React.MouseEvent) => {
        e.preventDefault();
        const nextOffset = offset + limit;
        setOffset(nextOffset);
        fetchAstrologers(nextOffset, true);
    };

    const scroll = (direction: "left" | "right") => {
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
        "Numerology", "Vedic", "Zodiac Compatibility", "Astrocartography", "Lunar Node Analysis",
        "Love Problem Solution",
        "Marriage Problem",

        "Divorce Problem Solution", "Breakup Problem Solution",
        "Get Your Ex Love Back",
        "Family Problem Solution",
        "Dispute Solution",
        "Childless Couple Solution"
    ];

    const applyFilters = () => {
        setFilterState(localFilter);
    };

    const resetFilters = () => {
        const initialState = {
            language: "",
            minPrice: 0,
            maxPrice: 100,
            addressState: "",
            onlineOnly: false
        };
        setFilterState(initialState);
        setLocalFilter(initialState);
    };

    return (
        <section className="astrologer-list">
            <div className="container">
                <h2 className="title-line mt-4">
                    <span>Find Your Astrologer</span>
                </h2>

                <div className="row align mb-4">
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
                            className="filter-btn border-0 bg-transparent"
                            data-bs-toggle="modal"
                            data-bs-target="#filterModal"
                        >
                            <i className="fa-solid fa-filter"></i> Filter
                        </button>
                        <button
                            type="button"
                            className="filter-btn sort-btn border-0 bg-transparent"
                            data-bs-toggle="modal"
                            data-bs-target="#sortModal"
                        >
                            <i className="fa-solid fa-sort"></i> Sort
                        </button>
                    </div>
                    <div className="col-sm-4 d-flex align-items-center">
                        <button
                            onClick={() => scroll("left")}
                            className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full mr-2 hover:bg-[#fd64101a] transition shrink-0"
                            style={{ width: "30px", height: "30px", border: "none", background: "transparent" }}
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
                            {specializations.map(spec => (
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
                            onClick={() => scroll("right")}
                            className="d-flex align-items-center justify-content-center text-[#fd6410] rounded-full ml-2 hover:bg-[#fd64101a] transition shrink-0"
                            style={{ width: "30px", height: "30px", border: "none", background: "transparent" }}
                        >
                            <i className="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {/* Sort Modal */}
                <div className="modal fade" id="sortModal" tabIndex={-1} aria-hidden="true" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-dark border-0 shadow-lg rounded-3">
                            <div className="modal-header bg-gradient-to-r from-orange-50 to-white border-0 py-3 px-4">
                                <h5 className="modal-title font-bold text-lg"><i className="fa-solid fa-sort mr-2 text-[#fd6410]"></i>Sort By</h5>
                                <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" aria-label="Close">X</button>
                            </div>
                            <div className="modal-body p-4">
                                <div className="space-y-3">
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-[#fd6410] hover:bg-orange-50" style={{ borderColor: sortOption === "none" ? "#fd6410" : "#e5e7eb", backgroundColor: sortOption === "none" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="none" checked={sortOption === "none"} onChange={() => setSortOption("none")} className="form-check-input me-3" style={{ accentColor: "#fd6410" }} />
                                        <i className="fa-solid fa-ban text-[#fd6410] mr-3"></i>
                                        <span className="font-medium">None (Default Order)</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-[#fd6410] hover:bg-orange-50" style={{ borderColor: sortOption === "rating" ? "#fd6410" : "#e5e7eb", backgroundColor: sortOption === "rating" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="rating" checked={sortOption === "rating"} onChange={() => setSortOption("rating")} className="form-check-input me-3" style={{ accentColor: "#fd6410" }} />
                                        <i className="fa-solid fa-star text-[#fd6410] mr-3"></i>
                                        <span className="font-medium">Rating: High to Low</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-[#fd6410] hover:bg-orange-50" style={{ borderColor: sortOption === "experience" ? "#fd6410" : "#e5e7eb", backgroundColor: sortOption === "experience" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="experience" checked={sortOption === "experience"} onChange={() => setSortOption("experience")} className="form-check-input me-3" style={{ accentColor: "#fd6410" }} />
                                        <i className="fa-solid fa-briefcase text-[#fd6410] mr-3"></i>
                                        <span className="font-medium">Experience: High to Low</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-[#fd6410] hover:bg-orange-50" style={{ borderColor: sortOption === "price_desc" ? "#fd6410" : "#e5e7eb", backgroundColor: sortOption === "price_desc" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="price_desc" checked={sortOption === "price_desc"} onChange={() => setSortOption("price_desc")} className="form-check-input me-3" style={{ accentColor: "#fd6410" }} />
                                        <i className="fa-solid fa-arrow-down-9-1 text-[#fd6410] mr-3"></i>
                                        <span className="font-medium">Price: High to Low</span>
                                    </label>
                                    <label className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-[#fd6410] hover:bg-orange-50" style={{ borderColor: sortOption === "price_asc" ? "#fd6410" : "#e5e7eb", backgroundColor: sortOption === "price_asc" ? "#fff7ed" : "white" }}>
                                        <input type="radio" name="sortOption" value="price_asc" checked={sortOption === "price_asc"} onChange={() => setSortOption("price_asc")} className="form-check-input me-3" style={{ accentColor: "#fd6410" }} />
                                        <i className="fa-solid fa-arrow-up-1-9 text-[#fd6410] mr-3"></i>
                                        <span className="font-medium">Price: Low to High</span>
                                    </label>
                                </div>
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0">
                                <button type="button" className="btn bg-black text-white w-100 font-semibold py-2.5 shadow-sm rounded-lg" data-bs-dismiss="modal">Apply Sort</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filter Modal */}
                <div className="modal fade" id="filterModal" tabIndex={-1} aria-hidden="true" style={{ zIndex: 1060 }}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content text-dark border-0 shadow-lg rounded-3">
                            <div className="modal-header bg-gradient-to-r from-orange-50 to-white border-0 py-3 px-4">
                                <h5 className="modal-title font-bold text-lg"><i className="fa-solid fa-filter mr-2 text-[#fd6410]"></i>Filter Astrologers</h5>
                                <button type="button" className="btn-close shadow-none text-red-500" data-bs-dismiss="modal" aria-label="Close ">X</button>
                            </div>
                            <div className="modal-body p-4">
                                {/* Language Input */}
                                <div className="mb-4">
                                    <label className="form-label font-bold text-gray-700 mb-2">Language</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 rounded-start-lg"><i className="fa-solid fa-language text-[#fd6410]"></i></span>
                                        <input type="text" className="form-control border-start-0 shadow-none rounded-end-lg" placeholder="e.g. Hindi, English" value={localFilter.language} onChange={(e) => setLocalFilter({ ...localFilter, language: e.target.value })} />
                                    </div>
                                </div>

                                {/* State Input */}
                                <div className="mb-4">
                                    <label className="form-label font-bold text-gray-700 mb-2">State</label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white border-end-0 rounded-start-lg"><i className="fa-solid fa-location-dot text-[#fd6410]"></i></span>
                                        <input type="text" className="form-control border-start-0 shadow-none rounded-end-lg" placeholder="e.g. Maharashtra, Delhi" value={localFilter.addressState} onChange={(e) => setLocalFilter({ ...localFilter, addressState: e.target.value })} />
                                    </div>
                                </div>

                                {/* Price Range Slider */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-2">
                                        <label className="form-label font-bold text-gray-700 mb-0">Price Range</label>
                                        <span className="badge bg-[#fd6410] text-white px-3 py-1.5 rounded-full">Up to ₹{localFilter.maxPrice}/min</span>
                                    </div>
                                    <input type="range" className="form-range w-100" min="0" max="100" step="5" value={localFilter.maxPrice} onChange={(e) => setLocalFilter({ ...localFilter, maxPrice: parseInt(e.target.value) })} style={{ accentColor: "#fd6410" }} />
                                    <div className="d-flex justify-content-between text-xs text-gray-500 mt-1 px-1">
                                        <span>₹0</span>
                                        <span>₹25</span>
                                        <span>₹50</span>
                                        <span>₹75</span>
                                        <span>₹100+</span>
                                    </div>
                                </div>

                                {/* Online Only Toggle */}
                                <div className="p-3 rounded-lg border bg-gradient-to-r from-green-50 to-white">
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div className="d-flex align-items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 d-flex align-items-center justify-content-center mr-3">
                                                <i className="fa-solid fa-circle text-green-500 text-xs"></i>
                                            </div>
                                            <div>
                                                <span className="font-bold text-gray-800">Show Online Only</span>
                                                <p className="text-xs text-gray-500 mb-0">Only show available astrologers</p>
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
                                <button type="button" className="btn btn-outline-secondary grow font-semibold py-2.5 rounded-lg" onClick={resetFilters}>Reset All</button>
                                <button type="button" className="btn bg-black text-white grow font-semibold py-2.5 shadow-sm rounded-lg" data-bs-dismiss="modal" onClick={applyFilters}>Apply Filters</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="astro-grid">
                    {astrologers.map((item) => (
                        <div className="grid-item" key={item.id}>
                            <Link href={{ pathname: "/astrologer-details", query: { id: item.id } }} className="text-decoration-none">
                                <div className="astro-card">
                                    <div className="vid-part">
                                        <img src={item.image} alt={item.name} className="astro-profile-img" />
                                        <div className={`status-badge ${item.is_available ? 'online' : 'offline'}`}>
                                            <i className="fa-solid fa-circle"></i> {item.is_available ? 'Online' : 'Offline'}
                                        </div>
                                        <span className="play-vid fa-beat" data-bs-toggle="modal" data-bs-target={`#${item.modalId}`} onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                            <i className="fa-solid fa-circle-play"></i>
                                        </span>
                                    </div>
                                    <div className="rating-star">{"★".repeat(item.ratings)}</div>
                                    <div className="astro-name">
                                        {item.name}
                                        {item.is_available && <span className="online-dot ms-2"></span>}
                                    </div>
                                    <div className="astro-tags">{item.expertise}</div>
                                    <div className="astro-info"><strong>Exp:</strong> {item.experience} Years</div>
                                    <div className="astro-info"><strong>Lang:</strong> {item.language}</div>
                                    <div className="astro-info"><strong>Price:</strong> ₹{item.price}/min</div>
                                    <div className="astro-actions">
                                        <button><i className="fa-regular fa-comment-dots"></i> Chat</button>
                                        <button className="call"><i className="fa-solid fa-phone-volume"></i> Call</button>
                                    </div>
                                </div>
                            </Link>

                            <div className="modal fade" id={item.modalId} tabIndex={-1} aria-hidden="true" style={{ zIndex: 1070 }}>
                                <div className="modal-dialog modal-dialog-centered modal-xl">
                                    <div className="modal-content text-dark border-0 shadow-2xl">
                                        <div className="modal-header border-0 pb-0">
                                            <h4 className="modal-title-astro-about">Meet {item.name}</h4>
                                            <button type="button" className="btn-close shadow-none" data-bs-dismiss="modal" ><i className="fa-solid fa-xmark"></i></button>
                                        </div>
                                        <div className="modal-body p-4">
                                            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-100">
                                                <iframe width="100%" height="500" src={item.video} title={`${item.name} Video`} frameBorder="0" allowFullScreen></iframe>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {loading && (
                    <div className="text-center my-4">
                        <div className="spinner-border text-[#fd6410]" role="status"><span className="visually-hidden">Loading...</span></div>
                    </div>
                )}

                {!loading && astrologers.length === 0 && (
                    <div className="text-center my-10 py-10 bg-orange-50 rounded-2xl border border-dashed border-[#fd641033]">
                        <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                            <i className="fa-solid fa-magnifying-glass fa-2x text-[#fd641055]"></i>
                        </div>
                        <h4 className="text-[#13070b] font-bold">No Astrologers Match Your Selection</h4>
                        <p className="text-gray-500 mb-4">Try clearing some filters or searching with different keywords.</p>
                        <button onClick={() => { setSearchQuery(""); setSelectedSpecialization(""); resetFilters(); setSortOption("newest"); }} className="btn bg-[#fd6410] text-white px-4 py-2 font-semibold rounded-lg shadow-md hover:opacity-90 transition">Reset All Filters</button>
                    </div>
                )}

                {hasMore && !loading && (
                    <div className="view-all mt-4 mb-4">
                        <button onClick={handleLoadMore} className="btn bg-white border border-[#fd6410] text-[#fd6410] px-5 py-2.5 rounded-full font-bold hover:bg-[#fd6410] hover:text-white transition duration-300 shadow-sm m-auto block">
                            Load More Experts
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
};

export default OurAstrologer;
