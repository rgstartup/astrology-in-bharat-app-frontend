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
      <div className="flex min-h-dvh bg-background text-foreground antialiased">
        <a
          href="#dashboard-content"
          className="fixed -top-96 left-4 z-50 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-md transition-[top] duration-150 focus:top-4 focus:outline-2 focus:outline-offset-2 focus:outline-[#ff6b00]"
        >
          Skip to content
        </a>
        <aside className="fixed inset-y-0 left-0 z-40 hidden h-dvh min-h-0 overflow-hidden flex-col border-r border-border bg-background md:flex w-64 lg:w-68">
          <DashboardSidebar />
        </aside>
        <SheetContent
          side="left"
          showCloseButton={false}
          className="max-w-[calc(100vw-2rem)] min-h-0 overflow-hidden gap-0 data-[side=left]:w-80 motion-reduce:transition-none"
          aria-describedby={undefined}
        >
          <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
          <DashboardSidebar onClose={() => setMobileMenuOpen(false)} />
        </SheetContent>
        <div className="flex min-w-0 flex-1 flex-col md:pl-64 lg:pl-68">
          <header className="sticky top-0 z-20 h-18 shrink-0 border-b border-border bg-background">
            <DashboardHeader />
          </header>
          <main
            id="dashboard-content"
            tabIndex={-1}
            className="mx-auto w-full max-w-7xl flex-1 scroll-mt-24 p-4 outline-none sm:p-6 lg:p-8"
          >
            {children}
          </main>
        </div>
      </div>
    </Sheet>
  );
};

export default DashboardShell;
