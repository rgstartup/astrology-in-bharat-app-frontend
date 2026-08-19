
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "../utils/cn";

export interface StatConfig {
    title: string;
    value: string | number;
    tooltipValue?: string | number;
    icon: LucideIcon;
    iconColor: string;
    iconBgColor: string;
    valueColor?: string;
    trend?: {
        value: string;
        isPositive: boolean;
        color?: string; // Optional custom color class
        period?: string;
    };
}

export interface StatsCardsProps {
    stats: StatConfig[];
    columns?: 2 | 3 | 4 | 5;
}

export function StatsCards({ stats, columns = 4 }: StatsCardsProps) {
    // Explicitly define grid classes based on columns prop
    let gridColsClass = "sm:grid-cols-2 xl:grid-cols-4"; // Default

    if (columns === 2) gridColsClass = "sm:grid-cols-2";
    if (columns === 3) gridColsClass = "md:grid-cols-3 lg:grid-cols-3";
    if (columns === 4) gridColsClass = "sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4";
    if (columns === 5) gridColsClass = "sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-5";

    return (
        <div className={`grid grid-cols-1 ${gridColsClass} gap-4 sm:gap-6`}>
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={`${index}-${stat.tooltipValue}`}
                        className="group group/card bg-white rounded-xl border-2 border-[#F25E0A] p-4 sm:p-6 shadow-sm hover:shadow-2xl hover:scale-105 hover:-translate-y-2 transition-all duration-300 cursor-pointer relative overflow-hidden"
                        title={String(stat.tooltipValue || stat.value)}
                    >
                        {/* Hover Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 via-orange-100/30 to-transparent opacity-0 group-hover:opacity-100 group-hover/card:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* CONTENT */}
                        <div className="relative z-10 flex items-start gap-3">
                            {/* LEFT TEXT */}
                            <div className="flex-1 min-w-0 pr-2">
                                <p className="text-xs sm:text-sm font-medium text-gray-900 mb-1 leading-tight">
                                    {stat.title}
                                </p>

                                <h3
                                    className={`text-xl sm:text-2xl lg:text-[1.65rem] font-bold ${stat.valueColor || "text-gray-900"} mb-1 truncate group-hover:scale-105 group-hover/card:scale-105 transition-transform origin-left`}
                                    title={String(stat.tooltipValue || stat.value)}
                                >
                                    {stat.value}
                                </h3>
                                {stat.trend && (
                                <div className="flex items-center whitespace-nowrap gap-1">
                                        {stat.trend.isPositive ? (
                                            <ArrowUp className={cn("w-4 h-4 flex-shrink-0 group-hover:scale-125 group-hover/card:scale-125 transition-transform", stat.trend.color || "text-green-600")} />
                                        ) : (
                                            <ArrowDown className={cn("w-4 h-4 flex-shrink-0 group-hover:scale-125 group-hover/card:scale-125 transition-transform", stat.trend.color || "text-red-600")} />
                                        )}
                                        <span className={cn("text-[10px] font-bold tracking-tighter truncate", stat.trend.color || (stat.trend.isPositive ? "text-green-600" : "text-red-600"))}>
                                            {stat.trend.value}
                                        </span>
                                        {stat.trend.period && (
                                            <span className="text-sm text-gray-700">
                                                {stat.trend.period}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ICON */}
                            <div
                                className={`${stat.iconBgColor} p-2 sm:p-3 rounded-lg flex items-center justify-center flex-shrink-0 max-w-[44px] max-h-[44px] group-hover:scale-110 group-hover/card:scale-110 group-hover:rotate-[360deg] group-hover/card:rotate-[360deg] transition-all duration-700 shadow-sm group-hover:shadow-md group-hover/card:shadow-md`}
                            >
                                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                            </div>
                        </div>

                        {/* Bottom Accent */}
                        <div className="absolute bottom-0 left-0 h-1.5 w-full bg-[#F25E0A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />

                        {/* Corner Glow */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-orange-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 group-hover/card:opacity-100 transition-opacity duration-500" />
                    </div>
                );
            })}
        </div>
    );
}



