"use client";
import { Button } from "@repo/ui";

interface AnalyticsHeaderProps {
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
}

export function AnalyticsHeader({ timeFilter, setTimeFilter }: AnalyticsHeaderProps) {
  const timeFilters = [
    { value: "7days", label: "7 Days" },
    { value: "30days", label: "30 Days" },
    { value: "90days", label: "90 Days" },
    { value: "year", label: "1 Year" },
  ];

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive insights into platform performance
        </p>
      </div>

      {/* ✅ Using Button Component */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar w-full sm:w-auto pb-2 sm:pb-0 -mx-4 px-4 sm:mx-0 sm:px-0">
        {timeFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={timeFilter === filter.value ? "primary" : "outline"}
            size="sm"
            onClick={() => setTimeFilter(filter.value)}
            className="whitespace-nowrap flex-shrink-0"
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}



