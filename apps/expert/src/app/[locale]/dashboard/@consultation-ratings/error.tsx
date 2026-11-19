"use client";

export default function ConsultationRatingsError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-200 text-center">
      <p className="text-red-600">Failed to load consultation ratings.</p>
      <button
        onClick={reset}
        className="mt-4 text-orange-600 text-sm font-medium hover:underline"
      >
        Retry
      </button>
    </div>
  );
}
