"use client";
import React, { useState } from "react";

type SortDirection = "none" | "asc" | "desc";

interface SortState {
  experience: SortDirection;
  price: SortDirection;
  rating: SortDirection;
}

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (sorts: SortState) => void;
}

const SortModal: React.FC<SortModalProps> = ({ isOpen, onClose, onApply }) => {
  const [selected, setSelected] = useState<string | null>(null);

  const handleReset = () => {
    setSelected(null);
  };

  const handleApply = () => {
    // build SortState from selected option
    const result: SortState = { experience: "none", price: "none", rating: "none" };
    if (selected) {
      const [field, dir] = selected.split("_") as [keyof SortState, Exclude<SortDirection, "none">];
      result[field] = dir;
    }
    onApply(result);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" onClick={onClose} style={{ display: "block" }} />
      <div className="modal fade show" style={{ display: "block" }} tabIndex={-1} aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                <i className="fa-solid fa-sort me-2" style={{ color: "#daa23e" }}></i>
                Sort Astrologers
              </h5>
              <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
            </div>

            <div className="modal-body">
              <div className="row">
                <div className="col-md-12 mb-3">
                  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                    {[
                      { key: "experience_desc", label: "Experience : High to Low" },
                      { key: "price_asc", label: "Price : Low to High" },
                      { key: "rating_desc", label: "Rating : High to Low" },
                    ].map((opt: { key: string; label: string }) => (
                      <label key={opt.key} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <input
                          type="radio"
                          name="sortOption"
                          value={opt.key}
                          checked={selected === opt.key}
                          onChange={() => setSelected(opt.key)}
                        />
                        {opt.label}
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn btn-outline-secondary" onClick={handleReset}>
                <i className="fa-solid fa-rotate-left me-2"></i>
                Reset
              </button>
              <button type="button" className="btn" onClick={onClose} style={{ backgroundColor: "#f0f0f0", color: "#333", border: "none" }}>
                Cancel
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleApply}
                style={{ background: "linear-gradient(45deg, #daa23e, #e0a800)", color: "white", border: "none" }}
              >
                <i className="fa-solid fa-filter me-2"></i>
                Apply Sorts
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SortModal;
