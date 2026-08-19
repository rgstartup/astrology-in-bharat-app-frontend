import React from "react";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils/cn";

interface StatCardProps {
    label: string;
    value: number;
    sub: string;
    subColor: string;
    icon: LucideIcon;
    iconBg: string;
    iconColor: string;
    isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ 
    label, 
    value, 
    sub, 
    subColor, 
    icon: Icon, 
    iconBg, 
    iconColor,
    isLoading
}) => {
    if (isLoading) {
        return (
            <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 space-y-4 animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="space-y-2">
                        <div className="h-3 w-20 bg-gray-100 rounded" />
                        <div className="h-8 w-32 bg-gray-100 rounded" />
                    </div>
                    <div className="w-12 h-12 bg-gray-100 rounded-xl" />
                </div>
                <div className="h-2 w-24 bg-gray-100 rounded" />
            </div>
        );
    }

    const shadowColors: any = {
        'text-green-500': 'hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.15)] hover:border-green-100',
        'text-orange-500': 'hover:shadow-[0_20px_40px_-12px_rgba(242,94,10,0.15)] hover:border-orange-100',
        'text-red-500': 'hover:shadow-[0_20px_40px_-12px_rgba(239,68,68,0.15)] hover:border-red-100',
        'text-blue-500': 'hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.15)] hover:border-blue-100',
        'text-amber-500': 'hover:shadow-[0_20px_40px_-12px_rgba(245,158,11,0.15)] hover:border-amber-100',
    };

    return (
        <div className={cn(
            "group bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col transition-all duration-500 hover:-translate-y-2 overflow-hidden",
            shadowColors[subColor] || ''
        )}>
            <div className="p-6 flex items-start justify-between flex-grow">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 tracking-tight transition-colors group-hover:text-gray-600">{label}</p>
                    <h3 className="text-3xl font-bold text-gray-900 tracking-tight transition-transform duration-500 group-hover:scale-105 origin-left">
                        ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 0 })}
                    </h3>
                    <p className={cn("text-xs font-medium flex items-center gap-1 transition-all duration-500", subColor)}>
                        <span className="text-lg group-hover:translate-y-[-2px]">↑</span> {sub}
                    </p>
                </div>
                <div className={cn(
                    "w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm",
                    iconBg,
                    iconColor
                )}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            
            {/* Orange Bottom Bar - Shows only on hover */}
            <div className="h-1.5 w-full bg-[#fd6410] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
        </div>
    );
};
