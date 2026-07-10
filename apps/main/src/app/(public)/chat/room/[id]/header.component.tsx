"use client";

import React, { useState, useEffect } from "react";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";

const Image = NextImage as any;
const {
    ChevronLeft, Clock, Home, User: UserIcon, Sun, Moon, AlertCircle
} = LucideIcons as any;

type HeaderProps = {
    router: any;
    expertData: any;
    isFree: boolean;
    sessionStatus: string;
    formatTime: (time: number) => string;
    elapsedTime: number;
    timeLeft: number;
    handleEndChat: () => void;
    isDarkMode: boolean;
    setIsDarkMode: (val: boolean) => void;
};

export default function Header({
    router,
    expertData,
    isFree,
    sessionStatus,
    formatTime,
    elapsedTime,
    timeLeft,
    handleEndChat,
    isDarkMode,
    setIsDarkMode
}: HeaderProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!expertData) return null;

    return (
        <header className="bg-[#fd6410] sticky top-0 z-20 shadow-lg border-b border-black/10 shrink-0 w-full">

            {/* ── ROW 1: Back | Avatar + Name | Nav Buttons ── */}
            <div className="flex items-center justify-between px-2 md:px-8 py-1.5">
                {/* Left: Back + Avatar + Name */}
                <div className="flex items-center gap-1.5 md:gap-3">
                    <button
                        onClick={() => router.back()}
                        className="p-1 md:p-1.5 hover:bg-black/10 rounded-xl transition-all active:scale-90 flex flex-col items-center shrink-0"
                    >
                        <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        <span className="text-[8px] font-bold uppercase tracking-tighter text-white">Back</span>
                    </button>

                    <div className="w-px h-6 bg-black/10" />

                    <div className="flex items-center gap-1.5 md:gap-3">
                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border-2 border-white/20 overflow-hidden relative shadow-sm shrink-0">
                            <Image src={(expertData as any).image} alt={expertData.name} width={40} height={40} className="object-cover" />
                        </div>
                        <div>
                            <h1 className="font-bold text-[11px] md:text-sm leading-none text-white flex items-center gap-1.5">
                                {expertData.name}
                                {isFree && <span className="bg-[#1A1A1A] text-[#fd6410] px-1.5 py-0.5 rounded text-[7px] font-black uppercase tracking-tighter shadow-sm animate-bounce">Free</span>}
                            </h1>
                            <p className="text-[8px] text-white/80 mt-0.5">
                                {sessionStatus === 'active' ? 'Live Session' : sessionStatus === 'completed' ? 'Session Ended' : 'Waiting'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Right: Home | Profile | Dark/Light Toggle */}
                <div className="flex items-center gap-1 md:gap-1.5">
                    <button
                        onClick={() => router.push('/')}
                        className="p-1 md:p-1.5 hover:bg-black/10 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-0.5 text-white"
                    >
                        <Home className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[7px] md:text-[8px] font-bold uppercase">Home</span>
                    </button>
                    <button
                        onClick={() => router.push('/client/profile')}
                        className="p-1 md:p-1.5 hover:bg-black/10 rounded-xl transition-all active:scale-95 flex flex-col items-center gap-0.5 text-white"
                    >
                        <UserIcon className="w-4 h-4 md:w-5 md:h-5" />
                        <span className="text-[7px] md:text-[8px] font-bold uppercase">Profile</span>
                    </button>
                    <button
                        onClick={() => setIsDarkMode(!isDarkMode)}
                        className="w-8 h-8 md:w-10 md:h-10 bg-black/20 hover:bg-black/30 rounded-full flex items-center justify-center transition-all active:scale-90 shadow-inner"
                    >
                        {isDarkMode
                            ? <Sun className="w-4 h-4 md:w-5 md:h-5 text-yellow-400" />
                            : <Moon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                        }
                    </button>
                </div>
            </div>

            {/* ── ROW 2 (mobile only, shown when session active): Elapsed | Divider | Time Left | End Button ── */}
            {sessionStatus === 'active' && (
                <div className="flex items-center justify-between px-3 md:hidden py-1.5 bg-black/10 border-t border-black/10">
                    {/* Elapsed */}
                    <div className="flex flex-col items-start">
                        <span className="text-[8px] font-black uppercase tracking-widest text-white/70 leading-none">Elapsed</span>
                        <span className="text-sm font-black tabular-nums text-white leading-tight">
                            {mounted ? formatTime(elapsedTime) : "--:--"}
                        </span>
                    </div>

                    {/* Time Left Capsule */}
                    <div className="bg-black/20 px-3 py-1 rounded-full flex items-center gap-2 border border-white/20 shadow-inner">
                        <Clock className="w-3.5 h-3.5 text-white/80 shrink-0" />
                        <div className="flex flex-col items-start">
                            <span className="text-[7px] font-black uppercase tracking-widest text-white/70 leading-none">
                                {isFree ? 'Free Time' : 'Time Left'}
                            </span>
                            <span className="text-sm font-black tabular-nums text-white leading-tight">
                                {mounted ? formatTime(timeLeft) : "--:--"}
                            </span>
                        </div>
                    </div>

                    {/* End Button */}
                    <button
                        onClick={handleEndChat}
                        className="bg-white text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-full font-black text-[11px] shadow-lg flex items-center gap-1.5 transition-all active:scale-95"
                    >
                        <AlertCircle className="w-3.5 h-3.5" />
                        End Session
                    </button>
                </div>
            )}

            {/* ── DESKTOP: Timers + End Button inline (hidden on mobile) ── */}
            {sessionStatus === 'active' && (
                <div className="hidden md:flex items-center gap-5 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                    <div className="flex flex-col items-end gap-0.5">
                        <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/80 whitespace-nowrap leading-none">Elapsed</span>
                        <span className="text-base font-black tabular-nums text-white leading-none">
                            {mounted ? formatTime(elapsedTime) : "--:--"}
                        </span>
                    </div>
                    <div className="w-px h-8 bg-[#1A1A1A]/20" />
                    <div className="bg-black/20 backdrop-blur-md px-4 py-2 rounded-full flex items-center gap-4 border border-white/30 shadow-2xl">
                        <div className="p-1.5 bg-[#1A1A1A]/10 rounded-full">
                            <Clock className="w-3.5 h-3.5 text-white" />
                        </div>
                        <div className="flex flex-col items-start gap-0.5">
                            <span className="text-[9px] font-black uppercase tracking-[0.1em] text-white/80 whitespace-nowrap leading-none">
                                {isFree ? 'Free Time' : 'Time Left'}
                            </span>
                            <span className="text-base font-black tabular-nums text-white leading-none">
                                {mounted ? formatTime(timeLeft) : "--:--"}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={handleEndChat}
                        className="bg-white text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl font-bold text-sm shadow-lg flex items-center gap-2 transition-all active:scale-95"
                    >
                        <AlertCircle className="w-4 h-4" />
                        End Session
                    </button>
                </div>
            )}
        </header>
    );
}
