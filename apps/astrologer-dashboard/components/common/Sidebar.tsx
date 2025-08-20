"use client";

import React, { memo, useCallback, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { X, ChevronDown, ChevronUp, LayoutDashboard, CalendarCheck, Coins, History, User, Settings } from "lucide-react";
import { cn } from "@/utils/cn";

// Stricter TypeScript interface for menu items
interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  submenu?: Omit<MenuItem, "submenu">[]; // Submenu items cannot have nested submenus
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// Menu items configuration
const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Appointment", href: "/dashboard/appointment", icon: CalendarCheck },
  { label: "Service & Pricing", href: "/dashboard/service-pricing", icon: Coins },
  { label: "Clients History", href: "/dashboard/client-history", icon: History },
  { label: "Earnings", href: "/dashboard/earnings", icon: Coins },
  {
    label: "Account",
    href: "#",
    icon: Settings,
    submenu: [
      { label: "Profile Management", href: "/dashboard/profilemanagement", icon: User },
      { label: "Signout", href: "/", icon: X },
    ],
  },
];

// Memoized Sidebar component to prevent unnecessary re-renders
export const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, toggleSidebar }) => {
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const pathname = usePathname();

  // Memoized submenu toggle handler
  const handleToggleSubmenu = useCallback((label: string) => {
    setOpenSubmenu((prev) => (prev === label ? null : label));
  }, []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-black/70 transition-opacity duration-300 ease-in-out"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 flex flex-col bg-yellow-600 text-white transition-transform duration-300 ease-in-out z-50 overflow-y-auto no-scrollbar",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
        aria-label="Sidebar navigation"
      >
        {/* Logo Section */}
        <div className="flex items-center justify-between p-6 border-b border-yellow-700 flex-shrink-0">
          <img src="/images/new-logo.png" alt="Logo" className="rounded-2xl p-2 " />
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-1 hover:bg-yellow-700 rounded transition-colors duration-200"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-4 px-4 flex-1" aria-label="Main navigation">
          {menuItems.map((item, index) => (
            <div key={item.label} className="mb-2">
              {!item.submenu ? (
                // Single Link Item
                <Link
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
                    pathname === item.href
                      ? "bg-yellow-800 text-white shadow-lg"
                      : "text-white hover:bg-yellow-700"
                  )}
                  aria-current={pathname === item.href ? "page" : undefined}
                >
                  <item.icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </Link>
              ) : (
                // Dropdown Menu Item
                <>
                  <button
                    onClick={() => handleToggleSubmenu(item.label)}
                    className={cn(
                      "w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between text-white hover:bg-yellow-700 transition-colors duration-200",
                      openSubmenu === item.label && "bg-yellow-700"
                    )}
                    aria-expanded={openSubmenu === item.label}
                    aria-controls={`submenu-${index}`}
                  >
                    <div className="flex items-center space-x-3">
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      <span>{item.label}</span>
                    </div>
                    {openSubmenu === item.label ? (
                      <ChevronUp className="w-4 h-4" />
                    ) : (
                      <ChevronDown className="w-4 h-4" />
                    )}
                  </button>
                  {openSubmenu === item.label && (
                    <div
                      id={`submenu-${index}`}
                      className="ml-6 mt-2 space-y-2 transition-all duration-300 ease-in-out"
                      role="region"
                    >
                      {item.submenu.map((subItem, subIndex) => (
                        <Link
                          key={subItem.label}
                          href={subItem.href}
                          className={cn(
                            "block px-3 py-2 rounded-lg text-sm text-yellow-100 hover:bg-yellow-600 hover:text-white transition-colors duration-200",
                            pathname === subItem.href && "bg-yellow-600 text-white font-medium"
                          )}
                          aria-current={pathname === subItem.href ? "page" : undefined}
                        >
                          {subItem.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
});
