"use client";
import React from "react";

interface AstrologerSortModalProps {
    modalId: string;
    sortBy: string;
    setSortBy: (sort: string) => void;
    applySort: () => void;
}

const AstrologerSortModal: React.FC<AstrologerSortModalProps> = ({
    modalId,
    sortBy,
    setSortBy,
    applySort,
}) => {
    const options = [
        { value: "newest", label: "Newest First", icon: "fa-sun" },
        { value: "rating", label: "Rating: High to Low", icon: "fa-star" },
        { value: "price_asc", label: "Price: Low to High", icon: "fa-arrow-up-1-9" },
        { value: "price_desc", label: "Price: High to Low", icon: "fa-arrow-down-9-1" },
        { value: "experience", label: "Experience: High to Low", icon: "fa-briefcase" },
    ];
    // comment

    return (
        <div
            className="modal fade"
            id={modalId}
            tabIndex={-1}
            aria-hidden="true"
            style={{ zIndex: 1060 }}
        >
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content text-dark border-0 shadow-lg rounded-3">
                    <div className="modal-header bg-linear-to-r from-orange-50 to-white border-0 py-3 px-4">
                        <h5 className="modal-title font-bold text-lg">
                            <i className="fa-solid fa-sort mr-2 text-primary"></i>Sort By
                        </h5>
                        <button
                            type="button"
                            className="btn-close shadow-none"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            style={{ fontSize: "0.8rem" }}
                        >X</button>
                    </div>
                    <div className="modal-body p-4">
                        <div className="space-y-3">
                            {options.map((option) => (
                                <label
                                    key={option.value}
                                    className="d-flex align-items-center p-3 rounded-lg border cursor-pointer transition hover:border-primary hover:bg-primary/5 mb-2"
                                    style={{
                                        borderColor: sortBy === option.value ? "#F25E0A" : "#e5e7eb",
                                        backgroundColor: sortBy === option.value ? "#fffaf5" : "white",
                                    }}
                                >
                                    <input
                                        type="radio"
                                        name="sortOption"
                                        value={option.value}
                                        checked={sortBy === option.value}
                                        onChange={() => setSortBy(option.value)}
                                        className="form-check-input me-3"
                                        style={{ accentColor: "#F25E0A" }}
                                    />
                                    <i className={`fa-solid ${option.icon} text-primary mr-3`} style={{ width: "20px" }}></i>
                                    <span className={`font-medium ${sortBy === option.value ? 'text-primary' : 'text-gray-700'}`}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                    <div className="modal-footer border-0 p-4 pt-0">
                        <button
                            type="button"
                            className="btn bg-black text-white w-100 font-semibold py-2.5 shadow-sm rounded-lg"
                            data-bs-dismiss="modal"
                            onClick={applySort}
                        >
                            Apply Sort
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AstrologerSortModal;
