import React from "react";

interface StatCardProps {
    label: string;
    value: string;
    sub: string;
    subColor: string;
    icon: any;
    iconBg: string;
    iconColor: string;
}

export const StatCard: React.FC<StatCardProps> = ({ 
    label, 
    value, 
    sub, 
    subColor, 
    icon: Icon, 
    iconBg, 
    iconColor 
}) => {
    const shadowColors: any = {
        'text-emerald-500': 'hover:shadow-[0_20px_40px_-12px_rgba(16,185,129,0.15)] hover:border-emerald-100',
        'text-blue-500': 'hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.15)] hover:border-blue-100',
        'text-orange-500': 'hover:shadow-[0_20px_40px_-12px_rgba(249,115,22,0.15)] hover:border-orange-100',
    };

    return (
        <div className={`group bg-white rounded-[1.5rem] border border-gray-100 shadow-sm flex flex-col transition-all duration-500 hover:-translate-y-2 overflow-hidden ${shadowColors[subColor] || ''}`}>
            <div className="p-6 flex items-start justify-between flex-grow">
                <div className="space-y-1">
                    <p className="text-xs font-medium text-gray-400 tracking-tight transition-colors group-hover:text-gray-600">{label}</p>
                    <h3 className="text-3xl font-black text-gray-900 tracking-tighter transition-transform duration-500 group-hover:scale-105 origin-left">
                        {value}
                    </h3>
                    <p className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-500 ${subColor}`}>
                        <span className="text-lg group-hover:translate-y-[-2px]">↑</span> {sub} <span className="text-gray-300 font-normal ml-1">Current</span>
                    </p>
                </div>
                <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm`}>
                    <Icon className="w-6 h-6" />
                </div>
            </div>
            
            {/* Orange Bottom Bar - Shows only on hover */}
            <div className="h-1.5 w-full bg-[#F25E0A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
        </div>
    );
};
