"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "./ui/card";
import { ArrowUpRight } from "lucide-react";
import { DASHBOARD_QUICK_ACTIONS } from "../data/quick-actions.data";

export function QuickActions() {
  const actions = DASHBOARD_QUICK_ACTIONS;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="mb-3">
        <h2 className="text-xl sm:text-2xl font-black text-[#301118] font-outfit">
          Quick Actions
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 font-medium">
          Fast shortcuts to your primary astrological tools and consultations
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.title}
              href={action.href}
              className="no-underline group block"
            >
              <Card className="h-full p-4 sm:p-5 border-orange-100/90 bg-white hover:border-[#ff6b00]/50 hover:shadow-md transition-all duration-200 flex flex-col justify-between group-hover:-translate-y-0.5">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-xl ${action.iconColor} flex items-center justify-center transition-transform group-hover:scale-110 duration-200`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider group-hover:text-[#ff6b00] transition-colors flex items-center gap-0.5">
                      <span>{action.badge}</span>
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 font-outfit group-hover:text-[#ff6b00] transition-colors mb-1">
                    {action.title}
                  </h3>
                  <p className="text-xs text-slate-500 font-normal leading-relaxed line-clamp-2">
                    {action.desc}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default QuickActions;
