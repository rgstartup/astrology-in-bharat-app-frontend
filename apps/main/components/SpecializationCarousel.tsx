"use client";
import React, { useState, useRef } from 'react';

const specializations = [
  { id: 1, name: "Numerology", icon: "🔢" },
  { id: 2, name: "Vedic", icon: "📿" },
  { id: 3, name: "Zodiac Compatibility", icon: "♈" },
  { id: 4, name: "Astrocartography", icon: "🗺️" },
  { id: 5, name: "Lunar Node Analysis", icon: "🌙" },
  { id: 6, name: "Karmic Astrology", icon: "♻️" },
  { id: 7, name: "Chakra Healing", icon: "🧘" },
  { id: 8, name: "Love Problem", icon: "❤️" },
  { id: 9, name: "Financial Problem", icon: "💰" },
  { id: 10, name: "Career Problem", icon: "💼" },
];

interface SpecializationCarouselProps {
  selectedSpecialization: string;
  onSpecializationChange: (specialization: string) => void;
}

const SpecializationCarousel: React.FC<SpecializationCarouselProps> = ({ 
  selectedSpecialization, 
  onSpecializationChange 
}) => {
  const carouselRef = useRef<HTMLDivElement>(null);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  const handleSpecializationClick = (specName: string) => {
    // Toggle: if already selected, deselect it
    if (selectedSpecialization === specName) {
      onSpecializationChange("");
    } else {
      onSpecializationChange(specName);
    }
  };

  return (
    <div className="specialization-carousel-container">
      <button className="carousel-arrow carousel-arrow-left" onClick={scrollLeft}>
        <i className="fa-solid fa-chevron-left"></i>
      </button>
      
      <div className="specialization-carousel" ref={carouselRef}>
        {specializations.map((spec) => (
          <button 
            key={spec.id} 
            className={`specialization-btn ${selectedSpecialization === spec.name ? 'active' : ''}`}
            onClick={() => handleSpecializationClick(spec.name)}
          >
            <span className="spec-icon">{spec.icon}</span>
            <span className="spec-name">{spec.name}</span>
          </button>
        ))}
      </div>

      <button className="carousel-arrow carousel-arrow-right" onClick={scrollRight}>
        <i className="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  );
};

export default SpecializationCarousel;
