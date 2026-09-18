"use client";

import React, { useCallback } from "react";
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
import { useDraggableScroll } from "@/hooks/useDraggableScroll";

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
  const {
    containerRef,
    canScrollLeft,
    canScrollRight,
    scrollToElement,
    onMouseDown,
    onMouseMove,
    onMouseUpOrLeave,
    wasDragged,
  } = useDraggableScroll<HTMLDivElement>({
    dragSpeed: 1.3,
    scrollStepRatio: 0.65,
    dragThreshold: 6,
  });

  const handleTabClick = useCallback(
    (key: RemedyTabKey, targetEl?: HTMLElement | null) => {
      if (wasDragged()) return;
      onSelectTab(key);
      scrollToElement(targetEl);
    },
    [onSelectTab, wasDragged, scrollToElement],
  );

  return (
    <div className="w-full">
      {/* ─────────────────────────────────────────────────────────────
          1. DESKTOP VIEW: 5-Pill Unified Segmented Control Track
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden sm:grid sm:grid-cols-5 gap-1.5 p-1.5 rounded-2xl bg-slate-100/90 border border-slate-200/80 shadow-2xs">
        {tabs.map((tab) => {
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
              onClick={(e) => handleTabClick(tab.key, e.currentTarget)}
              className={cn(
                "group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-left transition-all duration-200 cursor-pointer select-none outline-none border",
                isActive
                  ? "bg-orange text-white border-transparent shadow-xs font-bold"
                  : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 border-transparent font-medium",
              )}
            >
              {/* Icon & Label */}
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className={cn(
                    "size-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                    isActive
                      ? "bg-white/20 text-white"
                      : "bg-slate-200/80 text-slate-600 group-hover:bg-orange/10 group-hover:text-orange",
                  )}
                >
                  <Icon className="size-3.5 lg:size-4" />
                </div>

                <div className="min-w-0">
                  <h4
                    className={cn(
                      "text-xs lg:text-sm leading-tight truncate",
                      isActive
                        ? "text-white font-bold"
                        : "text-slate-700 group-hover:text-slate-900 font-semibold",
                    )}
                  >
                    <span className="hidden xl:inline">{tab.label}</span>
                    <span className="xl:hidden">{tab.shortLabel}</span>
                  </h4>
                  <p
                    className={cn(
                      "text-[10px] leading-none mt-0.5 truncate hidden 2xl:block",
                      isActive ? "text-white/80" : "text-slate-400",
                    )}
                  >
                    {tab.sublabel}
                  </p>
                </div>
              </div>

              {/* Count Badge */}
              {typeof count === "number" && count > 0 && (
                <span
                  className={cn(
                    "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full shrink-0 ml-1",
                    isActive
                      ? "bg-white text-orange"
                      : "bg-slate-200 text-slate-600 group-hover:bg-slate-300",
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          2. MOBILE VIEW: Horizontally Scrollable Segmented Track with Edge Fade Masks
          ───────────────────────────────────────────────────────────── */}
      <div className="relative block sm:hidden">
        {/* Left Fade Mask */}
        {canScrollLeft && (
          <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-slate-100 via-slate-100/80 to-transparent pointer-events-none z-10 rounded-l-2xl" />
        )}

        {/* Right Fade Mask */}
        {canScrollRight && (
          <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-slate-100 via-slate-100/80 to-transparent pointer-events-none z-10 rounded-r-2xl" />
        )}

        {/* Segmented Track */}
        <div
          ref={containerRef}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUpOrLeave}
          onMouseLeave={onMouseUpOrLeave}
          className="flex items-center gap-1.5 p-1 bg-slate-100/90 border border-slate-200/80 rounded-2xl overflow-x-auto no-scrollbar select-none cursor-grab active:cursor-grabbing scroll-smooth"
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {tabs.map((tab) => {
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
                onClick={(e) => handleTabClick(tab.key, e.currentTarget)}
                className={cn(
                  "shrink-0 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl transition-all duration-200 cursor-pointer select-none text-center outline-none border",
                  isActive
                    ? "bg-orange text-white font-bold border-transparent shadow-xs"
                    : "bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border-transparent font-medium",
                )}
              >
                <Icon
                  className={cn(
                    "size-3.5 shrink-0",
                    isActive ? "text-white" : "text-slate-500",
                  )}
                />
                <span className="text-xs leading-tight truncate whitespace-nowrap font-semibold">
                  {tab.shortLabel}
                </span>
                {typeof count === "number" && count > 0 && (
                  <span
                    className={cn(
                      "text-[9px] font-extrabold px-1.5 py-0.2 rounded-full shrink-0",
                      isActive
                        ? "bg-white text-orange"
                        : "bg-slate-200 text-slate-600",
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
  );
};
