"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  FaMapMarkerAlt as FaMa,
  FaSpinner as FaSp,
  FaSearch as FaSe,
} from "react-icons/fa";

const FaMapMarkerAlt = FaMa as any;
const FaSpinner = FaSp as any;
const FaSearch = FaSe as any;

interface LocationAutocompleteProps {
  placeholder?: string;
  onSelect: (location: { name: string; lat: string; lon: string }) => void;
  initialValue?: string;
  className?: string;
}

interface NominatimResult {
  place_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

const LocationAutocomplete: React.FC<LocationAutocompleteProps> = ({
  placeholder = "Search location...",
  onSelect,
  initialValue = "",
  className = "",
}) => {
  const [query, setQuery] = useState(initialValue);
  const [results, setResults] = useState<NominatimResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  /* ------------------------------
     Helper: Short location format
  ------------------------------ */
  const formatShortLocation = (result: NominatimResult) => {
    const addr = result.address;

    const city = addr?.city || addr?.town || addr?.village || "";
    const state = addr?.state || "";
    const country = addr?.country || "";

    return [city, state, country].filter(Boolean).join(", ");
  };

  /* ------------------------------
     Debounced search
  ------------------------------ */
  useEffect(() => {
    if (!query || query.length < 3 || !isOpen) {
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&q=${encodeURIComponent(
            query
          )}&limit=5`
        );
        setResults(response.data);
      } catch (error) {
        console.error("Error fetching locations:", error);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  /* ------------------------------
     Close dropdown on outside click
  ------------------------------ */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ------------------------------
     Handle select
  ------------------------------ */
  const handleSelect = (result: NominatimResult) => {
    const shortLocation = formatShortLocation(result);
    setQuery(shortLocation);
    onSelect({
      name: shortLocation,
      lat: result.lat,
      lon: result.lon,
    });
    setIsOpen(false);
  };

  return (
    <div className={`relative w-full ${className}`} ref={dropdownRef}>
      {/* Input */}
      <div className="relative group/input">
        <input
          type="text"
          className="form-control rounded-3 py-3 pl-10 pr-10 border bg-gray-50 text-sm shadow-sm focus:bg-white focus:ring-2 focus:ring-primary/10 transition-all w-full"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
        />

        {/* Right Icon */}
        <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
          {loading ? (
            <FaSpinner className="animate-spin" size={14} />
          ) : (
            <FaSearch size={12} />
          )}
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (results.length > 0 || loading) && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {loading && results.length === 0 ? (
            <div className="p-4 text-center text-gray-500 text-sm">
              Finding locations...
            </div>
          ) : (
            <ul className="m-0 p-0 list-none">
              {results.map((result) => (
                <li
                  key={result.place_id}
                  className="px-4 py-3 hover:bg-primary/5 cursor-pointer transition-colors border-b border-gray-50 last:border-0"
                  onClick={() => handleSelect(result)}
                >
                  <div className="flex items-start gap-3">
                    <FaMapMarkerAlt
                      className="text-primary mt-1 shrink-0"
                      size={12}
                    />
                    <span className="text-sm text-gray-700 leading-tight">
                      {formatShortLocation(result)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LocationAutocomplete;
