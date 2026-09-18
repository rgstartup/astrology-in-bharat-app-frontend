"use client";

import React from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { ChevronRight, Home } from "lucide-react";
import { useConsultantBreadcrumbStore } from "@/store/useConsultantBreadcrumbStore";

export function ConsultantsBreadcrumb() {
  const pathname = usePathname();
  const consultantName = useConsultantBreadcrumbStore((s) => s.consultantName);

  // Normalize path segments removing empty segments and locale if any
  const segments = pathname.split("/").filter(Boolean);

  // Check if we are on a detail page like /consultants/[id]
  const isDetailPage = segments.length >= 2 && segments[0] === "consultants";
  const detailId = isDetailPage ? segments[1] : null;

  return (
    <div className="w-full bg-white">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 py-2 sm:py-2.5">
        <nav aria-label="Breadcrumb">
          <ol className="flex items-center gap-1.5 text-[11px] sm:text-xs text-gray-500 font-medium flex-wrap">
            <li>
              <Link
                href="/"
                className="flex items-center gap-1 text-gray-500 hover:text-orange transition-colors"
              >
                <Home className="size-3.5" />
                <span>Home</span>
              </Link>
            </li>

            <li className="text-gray-300 select-none">
              <ChevronRight className="size-3.5" />
            </li>

            {isDetailPage && detailId ? (
              <>
                <li>
                  <Link
                    href="/consultants"
                    className="text-gray-500 hover:text-orange transition-colors"
                  >
                    Consultants
                  </Link>
                </li>
                <li className="text-gray-300 select-none">
                  <ChevronRight className="size-3.5" />
                </li>
                <li className="text-gray-800 font-semibold select-none truncate max-w-[240px] sm:max-w-none">
                  {consultantName || "Consultant Profile"}
                </li>
              </>
            ) : (
              <li className="text-gray-800 font-semibold select-none">
                Consultants
              </li>
            )}
          </ol>
        </nav>
      </div>
    </div>
  );
}
