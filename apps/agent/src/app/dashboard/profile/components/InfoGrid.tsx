import React from "react";
import { Mail, Phone, BadgeCheck, ShieldCheck } from "lucide-react";

interface InfoGridProps {
    agent: any;
}

export const InfoGrid: React.FC<InfoGridProps> = ({ agent }) => {
    const INFO_CARDS = [
        { 
            label: "Partner ID", 
            value: agent?.id ? `#${agent.id}` : "—", 
            icon: BadgeCheck, 
            color: "text-[#F25E0A]"
        },
        { 
            label: "Official Email", 
            value: agent?.user?.email ?? agent?.email ?? "—", 
            icon: Mail, 
            color: "text-gray-900"
        },
        { 
            label: "Contact Line", 
            value: agent?.phone ?? agent?.user?.phone ?? "—", 
            icon: Phone, 
            color: "text-gray-900"
        },
        { 
            label: "Account Status", 
            value: agent?.status ?? "Verified", 
            icon: ShieldCheck, 
            color: "text-green-600"
        },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {INFO_CARDS.map(({ label, value, icon: Icon, color }) => (
                <div 
                    key={label} 
                    className="group p-8 rounded-[2.5rem] bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.03)] border border-gray-50 hover:border-[#F25E0A]/20 hover:-translate-y-2 hover:shadow-[0_20px_40px_-12px_rgba(242,94,10,0.12)] transition-all duration-500"
                >
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-[#F25E0A]/10 group-hover:rotate-12 transition-all duration-500">
                            <Icon className={`w-5 h-5 ${color} transition-transform duration-500 group-hover:scale-110`} />
                        </div>
                        <p className="text-[10px] font-black text-gray-1000 uppercase tracking-[0.3em] group-hover:text-gray-1000 transition-colors">{label}</p>
                    </div>
                    <p className="text-[17px] font-black text-gray-900 break-all leading-tight tracking-tight group-hover:scale-[1.02] origin-left transition-transform duration-500">{value}</p>
                </div>
            ))}
        </div>
    );
};
