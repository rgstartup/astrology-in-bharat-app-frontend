"use client";

import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import type { NavSubItemConfig } from "../nav-config";
import { cn } from "@/lib/utils";

interface MobileSubMenuProps {
  items: NavSubItemConfig[];
  isOpen: boolean;
  onItemClick: () => void;
}

const MobileSubMenu = ({ items, isOpen, onItemClick }: MobileSubMenuProps) => {
  const t = useTranslations("Navigation");

  if (!isOpen) return null;

  return (
    <div className="pl-3 pr-2 py-2 my-1.5 ml-2 border-l-2 border-orange-300 bg-orange-50/40 rounded-r-xl space-y-1">
      {items.map((item) => {
        const Icon = item.icon;
        const title = t(item.titleKey as any);
        const description = t(item.descKey as any);
        const badge = item.badgeKey ? t(item.badgeKey as any) : null;

        return (
          <Link
            key={item.id}
            href={item.href}
            onClick={onItemClick}
            className="flex items-start gap-3 p-2.5 rounded-xl no-underline hover:bg-white hover:shadow-xs transition-all duration-200 group"
          >
            <div
              className={cn(
                "size-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 transition-transform group-hover:scale-105 shadow-2xs",
                item.iconBg,
                item.iconColor
              )}
            >
              <Icon className="size-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[13.5px] font-semibold text-stone-900 group-hover:text-orange-600 transition-colors">
                  {title}
                </span>
                {badge && (
                  <span
                    className={cn(
                      "text-[9.5px] font-bold px-1.5 py-0.2 rounded-full uppercase tracking-wider",
                      item.id === "live"
                        ? "bg-red-500 text-white animate-pulse"
                        : "bg-amber-100 text-amber-800"
                    )}
                  >
                    {badge}
                  </span>
                )}
              </div>
              <p className="text-[11.5px] text-stone-500 group-hover:text-stone-600 line-clamp-2 mt-0.5 leading-snug font-normal">
                {description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default MobileSubMenu;
