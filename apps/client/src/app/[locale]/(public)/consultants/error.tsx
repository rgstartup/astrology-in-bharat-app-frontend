"use client";

import React, { useEffect } from "react";
import { Link } from "@/i18n/navigation";
import { RotateCw, Home, AlertCircle } from "lucide-react";

export default function ConsultantsRootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Consultants Error:", error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="w-full max-w-lg bg-white rounded-3xl border border-amber-200/80 p-8 sm:p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)]">
        {/* Error Icon */}
        <div className="mx-auto mb-5 size-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-orange flex items-center justify-center shadow-xs">
          <AlertCircle className="size-8" />
        </div>

        {/* Title & Message */}
        <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight mb-2">
          Unable to Load Consultants
        </h1>
        <p className="text-gray-500 text-xs sm:text-sm leading-relaxed mb-8">
          We encountered an issue while loading the astrological consultants directory.
          Please try again or return to the homepage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-orange hover:bg-[#d35400] text-white font-bold text-xs sm:text-sm transition-all active:scale-95 shadow-xs cursor-pointer"
          >
            <RotateCw className="size-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs sm:text-sm transition-all active:scale-95 cursor-pointer"
          >
            <Home className="size-4" />
            <span>Go Home</span>
          </Link>
        </div>

        {/* Debug digest if available */}
        {error.digest && (
          <p className="mt-8 text-[10px] text-gray-400 font-mono">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  );
}
