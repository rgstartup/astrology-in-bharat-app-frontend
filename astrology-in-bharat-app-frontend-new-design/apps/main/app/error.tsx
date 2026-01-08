"use client";

import { useEffect } from "react";
import Link from "next/link";
import { FaRedoAlt, FaHome } from "react-icons/fa";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(90vh-100px)] items-center justify-center bg-[#fafafa] px-4 font-poppins">
      <div className="w-full max-w-3/5  rounded-2xl border border-gray-200 bg-white px-8 py-16 text-center shadow-sm">
        {/* Icon */}
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-50">
          <span className="text-2xl font-semibold text-[#fd6410]">!</span>
        </div>

        {/* Title */}
        <h1 className="mb-2 text-2xl font-semibold text-gray-800">
          Something went wrong
        </h1>

        {/* Description */}
        <p className="mb-6 text-sm leading-relaxed text-gray-500">
          We couldn’t complete your request right now. Please try again or go
          back to the homepage.
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 rounded-pill bg-[#fd6410] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#e65a0e]"
          >
            <FaRedoAlt size={14} />
            Try Again
          </button>

          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-black transition hover:bg-gray-50"
          >
            <FaHome size={14} />
            Go Home
          </Link>
        </div>

        {/* Optional Debug ID */}
        {error.digest && (
          <p className="mt-6 text-[11px] text-gray-400">
            Reference ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
