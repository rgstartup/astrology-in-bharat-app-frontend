"use client";

import React from "react";
import { Compass } from "lucide-react";
import { PATHS } from "@repo/routes";
import { usePathname } from "@/i18n/navigation";
import { SidebarBrand } from "./sidebar-brand.component";
import { SidebarNavItem } from "./sidebar-nav-item.component";
import { SidebarNavGroup } from "./sidebar-nav-group.component";
import { SidebarSupportCard } from "./sidebar-support-card.component";
import {
  ASTROLOGY_SUB_LINKS,
  MAIN_SERVICES_NAV,
  ACCOUNT_NAV_ITEMS,
} from "../../data/navigation.data";

export interface DashboardSidebarProps {
  onClose?: () => void;
}

const groups = [
  { title: "My astrology", items: ASTROLOGY_SUB_LINKS },
  { title: "Explore & activity", items: MAIN_SERVICES_NAV },
  { title: "Account", items: ACCOUNT_NAV_ITEMS },
];

/**
 * Sidebar root orchestrator component for the client dashboard.
 * Composes brand identity, categorized navigation links, and support card.
 *
 * Design tokens adhere to pure Intercom specification:
 * - Cream canvas background (#f5f1ec) on container and nav, never white
 * - Warm hairline borders (#d3cec6)
 * - Charcoal ink typography (#111111)
 * - Charcoal (#111111) active indicators
 * - Smooth scroll area with data-lenis-prevent
 *
 * @param props - Component properties.
 * @param props.onClose - Optional callback for mobile sheet drawer dismissal.
 * @returns Dashboard sidebar root element.
 */
export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname().replace(/\/$/, "");
  const isOverviewActive = pathname === PATHS.DASHBOARD.ROOT;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec] font-sans text-[#111111]">
      <SidebarBrand onClose={onClose} />

      <nav
        aria-label="Dashboard"
        data-lenis-prevent
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain bg-[#f5f1ec] px-3 py-3 focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-[#111111] [scrollbar-width:thin]"
      >
        <SidebarNavItem
          item={{
            name: "Overview",
            href: PATHS.DASHBOARD.ROOT,
            icon: Compass,
          }}
          active={isOverviewActive}
          onClose={onClose}
        />

        {groups.map(({ title, items }) => (
          <SidebarNavGroup
            key={title}
            title={title}
            items={items}
            pathname={pathname}
            onClose={onClose}
          />
        ))}
      </nav>

      <SidebarSupportCard onClose={onClose} />
    </div>
  );
}
