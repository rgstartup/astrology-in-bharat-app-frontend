"use client";
import { CalendarCheck } from "@repo/design/lucide";

export default function StatsEmpty() {
  return (
    <div className="bg-white rounded-xl p-12 shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
      <CalendarCheck className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No stats available</h3>
      <p className="text-gray-600 text-sm mb-6">
        Stats will appear here once you start taking consultations.
      </p>
    </div>
  );
}
