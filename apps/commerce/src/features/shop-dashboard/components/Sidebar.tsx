"use client";

import React, { memo, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  HelpCircle,
  LogOut,
  CalendarCheck,
  IndianRupee,
  Clock,
  Wallet,
  X,
  Package,
  ShoppingBag,
  ShieldCheck,
  BarChart3
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "next/navigation";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = memo(({ isOpen, toggleSidebar }) => {
  const pathname = usePathname();

  const menuItems = useMemo(() => [
    { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { name: "My Wallet", icon: Wallet, href: "/wallet" },
    { name: "Orders", icon: ShoppingBag, href: "/orders" },
    { name: "Manage Products", icon: Package, href: "/products" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Profile", icon: ShieldCheck, href: "/profile" },
    { name: "Shop Settings", icon: Settings, href: "/settings" },
    { name: "Help Center", icon: HelpCircle, href: "/help" },
  ], []);

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/70 backdrop-blur-sm transition-opacity duration-300"
          onClick={toggleSidebar}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 h-full w-64 flex flex-col bg-[#301118] text-white transition-transform duration-300 ease-in-out z-50 overflow-hidden shadow-2xl",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:translate-x-0"
        )}
      >
        {/* Branded Logo Section (White Background) */}
        <div className="bg-white p-6 flex items-center justify-between border-b border-orange-50 sticky top-0 z-20">
          <Link href="/dashboard" className="group transition-transform hover:scale-105 duration-300 flex-1">
            <img 
              src="/images/web-logo.png" 
              alt="Astrology in Bharat" 
              className="h-auto max-h-[80px] w-auto object-contain mx-auto"
            />
          </Link>
          {/* Close button for mobile */}
          <button 
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-xl transition-colors text-gray-800 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Menu */}
        <div className="px-4 py-8 overflow-y-auto flex-1 no-scrollbar">
          <p className="text-[10px] text-white/30 font-black uppercase tracking-[0.2em] px-4 mb-6">
            Merchant Menu
          </p>
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    if (window.innerWidth < 1024 && isOpen) {
                      toggleSidebar();
                    }
                  }}
                  className={cn(
                    "group flex items-center px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-300",
                    isActive 
                      ? "bg-[#fd6410] text-white shadow-lg shadow-orange-900/40" 
                      : "text-white/80 hover:bg-[#fd6410] hover:text-white hover:shadow-lg hover:shadow-orange-900/40"
                  )}
                >
                  <div className="flex items-center space-x-4">
                    <item.icon className={cn("w-5 h-5 shrink-0", isActive ? "text-white" : "text-white/70 group-hover:text-white")} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/5 space-y-1 bg-[#250d12]/50">
            <button 
                onClick={async () => {
                    await useAuthStore.getState().logout();
                    window.location.href = "/login";
                }}
                className="w-full flex items-center space-x-4 px-4 py-3 text-sm font-semibold text-rose-400 hover:text-rose-300 hover:bg-white/5 rounded-xl mt-2 transition-colors"
            >
              <LogOut className="w-5 h-5 shrink-0" />
              <span>Logout</span>
            </button>
        </div>
      </aside>
    </>
  );
});

Sidebar.displayName = "Sidebar";
