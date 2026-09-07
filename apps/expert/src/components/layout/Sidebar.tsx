"use client";

import React, { memo, useCallback, useState, Fragment, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
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
  LogOut,
  Wallet,
  Bell,
} from "lucide-react";
import { cn } from "@/lib/cn";
import { useAuthStore } from "@/store/useAuthStore";
import expertMenu from "../../../public/data/expert_menu.json";

const IconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  CalendarCheck,
  Coins,
  History,
  User,
  Settings,
  LogOut,
  Wallet,
  Bell,
};

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;
  submenu?: Omit<MenuItem, "submenu">[];
  onClick?: () => void;
}

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

interface SidebarMenuItemProps {
  item: MenuItem;
  pathname: string;
  openSubmenu: string | null;
  onToggleSubmenu: (label: string) => void;
  onNavigate: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  pathname,
  openSubmenu,
  onToggleSubmenu,
  onNavigate,
}) => {
  const isSubmenuOpen = openSubmenu === item.label;
  const isActiveLink = pathname === item.href;

  if (item.onClick) {
    return (
      <button
        onClick={() => { item.onClick?.(); onNavigate(); }}
        className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-white hover:!bg-[#fd6410] mt-auto"
      >
        <item.icon className="w-5 h-5 shrink-0" />
        <span>{item.label}</span>
      </button>
    );
  }

  if (!item.submenu) {
    return (
      <Link
        href={item.href}
        onClick={onNavigate}
        className={cn(
          "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200",
          isActiveLink
            ? "bg-[#fd6410] text-white shadow-lg"
            : "text-white hover:!bg-[#fd6410]"
        )}
        aria-current={isActiveLink ? "page" : undefined}
      >
        <item.icon className="w-5 h-5 shrink-0" />
        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <Fragment>
      <button
        onClick={() => onToggleSubmenu(item.label)}
        className={cn(
          "w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between text-white hover:!bg-[#fd6410] transition-all duration-200",
          isSubmenuOpen && "bg-[#fd6410]"
        )}
        aria-expanded={isSubmenuOpen}
        aria-controls={`submenu-${item.label.replace(/\s/g, "-").toLowerCase()}`}
      >
        <div className="flex items-center space-x-3">
          <item.icon className="w-5 h-5 shrink-0" />
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
            if (subItem.onClick) {
              return (
                <button
                  key={subItem.label}
                  onClick={() => { subItem.onClick?.(); onNavigate(); }}
                  className="block w-full text-left px-3 py-2 rounded-lg text-sm text-white hover:!bg-[#fd6410] transition-all duration-200"
                >
                  {subItem.label}
                </button>
              );
            }
            return (
              <Link
                key={subItem.label}
                href={subItem.href}
                onClick={onNavigate}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm text-white hover:!bg-[#fd6410] transition-all duration-200",
                  isSubmenuActive && "bg-[#fd6410] text-white font-medium"
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
    const pathname = usePathname();
    const router = useRouter();
    const { logout, user } = useAuthStore();

    const handleLogout = useCallback(async () => {
      if (user?.isAvailable) {
        const actualUserId = user?.userId || user?.id;
        if (actualUserId) {
          const { socket } = await import("@/lib/socket");
          socket.emit("expert_offline", { userId: String(actualUserId) });
          // Small delay to ensure the packet is sent before session is destroyed
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      await logout();
      router.push('/');
    }, [logout, router, user]);

    const menuItems = useMemo((): MenuItem[] => {
      return expertMenu.menuItems.map((item: any) => ({
        ...item,
        icon: IconMap[item.icon] || User,
        onClick: item.isLogout ? handleLogout : undefined,
        submenu: item.submenu?.map((sub: any) => ({
          ...sub,
          icon: IconMap[sub.icon] || User,
          onClick: sub.isLogout ? handleLogout : undefined,
        })),
      }));
    }, [handleLogout]);

    const initialOpenSubmenu = useMemo(() => {
      return menuItems.find(
        (item) => item.submenu && item.submenu.some((sub) => sub.href === pathname)
      )?.label || null;
    }, [menuItems, pathname]);

    const [openSubmenu, setOpenSubmenu] = useState<string | null>(
      initialOpenSubmenu
    );

    const handleToggleSubmenu = useCallback((label: string) => {
      setOpenSubmenu((prev) => (prev === label ? null : label));
    }, []);

    const kycStatus = (user?.kycStatus || "").toLowerCase();

    return (
      <>
        {isOpen && (
          <div
            className="fixed inset-0 z-50 lg:hidden bg-black/70 transition-opacity duration-300 ease-in-out"
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}

        <aside
          className={cn(
            "fixed left-0 top-0 h-full w-64 flex flex-col bg-[#301118] text-white transition-transform duration-300 ease-in-out z-50 overflow-y-auto no-scrollbar shadow-xl",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0"
          )}
          aria-label="Sidebar navigation"
        >
          <div className="flex items-center justify-between p-6 bg-white border-b border-orange-100 shrink-0 sticky top-0 z-20">
            <img
              src="/images/web-logo.png"
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

          <nav className="mt-8 px-4 flex-1" aria-label="Main navigation">
            {menuItems.map((item) => (
              <div key={item.label} className="mb-2">
                <SidebarMenuItem
                  item={item}
                  pathname={pathname}
                  openSubmenu={openSubmenu}
                  onToggleSubmenu={handleToggleSubmenu}
                  onNavigate={() => {
                    if (isOpen) toggleSidebar();
                  }}
                />
              </div>
            ))}
          </nav>

          {/* Verification Status Banner (Sidebar Bottom) */}
          {kycStatus === 'rejected' && (
            <div className="mx-4 mb-8 bg-black/20 rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-rose-300 mb-2">
                <X className="w-4 h-4 shrink-0" />
                <span className="text-[10px] font-black uppercase tracking-widest">Profile Rejected</span>
              </div>
              <p className="text-[10px] text-white/70 line-clamp-2 mb-3 italic">
                "{user?.rejectionReason || user?.profile_expert?.rejectionReason || "Check profile"}"
              </p>
              <Link
                href="/dashboard/profilemanagement"
                className="block w-full py-2 bg-rose-500 text-white text-center rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all shadow-lg shadow-rose-900/40"
              >
                Edit profile
              </Link>
            </div>
          )}
        </aside>
      </>
    );
  }
);

Sidebar.displayName = "Sidebar";

Sidebar.displayName = "Sidebar";
