"use client";

import React from "react";
import {
  FileText,
  Flame,
  Gem,
  BookOpen,
  Clock,
  Sparkles,
} from "lucide-react";
import { RemedyTabConfig, RemedyTabKey } from "./types";
import { cn } from "@/lib/utils";

interface RemediesTabsHeaderProps {
  tabs: RemedyTabConfig[];
  activeTab: RemedyTabKey;
  onSelectTab: (key: RemedyTabKey) => void;
  counts?: Record<RemedyTabKey, number>;
}

const getTabIcon = (key: RemedyTabKey) => {
  switch (key) {
    case "reports":
      return FileText;
    case "rituals":
      return Flame;
    case "gemstones":
      return Gem;
    case "books":
      return BookOpen;
    case "consultations":
      return Clock;
    default:
      return Sparkles;
  }
};

export const RemediesTabsHeader: React.FC<RemediesTabsHeaderProps> = ({
  tabs,
  activeTab,
  onSelectTab,
  counts,
}) => {
  const row1Tabs = tabs.slice(0, 3); // Reports, Puja/Havan, Mala/Gems
  const row2Tabs = tabs.slice(3); // Books/Texts, Consultations

  return (
    <div className="w-full">
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP VIEW: 5-Pill Responsive Grid
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-2.5 lg:gap-3.5">
        {tabs.map((tab, idx) => {
          const isActive = activeTab === tab.key;
          const Icon = getTabIcon(tab.key);
          const count = counts?.[tab.key];

          return (
            <button
              key={tab.key}
              type="button"
              id={`remedy-tab-desktop-${tab.key}`}
              aria-selected={isActive}
              aria-controls={`remedy-panel-${tab.key}`}
              onClick={() => onSelectTab(tab.key)}
              className={cn(
                "group relative flex flex-col justify-between p-3.5 lg:p-4 rounded-2xl text-left transition-all duration-200 cursor-pointer select-none outline-none border",
                isActive
                  ? "bg-orange text-white border-orange shadow-md shadow-orange/20 -translate-y-0.5"
                  : "bg-white text-gray-700 hover:bg-slate-50 hover:text-gray-900 border-gray-200/90 shadow-2xs hover:border-gray-300",
              )}
            >
              {/* Top Row: Icon + Count */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <div
                  className={cn(
                    "size-8 rounded-xl flex items-center justify-center transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-orange/10 text-orange group-hover:bg-orange/15",
                  )}
                >
                  <Icon className="size-4.5" />
                </div>

                {typeof count === "number" && count > 0 && (
                  <span
                    className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full",
                      isActive
                        ? "bg-white text-orange"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200",
                    )}
                  >
                    {count}
                  </span>
                )}
              </div>

              {/* Bottom Labels */}
              <div>
                <h4
                  className={cn(
                    "text-xs lg:text-sm font-extrabold leading-tight truncate",
                    isActive ? "text-white" : "text-gray-900 group-hover:text-orange transition-colors",
                  )}
                >
                  {tab.label}
                </h4>
                <p
                  className={cn(
                    "text-[10px] font-medium leading-tight mt-0.5 truncate",
                    isActive ? "text-white/80" : "text-gray-400",
                  )}
                >
                  {tab.sublabel}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE VIEW: 2-Row Compact Pills (All 5 options visible on screen)
          ───────────────────────────────────────────────────────────── */}
      <div className="block sm:hidden">
        <div className="space-y-2">
          {/* Row 1: 3 options */}
          <div className="grid grid-cols-3 gap-1.5">
            {row1Tabs.map((tab, idx) => {
              const isActive = activeTab === tab.key;
              const Icon = getTabIcon(tab.key);
              const count = counts?.[tab.key];

              return (
                <button
                  key={tab.key}
                  type="button"
                  id={`remedy-tab-mobile-${tab.key}`}
                  aria-selected={isActive}
                  aria-controls={`remedy-panel-${tab.key}`}
                  onClick={() => onSelectTab(tab.key)}
                  className={cn(
                    "relative flex flex-col items-center justify-center py-2.5 px-1 rounded-xl transition-all duration-200 cursor-pointer select-none text-center outline-none border",
                    isActive
                      ? "bg-orange text-white font-bold border-orange shadow-xs"
                      : "bg-white text-gray-700 hover:bg-slate-50 border-gray-200/90 font-medium shadow-2xs",
                  )}
                >
                  <div className="flex items-center gap-1 mb-1">
                    <Icon
                      className={cn(
                        "size-3.5 shrink-0",
                        isActive ? "text-white" : "text-orange",
                      )}
                    />
                    {typeof count === "number" && count > 0 && (
                      <span
                        className={cn(
                          "text-[9px] font-black px-1 rounded-full",
                          isActive
                            ? "bg-white text-orange"
                            : "bg-gray-100 text-gray-600",
                        )}
                      >
                        {count}
                      </span>
                    )}
                  </div>

                  <span className="text-[11px] leading-tight line-clamp-1 font-bold">
                    {tab.shortLabel}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Row 2: 2 options */}
          <div className="grid grid-cols-2 gap-1.5">
            {row2Tabs.map((tab, idx) => {
              const isActive = activeTab === tab.key;
              const Icon = getTabIcon(tab.key);
              const count = counts?.[tab.key];

              return (
                <button
                  key={tab.key}
                  type="button"
                  id={`remedy-tab-mobile-${tab.key}`}
                  aria-selected={isActive}
                  aria-controls={`remedy-panel-${tab.key}`}
                  onClick={() => onSelectTab(tab.key)}
                  className={cn(
                    "relative flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl transition-all duration-200 cursor-pointer select-none text-center outline-none border",
                    isActive
                      ? "bg-orange text-white font-bold border-orange shadow-xs"
                      : "bg-white text-gray-700 hover:bg-slate-50 border-gray-200/90 font-medium shadow-2xs",
                  )}
                >
                  <Icon
                    className={cn(
                      "size-3.5 shrink-0",
                      isActive ? "text-white" : "text-orange",
                    )}
                  />

                  <span className="text-[11px] leading-tight truncate font-bold">
                    {tab.shortLabel}
                  </span>

                  {typeof count === "number" && count > 0 && (
                    <span
                      className={cn(
                        "text-[9px] font-black px-1.5 py-0.2 rounded-full shrink-0",
                        isActive
                          ? "bg-white text-orange"
                          : "bg-gray-100 text-gray-600",
                      )}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
