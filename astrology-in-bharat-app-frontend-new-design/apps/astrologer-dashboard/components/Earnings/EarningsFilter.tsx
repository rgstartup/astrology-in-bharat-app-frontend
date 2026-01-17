import React from "react";

interface EarningsFilterProps {
    timeRange: string;
    setTimeRange: (range: string) => void;
}

export default function EarningsFilter({
    timeRange,
    setTimeRange,
}: EarningsFilterProps) {
    const ranges = [
        { key: "lastWeek", label: "Last Week" },
        { key: "thisWeek", label: "This Week" },
        { key: "lastMonth", label: "Last Month" },
        { key: "thisMonth", label: "This Month" },
        { key: "lastYear", label: "Last Year" },
        { key: "thisYear", label: "This Year" },
    ];

    return (
        <div className="flex gap-3 mb-4 flex-wrap">
            {ranges.map((range) => (
                <button
                    key={range.key}
                    onClick={() => setTimeRange(range.key)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${timeRange === range.key
                            ? "bg-yellow-600 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        }`}
                >
                    {range.label}
                </button>
            ))}
        </div>
    );
}
