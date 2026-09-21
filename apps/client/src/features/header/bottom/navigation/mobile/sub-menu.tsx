"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { NavSubItemConfig } from "../nav-config";
import { cn } from "@/lib/utils";

import { ChevronRight } from "lucide-react";

interface MobileSubMenuProps {
  items: NavSubItemConfig[];
  isOpen: boolean;
  onItemClick: () => void;
}

const MobileSubMenu = ({ items, isOpen, onItemClick }: MobileSubMenuProps) => {
  const t = useTranslations("Navigation");

  if (!isOpen) return null;

  return (
    <div className="pl-3 pr-1 py-1.5 my-1 ml-4 border-l-2 border-orange-200/80 space-y-0.5 animate-in fade-in-0 slide-in-from-top-1 duration-150">
      {items.map((item) => {
        const Icon = item.icon;
        const title = t(item.titleKey as any);
        const badge = item.badgeKey ? t(item.badgeKey as any) : null;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onItemClick}
            className="flex items-center justify-between px-2.5 py-2 rounded-xl no-underline text-stone-800 hover:text-orange-600 hover:bg-orange-50/70 active:bg-orange-100/60 active:scale-[0.99] transition-all group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={cn(
                  "size-7 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 shadow-2xs",
                  item.iconBg,
                  item.iconColor
                )}
              >
                <Icon className="size-3.5" />
              </div>
              <span className="text-[13.5px] font-medium text-stone-800 group-hover:text-orange-600 transition-colors truncate">
                {title}
              </span>
            </div>

            {badge ? (
              <span
                className={cn(
                  "text-[9.5px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider shrink-0",
                  item.id === "live"
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-amber-100 text-amber-800"
                )}
              >
                {badge}
              </span>
            ) : (
              <ChevronRight className="size-3.5 text-stone-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default MobileSubMenu;
