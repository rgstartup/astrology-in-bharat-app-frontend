"use client";

import React from "react";
import ExpertCard from "@/components/features/experts/ExpertCard";

type SidebarProps = {
    isDarkMode: boolean;
    expertData: any;
};

export default function Sidebar({ isDarkMode, expertData }: SidebarProps) {
    return (
        <aside className={`hidden lg:flex flex-col w-[380px] ${isDarkMode ? 'bg-[#1a0c0c] border-white/5' : 'bg-[#FFF1E6] border-black/5'} border-l p-6 space-y-6 overflow-y-auto transition-colors duration-500`}>
            <div className="scale-90 origin-top">
                <ExpertCard expertData={expertData} />
            </div>
        </aside>
    );
}
