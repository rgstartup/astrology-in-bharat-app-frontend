import React from "react";
import Button from "../ui/Button";

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
                <Button
                    key={range.key}
                    onClick={() => setTimeRange(range.key)}
                    variant={timeRange === range.key ? "primary" : "secondary"}
                    size="md"
                    className="rounded-lg"
                >
                    {range.label}
                </Button>
            ))}
        </div>
    );
}


