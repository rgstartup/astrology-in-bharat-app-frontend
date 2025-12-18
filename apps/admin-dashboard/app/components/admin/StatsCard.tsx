"use client";

import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";

interface StatConfig {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  valueColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    period?: string;
  };
}

interface StatsCardsProps {
  stats: StatConfig[];
  columns?: 2 | 3 | 4;
}

export function StatsCards({ stats, columns = 4 }: StatsCardsProps) {
  const gridCols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 xl:grid-cols-4",
  };

  return (
    <div className={`grid grid-cols-1 ${gridCols[columns]} gap-6`}>
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="group bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-2xl hover:border-yellow-400 hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden"
            title={`${stat.title}: ${stat.value}`}
          >
            {/* Hover Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            
            <div className="relative z-10 flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2 group-hover:text-gray-800 transition-colors">
                  {stat.title}
                </p>
                <h3
                  className={`text-3xl font-bold ${
                    stat.valueColor || "text-gray-900"
                  } mb-3 group-hover:scale-110 transition-transform duration-200`}
                >
                  {stat.value}
                </h3>
                {stat.trend && (
                  <div className="flex items-center space-x-1">
                    {stat.trend.isPositive ? (
                      <ArrowUp className="w-4 h-4 text-green-600 group-hover:scale-125 transition-transform" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-600 group-hover:scale-125 transition-transform" />
                    )}
                    <span
                      className={`text-sm font-semibold ${
                        stat.trend.isPositive ? "text-green-600" : "text-red-600"
                      } group-hover:scale-105 transition-transform`}
                    >
                      {stat.trend.value}
                    </span>
                    {stat.trend.period && (
                      <span className="text-sm text-gray-500 group-hover:text-gray-700 transition-colors">
                        {stat.trend.period}
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div
                className={`${stat.iconBgColor} p-3 rounded-lg flex items-center justify-center group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 shadow-sm group-hover:shadow-md`}
              >
                <Icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>

            {/* Bottom Accent Bar */}
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />
            
            {/* Corner Glow Effect */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </div>
        );
      })}
    </div>
  );
}