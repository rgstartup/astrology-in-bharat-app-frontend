"use client";

import React from "react";
import { Link } from "@/i18n/navigation";
import { Card } from "./ui/card";
import { ArrowUpRight } from "lucide-react";
import { DASHBOARD_QUICK_ACTIONS } from "../data/quick-actions.data";

/**
 * Shortcut tile grid linking to the primary astrological tools
 * and consultation entry points.
 */
export function QuickActions() {
  const actions = DASHBOARD_QUICK_ACTIONS;

  return (
    <div className="mb-6 sm:mb-8">
      <div className="mb-3">
        <h2 className="font-sans text-xl sm:text-2xl font-medium tracking-tight text-[#111111]">
          Quick actions
        </h2>
        <p className="font-sans text-xs sm:text-sm text-[#626260]">
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
              <Card className="h-full p-6 hover:border-[#111111] flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className={`w-10 h-10 rounded-full ${action.iconColor} flex items-center justify-center`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-medium text-[#7b7b78] tracking-wide group-hover:text-[#111111] transition-colors flex items-center gap-0.5">
                      <span>{action.badge}</span>
                      <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>

                  <h3 className="font-sans text-sm sm:text-base font-medium tracking-tight text-[#111111] mb-1">
                    {action.title}
                  </h3>
                  <p className="font-sans text-xs text-[#626260] leading-relaxed line-clamp-2">
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
