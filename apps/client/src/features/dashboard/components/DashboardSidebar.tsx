"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Compass, Sparkles, HelpCircle, ChevronDown, X } from "lucide-react";
import Image from "next/image";

import {
  ASTROLOGY_SUB_LINKS,
  MAIN_SERVICES_NAV,
  ACCOUNT_NAV_ITEMS,
} from "../data/navigation.data";

export interface DashboardSidebarProps {
  onClose?: () => void;
}

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [astroExpanded, setAstroExpanded] = useState(true);

  const isActive = (path: string) => {
    if (path === PATHS.DASHBOARD) {
      return pathname === "/dashboard";
    }
    return pathname.startsWith(path);
  };

  const astrologySubLinks = ASTROLOGY_SUB_LINKS;
  const mainNavItems = MAIN_SERVICES_NAV;
  const accountNavItems = ACCOUNT_NAV_ITEMS;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Sidebar Brand Header */}
      <div className="h-16 px-5 flex items-center justify-between border-b border-orange-100/80 shrink-0">
        <Link
          href={PATHS.DASHBOARD}
          onClick={onClose}
          className="flex items-center gap-3 no-underline group"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#301118] to-[#4a1824] flex items-center justify-center text-white shadow-xs p-1.5">
            <Image
              src="/icon.png"
              alt="AIB"
              width={28}
              height={28}
              className="object-contain"
              priority
            />
          </div>
          <div>
            <span className="font-outfit font-black text-sm text-[#301118] tracking-tight block leading-tight">
              Astrology In Bharat
            </span>
            <span className="text-[10px] font-bold text-[#ff6b00] uppercase tracking-wider block">
              Client Sanctuary
            </span>
          </div>
        </Link>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 md:hidden"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Navigation Links Scrollable List */}
      <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-6">
        {/* Top Level: Main Dashboard */}
        <div>
          <Link
            href={PATHS.DASHBOARD}
            onClick={onClose}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl font-bold text-xs tracking-wide transition-all no-underline ${
              isActive(PATHS.DASHBOARD)
                ? "bg-[#ff6b00] text-white shadow-xs shadow-[#ff6b00]/25"
                : "text-slate-700 hover:bg-orange-50/60 hover:text-[#ff6b00]"
            }`}
          >
            <Compass className="w-4 h-4 shrink-0" />
            <span>Overview</span>
          </Link>
        </div>

        {/* Group: My Astrology (Highlighted Brand Experience) */}
        <div>
          <div className="px-3 mb-1.5 flex items-center justify-between">
            <button
              onClick={() => setAstroExpanded(!astroExpanded)}
              className="w-full flex items-center justify-between text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 transition-colors py-1"
            >
              <div className="flex items-center gap-1.5 text-amber-700">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                <span>My Astrology</span>
              </div>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  astroExpanded ? "rotate-0" : "-rotate-90"
                }`}
              />
            </button>
          </div>

          {astroExpanded && (
            <div className="space-y-1 pl-1">
              {astrologySubLinks.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all no-underline ${
                      active
                        ? "bg-amber-50 text-amber-950 font-bold border-l-3 border-[#ff6b00]"
                        : "text-slate-600 hover:bg-orange-50/50 hover:text-[#ff6b00]"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0 opacity-80" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>

        {/* Group: Services & Activity */}
        <div>
          <span className="block px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Sanctuary Services
          </span>
          <div className="space-y-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all no-underline ${
                    active
                      ? "bg-orange-50 text-[#ff6b00] font-bold"
                      : "text-slate-600 hover:bg-orange-50/50 hover:text-[#ff6b00]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 opacity-75" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Group: Account & Settings */}
        <div>
          <span className="block px-3 mb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Account
          </span>
          <div className="space-y-1">
            {accountNavItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all no-underline ${
                    active
                      ? "bg-orange-50 text-[#ff6b00] font-bold"
                      : "text-slate-600 hover:bg-orange-50/50 hover:text-[#ff6b00]"
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0 opacity-75" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Sidebar Footer: Support link */}
      <div className="p-3.5 border-t border-orange-100/80 shrink-0 bg-orange-50/30">
        <Link
          href="/support"
          onClick={onClose}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors no-underline"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Need help with your charts?</span>
        </Link>
      </div>
    </div>
  );
}

export default DashboardSidebar;
