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
} from "lucide-react";


// Utility function for className merging
function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ');
}

interface MenuItem {
  label: string;
  href: string;
  icon: React.ElementType;  // ✅ Change from string to React.ElementType
  submenu?: Omit<MenuItem, "submenu">[];
}
const menuItems: MenuItem[] = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { label: "Appointments", href: "/admin/appointments", icon: CalendarCheck },
  { label: "User Management", href: "/admin/users", icon: Users },
  { label: "Expert Management", href: "/admin/experts", icon: UserCheck },
  { label: "Expert KYC Review", href: "/admin/kyc", icon: FileText },
  { label: "Service & Pricing", href: "/admin/pricing", icon: Tag },
  { label: "Promo Configuration", href: "/admin/promos", icon: Ticket },
  { label: "Coupons/Offers", href: "/admin/coupons", icon: Tag },
  { label: "Live Sessions Monitor", href: "/admin/live-sessions", icon: Tv },
  { label: "Session Logs", href: "/admin/session-logs", icon: History },
  { label: "Payout Requests", href: "/admin/payouts", icon: Wallet },
  { label: "Refund Management", href: "/admin/refunds", icon: RefreshCw },
  { label: "Dispute Resolution", href: "/admin/disputes", icon: AlertCircle },
  { label: "Reviews Moderation", href: "/admin/reviews", icon: Star },
  { label: "Analytics Dashboard", href: "/admin/analytics", icon: BarChart3 },
  { label: "Earnings", href: "/admin/earnings", icon: IndianRupee },
  {
    label: "Account",
    href: "#",
    icon: Settings,
    submenu: [
      {
        label: "Profile Management",
        href: "/admin/profile",
        icon: User,
      },
      { label: "Signout", href: "/admin", icon: LogOut },
    ],
  },
];
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
        <i className={`bi ${item.icon} w-5 h-5 flex-shrink-0`}></i>
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
          <i className={`bi ${item.icon} w-5 h-5 flex-shrink-0`}></i>
          <span>{item.label}</span>
        </div>
        <i className={`bi bi-chevron-${isSubmenuOpen ? "up" : "down"} w-4 h-4`}></i>
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
    "fixed left-0 top-0 h-full w-64 flex flex-col bg-yellow-600 text-white transition-transform duration-300 ease-in-out z-50 shadow-xl shadow-gray-400",
    isOpen ? "translate-x-0" : "-translate-x-full",
    "lg:translate-x-0"
  )}
  aria-label="Sidebar navigation"
>
  {/* Logo Section - Fixed */}
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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const adminRoutes = ["/admin/dashboard", "/admin/appointment", "/admin/pricing", "/admin/clients", "/admin/earnings"];
  const shouldShowSidebar = adminRoutes.some(route => pathname?.startsWith(route));

  if (!shouldShowSidebar) {
    return <>{children}</>;
  }

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
      />
      
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Component */}
        <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 lg:ml-64">
          {/* Top Header */}
          <header className="bg-white px-6 py-4 border-b border-gray-200 sticky top-0 z-30 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleSidebar}
                  className="lg:hidden text-gray-800 text-2xl"
                  aria-label="Toggle sidebar"
                >
                  <i className="bi bi-list"></i>
                </button>
                <h1 className="text-2xl font-semibold text-gray-800">
                  {menuItems.find(item => item.href === pathname)?.label || "Dashboard"}
                </h1>
              </div>

              <div className="flex items-center space-x-4">
                {/* Search */}
                <div className="hidden md:flex items-center relative">
                  <i className="bi bi-search absolute left-3 text-gray-400"></i>
                  <input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                  />
                </div>

              

                {/* Notifications */}
                <button className="relative text-gray-600 hover:text-gray-800">
                  <i className="bi bi-bell text-xl"></i>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                </button>

                {/* Profile */}
                <img
                  src="https://i.pravatar.cc/150?img=12"
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-yellow-500"
                />
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}