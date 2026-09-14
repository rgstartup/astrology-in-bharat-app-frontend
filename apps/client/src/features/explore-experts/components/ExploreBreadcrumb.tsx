"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

export function ExploreBreadcrumb() {
  return (
    <nav aria-label="Breadcrumb" className="pt-3 pb-4">
      <ol className="flex items-center gap-2 text-xs sm:text-sm text-gray-500">
        <li>
          <Link
            href="/"
            className="hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
        </li>
        <li className="text-gray-300 select-none">
          <ChevronRight className="size-3.5" />
        </li>
        <li className="text-gray-900 font-medium select-none">
          Astrologers
        </li>
      </ol>
    </nav>
  );
}
