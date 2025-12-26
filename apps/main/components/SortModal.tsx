"use client";
import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";

interface SortModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (sortOption: string) => void;
}

const SortModal: React.FC<SortModalProps> = ({ isOpen, onClose, onApply }) => {
  const [selectedSort, setSelectedSort] = useState<string>("");

  const options = [
    { label: "Recommended", value: "recommended" },
    { label: "Price: Low to High", value: "price_asc" },
    { label: "Price: High to Low", value: "price_desc" },
    { label: "Experience: High to Low", value: "experience_desc" },
    { label: "Rating: High to Low", value: "rating_desc" },
  ];

  const handleApply = () => {
    onApply(selectedSort);
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered className="premium-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Sort By</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-2">
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => setSelectedSort(opt.value)}
              className={`p-3 rounded-3 cursor-pointer d-flex justify-content-between align-items-center transition-all ${
                selectedSort === opt.value
                  ? "bg-warning-subtle border border-warning"
                  : "bg-light border-transparent hover:bg-gray-100"
              }`}
              style={{ cursor: "pointer" }}
            >
              <span
                className={`fw-medium ${selectedSort === opt.value ? "text-dark" : "text-muted"}`}
              >
                {opt.label}
              </span>
              <Form.Check
                type="radio"
                name="sortParams"
                checked={selectedSort === opt.value}
                readOnly
                className="pointer-events-none"
              />
            </div>
          ))}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button
          variant="warning"
          onClick={handleApply}
          className="w-100 rounded-pill py-2 text-white fw-bold shadow-sm"
          style={{
            background: "linear-gradient(45deg, #f0c14b, #cf9d2a)",
            border: "none",
          }}
          disabled={!selectedSort}
        >
          Apply
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default SortModal;
