"use client";
import React, { useState } from "react";

interface FilterState {
  location: string;
  language: string;
  specialization: string;
  rating: number;
  price: number;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({ isOpen, onClose, onApply }) => {
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    language: "",
    specialization: "",
    rating: 1,
    price: 50,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRatingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      rating: parseInt(e.target.value),
    }));
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters((prev) => ({
      ...prev,
      price: parseInt(e.target.value),
    }));
  };

  const handleApply = () => {
    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    setFilters({
      location: "",
      language: "",
      specialization: "",
      rating: 1,
      price: 50,
    });
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="modal-backdrop fade show"
        onClick={onClose}
        style={{ display: "block" }}
      ></div>

      {/* Modal */}
      <div
        className="modal fade show"
        style={{ display: "block" }}
        tabIndex={-1}
        aria-labelledby="filterModalLabel"
        aria-modal="true"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            {/* Modal Header */}
            <div className="modal-header">
              <h5 className="modal-title" id="filterModalLabel">
                <i className="fa-solid fa-filter me-2" style={{ color: "#daa23e" }}></i>
                Filter Astrologers
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={onClose}
                aria-label="Close"
              ></button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="row">
                {/* Location */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-location-dot me-2" style={{ color: "#daa23e" }}></i>
                    Location
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="location"
                    value={filters.location}
                    onChange={handleInputChange}
                    placeholder="Enter the city e.g: Delhi"
                    style={{
                      borderColor: "#daa23e",
                      borderWidth: "2px",
                    }}
                  />
                </div>

                {/* Language */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-language me-2" style={{ color: "#daa23e" }}></i>
                    Language
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="language"
                    value={filters.language}
                    onChange={handleInputChange}
                    placeholder="Enter the language e.g: Hindi"
                    style={{
                      borderColor: "#daa23e",
                      borderWidth: "2px",
                    }}
                  />
                </div>

                {/* Specialization */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-star me-2" style={{ color: "#daa23e" }}></i>
                    Specialization
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    name="specialization"
                    value={filters.specialization}
                    onChange={handleInputChange}
                    placeholder="Enter specialization e.g: Vedic"
                    style={{
                      borderColor: "#daa23e",
                      borderWidth: "2px",
                    }}
                  />
                </div>

                {/* Rating */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-star me-2" style={{ color: "#daa23e" }}></i>
                    Rating: {filters.rating} / 5
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="5"
                    step="0.5"
                    name="rating"
                    value={filters.rating}
                    onChange={handleRatingChange}
                    style={{
                      accentColor: "#daa23e",
                      height: "6px",
                    }}
                  />
                </div>

                {/* Price */}
                <div className="col-md-6 mb-4">
                  <label className="form-label fw-bold">
                    <i className="fa-solid fa-rupee-sign me-2" style={{ color: "#daa23e" }}></i>
                    Max Price: ₹{filters.price}/min
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    min="1"
                    max="100"
                    step="1"
                    name="price"
                    value={filters.price}
                    onChange={handlePriceChange}
                    style={{
                      accentColor: "#daa23e",
                      height: "6px",
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={handleReset}
              >
                <i className="fa-solid fa-rotate-left me-2"></i>
                Reset
              </button>
              <button
                type="button"
                className="btn"
                onClick={onClose}
                style={{
                  backgroundColor: "#f0f0f0",
                  color: "#333",
                  border: "none",
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleApply}
                style={{
                  background: "linear-gradient(45deg, #daa23e, #e0a800)",
                  color: "white",
                  border: "none",
                }}
              >
                <i className="fa-solid fa-filter me-2"></i>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterModal;
