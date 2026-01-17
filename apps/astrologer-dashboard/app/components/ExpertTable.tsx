// Refactored `ExpertsTable.tsx`
"use client";

import React from 'react';
import { Search, Star } from 'lucide-react';
import { cn } from '@/utils/cn'; // Assuming the utility function is in a central place

// 💡 Define a more robust data structure with explicit types
interface Expert {
  id: number;
  name: string;
  specialization: string;
  status: 'Online' | 'Pending Approval' | 'Out of Studio'; // 💡 Using a union type for better type-safety
  rating: number;
}

export const ExpertsTable: React.FC = () => {
  // 💡 Data should ideally be fetched from an API
  const experts: Expert[] = [
    { id: 1, name: "Parsona Mukherjee", specialization: "Vedic Astrology", status: "Online", rating: 5 },
    { id: 2, name: "Amar Perera", specialization: "Horoscope Matching", status: "Pending Approval", rating: 4 },
    { id: 3, name: "Suresh Sharma", specialization: "Zodiac Consultations", status: "Out of Studio", rating: 5 } // 💡 Corrected "Amar Perera" duplicate
  ];

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-md border border-gray-200 overflow-hidden custom-scrollbar-yellow">

      {/* Table Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h3 className="text-xl font-bold text-gray-900 leading-tight">Manage Experts</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-48 pl-10 pr-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 placeholder-gray-500 focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none transition-colors duration-200"
            aria-label="Search experts table"
          />
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto custom-scrollbar-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Specialization</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rating</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {experts.map((expert) => (
              <tr key={expert.id} className="hover:bg-gray-50 transition-colors duration-200">
                <td className="py-4 px-4 whitespace-nowrap font-medium text-gray-900">{expert.name}</td>
                <td className="py-4 px-4 whitespace-nowrap text-gray-600">{expert.specialization}</td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <span className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                    expert.status === "Online" && "bg-green-100 text-green-800",
                    expert.status === "Pending Approval" && "bg-yellow-100 text-yellow-800",
                    expert.status === "Out of Studio" && "bg-gray-100 text-gray-800"
                  )}>
                    {expert.status}
                  </span>
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < expert.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};