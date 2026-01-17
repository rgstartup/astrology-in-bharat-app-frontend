import React from "react";
import { Search, List, LayoutGrid } from "lucide-react";

interface FiltersSectionProps {
  view: "list" | "calendar";
  onViewChange: (view: "list" | "calendar") => void;
}

export default function FiltersSection({ view, onViewChange }: FiltersSectionProps) {
  const cn = (...classes: (string | undefined | null | boolean)[]) =>
    classes.filter(Boolean).join(" ");

  return (
    <section aria-labelledby="appointment-filters-heading">
      <h2 id="appointment-filters-heading" className="sr-only">
        Appointment Filters
      </h2>

      <div className="flex flex-col sm:flex-row flex-wrap items-center justify-between gap-4 bg-gradient-to-br from-white to-gray-50 p-5 rounded-xl shadow-lg border border-gray-200">
        {/* Search Input */}
        <div className="flex-1 min-w-[220px] relative">
          <input
            type="text"
            placeholder="Search by name or service..."
            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
            aria-label="Search appointments"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            <Search size={20} />
          </span>
        </div>

        {/* Date Filters & Sorting */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <input
            type="date"
            className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          />
          <input
            type="date"
            className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
          />
          <select
            className="px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 transition-all"
            aria-label="Sort appointments"
            defaultValue="earliest"
          >
            <option value="earliest">Sort by Time (Earliest)</option>
            <option value="latest">Sort by Time (Latest)</option>
          </select>
        </div>

        {/* View toggles */}
        <div className="flex gap-2">
          <button
            onClick={() => onViewChange("list")}
            className={cn(
              "p-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center",
              view === "list"
                ? "bg-yellow-600 text-white shadow-md ring-1 ring-yellow-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
            aria-label="Switch to list view"
          >
            <List className="w-5 h-5" />
          </button>
          <button
            onClick={() => onViewChange("calendar")}
            className={cn(
              "p-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center",
              view === "calendar"
                ? "bg-yellow-600 text-white shadow-md ring-1 ring-yellow-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            )}
            aria-label="Switch to calendar view"
          >
            <LayoutGrid className="w-5 h-5" />
          </button>
        </div>
      </div>
    </section>
  );
}