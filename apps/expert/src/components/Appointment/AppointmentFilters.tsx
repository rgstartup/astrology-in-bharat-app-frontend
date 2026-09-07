import React from "react";
import { Search } from "lucide-react";
import Button from "../ui/Button";

interface AppointmentFiltersProps {
    view: "list" | "calendar";
    setView: (view: "list" | "calendar") => void;
    searchTerm: string;
    onSearch: (value: string) => void;
    activeStatus: string;
    onStatusChange: (status: string) => void;
}

export default function AppointmentFilters({
    searchTerm,
    onSearch,
    activeStatus,
    onStatusChange,
}: AppointmentFiltersProps) {
    const cn = (...classes: (string | undefined | null | boolean)[]) =>
        classes.filter(Boolean).join(" ");

    return (
        <section aria-labelledby="appointment-filters-heading">
            <h2 id="appointment-filters-heading" className="sr-only">
                Appointment Filters
            </h2>

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 mb-6 flex flex-col gap-4">
                {/* Search Input */}
                <div className="w-full relative">
                    <input
                        type="text"
                        placeholder="Search by name or service..."
                        value={searchTerm}
                        onChange={(e) => onSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg shadow-sm text-sm focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                        aria-label="Search appointments"
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">
                        <Search size={20} />
                    </span>
                </div>

                {/* Status Filters */}
                <div className="flex flex-wrap gap-2">
                    <Button
                        onClick={() => onStatusChange('all')}
                        variant={activeStatus === 'all' ? "primary" : "secondary"}
                        size="sm"
                        className="rounded-full cursor-pointer"
                    >
                        All
                    </Button>
                    <Button
                        onClick={() => onStatusChange('today')}
                        variant={activeStatus === 'today' ? "primary" : "secondary"}
                        size="sm"
                        className={cn("rounded-full cursor-pointer", activeStatus === 'today' ? "bg-blue-600 hover:bg-blue-700" : "text-blue-600")}
                    >
                        Today
                    </Button>
                    <Button
                        onClick={() => onStatusChange('completed')}
                        variant={activeStatus === 'completed' ? "primary" : "secondary"}
                        size="sm"
                        className={cn("rounded-full cursor-pointer", activeStatus === 'completed' ? "bg-green-600 hover:bg-green-700" : "text-green-600")}
                    >
                        Completed
                    </Button>
                    <Button
                        onClick={() => onStatusChange('expired')}
                        variant={activeStatus === 'expired' ? "primary" : "secondary"}
                        size="sm"
                        className={cn("rounded-full cursor-pointer", activeStatus === 'expired' ? "bg-red-600 hover:bg-red-700" : "text-red-600")}
                    >
                        Expired
                    </Button>
                </div>
            </div>
        </section>
    );
}
