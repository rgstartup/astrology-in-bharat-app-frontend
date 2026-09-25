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
          "flex shrink-0 min-h-11 sm:min-h-10 items-center gap-2.5 rounded-full border px-3.5 py-2 text-sm leading-5 no-underline transition-all duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400 motion-reduce:transition-none",
          active
            ? "border-[#543b2e] bg-[#38261e] text-[#fbe6c2] font-semibold shadow-sm"
            : "border-transparent font-normal text-[#cfbfad] hover:bg-[#32221a] hover:text-[#faedd9]",
        )}
      >
        <Icon
          aria-hidden="true"
          className={cn(
            "size-5 shrink-0",
            active ? "text-amber-400" : "text-[#9d8977]",
          )}
          strokeWidth={active ? 2 : 1.7}
        />
        <span className="flex-1">{item.name}</span>
        {active && (
          <ChevronRight
            aria-hidden="true"
            className="size-4 shrink-0 text-amber-300/80"
          />
        )}
      </Link>
    );
  };

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden bg-transparent text-[#e6d7c3]">
      <div className="flex h-16 shrink-0 items-center justify-between gap-1 px-5">
        <Link
          href={PATHS.DASHBOARD.ROOT}
          onClick={onClose}
          className="flex min-w-0 items-center gap-2.5 rounded-lg no-underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-amber-400"
        >
          <Image
            src="/images/Expert.png"
            alt=""
            width={34}
            height={34}
            className="shrink-0 object-contain drop-shadow-sm"
            priority
          />
          <div className="min-w-0">
            <span className="block font-outfit text-base font-semibold leading-5 tracking-tight text-[#f9e9cf]">
              Astrology in Bharat
            </span>
            <span className="mt-0.5 block text-xs font-normal leading-4 text-[#b49f89]">
              Your personal space
            </span>
          </div>
        </Link>
        {onClose && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="size-10 shrink-0 text-[#b49f89] hover:bg-[#34241b] hover:text-[#faedd9] cursor-pointer"
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
        className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto overscroll-contain focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-amber-400 px-3 py-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        {renderLink({
          name: "Overview",
          href: PATHS.DASHBOARD.ROOT,
          icon: Compass,
        })}

        {groups.map(({ title, items }) => (
          <div
            key={title}
            className="flex shrink-0 flex-col gap-1 border-t border-[#3d2a20] pt-3"
          >
            <h2 className="mb-1 px-3.5 font-sans! text-[11px] font-semibold uppercase tracking-wider text-[#9e8672]">
              {title}
            </h2>
            {items.map(renderLink)}
          </div>
        ))}
      </nav>

      <div className="shrink-0 p-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
        <Link
          href="/support"
          onClick={onClose}
          className="group flex min-h-12 items-center gap-2.5 rounded-2xl border border-[#493529] bg-[#2d1f18]/90 backdrop-blur-xs px-3.5 text-[#ecdcc9] hover:bg-[#38271e] hover:border-[#5c4334] hover:text-[#fbf0df] no-underline transition-all focus-visible:outline-2 focus-visible:outline-amber-400 motion-reduce:transition-none"
        >
          <HelpCircle
            aria-hidden="true"
            className="size-5 shrink-0 text-[#9e8672] group-hover:text-amber-400"
            strokeWidth={1.7}
          />
          <div className="flex-1 min-w-0">
            <span className="block text-xs font-semibold leading-4">
              Here to help
            </span>
            <span className="block text-[11px] font-normal leading-4 text-[#a89481] truncate">
              Support & questions
            </span>
          </div>
          <ArrowUpRight aria-hidden="true" className="size-4 text-[#9e8672] group-hover:text-amber-400" />
        </Link>
      </div>
    </div>
  );
}

export default DashboardSidebar;
