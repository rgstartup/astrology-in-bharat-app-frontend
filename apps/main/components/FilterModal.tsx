"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface FilterState {
  location: string;
  language: string;
  rating: number;
  price: number;
}

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (filters: FilterState) => void;
}

const FilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  onApply,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    location: "",
    language: "",
    rating: 0,
    price: 0,
  });

  const handleChange = (field: keyof FilterState, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleApply = () => {
    onApply(filters);
  };

  const handleClear = () => {
    setFilters({
      location: "",
      language: "",
      rating: 0,
      price: 0,
    });
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered className="premium-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Filter Astrologers</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Language */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Language</Form.Label>
            <div className="d-flex flex-wrap gap-2">
              {["English", "Hindi", "Marathi", "Tamil", "Bengali"].map(
                (lang) => (
                  <span
                    key={lang}
                    onClick={() =>
                      handleChange(
                        "language",
                        filters.language === lang ? "" : lang
                      )
                    }
                    className={`px-3 py-2 rounded-pill cursor-pointer border transition-all ${
                      filters.language === lang
                        ? "bg-warning text-dark border-warning fw-bold"
                        : "bg-light text-muted border-light hover:bg-gray-100"
                    }`}
                    style={{ cursor: "pointer", fontSize: "0.9rem" }}
                  >
                    {lang}
                  </span>
                )
              )}
            </div>
          </Form.Group>

          {/* Rating */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Min Rating</Form.Label>
            <div className="d-flex gap-2">
              {[3, 4, 4.5, 5].map((r) => (
                <span
                  key={r}
                  onClick={() =>
                    handleChange("rating", filters.rating === r ? 0 : r)
                  }
                  className={`px-3 py-2 rounded-3 cursor-pointer border transition-all d-flex align-items-center gap-1 ${
                    filters.rating === r
                      ? "bg-warning text-dark border-warning fw-bold"
                      : "bg-light text-muted border-light"
                  }`}
                  style={{ cursor: "pointer", fontSize: "0.9rem" }}
                >
                  {r}+ <i className="fa-solid fa-star text-xs"></i>
                </span>
              ))}
            </div>
          </Form.Group>

          {/* Price */}
          <Form.Group className="mb-4">
            <Form.Label className="fw-semibold">Max Price (₹/min)</Form.Label>
            <input
              type="range"
              className="form-range"
              min="0"
              max="200"
              step="10"
              value={filters.price}
              onChange={(e) => handleChange("price", Number(e.target.value))}
            />
            <div className="d-flex justify-content-between text-muted small">
              <span>Free</span>
              <span>₹100</span>
              <span>₹200+</span>
            </div>
            <div className="text-center mt-2 fw-bold text-warning">
              {filters.price > 0 ? `Up to ₹${filters.price}/min` : "Any Price"}
            </div>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="light"
          onClick={handleClear}
          className="rounded-pill px-4"
        >
          Clear
        </Button>
        <Button
          variant="warning"
          onClick={handleApply}
          className="rounded-pill px-5 text-white fw-bold shadow-sm"
          style={{
            background: "linear-gradient(45deg, #f0c14b, #cf9d2a)",
            border: "none",
          }}
        >
          Apply Filters
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
