import React from "react";

interface StatCardProps {
    label: string;
    value: number;
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
        'text-green-500': 'hover:shadow-[0_20px_40px_-12px_rgba(34,197,94,0.15)] hover:border-green-100',
        'text-primary': 'hover:shadow-[0_20px_40px_-12px_rgba(242,94,10,0.15)] hover:border-orange-100',
        'text-red-500': 'hover:shadow-[0_20px_40px_-12px_rgba(239,68,68,0.15)] hover:border-red-100',
    };

    return (
        <div className={`group bg-white rounded-[1.5rem] shadow-sm flex flex-col transition-all duration-500 hover:-translate-y-2 overflow-hidden border-2 border-[#F25E0A] ${shadowColors[subColor] || ''}`}>
            <div className="p-4 md:p-6 flex items-start justify-between flex-grow">
                <div className="space-y-1">
                    <p className="text-[10px] md:text-xs font-medium text-gray-1000 tracking-tight transition-colors group-hover:text-gray-1000">{label}</p>
                    <h3 className="text-xl md:text-3xl font-black text-gray-900 tracking-tighter transition-transform duration-500 group-hover:scale-105 origin-left">
                        ₹{value.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </h3>
                    <p className={`text-[9px] md:text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 transition-all duration-500 ${subColor}`}>
                        <span className="text-base md:text-lg group-hover:translate-y-[-2px]">↑</span> {sub} <span className="text-gray-300 font-normal ml-1 hidden md:inline">Current</span>
                    </p>
                </div>
                <div className={`w-9 h-9 md:w-12 md:h-12 rounded-xl ${iconBg} flex items-center justify-center ${iconColor} transition-all duration-500 group-hover:rotate-[15deg] group-hover:scale-110 shadow-sm shrink-0`}>
                    <Icon className="w-4 h-4 md:w-6 md:h-6" />
                </div>
            </div>
            
            {/* Orange Bottom Bar - Shows only on hover */}
            <div className="h-1.5 w-full bg-[#F25E0A] transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
        </div>
    );
};
