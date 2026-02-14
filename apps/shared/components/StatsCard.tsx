
import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";

export interface StatConfig {
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

export interface StatsCardsProps {
    stats: StatConfig[];
    columns?: 2 | 3 | 4;
}

export function StatsCards({ stats, columns = 4 }: StatsCardsProps) {
    // Explicitly define grid classes based on columns prop
    let gridColsClass = "sm:grid-cols-2 xl:grid-cols-4"; // Default

    if (columns === 2) gridColsClass = "sm:grid-cols-2";
    if (columns === 3) gridColsClass = "sm:grid-cols-3";
    // Force 4 columns on medium (md) screens and up, as requested
    if (columns === 4) gridColsClass = "sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4";

    return (
        <div className={`grid grid-cols-1 ${gridColsClass} gap-6`}>
            {stats.map((stat, index) => {
                const Icon = stat.icon;

                return (
                    <div
                        key={index}
                        className="
              group bg-white rounded-xl border border-gray-200
              p-4 sm:p-6
              shadow-sm
              hover:shadow-2xl hover:border-yellow-400
              hover:scale-105 hover:-translate-y-2
              transition-all duration-300
              cursor-pointer relative overflow-hidden
            "
                        title={`${stat.title}: ${stat.value}`}
                    >
                        {/* Hover Background */}
                        <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-yellow-100/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* CONTENT */}
                        <div className="relative z-10 flex items-start gap-3">
                            {/* LEFT TEXT */}
                            <div className="flex-1 min-w-0 overflow-hidden">
                                <p className="text-sm font-medium text-gray-600 mb-1 truncate">
                                    {stat.title}
                                </p>

                                <h3
                                    className={`text-xl sm:text-3xl font-bold ${stat.valueColor || "text-gray-900"
                                        } mb-2 break-words
                  group-hover:scale-110
                  transition-transform origin-left`}
                                >
                                    {stat.value}
                                </h3>
                                {stat.trend && (
                                    <div className="flex items-center flex-wrap gap-1">
                                        {stat.trend.isPositive ? (
                                            <ArrowUp className="w-4 h-4 text-green-600 group-hover:scale-125 transition-transform" />
                                        ) : (
                                            <ArrowDown className="w-4 h-4 text-red-600 group-hover:scale-125 transition-transform" />
                                        )}
                                        <span
                                            className={`text-sm font-semibold ${stat.trend.isPositive
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {stat.trend.value}
                                        </span>
                                        {stat.trend.period && (
                                            <span className="text-sm text-gray-500">
                                                {stat.trend.period}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* ICON */}
                            <div
                                className={`${stat.iconBgColor}
                  p-2 sm:p-3
                  rounded-lg
                  flex items-center justify-center
                  flex-shrink-0
                  max-w-[44px] max-h-[44px]
                  group-hover:scale-125 group-hover:rotate-12
                  transition-all duration-300
                  shadow-sm group-hover:shadow-md`}
                            >
                                <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.iconColor}`} />
                            </div>
                        </div>

                        {/* Bottom Accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left rounded-b-xl" />

                        {/* Corner Glow */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    </div>
                );
            })}
        </div>
    );
}
