// refund-management/components/RefundFilters.tsx
import React from "react";
import { Filter, Calendar, Download } from "lucide-react";
import { Button } from "@repo/ui";

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
    <div className="bg-white rounded-xl border p-3 sm:p-4">
      <div className="flex flex-col gap-3">
        {/* Filter buttons - scrollable on mobile */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
          <div className="flex items-center gap-2 mr-1 flex-shrink-0">
            <FilterComp className="w-4 h-4 text-gray-500" />
            <span className="text-xs sm:text-sm font-medium text-gray-700 whitespace-nowrap">Filter:</span>
          </div>

          {filters.map((filter) => (
            <Button
              key={filter.key}
              onClick={() => onFilterChange(filter.key)}
              variant={activeFilter === filter.key ? "primary" : "secondary"}
              size="sm"
              className="whitespace-nowrap flex-shrink-0 text-xs"
            >
              {filter.label}
            </Button>
          ))}
        </div>

        {/* Date + Export - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-3">
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



