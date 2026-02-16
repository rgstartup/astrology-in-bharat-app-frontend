"use client";
import React from "react";

interface AstrologerListHeaderProps {
    searchQuery: string;
    setSearchQuery: (q: string) => void;
    selectedSpecialization: string;
    setSelectedSpecialization: (s: string) => void;
    hasActiveFilters: boolean;
    filterModalId: string;
    sortModalId: string;
    resetFilters: () => void;
    scrollTabs: (direction: "left" | "right") => void;
    scrollContainerRef: React.RefObject<HTMLDivElement | null>;
}

const specializations = [
    "Numerology",
    "Vedic",
    "Zodiac Compatibility",
    "Astrocartography",
    "Lunar Node Analysis",
    "Love Problem Solution",
    "Marriage Problem",
    "Divorce Problem Solution",
    "Breakup Problem Solution",
    "Get Your Ex Love Back",
    "Family Problem Solution",
    "Dispute Solution",
    "Childless Couple Solution"
];

const AstrologerListHeader: React.FC<AstrologerListHeaderProps> = ({
    searchQuery,
    setSearchQuery,
    selectedSpecialization,
    setSelectedSpecialization,
    hasActiveFilters,
    filterModalId,
    sortModalId,
    resetFilters,
    scrollTabs,
    scrollContainerRef,
}) => {
    return (
        <div className="row align gy-3">
            <div className="col-lg-5 col-md-6">
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
            <div className="col-lg-3 col-md-6 text-md-end text-center d-flex align-items-center justify-content-md-end justify-content-center">
                <button
                    type="button"
                    className="filter-btn border-0 bg-transparent cursor-pointer hover:text-primary transition-colors relative"
                    data-bs-toggle="modal"
                    data-bs-target={`#${filterModalId}`}
                >
                    <i className="fa-solid fa-filter"></i> Filter
                    {hasActiveFilters && (
                        <span className="absolute top-0 right-0 w-2 h-2 bg-primary rounded-full translate-x-1/2 -translate-y-1/2"></span>
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
            <div className="col-lg-4 col-md-12 d-flex align-items-center">
                <button
                    onClick={() => scrollTabs("left")}
                    className="d-flex align-items-center justify-content-center text-primary rounded-full mr-2 hover:bg-primary/10 transition shrink-0"
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
                        className={`px-[15px] py-2 rounded-[20px] text-sm font-medium border border-primary cursor-pointer transition duration-300 ${selectedSpecialization === "" ? "bg-primary text-white" : "bg-white text-[#1e0b0f] hover:bg-primary hover:text-white"}`}
                    >
                        All
                    </div>
                    {specializations.map((spec) => (
                        <div
                            key={spec}
                            onClick={() => setSelectedSpecialization(spec)}
                            className={`px-[15px] py-2 rounded-[20px] text-sm font-medium border border-primary cursor-pointer transition duration-300 ${selectedSpecialization === spec ? "bg-primary text-white" : "bg-white text-[#1e0b0f] hover:bg-primary hover:text-white"}`}
                        >
                            {spec}
                        </div>
                    ))}
                </div>
                <button
                    onClick={() => scrollTabs("right")}
                    className="d-flex align-items-center justify-content-center text-primary rounded-full ml-2 hover:bg-primary/10 transition shrink-0"
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
    );
};

export default AstrologerListHeader;
