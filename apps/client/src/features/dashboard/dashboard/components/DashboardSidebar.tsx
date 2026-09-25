"use client";

import React from "react";
import Image from "next/image";
import {
  Compass,
  HelpCircle,
  ArrowUpRight,
  ChevronRight,
  X,
} from "lucide-react";
import { Button } from "@repo/ui";
import { PATHS } from "@repo/routes";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import {
  ASTROLOGY_SUB_LINKS,
  MAIN_SERVICES_NAV,
  ACCOUNT_NAV_ITEMS,
  type NavItem,
} from "../data/navigation.data";

export interface DashboardSidebarProps {
  onClose?: () => void;
}

const groups = [
  { title: "My astrology", items: ASTROLOGY_SUB_LINKS },
  { title: "Explore & activity", items: MAIN_SERVICES_NAV },
  { title: "Account", items: ACCOUNT_NAV_ITEMS },
];

export function DashboardSidebar({ onClose }: DashboardSidebarProps) {
  const pathname = usePathname().replace(/\/$/, "");

  const renderLink = (item: NavItem) => {
    const active =
      pathname === item.href ||
      (item.href !== PATHS.DASHBOARD.ROOT &&
        pathname.startsWith(`${item.href}/`));
    const Icon = item.icon;

    return (
      <Link
        key={item.href}
        href={item.href}
        onClick={onClose}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex shrink-0 min-h-11 sm:min-h-10 items-center gap-2.5 rounded-full border px-3 py-2 text-sm leading-5 no-underline transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring motion-reduce:transition-none",
          active
            ? "border-slate-300 bg-slate-100 text-slate-900 font-semibold shadow-2xs"
            : "border-transparent font-normal text-slate-700 hover:bg-slate-100 hover:text-slate-900",
        )}
      >
        <Icon
          aria-hidden="true"
          className="size-5 shrink-0"
          strokeWidth={active ? 2 : 1.7}
        />
        <span className="flex-1">{item.name}</span>
        {active && (
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-slate-700"
          />
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-background text-foreground">
      <div className="flex h-18 shrink-0 items-center justify-between gap-1 px-5 border-b border-border">
        <Link
          href={PATHS.DASHBOARD.ROOT}
          onClick={onClose}
          className="flex min-w-0 items-center gap-2.5 rounded-lg no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring"
        >
          <Image
            src="/images/Expert.png"
            alt=""
            width={36}
            height={36}
            className="shrink-0 object-contain"
            priority
          />
          <div className="min-w-0">
            <span className="block font-outfit text-base font-semibold leading-5 tracking-tight text-orange-700">
              Astrology in Bharat
            </span>
            <span className="mt-1 block text-xs font-normal leading-4 text-slate-500">
              Your personal space
            </span>
          </div>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-11 shrink-0 text-slate-600 hover:bg-slate-100 cursor-pointer"
            aria-label="Close navigation"
          >
            <X aria-hidden="true" />
          </Button>
        )}
      </div>

      <nav
        aria-label="Dashboard"
        data-lenis-prevent
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-ring px-4 py-4"
      >
        {renderLink({
          name: "Overview",
          href: PATHS.DASHBOARD.ROOT,
          icon: Compass,
        })}
        {groups.map(({ title, items }) => (
          <div
            key={title}
            className="flex shrink-0 flex-col gap-1 border-t border-slate-100 pt-3"
          >
            <h2 className="mb-1 px-3.5 font-sans! text-xs font-semibold leading-4 text-slate-500">
              {title}
            </h2>
            {items.map(renderLink)}
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-border p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          href="/support"
          onClick={onClose}
          className="group flex min-h-14 items-center gap-2.5 rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:bg-gray-100 hover:text-slate-900 no-underline transition-colors focus-visible:outline-2 focus-visible:outline-ring motion-reduce:transition-none"
        >
          <HelpCircle
            aria-hidden="true"
            className="size-5 shrink-0"
            strokeWidth={1.7}
          />
          <div className="flex-1">
            <span className="block text-sm font-medium leading-5">
              Here to help
            </span>
            <span className="mt-1 block text-xs font-normal leading-4">
              Get in touch with support
            </span>
          </div>
          <ArrowUpRight aria-hidden="true" className="size-4" />
        </Link>
      </div>
    </div>
  );
}

export default DashboardSidebar;
