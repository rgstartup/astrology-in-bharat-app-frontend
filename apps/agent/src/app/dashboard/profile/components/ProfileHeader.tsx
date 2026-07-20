import React from "react";
import { Avatar, Button } from "@repo/ui";
import { toast } from "react-toastify";

interface ProfileHeaderProps {
    agent: any;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ agent }) => {
    return (
        <div className="bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(242,94,10,0.1)] border border-gray-100 overflow-hidden">
            {/* Professional Banner */}
            <div className="h-60 bg-[#1A1A1A] relative overflow-hidden">
                {/* Brand Orange Accent */}
                <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-[#F25E0A] to-transparent opacity-20" />
                <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#F25E0A] rounded-full blur-[100px] opacity-10" />
                
                {/* Subtle Brand Pattern */}
                <div className="absolute inset-0 opacity-[0.03] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
                
                <div className="absolute inset-0 flex items-center justify-end px-20">
                    <div className="text-right hidden md:block">
                        <p className="text-[#F25E0A] text-[10px] font-black uppercase tracking-[0.5em] mb-2">Agent Partnership Program</p>
                        <h1 className="text-white text-2xl font-black uppercase tracking-tighter opacity-20">Astrology in Bharat</h1>
                    </div>
                </div>
            </div>
            
            <div className="px-12 pb-12 -mt-24 relative">
                <div className="flex flex-col md:flex-row items-end justify-between gap-8 mb-12">
                    <div className="relative">
                        <div className="ring-[16px] ring-white rounded-[3rem] shadow-2xl overflow-hidden bg-white">
                            <Avatar
                                src={agent?.avatar ?? agent?.user?.avatar ?? null}
                                alt={agent?.user?.name ?? "Agent"}
                                size="xl"
                                className="!w-48 !h-48 object-cover"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-[#F25E0A] border-[8px] border-white rounded-[1.5rem] shadow-xl flex items-center justify-center">
                            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                        </div>
                    </div>
                    
                    <div className="pb-4 flex flex-col items-center md:items-end gap-4">
                        <Button
                            variant="primary"
                            className="rounded-2xl shadow-2xl shadow-[#F25E0A]/30 font-black uppercase tracking-[0.25em] text-[11px] bg-[#F25E0A] hover:bg-[#D94E00] border-none px-12 py-7 h-auto transition-all hover:scale-105 active:scale-95"
                            onClick={() => toast.info("Profile updates restricted. Contact Admin.")}
                        >
                            Edit Account
                        </Button>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Last login: Today at 10:30 AM</p>
                    </div>
                </div>
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <h2 className="text-6xl font-black text-gray-900 tracking-tight leading-none">
                            {agent?.user?.name ?? "Agent Partner"}
                        </h2>
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="px-6 py-2.5 bg-gray-900 text-white text-[11px] font-black uppercase tracking-[0.3em] rounded-2xl">
                                Official Field Agent
                            </span>
                            <div className="h-6 w-[2px] bg-gray-100 hidden md:block" />
                            <div className="flex items-center gap-3 px-5 py-2.5 bg-orange-50 rounded-2xl border border-orange-100/50">
                                <span className="text-[11px] font-black text-[#F25E0A] uppercase tracking-widest">Tier 1 Partner</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
