"use client";


interface AnalyticsHeaderProps {
  timeFilter: string;
  setTimeFilter: (filter: string) => void;
}

export function AnalyticsHeader({ timeFilter, setTimeFilter }: AnalyticsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Comprehensive insights into platform performance
        </p>
      </div>

      {/* Time Filter */}
      <div className="flex gap-2">
        {["7days", "30days", "90days", "year"].map((filter) => (
          <button
            key={filter}
            onClick={() => setTimeFilter(filter)}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              timeFilter === filter
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            {filter === "7days"
              ? "7 Days"
              : filter === "30days"
              ? "30 Days"
              : filter === "90days"
              ? "90 Days"
              : "1 Year"}
          </button>
        ))}
      </div>
    </div>
  );
}