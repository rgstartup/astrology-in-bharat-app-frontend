"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/navigation";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { PATHS } from "@repo/routes";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { NAV_ITEMS_CONFIG } from "./nav-config";
import MobileSubMenu from "./mobile/sub-menu";
import ProfileCTA from "./profile.cta";
import {
  ChevronDown,
  ChevronRight,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface INavigationMenuProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NavigationMenuComponent: React.FC<INavigationMenuProps> = ({
  isMobileMenuOpen,
  setIsMobileMenuOpen,
}) => {
  const t = useTranslations("Navigation");

  // Mobile open state for each accordion section
  const [openMobileSections, setOpenMobileSections] = useState<
    Record<string, boolean>
  >({
    astrology: true,
  });

  const toggleMobileSection = (id: string) => {
    setOpenMobileSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* -------------------------------------------------------------
          MOBILE NAVIGATION SHEET DRAWER
          ------------------------------------------------------------- */}
      <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
        <SheetContent
          side="left"
          className="bg-white text-stone-900 border-r border-stone-200/80 w-[320px] sm:w-[380px] max-w-[85vw] p-0 flex flex-col justify-between overflow-hidden z-[100] shadow-2xl"
        >
          {/* Sheet Top Header */}
          <SheetHeader className="p-4 pb-3 border-b border-stone-100 bg-[#FFF9F4] flex flex-row items-center justify-between gap-3 text-left">
            <div className="flex items-center gap-2">
              <Image
                src="/images/web-logo.png"
                alt="Astrology in Bharat"
                width={160}
                height={50}
                className="object-contain h-9 w-auto"
              />
            </div>
            <SheetTitle className="sr-only">Mobile Navigation Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigation drawer for exploring astrology services, verified consultants, and devotion.
            </SheetDescription>
          </SheetHeader>

          {/* Sheet Scrollable Body */}
          <div
            data-lenis-prevent
            className="flex-1 overflow-y-auto px-3 py-3 space-y-1 [&::-webkit-scrollbar]:w-[4px] [&::-webkit-scrollbar-thumb]:bg-orange/30 [&::-webkit-scrollbar-thumb]:rounded-full"
          >
            {NAV_ITEMS_CONFIG.map((section) => {
              const hasSubMenu = section.items && section.items.length > 0;
              const isSectionOpen = !!openMobileSections[section.id];
              const title = t(section.titleKey as any);
              const SectionIcon = section.icon || ShoppingBag;

              if (!hasSubMenu && section.href) {
                return (
                  <div
                    key={section.id}
                    className="w-full border-b border-stone-100/80 pb-0.5 last:border-0"
                  >
                    <Link
                      href={section.href}
                      onClick={closeMobileMenu}
                      className="flex items-center justify-between p-2.5 rounded-xl no-underline text-stone-900 hover:text-orange-600 hover:bg-orange-50/60 active:scale-[0.99] transition-all font-medium group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={cn(
                            "size-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105",
                            section.iconBg || "bg-orange-50",
                            section.iconColor || "text-orange-600"
                          )}
                        >
                          <SectionIcon className="size-4" />
                        </div>
                        <span className="font-semibold text-stone-900 text-[14px] group-hover:text-orange-600 transition-colors">
                          {title}
                        </span>
                      </div>
                      <ChevronRight className="size-4 text-stone-300 group-hover:text-orange-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                    </Link>
                  </div>
                );
              }

              return (
                <div
                  key={section.id}
                  className="w-full border-b border-stone-100/80 pb-0.5 last:border-0"
                >
                  <button
                    type="button"
                    onClick={() => toggleMobileSection(section.id)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl bg-transparent border-0 text-left text-stone-900 hover:text-orange-600 hover:bg-orange-50/60 active:scale-[0.99] transition-all cursor-pointer group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "size-8 rounded-lg flex items-center justify-center shrink-0 shadow-2xs transition-transform group-hover:scale-105",
                          section.iconBg || "bg-orange-50",
                          section.iconColor || "text-orange-600"
                        )}
                      >
                        <SectionIcon className="size-4" />
                      </div>
                      <span className="font-semibold text-[14px] text-stone-900 group-hover:text-orange-600 transition-colors">
                        {title}
                      </span>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 text-stone-400 transition-transform duration-200",
                        isSectionOpen && "rotate-180 text-orange-600"
                      )}
                    />
                  </button>

                  {section.items && (
                    <MobileSubMenu
                      items={section.items}
                      isOpen={isSectionOpen}
                      onItemClick={closeMobileMenu}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Sheet Bottom Footer: Profile CTA */}
          <div className="p-3 border-t border-stone-100 bg-[#FFF9F4]">
            <ProfileCTA setIsMenuOpen={setIsMobileMenuOpen} />
          </div>
        </SheetContent>
      </Sheet>

      {/* -------------------------------------------------------------
          DESKTOP NAVIGATION (SHADCN NAVIGATION MENU)
          ------------------------------------------------------------- */}
      <div
        data-lenis-prevent
        className="hidden lg:flex lg:items-center lg:justify-center lg:flex-1"
      >
        <NavigationMenu className="max-w-max">
          <NavigationMenuList className="flex items-center gap-1 xl:gap-2">
            {NAV_ITEMS_CONFIG.map((section) => {
              const hasSubMenu = section.items && section.items.length > 0;
              const title = t(section.titleKey as any);

              // Menu Item without sub-menu (e.g. Products)
              if (!hasSubMenu && section.href) {
                return (
                  <NavigationMenuItem key={section.id}>
                    <Link
                      href={section.href}
                      className="inline-flex h-9 items-center justify-center rounded-xl px-3.5 py-2 text-[15px] font-semibold text-[#1e0b0f] transition-all duration-200 hover:text-orange-600 hover:bg-orange-50/60 no-underline cursor-pointer"
                    >
                      {title}
                    </Link>
                  </NavigationMenuItem>
                );
              }

              // Menu Item with Dropdown (Astrology, Experts, Devotion)
              return (
                <NavigationMenuItem key={section.id}>
                  <NavigationMenuTrigger className="h-9 px-3.5 py-2 text-[15px] font-semibold text-[#1e0b0f] transition-all duration-200 hover:text-orange-600 hover:bg-orange-50/60 rounded-xl bg-transparent data-open:bg-orange-50/80 data-open:text-orange-600 cursor-pointer border-0">
                    {title}
                  </NavigationMenuTrigger>

                  <NavigationMenuContent className="p-0 bg-transparent border-0 shadow-none">
                    <div
                      className={cn(
                        "bg-white rounded-2xl p-4 shadow-xl border border-stone-200/80 animate-in fade-in-0 zoom-in-95 duration-200",
                        section.id === "astrology" && "w-[560px]",
                        section.id === "calculators" && "w-[620px]",
                        section.id === "experts" && "w-[620px]",
                        section.id === "devotion" && "w-[400px]"
                      )}
                    >
                      {/* Header preview / section intro */}
                      {section.descKey && (
                        <div className="px-2.5 pb-2.5 mb-2.5 border-b border-stone-100 flex flex-col gap-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-orange-600 flex items-center gap-1.5">
                            <Sparkles className="size-3.5" />
                            {title}
                          </span>
                          <p className="text-[12px] text-stone-500 font-normal leading-normal">
                            {t(section.descKey as any)}
                          </p>
                        </div>
                      )}

                      {/* Sub-menu items grid */}
                      <div
                        className={cn(
                          "grid gap-2",
                          section.id === "devotion"
                            ? "grid-cols-1"
                            : "grid-cols-2"
                        )}
                      >
                        {section.items?.map((item) => {
                          const Icon = item.icon;
                          const itemTitle = t(item.titleKey as any);
                          const itemDesc = t(item.descKey as any);
                          const itemBadge = item.badgeKey
                            ? t(item.badgeKey as any)
                            : null;

                          return (
                            <Link
                              key={item.id}
                              href={item.href}
                              className="group/item flex items-start gap-3.5 p-2.5 rounded-xl no-underline border border-transparent hover:border-orange-200/60 hover:bg-orange-50/60 transition-all duration-200 cursor-pointer"
                            >
                              <div
                                className={cn(
                                  "size-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5 transition-all duration-200 group-hover/item:scale-105 shadow-xs",
                                  item.iconBg,
                                  item.iconColor
                                )}
                              >
                                <Icon className="size-5" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-[14px] font-semibold text-stone-900 group-hover/item:text-orange-600 transition-colors">
                                    {itemTitle}
                                  </span>
                                  {itemBadge && (
                                    <span
                                      className={cn(
                                        "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                                        item.id === "live"
                                          ? "bg-red-500 text-white animate-pulse"
                                          : "bg-amber-100 text-amber-800"
                                      )}
                                    >
                                      {itemBadge}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[12px] text-stone-500 group-hover/item:text-stone-600 leading-normal line-clamp-2 mt-1 font-normal">
                                  {itemDesc}
                                </p>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </>
  );
};

export default NavigationMenuComponent;
