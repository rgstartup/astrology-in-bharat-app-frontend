"use client";

import React, { memo, useCallback, useState, Fragment } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  X,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CalendarCheck,
  Coins,
  History,
  User,
  Settings,
} from "lucide-react";
import { cn } from "@/utils/cn";

// **Architectural Change:** Decouple data from component
// This enhances maintainability and scalability. Menu data can now be
// managed in a separate file (e.g., `src/config/menuItems.ts`).
// The menu items are no longer hard-coded within the component itself.
interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  submenu?: Omit<MenuItem, "submenu">[];
}

const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Appointment", href: "/dashboard/appointment", icon: CalendarCheck },
  {
    label: "Service & Pricing",
    href: "/dashboard/service-pricing",
    icon: Coins,
  },
  
  {
    label: "Clients History",
    href: "/dashboard/client-history",
    icon: History,
  },
  { label: "Earnings", href: "/dashboard/earnings", icon: Coins },
  {
    label: "Account",
    href: "#",
    icon: Settings,
    submenu: [
      {
        label: "Profile Management",
        href: "/dashboard/profilemanagement",
        icon: User,
      },
      { label: "Signout", href: "/", icon: X },
    ],
  },
];

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

// **Refactoring:** Created a sub-component for menu items.
// This improves reusability and readability by separating the rendering logic.
interface SidebarMenuItemProps {
  item: MenuItem;
  pathname: string;
  openSubmenu: string | null;
  onToggleSubmenu: (label: string) => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  pathname,
  openSubmenu,
  onToggleSubmenu,
}) => {
  const isSubmenuOpen = openSubmenu === item.label;
  const isActiveLink = pathname === item.href;

  // Accessibility and Semantic HTML:
  // Use `role="button"` for the submenu button.
  // The `aria-controls` and `aria-expanded` attributes are crucial for screen readers.
  // The `aria-current` attribute correctly indicates the active page.

  if (!item.submenu) {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
          isActiveLink
            ? "bg-yellow-800 text-white shadow-lg"
            : "text-white hover:bg-yellow-700"
        )}
        aria-current={isActiveLink ? "page" : undefined}
      >
        <item.icon className="w-5 h-5 flex-shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <Fragment>
      <button
        onClick={() => onToggleSubmenu(item.label)}
        className={cn(
          "w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between text-white hover:bg-yellow-700 transition-colors duration-200",
          isSubmenuOpen && "bg-yellow-700"
        )}
        aria-expanded={isSubmenuOpen}
        aria-controls={`submenu-${item.label.replace(/\s/g, "-").toLowerCase()}`}
      >
        <div className="flex items-center space-x-3">
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span>{item.label}</span>
        </div>
        {isSubmenuOpen ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>
      {isSubmenuOpen && (
        <div
          id={`submenu-${item.label.replace(/\s/g, "-").toLowerCase()}`}
          className="ml-6 mt-2 space-y-2"
          role="region"
        >
          {item.submenu.map((subItem) => {
            const isSubmenuActive = pathname === subItem.href;
            return (
              <Link
                key={subItem.label}
                href={subItem.href}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm text-yellow-100 hover:bg-yellow-600 hover:text-white transition-colors duration-200",
                  isSubmenuActive && "bg-yellow-600 text-white font-medium"
                )}
                aria-current={isSubmenuActive ? "page" : undefined}
              >
                {subItem.label}
              </Link>
            );
          })}
        </div>
      )}
    </Fragment>
  );
};

export const Sidebar: React.FC<SidebarProps> = memo(
  ({ isOpen, toggleSidebar }) => {
    // **State Management Improvement:** Initialize open submenu based on active path.
    // This ensures that the submenu is open on page load if a sub-link is active.
    const pathname = usePathname();
    const initialOpenSubmenu = menuItems.find(
      (item) => item.submenu && item.submenu.some((sub) => sub.href === pathname)
    )?.label || null;
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(
      initialOpenSubmenu
    );

    const handleToggleSubmenu = useCallback((label: string) => {
      setOpenSubmenu((prev) => (prev === label ? null : label));
    }, []);

    // **Accessibility & Semantics:**
    // Use an accessible name for the close button.
    // The main `<aside>` and `<nav>` elements already have good ARIA labels.

    return (
      <>
        {/* Mobile Overlay: */}
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
            "fixed left-0 top-0 h-full w-64 flex flex-col bg-yellow-600 text-white transition-transform duration-300 ease-in-out z-50 overflow-y-auto no-scrollbar shadow-xl shadow-gray-400",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0"
          )}
          aria-label="Sidebar navigation"
        >
          {/* Logo Section */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-r border-gray-200 flex-shrink-0">
            <img
              src="/images/logo.png"
              alt="Logo"
              className="rounded-2xl"
            />
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 hover:bg-yellow-700 rounded transition-colors duration-200 text-gray-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu */}
          <nav className="mt-8 px-4 flex-1" aria-label="Main navigation">
            {menuItems.map((item) => (
              <div key={item.label} className="mb-2">
                <SidebarMenuItem
                  item={item}
                  pathname={pathname}
                  openSubmenu={openSubmenu}
                  onToggleSubmenu={handleToggleSubmenu}
                />
              </div>
            ))}
          </nav>
        </aside>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";