"use client";

import { Award } from "lucide-react";

interface Expert {
  name: string;
  consultations: number;
  rating: number;
  revenue: number;
}

interface TopExpertsListProps {
  experts: Expert[];
}

export function TopExpertsList({ experts }: TopExpertsListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Top Performing Experts
          </h3>
          <p className="text-sm text-gray-500">Based on consultations</p>
        </div>
        <Award className="w-6 h-6 text-yellow-600" />
      </div>
      <div className="space-y-4">
        {experts.map((expert, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 font-bold">
                #{index + 1}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{expert.name}</p>
                <p className="text-xs text-gray-500">
                  {expert.consultations} consultations
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900">
                ₹{expert.revenue.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500">⭐ {expert.rating}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}



