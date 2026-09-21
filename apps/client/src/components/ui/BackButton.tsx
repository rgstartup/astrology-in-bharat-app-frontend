"use client";

import React from "react";
import { useRouter } from "@/i18n/navigation";
import { ArrowLeft } from "lucide-react";

interface BackButtonProps {
  className?: string;
  fallbackUrl?: string;
  label?: string;
  onClick?: () => void;
}

export default function BackButton({
  className = "",
  fallbackUrl = "/",
  label = "Back",
  onClick,
}: BackButtonProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onClick) {
      onClick();
      return;
    }

    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push(fallbackUrl);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      aria-label="Go back to previous page"
      className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-900 bg-white hover:bg-stone-50 border border-stone-200/90 hover:border-stone-300 transition-all duration-200 cursor-pointer group shadow-2xs ${className}`}
    >
      <ArrowLeft className="size-4 group-hover:-translate-x-0.5 transition-transform duration-200" />
      <span>{label}</span>
    </button>
  );
}
