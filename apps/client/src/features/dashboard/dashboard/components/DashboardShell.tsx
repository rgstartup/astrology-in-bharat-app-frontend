"use client";

import React, { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 768px)");
    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };
    desktop.addEventListener("change", closeOnDesktop);
    return () => desktop.removeEventListener("change", closeOnDesktop);
  }, []);

  return (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <div className="flex h-dvh min-h-0 w-full overflow-hidden bg-[#241913] text-[#2d2118] antialiased md:p-3 lg:p-3.5 md:gap-3 lg:gap-3.5">
        <a
          href="#dashboard-content"
          className="fixed -top-96 left-4 z-50 rounded-full bg-[#1b120d] px-4 py-2 text-xs font-semibold text-[#faedd9] shadow-md transition-[top] duration-150 focus:top-4 focus:outline-2 focus:outline-offset-2 focus:outline-[#f59e0b]"
        >
          Skip to content
        </a>
        <aside className="hidden h-full min-h-0 shrink-0 flex-col overflow-hidden bg-transparent md:flex w-60 lg:w-64">
          <DashboardSidebar />
        </aside>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="max-w-[calc(100vw-2rem)] min-h-0 overflow-hidden gap-0 bg-[#241913] p-0 border-r border-[#3d2a20] data-[side=left]:w-80 motion-reduce:transition-none"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
        <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-none border-0 bg-[#fcf9f2] md:rounded-2xl md:border md:border-[#e3d7c3] md:shadow-[0_8px_30px_rgb(0,0,0,0.18)]">
          <header className="h-16 shrink-0 border-b border-[#ebdcc7] bg-[#fcf9f2]/95 backdrop-blur-xs">
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
};

export default DashboardShell;
