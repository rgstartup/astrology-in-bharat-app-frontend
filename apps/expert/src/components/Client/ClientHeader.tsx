import React from "react";
import { Search, History } from "lucide-react";

interface ClientHeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export default function ClientHeader({
    searchTerm,
    setSearchTerm,
}: ClientHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 pt-2 sticky top-0 bg-white z-10 pb-4 border-b border-gray-50 -mt-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0 flex items-center gap-3">
                <span className="w-10 h-10 rounded-full flex items-center justify-center bg-[#e3f2fd] text-[#1e88e5]">
                    <History size={20} />
                </span>
                Consultation History
            </h1>
            <div className="relative w-full sm:w-64">
                <input
                    type="text"
                    placeholder="Search Session ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-shadow placeholder:text-gray-500"
                />
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
                    size={16}
                />
            </div>
        </div>
    );
}


