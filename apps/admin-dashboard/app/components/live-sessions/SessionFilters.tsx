// live-sessions/components/SessionFilters.tsx
import React from "react";

interface FilterItem {
  key: string;
  label: string;
}

interface SessionFiltersProps {
  filters: FilterItem[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function SessionFilters({ 
  filters, 
  activeFilter, 
  onFilterChange 
}: SessionFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
      <span className="text-sm font-medium text-gray-700 flex-shrink-0">
        Filter by:
      </span>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.key}
            onClick={() => onFilterChange(filter.key)}
            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
              activeFilter === filter.key
                ? "bg-gray-900 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
