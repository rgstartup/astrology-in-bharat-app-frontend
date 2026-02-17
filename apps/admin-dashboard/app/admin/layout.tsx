"use client";
import React, { memo, useCallback, useState, Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import AdminGuard from "@/app/components/AdminGuard";
import { useAuthStore } from "@/src/store/useAuthStore";

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
} from "lucide-react";
import { cn } from "@/utils/cn";
import { SearchInput, Avatar, NotificationBell } from "@repo/ui";
import { toast } from "react-toastify";
import adminData from "../../public/data/admin_data.json";

interface MenuItem {
  label: string;
  href: string;
  icon: any; // Changed to any to handle mapped components
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
};

const menuItems: MenuItem[] = adminData.menuItems.map((item: any) => ({
  ...item,
  icon: IconMap[item.icon] || User,
  submenu: item.submenu?.map((sub: any) => ({
    ...sub,
    icon: IconMap[sub.icon] || User,
  })),
}));

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

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

  const { logout, user } = useAuthStore();
  const router = useRouter();

  if (!item.submenu) {
    if (item.label === "Signout") {
      return (
        <button
          onClick={() => {
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

const Sidebar: React.FC<SidebarProps> = memo(
  ({ isOpen, toggleSidebar }) => {
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
            "fixed left-0 top-0 h-full w-64 flex flex-col bg-primary text-white transition-transform duration-300 ease-in-out z-50 shadow-xl shadow-gray-400",
            isOpen ? "translate-x-0" : "-translate-x-full",
            "lg:translate-x-0"
          )}
          aria-label="Sidebar navigation"
        >
          {/* Logo Section - Fixed */}
          <div className="flex items-center justify-between p-6 bg-gray-50 border-r border-gray-200 flex-shrink-0"
            style={{
              backgroundImage: "url('/images/back-image.webp')",
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundRepeat: "no-repeat",
            }}
          >

            <img
              src="/images/logo.png"
              alt="Logo"
              className="rounded-2xl"
            />
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-1 hover:bg-primary-hover rounded transition-colors duration-200 text-gray-800"
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
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
        )}

        {/* Main Content */}
        <div className={cn("flex-1", shouldShowSidebar && "lg:ml-64")}>
          {/* Top Header - Only show when sidebar is visible */}
          {shouldShowSidebar && (
            <header className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-30 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <button
                    onClick={toggleSidebar}
                    className="lg:hidden text-gray-800 hover:bg-gray-100 p-2 rounded-lg transition-colors"
                    aria-label="Toggle sidebar"
                  >
                    <Menu className="w-6 h-6" />
                  </button>
                  <h1 className="text-2xl font-semibold text-gray-800">
                    {menuItems.find((item) => item.href === pathname)?.label ||
                      "Dashboard"}
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
          <main className={cn(shouldShowSidebar && "p-6")}>{children}</main>
        </div>
      </div>
    </AdminGuard>
  );
}



