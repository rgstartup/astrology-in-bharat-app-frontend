"use client";
import React, { memo, useCallback, useState, Fragment } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useAgentAuthStore } from "@/src/store/useAgentAuthStore";
import { toast } from "react-toastify";
import { cn } from "@/src/lib/cn";
import { Avatar } from "@repo/ui";

import {
    X,
    ChevronDown,
    ChevronUp,
    LayoutDashboard,
    Star,
    Building2,
    ShoppingBag,
    BadgeIndianRupee,
    User,
    UserPlus,
    LogOut,
    Menu,
    Handshake,
} from "lucide-react";

// ── Menu config ─────────────────────────────────────────────
interface MenuItem {
    label: string;
    href: string;
    icon: React.ElementType;
    submenu?: Omit<MenuItem, "submenu">[];
}

const MENU_ITEMS: MenuItem[] = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "My Profile", href: "/dashboard/profile", icon: User },
    { label: "Register User", href: "/dashboard/register-user", icon: UserPlus },
    { label: "Astrologers", href: "/dashboard/astrologers", icon: Star },
    { label: "Mandirs", href: "/dashboard/mandirs", icon: Building2 },
    { label: "Puja Shops", href: "/dashboard/puja-shops", icon: ShoppingBag },
    { label: "Commissions", href: "/dashboard/commissions", icon: BadgeIndianRupee },
    { label: "Signout", href: "#", icon: LogOut },
];

// ── SidebarMenuItem — exact same pattern as admin-dashboard ──
const SidebarMenuItem: React.FC<{
    item: MenuItem;
    pathname: string;
    openSubmenu: string | null;
    onToggleSubmenu: (label: string) => void;
}> = ({ item, pathname, openSubmenu, onToggleSubmenu }) => {
    const isSubmenuOpen = openSubmenu === item.label;
    const isActiveLink = pathname === item.href;
    const { logout } = useAgentAuthStore();
    const router = useRouter();

    // Signout
    if (!item.submenu && item.label === "Signout") {
        return (
            <button
                onClick={async () => {
                    // 1. Clear HttpOnly cookies server-side
                    const { agentLogoutAction } = await import("@/src/actions/auth");
                    await agentLogoutAction();
                    // 2. Clear Zustand store
                    logout();
                    toast.success("Signed out successfully");
                    // 3. Full reload so server sees cleared cookies
                    window.location.href = "/";
                }}
                className={cn(
                    "flex items-center space-x-3 w-full px-4 py-3 rounded-lg text-sm font-medium transition-colors duration-200 text-left",
                    "text-white hover:bg-primary-hover"
                )}
            >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
            </button>
        );
    }

    // Plain link
    if (!item.submenu) {
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

    // Submenu
    return (
        <Fragment>
            <button
                onClick={() => onToggleSubmenu(item.label)}
                className={cn(
                    "w-full px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between text-white hover:bg-primary-hover transition-colors duration-200",
                    isSubmenuOpen && "bg-primary-hover"
                )}
                aria-expanded={isSubmenuOpen}
            >
                <div className="flex items-center space-x-3">
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span>{item.label}</span>
                </div>
                {isSubmenuOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {isSubmenuOpen && (
                <div className="ml-6 mt-2 space-y-2">
                    {item.submenu!.map((sub) => (
                        <Link
                            key={sub.label}
                            href={sub.href}
                            className={cn(
                                "block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-primary-hover hover:text-white transition-colors duration-200",
                                pathname === sub.href && "bg-primary-hover text-white font-medium"
                            )}
                            aria-current={pathname === sub.href ? "page" : undefined}
                        >
                            {sub.label}
                        </Link>
                    ))}
                </div>
            )}
        </Fragment>
    );
};

// ── Sidebar — exact same structure as admin-dashboard ────────
const Sidebar: React.FC<{ isOpen: boolean; toggleSidebar: () => void }> = memo(
    ({ isOpen, toggleSidebar }) => {
        const pathname = usePathname();
        const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
        const handleToggleSubmenu = useCallback(
            (label: string) => setOpenSubmenu((prev) => (prev === label ? null : label)),
            []
        );

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
                    {/* Premium Logo Section */}
                    <div
                        className="relative flex flex-col p-6 flex-shrink-0 border-b border-white/10 overflow-hidden"
                        style={{
                            backgroundImage: "url('/images/back-image.webp')",
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    >
                        {/* Subtle Dark Overlay for better text contrast */}
                        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

                        <div className="relative z-10 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                {/* Larger flipped Baba Ji with premium glow */}
                                <div className="relative">
                                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl rounded-full animate-pulse" />
                                    <img
                                        src="/images/Astrologer.png"
                                        alt="AstrologyInBharat"
                                        className="w-16 h-16 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
                                        style={{ transform: "scaleX(-1)" }}
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <div className="leading-none mb-1">
                                        <h2 className="text-white text-lg font-black tracking-tighter drop-shadow-md">
                                            ASTROLOGY
                                        </h2>
                                        <p className="text-white/90 text-[11px] font-bold tracking-[0.2em] -mt-1 drop-shadow-sm uppercase">
                                            IN BHARAT
                                        </p>
                                    </div>

                                    {/* Sleek Pill Badge */}
                                    <div className="mt-1 flex">
                                        <span className="bg-gradient-to-r from-orange-600 to-yellow-500 text-white text-[10px] font-black px-3 py-1 rounded-full shadow-lg border border-white/20 uppercase tracking-widest flex items-center gap-1">
                                            <div className="w-1 h-1 bg-white rounded-full animate-ping" />
                                            Agent
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={toggleSidebar}
                                className="lg:hidden p-2 hover:bg-white/10 rounded-full transition-all text-white"
                                aria-label="Close sidebar"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation — Scrollable */}
                    <nav className="mt-8 px-4 flex-1 overflow-y-auto pb-6" aria-label="Main navigation">
                        {MENU_ITEMS.map((item) => (
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

// ── Main Layout ──────────────────────────────────────────────
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { agent } = useAgentAuthStore();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();
    const toggleSidebar = useCallback(() => setSidebarOpen((p) => !p), []);
    const currentPage = MENU_ITEMS.find((m) => m.href === pathname)?.label ?? "Dashboard";

    return (
        <div
            className="flex min-h-screen bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/images/back-image.webp')" }}
        >
            <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />

            {/* Main Content */}
            <div className="flex-1 lg:ml-64">
                {/* Header — same as admin */}
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
                            <h1 className="text-2xl font-semibold text-gray-800">{currentPage}</h1>
                        </div>

                        {/* Agent info — right side (using @repo/ui Avatar) */}
                        <div className="flex items-center gap-3">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-gray-800">{agent?.name ?? "Agent"}</p>
                                <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest flex items-center gap-1 justify-end">
                                    <Handshake className="w-3 h-3 text-primary-hover" />
                                    {agent?.agent_id ?? "Field Agent"}
                                </p>
                            </div>
                            {/* @repo/ui Avatar component */}
                            <Avatar
                                src={agent?.avatar ?? null}
                                alt={agent?.name ?? "Agent"}
                                size="md"
                                className="cursor-pointer hover:ring-2 hover:ring-primary-hover transition-all border-2 border-primary/10"
                            />
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="p-6">{children}</main>
            </div>
        </div>
    );
}
