"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-gray-50 px-4 text-center">
      <div className="rounded-2xl bg-white p-8 shadow-xl">
        <div className="mb-4 flex justify-center text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2 className="mb-2 text-2xl font-bold text-gray-800">
          Something went wrong!
        </h2>
        <p className="mb-6 text-gray-600">
          We encountered an unexpected error. Please try again.
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="rounded-full bg-[#fd6410] px-6 py-2 font-semibold text-white transition hover:bg-[#e35d0e]"
          >
            Try Again
          </button>
          <button
            onClick={() => (window.location.href = "/")}
            className="rounded-full border border-gray-300 bg-white px-6 py-2 font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}
