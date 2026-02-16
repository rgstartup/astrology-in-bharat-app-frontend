"use client";
import React from "react";

interface FilterState {
    language: string;
    minPrice: number;
    maxPrice: number;
    addressState: string;
    serviceType: string;
    minRating: number;
    onlyOnline: boolean;
    sortBy: string;
}

interface AstrologerFilterModalProps {
    modalId: string;
    localFilter: FilterState;
    setLocalFilter: (filter: FilterState) => void;
    applyFilters: () => void;
    resetFilters: () => void;
}

const AstrologerFilterModal: React.FC<AstrologerFilterModalProps> = ({
    modalId,
    localFilter,
    setLocalFilter,
    applyFilters,
    resetFilters,
}) => {
    return (
        <div
            className="modal fade"
            id={modalId}
            tabIndex={-1}
            aria-hidden="true"
            style={{ zIndex: 1060 }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-dark border-0 shadow-lg">
                    <div className="modal-header bg-light border-0 d-flex justify-content-between align-items-center w-100">
                        <h5 className="modal-title font-bold">Customize Filters</h5>
                        <button
                            type="button"
                            className="btn shadow-none p-0 border-0"
                            style={{
                                backgroundColor: "#e2e8f0",
                                width: "32px",
                                height: "32px",
                                borderRadius: "50%",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: "pointer"
                            }}
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                            <i className="fa-solid fa-xmark" style={{ fontSize: "16px", color: "#1e293b" }}></i>
                        </button>
                    </div>
                    <div className="modal-body p-4 custom-scrollbar" style={{ maxHeight: "70vh", overflowY: "auto" }}>

                        {/* 1. Availability */}
                        <div className="mb-4 flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 rounded-full ${localFilter.onlyOnline ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                                <span className="font-bold text-gray-700">Online Astrologers Only</span>
                            </div>
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input cursor-pointer"
                                    type="checkbox"
                                    checked={localFilter.onlyOnline}
                                    onChange={(e) => setLocalFilter({ ...localFilter, onlyOnline: e.target.checked })}
                                />
                            </div>
                        </div>



                        {/* 3. Sort Order */}
                        <div className="mb-4">
                            <label className="form-label font-bold text-gray-700 mb-2 block">Sort By</label>
                            <select
                                className="form-select border-gray-200 shadow-sm"
                                value={localFilter.sortBy}
                                onChange={(e) => setLocalFilter({ ...localFilter, sortBy: e.target.value })}
                            >
                                <option value="newest">Newest First</option>
                                <option value="rating">Rating: High to Low</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="experience">Experience: High to Low</option>
                            </select>
                        </div>

                        {/* 4. Rating Filter */}
                        <div className="mb-4">
                            <label className="form-label font-bold text-gray-700 mb-2 block">Minimum Rating</label>
                            <div className="flex gap-2">
                                {[0, 3, 4, 5].map((rating) => (
                                    <button
                                        key={rating}
                                        onClick={() => setLocalFilter({ ...localFilter, minRating: rating })}
                                        className={`flex-1 py-1.5 rounded-md border text-sm transition ${localFilter.minRating === rating
                                            ? 'bg-primary text-white border-primary'
                                            : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        {rating === 0 ? 'Any' : <><i className="fa-solid fa-star text-xs mr-1" />{rating}+</>}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 5. Price Range */}
                        <div className="mb-4">
                            <div className="d-flex justify-content-between mb-2">
                                <label className="form-label font-bold text-gray-700">Price Range</label>
                                <span className="px-3 py-1 rounded-full font-bold text-sm shadow-sm" style={{ backgroundColor: "#F25E0A", color: "#fff" }}>
                                    Up to ₹{localFilter.maxPrice}/min
                                </span>
                            </div>
                            <input
                                type="range"
                                className="form-range w-full h-2 rounded-lg appearance-none cursor-pointer"
                                style={{
                                    background: `linear-gradient(to right, #F25E0A ${(localFilter.maxPrice / 1000) * 100}%, #e5e7eb ${(localFilter.maxPrice / 1000) * 100}%)`
                                }}
                                min="0"
                                max="1000"
                                step="10"
                                value={localFilter.maxPrice}
                                onChange={(e) => setLocalFilter({ ...localFilter, maxPrice: parseInt(e.target.value) })}
                            />
                            <div className="d-flex justify-content-between text-xs mt-2 font-medium">
                                <span
                                    className={`cursor-pointer transition-colors ${localFilter.maxPrice <= 50 ? 'text-primary font-bold' : 'text-gray-400 hover:text-primary'}`}
                                    onClick={() => setLocalFilter({ ...localFilter, maxPrice: 50 })}
                                >
                                    ₹50
                                </span>
                                <span
                                    className={`cursor-pointer transition-colors ${localFilter.maxPrice > 50 && localFilter.maxPrice <= 200 ? 'text-primary font-bold' : 'text-gray-400 hover:text-primary'}`}
                                    onClick={() => setLocalFilter({ ...localFilter, maxPrice: 200 })}
                                >
                                    ₹200
                                </span>
                                <span
                                    className={`cursor-pointer transition-colors ${localFilter.maxPrice > 200 && localFilter.maxPrice <= 500 ? 'text-primary font-bold' : 'text-gray-400 hover:text-primary'}`}
                                    onClick={() => setLocalFilter({ ...localFilter, maxPrice: 500 })}
                                >
                                    ₹500
                                </span>
                                <span
                                    className={`cursor-pointer transition-colors ${localFilter.maxPrice > 500 ? 'text-primary font-bold' : 'text-gray-400 hover:text-primary'}`}
                                    onClick={() => setLocalFilter({ ...localFilter, maxPrice: 1000 })}
                                >
                                    Any Price
                                </span>
                            </div>
                        </div>

                        {/* 6. Language & State */}
                        <div className="grid grid-cols-2 gap-3 mb-2">
                            <div>
                                <label className="form-label font-bold text-gray-700 text-sm">Language</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-gray-200"
                                    placeholder="e.g. Hindi"
                                    value={localFilter.language}
                                    onChange={(e) => setLocalFilter({ ...localFilter, language: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label font-bold text-gray-700 text-sm">State</label>
                                <input
                                    type="text"
                                    className="form-control form-control-sm border-gray-200"
                                    placeholder="e.g. Delhi"
                                    value={localFilter.addressState}
                                    onChange={(e) => setLocalFilter({ ...localFilter, addressState: e.target.value })}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="modal-footer border-0 p-4 pt-0 gap-2">
                        <button
                            type="button"
                            className="btn btn-light grow font-semibold py-2"
                            onClick={resetFilters}
                        >
                            Reset All
                        </button>
                        <button
                            type="button"
                            className="btn text-white grow font-semibold py-2 shadow-sm bg-primary border-primary"
                            data-bs-dismiss="modal"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstrologerFilterModal;
