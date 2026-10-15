"use client";

import React from "react";
import { ChevronRight, Compass } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";

export interface HeaderBreadcrumbProps {
  isOverview: boolean;
  pageName: string;
}

/**
 * Overview page heading rendered when on the dashboard root.
 * Follows OpenWolf Rule 4 (dedicated named sub-component).
 *
 * @returns Overview title list element.
 */
function OverviewTitle() {
  return (
    <li className="font-sans text-base font-bold tracking-tight text-[#111111] sm:text-lg">
      <span aria-current="page">Overview</span>
    </li>
  );
}

/**
 * Nested breadcrumb trail with link back to Overview.
 * Follows OpenWolf Rule 4 (dedicated named sub-component).
 *
 * @param props.pageName - Active subpage label.
 * @returns Breadcrumb list items.
 */
function NestedTrail({ pageName }: { pageName: string }) {
  return (
    <>
      <li className="hidden font-sans sm:block">
        <Link
          href={PATHS.DASHBOARD.ROOT}
          className="inline-flex min-h-10 items-center rounded-md font-sans text-sm font-semibold text-[#626260] no-underline hover:text-[#111111] focus-visible:outline-2 focus-visible:outline-[#111111]"
        >
          Overview
        </Link>
      </li>
      <li aria-hidden="true" className="hidden text-[#7b7b78] sm:block">
        <ChevronRight className="size-4" />
      </li>
      <li
        aria-current="page"
        className="truncate font-sans text-base font-bold tracking-tight text-[#111111] sm:text-lg"
      >
        {pageName}
      </li>
    </>
  );
}

/**
 * Header breadcrumb and current page title display.
 * Styled with Intercom charcoal ink (#111111) on cream canvas (#f5f1ec)
 * with hairline borders (#d3cec6) and zero JSX ternaries.
 *
 * @param props - Component properties.
 * @param props.isOverview - Whether the active page is Overview root.
 * @param props.pageName - Human-readable name of current page.
 * @returns Breadcrumb navigation element.
 */
export function HeaderBreadcrumb({
  isOverview,
  pageName,
}: HeaderBreadcrumbProps) {
  if (isOverview) {
    return (
      <div className="flex min-w-0 items-center gap-2.5 font-sans">
        <span
          aria-hidden="true"
          className="hidden size-8 shrink-0 items-center justify-center rounded-full bg-white text-[#111111] md:flex border border-[#d3cec6]"
        >
          <Compass className="size-4" strokeWidth={2} />
        </span>
        <nav aria-label="Breadcrumb" className="min-w-0">
          <ol className="flex min-w-0 items-center gap-2 text-sm">
            <OverviewTitle />
          </ol>
        </nav>
      </div>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-2.5 font-sans">
      <span
        aria-hidden="true"
        className="hidden size-8 shrink-0 items-center justify-center rounded-md bg-white text-[#111111] md:flex border border-[#d3cec6]"
      >
        <Compass className="size-4" strokeWidth={2} />
      </span>
      <nav aria-label="Breadcrumb" className="min-w-0">
        <ol className="flex min-w-0 items-center gap-2 text-sm">
          <NestedTrail pageName={pageName} />
        </ol>
      </nav>
    </div>
  );
}
