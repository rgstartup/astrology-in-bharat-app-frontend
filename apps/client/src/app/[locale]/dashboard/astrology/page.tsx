"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { PATHS } from "@repo/routes";
import { Card, CardContent, Button, useDashboardOverview, ASTROLOGY_HUB_MODULES } from "@/features/dashboard";
import {
  Sparkles,
  Scroll,
  Sun,
  Compass,
  Orbit,
  Star,
  Clock,
  ShieldAlert,
  HeartHandshake,
  FileText,
  ArrowRight,
  PlusCircle,
} from "lucide-react";

const ICON_MAP: Record<string, any> = {
  Scroll,
  Sun,
  Orbit,
  Star,
  Clock,
  ShieldAlert,
  HeartHandshake,
  FileText,
};

export default function MyAstrologyHubPage() {
  const { astrologyDetails, hasBirthDetails } = useDashboardOverview();


  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-orange-100/80 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="p-1.5 rounded-lg bg-orange-100 text-[#ff6b00]">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-[#ff6b00] font-outfit">
              Private Astrology Hub
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-[#301118] font-outfit tracking-tight">
            My Astrology
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-medium mt-1">
            Your personal astrological library powered by your verified birth chart
          </p>
        </div>

        {hasBirthDetails ? (
          <div className="flex items-center gap-2.5 p-3 rounded-2xl bg-orange-50 border border-orange-200/70">
            <Compass className="w-5 h-5 text-[#ff6b00]" />
            <div className="text-xs">
              <p className="font-bold text-slate-900 leading-tight">
                {astrologyDetails?.sunSign || "Gemini"} Sun • {astrologyDetails?.moonSign || "Taurus"} Moon
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">
                Ascendant: {astrologyDetails?.ascendant || "Gemini"}
              </p>
            </div>
          </div>
        ) : (
          <Link href={PATHS.DASHBOARD_PROFILE} className="no-underline">
            <Button variant="default" size="sm">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Complete Birth Profile</span>
            </Button>
          </Link>
        )}
      </div>

      {/* Grid of Astrology Features */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {ASTROLOGY_HUB_MODULES.map((item) => {
          const Icon = ICON_MAP[item.iconName] || Star;
          return (
            <Link
              key={item.id}
              href={item.href}
              className="no-underline group block h-full"
            >
              <Card className="h-full p-5 sm:p-6 border-orange-100/80 bg-white hover:shadow-lg transition-all duration-200 hover:border-orange-300 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className={`w-11 h-11 rounded-2xl ${item.color} border flex items-center justify-center transition-transform duration-200 group-hover:scale-110 shadow-xs`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-slate-900 font-outfit mb-1.5 group-hover:text-[#ff6b00] transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs text-slate-500 leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#ff6b00] group-hover:translate-x-0.5 transition-transform">
                  <span>Explore</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
