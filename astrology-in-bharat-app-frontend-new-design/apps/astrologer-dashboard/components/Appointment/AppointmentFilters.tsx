import React from "react";
import { Search, List, LayoutGrid } from "lucide-react";

interface AppointmentFiltersProps {
    view: "list" | "calendar";
    setView: (view: "list" | "calendar") => void;
    searchTerm: string;
    onSearch: (value: string) => void;
    activeStatus: string;
    onStatusChange: (status: string) => void;
}

export default function AppointmentFilters({
    view,
    setView,
    searchTerm,
    onSearch,
    activeStatus,
    onStatusChange,
}: AppointmentFiltersProps) {
    // Utility function for classnames
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
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-all"
                        aria-label="Search appointments"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                        {/* @ts-ignore */}
                        <Search size={20} />
                    </span>
                </div>

                {/* Date Filters & Sorting */}
                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    {/* Status Filters */}
                    <div className="flex gap-2 mr-2">
                        <button
                            onClick={() => onStatusChange('all')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-full transition-all border",
                                activeStatus === 'all'
                                    ? "bg-gray-800 text-white border-gray-800"
                                    : "bg-gray-50 text-gray-600 border-gray-100 hover:bg-gray-100"
                            )}
                        >
                            All
                        </button>
                        <button
                            onClick={() => onStatusChange('today')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-full transition-all border",
                                activeStatus === 'today'
                                    ? "bg-blue-600 text-white border-blue-600"
                                    : "bg-blue-50 text-blue-600 border-blue-100 hover:bg-blue-100"
                            )}
                        >
                            Today
                        </button>
                        <button
                            onClick={() => onStatusChange('completed')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-full transition-all border",
                                activeStatus === 'completed'
                                    ? "bg-green-600 text-white border-green-600"
                                    : "bg-green-50 text-green-600 border-green-100 hover:bg-green-100"
                            )}
                        >
                            Completed
                        </button>
                        <button
                            onClick={() => onStatusChange('expired')}
                            className={cn(
                                "px-3 py-1.5 text-xs font-semibold rounded-full transition-all border",
                                activeStatus === 'expired'
                                    ? "bg-red-600 text-white border-red-600"
                                    : "bg-red-100 text-red-600 border-red-200 hover:bg-red-200"
                            )}
                        >
                            Expired
                        </button>
                    </div>

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
                        onClick={() => setView("list")}
                        className={cn(
                            "p-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center",
                            view === "list"
                                ? "bg-yellow-600 text-white shadow-md ring-1 ring-yellow-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                        aria-label="Switch to list view"
                    >
                        {/* @ts-ignore */}
                        <List className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => setView("calendar")}
                        className={cn(
                            "p-2.5 rounded-lg shadow-sm transition-all duration-200 flex items-center justify-center",
                            view === "calendar"
                                ? "bg-yellow-600 text-white shadow-md ring-1 ring-yellow-600"
                                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        )}
                        aria-label="Switch to calendar view"
                    >
                        {/* @ts-ignore */}
                        <LayoutGrid className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </section>
    );
}
