"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import {
  RotateCw,
  ArrowLeft,
  AlertTriangle,
  Home,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Headphones,
  Info,
} from "lucide-react";

export default function ConsultantDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error("Consultant Profile Error:", error);
  }, [error]);

  const errorMessage =
    error?.message || "An unexpected error occurred while loading this consultant profile.";

  // Determine error category based on message content
  const isNetworkError =
    errorMessage.toLowerCase().includes("fetch") ||
    errorMessage.toLowerCase().includes("network") ||
    errorMessage.toLowerCase().includes("timeout") ||
    errorMessage.toLowerCase().includes("connection");

  const isNotFoundError =
    errorMessage.toLowerCase().includes("not found") ||
    errorMessage.toLowerCase().includes("404") ||
    errorMessage.toLowerCase().includes("does not exist");

  const handleCopyError = () => {
    const textToCopy = `Error: ${errorMessage}${
      error?.digest ? `\nDigest: ${error.digest}` : ""
    }\nURL: ${typeof window !== "undefined" ? window.location.href : ""}`;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center bg-gradient-to-b from-amber-50/30 via-slate-50 to-slate-50 px-4 py-16">
      <div className="w-full max-w-xl bg-white rounded-3xl border border-amber-200/90 p-6 sm:p-10 shadow-[0_10px_35px_rgb(0,0,0,0.07)]">
        {/* Header Badge & Icon */}
        <div className="flex flex-col items-center text-center">
          <div className="size-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-orange flex items-center justify-center mb-4 shadow-xs">
            <AlertTriangle className="size-8" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-bold uppercase tracking-wider mb-2 border border-rose-200">
            <span>{isNetworkError ? "Connection Issue" : isNotFoundError ? "Profile Unavailable" : "Consultation Service Notice"}</span>
          </div>

          <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
            Unable to Load Consultant Profile
          </h1>

          <p className="text-gray-500 text-xs sm:text-sm mt-1.5 max-w-md leading-relaxed">
            {isNotFoundError
              ? "The requested astrologer account may be inactive, undergoing verification, or the link is outdated."
              : isNetworkError
                ? "We could not establish a connection to our consultation servers. Please check your internet or retry."
                : "A server issue occurred while processing this consultant's details."}
          </p>
        </div>

        {/* Detailed Error Conveyance Box */}
        <div className="mt-6 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80">
          <div className="flex items-start gap-2.5">
            <Info className="size-4 text-orange shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <span className="block text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                Server Response / Error Details
              </span>
              <p className="text-xs font-semibold text-gray-800 mt-1 break-words leading-relaxed font-mono bg-white/80 p-2.5 rounded-xl border border-amber-200/60">
                {errorMessage}
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Technical Details for Debugging */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowDetails((prev) => !prev)}
            className="w-full flex items-center justify-between text-left text-xs font-bold text-gray-500 hover:text-gray-800 py-1.5 px-2 transition-colors cursor-pointer"
          >
            <span>Technical Diagnostics</span>
            {showDetails ? (
              <ChevronUp className="size-4 text-gray-400" />
            ) : (
              <ChevronDown className="size-4 text-gray-400" />
            )}
          </button>

          {showDetails && (
            <div className="mt-2 p-3 rounded-xl bg-slate-900 text-slate-200 text-[11px] font-mono space-y-1.5 animate-in fade-in duration-200">
              {error.digest && (
                <p>
                  <span className="text-amber-400 font-bold">Digest ID:</span>{" "}
                  {error.digest}
                </p>
              )}
              {error.stack && (
                <div className="mt-2">
                  <span className="text-amber-400 font-bold block mb-1">
                    Stack Trace:
                  </span>
                  <pre className="max-h-28 overflow-y-auto text-[10px] text-slate-400 leading-tight whitespace-pre-wrap">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-orange to-[#d35400] hover:from-[#e65a00] hover:to-[#b84500] text-white font-bold text-xs sm:text-sm transition-all active:scale-[0.98] shadow-sm cursor-pointer"
          >
            <RotateCw className="size-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/consultants"
            className="w-full sm:flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-50 hover:bg-amber-100/80 border border-amber-200 text-amber-950 font-bold text-xs sm:text-sm transition-all active:scale-[0.98] cursor-pointer"
          >
            <ArrowLeft className="size-4 text-orange" />
            <span>All Consultants</span>
          </Link>

          <button
            type="button"
            onClick={handleCopyError}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-600 font-semibold text-xs sm:text-sm transition-all cursor-pointer"
            title="Copy Error for Support"
          >
            {copied ? (
              <>
                <Check className="size-4 text-emerald-600" />
                <span className="text-emerald-700 sm:hidden">Copied</span>
              </>
            ) : (
              <>
                <Copy className="size-4" />
                <span className="sm:hidden">Copy Error</span>
              </>
            )}
          </button>
        </div>

        {/* Footer Support Navigation */}
        <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-orange transition-colors"
          >
            <Home className="size-3.5" />
            <span>Home</span>
          </Link>

          <Link
            href="/contact-us"
            className="inline-flex items-center gap-1 text-gray-500 hover:text-orange transition-colors"
          >
            <Headphones className="size-3.5" />
            <span>Contact Support</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
