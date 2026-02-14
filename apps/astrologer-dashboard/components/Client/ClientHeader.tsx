import React from "react";
import { Search } from "lucide-react";

interface ClientHeaderProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
}

export default function ClientHeader({
    searchTerm,
    setSearchTerm,
}: ClientHeaderProps) {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
                Clients & Consultation History
            </h1>
            <div className="relative w-full sm:w-64">
                <input
                    type="text"
                    placeholder="Search clients..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:outline-none focus:ring-1 focus:ring-yellow-500 transition-shadow"
                />
                <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={16}
                />
            </div>
        </div>
    );
}
