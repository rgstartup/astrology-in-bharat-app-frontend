"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { DashboardSidebar } from "./dashboard-sidebar.root";
import { DashboardHeader } from "./dashboard-header.root";

export interface DashboardShellProps {
  children: React.ReactNode;
}

/**
 * Client Dashboard Layout Orchestrator (Root).
 *
 * Implements Intercom design language:
 * - High-contrast charcoal ink (#111111) and crisp hairline borders (#d3cec6)
 * - Warm cream canvas ground (#f5f1ec) for shell, main panel, drawer, and header
 * - White cards with 1px hairline borders, rounded-xl cards and fully rounded pill buttons
 * - Pinned desktop sidebar (w-60 to w-64) with smooth vertical scrolling
 * - Accessible mobile Sheet navigation drawer
 * - Sticky header with breadcrumbs, wallet chip, and unread notification counter
 * - Strict zero JSX ternary operators and modular single-responsibility composition
 *
 * @param props - Component properties.
 * @param props.children - Dashboard page content.
 * @returns Dashboard shell layout element.
 */
export function DashboardShell({ children }: DashboardShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const desktopQuery = window.matchMedia("(min-width: 768px)");
    const handleViewportChange = () => {
      if (desktopQuery.matches) {
        setMobileMenuOpen(false);
      }
    };
    desktopQuery.addEventListener("change", handleViewportChange);
    return () => desktopQuery.removeEventListener("change", handleViewportChange);
  }, []);

  const handleCloseMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-[#f5f1ec] font-sans text-[#111111] antialiased">
        <a
          href="#dashboard-content"
          className="fixed -top-96 left-4 z-50 rounded-md bg-[#111111] px-4 py-2 font-sans text-xs font-semibold text-white transition-[top] duration-150 focus:top-4 focus:outline-2 focus:outline-offset-2 focus:outline-[#111111]"
        >
          Skip to content
        </a>

        {/* Pinned desktop sidebar */}
        <aside className="hidden h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-[#d3cec6] bg-[#f5f1ec] md:flex w-60 lg:w-64">
          <DashboardSidebar />
        </aside>

        {/* Mobile slide-over drawer */}
        <SheetContent
          side="left"
          showCloseButton={false}
          className="max-w-[calc(100vw-2rem)] min-h-0 overflow-hidden gap-0 bg-[#f5f1ec] p-0 border-r border-[#d3cec6] data-[side=left]:w-80 motion-reduce:transition-none"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar onClose={handleCloseMobileMenu} />
        </SheetContent>

        {/* Main application panel */}
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden bg-[#f5f1ec]">
          <header className="h-16 shrink-0 border-b border-[#d3cec6] bg-[#f5f1ec] z-10">
            <DashboardHeader />
          </header>
          <main
            id="dashboard-content"
            tabIndex={-1}
            data-lenis-prevent
            className="flex-1 overflow-y-auto overscroll-contain p-4 outline-none sm:p-6 lg:p-8 [scrollbar-width:thin]"
          >
            {children}
          </main>
        </div>
      </div>
    </Sheet>
  );
}

export default DashboardShell;
