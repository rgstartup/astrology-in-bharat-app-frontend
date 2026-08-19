"use client";
import React, { memo, useCallback, useState, Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/app/components/AdminGuard";
import { useAuthStore } from "@/store/useAuthStore";

import {
  X,
  ChevronDown,
  ChevronUp,
  LayoutDashboard,
  CalendarCheck,
  Tag,
  History,
  IndianRupee,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Tv,
  FileText,
  Wallet,
  RefreshCw,
  AlertCircle,
  Star,
  BarChart3,
  Ticket,
  User,
  Menu,
  Bell,
  Search,
  Package,
  ShoppingBag,
  Handshake,
  BookOpen,
  BadgeIndianRupee,
} from "lucide-react";
import { cn } from "@/utils/cn";
import { SearchInput, Avatar, NotificationBell } from "@repo/ui";
import { toast } from "react-toastify";
import adminData from "../../../public/data/admin_data.json";

interface MenuItem {
  label: string;
  href: string;
  icon: any; // Changed to any to handle mapped components
  permissionKey?: string | null;
  submenu?: Omit<MenuItem, "submenu">[];
}

const IconMap: Record<string, React.ElementType> = {
  LayoutDashboard,
  CalendarCheck,
  Tag,
  History,
  IndianRupee,
  Users,
  UserCheck,
  Settings,
  LogOut,
  Tv,
  FileText,
  Wallet,
  RefreshCw,
  AlertCircle,
  Star,
  BarChart3,
  Ticket,
  User,
  Menu,
  Bell,
  Search,
  Package,
  ShoppingBag,
  Handshake,
  BookOpen,
  BadgeIndianRupee,
};

const allMenuItems: MenuItem[] = adminData.menuItems.map((item: any) => ({
  ...item,
  icon: IconMap[item.icon] || User,
  submenu: item.submenu?.map((sub: any) => ({
    ...sub,
    icon: IconMap[sub.icon] || User,
  })),
}));

// User ke role/permissions ke hisab se menu filter karo
function filterMenuItems(items: MenuItem[], userRoles?: string[], permissions?: string[] | null): MenuItem[] {
  const isSuperAdmin = userRoles?.some(r => ['admin', 'super_admin'].includes(r.toLowerCase()));

  return items
    .filter(item => {
      // null permissionKey = sabko dikhao
      if (!item.permissionKey) return true;
      // super_admin_only = sirf SUPER_ADMIN/ADMIN ko dikhao
      if (item.permissionKey === 'super_admin_only') return isSuperAdmin;
      // SUPER_ADMIN ko sab dikhao
      if (isSuperAdmin) return true;
      // SUB_ADMIN ke liye: unki permission list mein check karo
      return permissions?.includes(item.permissionKey) ?? false;
    })
    .map(item => ({
      ...item,
      submenu: item.submenu
        ? filterMenuItems(item.submenu as MenuItem[], userRoles, permissions)
        : undefined,
    }))
    // Empty submenus wale parent items ko hatao (agar submenu tha but sab filter ho gaya)
    .filter(item => !item.submenu || item.submenu.length > 0 || item.href !== '#');
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
  closeSidebar?: () => void;
}

const SidebarMenuItem: React.FC<SidebarMenuItemProps> = ({
  item,
  pathname,
  openSubmenu,
  onToggleSubmenu,
  closeSidebar,
}) => {
  const isSubmenuOpen = openSubmenu === item.label;
  const isActiveLink = pathname === item.href;

  const { logout, user } = useAuthStore();
  const router = useRouter();

  if (!item.submenu) {
    if (item.label === "Signout") {
      return (
        <button
          onClick={() => {
            if (closeSidebar) closeSidebar();
            logout();
            toast.success("Signed out successfully");
            router.push("/");
          }}
          className={cn(
            "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-left",
            isActiveLink
              ? "bg-primary-hover text-white shadow-lg"
              : "text-white hover:bg-primary-hover"
          )}
        >
          <item.icon className="w-5 h-5 flex-shrink-0" />
          <span>{item.label}</span>
        </button>
      );
    }

    return (
      <Link
        href={item.href}
        onClick={() => closeSidebar && closeSidebar()}
        className={cn(
          "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200",
          isActiveLink
            ? "bg-primary-hover text-white shadow-lg"
            : "text-white hover:bg-primary-hover"
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
          "w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between text-white hover:bg-primary-hover transition-colors duration-200",
          isSubmenuOpen && "bg-primary-hover"
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

            if (subItem.label === "Signout") {
              return (
                <button
                  key={subItem.label}
                  onClick={() => {
                    if (closeSidebar) closeSidebar();
                    logout();
                    toast.success("Signed out successfully");
                    router.push("/");
                  }}
                  className={cn(
                    "block w-full text-left px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-primary-hover hover:text-white transition-colors duration-200",
                    isSubmenuActive && "bg-primary-hover text-white font-medium"
                  )}
                >
                  {subItem.label}
                </button>
              );
            }

            return (
              <Link
                key={subItem.label}
                href={subItem.href}
                onClick={() => closeSidebar && closeSidebar()}
                className={cn(
                  "block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-primary-hover hover:text-white transition-colors duration-200",
                  isSubmenuActive && "bg-primary-hover text-white font-medium"
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

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  closeSidebar?: () => void;
}

const Sidebar: React.FC<SidebarProps> = memo(
  ({ isOpen, toggleSidebar, closeSidebar }) => {
    const pathname = usePathname();
    const { user } = useAuthStore();

    // User ke role aur permissions ke hisab se menu filter karo
    const menuItems = filterMenuItems(
      allMenuItems,
      user?.roles,
      user?.admin_permissions,
    );

    const initialOpenSubmenu = menuItems.find(
      (item) => item.submenu && item.submenu.some((sub) => sub.href === pathname)
    )?.label || null;
    const [openSubmenu, setOpenSubmenu] = useState<string | null>(
      initialOpenSubmenu
    );

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
            "fixed left-0 top-0 h-full w-64 flex flex-col bg-[#301118] text-white transition-transform duration-300 ease-in-out z-50 shadow-xl shadow-gray-400",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0"
          )}
          aria-label="Sidebar navigation"
        >
          <div className="flex items-center justify-between p-6 bg-white border-b border-orange-100 shrink-0 sticky top-0 z-20">
            <img
              src="/images/web-logo.png"
              alt="Logo"
              className="w-full h-auto object-contain max-w-[200px]"
            />
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 hover:bg-gray-100 rounded transition-colors duration-200 text-gray-800"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Menu - Scrollable */}
          <nav className="mt-8 px-4 flex-1 overflow-y-auto pb-6" aria-label="Main navigation">
            {menuItems.map((item) => (
              <div key={item.label} className="mb-2">
                <SidebarMenuItem
                  item={item}
                  pathname={pathname}
                  openSubmenu={openSubmenu}
                  onToggleSubmenu={handleToggleSubmenu}
                  closeSidebar={closeSidebar}
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

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [globalSearch, setGlobalSearch] = useState("");
  const pathname = usePathname();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const closeSidebar = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  // ✅ FIX: Check if it's an admin route (including login/register which shouldn't show sidebar)
  const isAdminRoute = pathname?.startsWith("/admin");
  const isLoginOrRegister = pathname === "/admin/login" || pathname === "/admin/register" || pathname === "/admin";

  // ✅ Show sidebar only for admin routes (except login/register)
  const shouldShowSidebar = isAdminRoute && !isLoginOrRegister;

  // ✅ REMOVED: The problematic condition that was preventing 404 from rendering
  // Now all children will render with appropriate layout

  return (
    <AdminGuard>
      <div
        className="flex min-h-screen bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/back-image.webp')" }}
      >
        {/* Sidebar Component - Only show when needed */}
        {shouldShowSidebar && (
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} closeSidebar={closeSidebar} />
        )}

        {/* Main Content */}
        <div className={cn("flex-1 min-w-0", shouldShowSidebar && "lg:ml-64")}>
          {/* Top Header - Only show when sidebar is visible */}
          {shouldShowSidebar && (
            <header className="bg-white px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 sm:space-x-4">
                  <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    aria-label="Toggle sidebar"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <h1 className="text-lg sm:text-2xl font-semibold text-gray-800 truncate max-w-[150px] sm:max-w-none">
                    {(() => {
                      const found = allMenuItems.find((item) => item.href === pathname);
                      if (found) return found.label;
                      for (const item of allMenuItems) {
                        if (item.submenu) {
                          const subFound = item.submenu.find((sub) => sub.href === pathname);
                          if (subFound) return subFound.label;
                        }
                      }
                      return "Dashboard";
                    })()}
                  </h1>
                </div>

                {/* Profile */}
                <div className="flex items-center gap-3">
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-bold text-gray-800">{user?.name || "Admin"}</p>
                    <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest">Administrator</p>
                  </div>
                  <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                    <Avatar
                      src={user?.avatar || user?.profile_picture || ""}
                      alt="Profile"
                      className="cursor-pointer hover:ring-2 hover:ring-primary transition-all"
                    />
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Main Content */}
          <main className={cn(shouldShowSidebar && "p-4 sm:p-6")}>{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}



