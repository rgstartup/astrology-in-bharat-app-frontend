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
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-gray-700">Filter by:</span>
      {filters.map((filter) => (
        <button
          key={filter.key}
          onClick={() => onFilterChange(filter.key)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            activeFilter === filter.key
              ? "bg-gray-900 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
}