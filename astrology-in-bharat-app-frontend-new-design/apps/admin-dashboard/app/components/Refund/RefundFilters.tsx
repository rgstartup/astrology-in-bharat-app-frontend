// refund-management/components/RefundFilters.tsx
import React from "react";
import { Filter, Calendar, Download } from "lucide-react";
import { Button } from "../../../../shared/components/Button";

const FilterComp = Filter as any;
const CalendarComp = Calendar as any;
const DownloadComp = Download as any;

interface FilterItem {
  key: string;
  label: string;
}

interface RefundFiltersProps {
  filters: FilterItem[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

export function RefundFilters({
  filters,
  activeFilter,
  onFilterChange
}: RefundFiltersProps) {
  return (
    <div className="bg-white rounded-xl border p-4">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left side - Filter buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-2 mr-2">
            <FilterComp className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter by:</span>
          </div>

          {filters.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              variant={activeFilter === filter.key ? "primary" : "secondary"}
              size="sm"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Right side - Date range and export */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg">
            <CalendarComp className="w-4 h-4 text-gray-500" />
            <select className="bg-transparent text-sm outline-none">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
              <option>Custom range</option>
            </select>
          </div>

          <Button variant="outline" size="sm" icon={DownloadComp}>
            Export
          </Button>
        </div>
      </div>
    </div>
  );
}