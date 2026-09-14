"use client";

import React, { useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

interface DashboardShellProps {
  children: React.ReactNode;
}

export const DashboardShell: React.FC<DashboardShellProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#FFFDF9] flex flex-col md:flex-row antialiased selection:bg-[#ff6b00]/20 selection:text-[#301118]">
      {/* Desktop Fixed Sidebar */}
      <aside className="hidden md:flex md:w-64 lg:w-72 flex-col fixed inset-y-0 left-0 z-30 border-r border-orange-100/80 bg-white shadow-xs">
        <DashboardSidebar />
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Slide-out Drawer */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white transform transition-transform duration-300 ease-in-out md:hidden shadow-2xl flex flex-col ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <DashboardSidebar onClose={() => setMobileMenuOpen(false)} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:pl-64 lg:pl-72 flex flex-col min-w-0">
        {/* Sticky Dashboard Header */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-orange-100/80">
          <DashboardHeader onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        </header>

        {/* Page Content Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
