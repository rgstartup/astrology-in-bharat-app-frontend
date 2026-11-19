"use client";
import { AlertCircle } from "@repo/design/lucide";

export default function ConsultationRatingsEmpty() {
  return (
    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center h-full">
      <AlertCircle className="w-12 h-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
      <p className="text-gray-600 text-sm">
        Client reviews will appear here after consultations.
      </p>
    </div>
  );
}
