"use client";
import React from "react";

interface SpecializationCarouselProps {
  selectedSpecialization: string;
  onSpecializationChange: (spec: string) => void;
}

const specializations = [
  { id: "all", label: "All", icon: "fa-border-all" },
  { id: "love", label: "Love", icon: "fa-heart" },
  { id: "career", label: "Career", icon: "fa-briefcase" },
  { id: "marriage", label: "Marriage", icon: "fa-ring" },
  { id: "health", label: "Health", icon: "fa-heart-pulse" },
  { id: "wealth", label: "Wealth", icon: "fa-coins" },
  { id: "education", label: "Education", icon: "fa-graduation-cap" },
  { id: "legal", label: "Legal", icon: "fa-scale-balanced" },
];

const SpecializationCarousel: React.FC<SpecializationCarouselProps> = ({
  selectedSpecialization,
  onSpecializationChange,
}) => {
  return (
    <div className="specialization-carousel-container py-3">
      <div
        className="d-flex gap-3 overflow-auto pb-2 px-1 scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {specializations.map((spec) => (
          <button
            key={spec.id}
            onClick={() =>
              onSpecializationChange(spec.id === "all" ? "" : spec.label)
            }
            className={`flex-shrink-0 px-4 py-2 rounded-pill d-flex align-items-center gap-2 border transition-all ${
              selectedSpecialization === spec.label ||
              (spec.id === "all" && selectedSpecialization === "")
                ? "bg-warning text-dark fw-bold border-warning shadow-sm"
                : "bg-white text-muted border-gray-200 hover:shadow-sm"
            }`}
            style={{ whiteSpace: "nowrap", minWidth: "auto" }}
          >
            <i
              className={`fa-solid ${spec.icon} ${
                selectedSpecialization === spec.label ||
                (spec.id === "all" && selectedSpecialization === "")
                  ? "text-dark"
                  : "text-warning"
              }`}
            ></i>
            {spec.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SpecializationCarousel;
