
"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronLeft, MessageSquare, User, Calendar, MapPin } from "lucide-react";

interface AstrologerData {
    id: string | number;
    name: string;
    image: string;
    expertise: string;
    experience: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";

export default function ConsultationPrep() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [astrologer, setAstrologer] = useState<AstrologerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [askSomeoneElse, setAskSomeoneElse] = useState(true);

    useEffect(() => {
        const fetchAstro = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/v1/expert/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAstrologer({
                        id: data.id,
                        name: data.user?.name || "Astrologer",
                        image: data.user?.avatar || "/images/astro-img1.png",
                        expertise: data.specialization || "Vedic Astrology",
                        experience: data.experience_in_years || 0,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch astrologer for prep:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAstro();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#fd6410]"></div>
        </div>
    );

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed pb-20 relative"
            style={{ backgroundImage: "url('/images/white-background.png')" }}
        >
            {/* Background Overlay for better readability */}
            <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px]"></div>

            {/* Header */}
            <header className="bg-white/80 backdrop-blur-md px-4 py-4 sticky top-0 z-30 border-b border-gray-100 flex items-center justify-center shadow-sm">
                <button
                    onClick={() => router.back()}
                    className="absolute left-4 p-2 hover:bg-[#fd6410]/10 rounded-full transition-all active:scale-90 group"
                >
                    <ChevronLeft className="w-6 h-6 text-gray-700 group-hover:text-[#fd6410]" />
                </button>
                <h1 className="text-xl font-bold text-[#800000] tracking-tight">Consultation Prep</h1>
            </header>

            <div className="max-w-6xl mx-auto p-4 md:py-10 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

                    {/* Left Column: Workflow */}
                    <div className="group space-y-8 bg-white/70 backdrop-blur-xl p-6 md:p-10 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-[3px] border-[#fd6410] transition-all duration-500">
                        <h2 className="text-2xl font-bold text-[#800000] mb-2 flex items-center gap-4">
                            <div className="w-1.5 h-6 bg-[#800000] rounded-full"></div>
                            Workflow
                        </h2>

                        <style jsx>{`
                            @keyframes flowDown {
                                0% {
                                    top: -100%;
                                }
                                100% {
                                    top: 100%;
                                }
                            }
                            .flow-line {
                                position: relative;
                                overflow: hidden;
                            }
                            .flow-line::after {
                                content: '';
                                position: absolute;
                                left: 0;
                                width: 100%;
                                height: 50%;
                                background: linear-gradient(to bottom, transparent, #800000, transparent);
                                animation: flowDown 3s linear infinite;
                            }
                        `}</style>

                        <div className="space-y-0 relative">
                            {/* Step 1: Active */}
                            <div className="flex gap-6 relative">
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="w-11 h-11 rounded-full bg-white border-[6px] border-[#fd6410]/10 flex items-center justify-center z-10 shadow-sm relative">
                                        <div className="w-3.5 h-3.5 rounded-full bg-[#fd6410] shadow-[0_0_10px_rgba(253,100,16,0.3)]"></div>
                                        <div className="absolute inset-0 rounded-full border-2 border-[#fd6410] opacity-30 scale-110"></div>
                                    </div>
                                    {/* Line segment - Grows to fill space */}
                                    <div className="flex-1 w-[4px] bg-[#800000]/20 -mt-1 flow-line"></div>
                                </div>
                                <div className="flex-1 pb-12">
                                    <div className="bg-white p-6 rounded-[2.5rem] border-2 border-[#fd6410]/20 shadow-sm transition-all duration-300 hover:shadow-md">
                                        <h3 className="text-xl font-bold text-[#800000]">Connecting to Expert</h3>
                                        <p className="text-[13px] text-[#800000] mt-2 font-medium leading-relaxed opacity-80">Our top astrologers are being notified to join your session.</p>
                                        <div className="flex items-center gap-3 mt-4">
                                            <span className="px-6 py-2 bg-[#fd6410] text-[#800000] text-[9px] font-black rounded-full shadow-[0_5px_15px_rgba(253,100,16,0.15)] uppercase tracking-widest leading-none">
                                                Active
                                            </span>
                                            <div className="flex gap-1.5">
                                                <div className="w-1.5 h-1.5 bg-[#fd6410] rounded-full animate-pulse shadow-[0_0_5px_#fd6410]"></div>
                                                <div className="w-1.5 h-1.5 bg-[#fd6410] rounded-full opacity-60"></div>
                                                <div className="w-1.5 h-1.5 bg-[#fd6410] rounded-full opacity-30"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Inactive */}
                            <div className="flex gap-6 relative">
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="w-11 h-11 rounded-full bg-white border-2 border-[#fd6410]/20 flex items-center justify-center z-10 text-[#fd6410]">
                                        <Calendar className="w-5 h-5 opacity-60" />
                                    </div>
                                    {/* Line segment - Grows to fill space */}
                                    <div className="flex-1 w-[4px] bg-[#800000]/20 -mt-1 flow-line"></div>
                                </div>
                                <div className="flex-1 pb-12">
                                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border border-[#fd6410]/10 shadow-sm transition-all duration-300">
                                        <h3 className="text-lg font-bold text-[#800000]">5 Mins Free Session</h3>
                                        <p className="text-[12px] text-[#800000] mt-1 font-medium italic opacity-60">Session will start automatically.</p>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Inactive */}
                            <div className="flex gap-6 relative">
                                <div className="flex flex-col items-center shrink-0">
                                    <div className="w-11 h-11 rounded-full bg-white border-2 border-[#fd6410]/20 flex items-center justify-center z-10 text-[#fd6410]">
                                        <User className="w-5 h-5 opacity-60" />
                                    </div>
                                </div>
                                <div className="flex-1 pb-2">
                                    <div className="bg-white/50 backdrop-blur-sm p-6 rounded-[2.5rem] border border-[#fd6410]/10 shadow-sm transition-all duration-300">
                                        <h3 className="text-lg font-bold text-[#800000]">Deep Consultation</h3>
                                        <p className="text-[12px] text-[#800000] mt-1 font-medium opacity-60">Option to extend via wallet recharge.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: User Content */}
                    <div className="space-y-8">
                        {/* Profile Section */}
                        <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-[3px] border-[#fd6410] group hover:shadow-[0_30px_60px_rgba(253,100,16,0.08)] transition-all duration-500">
                            <h2 className="text-2xl font-black text-[#800000] mb-8 flex items-center gap-3">
                                <User className="w-6 h-6 text-[#fd6410]" /> Profile to be shared
                            </h2>
                            <div className="flex items-center gap-8 bg-gradient-to-br from-gray-50 to-white p-8 rounded-3xl border border-gray-100 relative overflow-hidden group-hover:border-[#fd6410]/20 transition-colors">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-[#fd6410]/5 rounded-full blur-3xl -mr-10 -mt-10"></div>
                                <div className="flex-1 space-y-4">
                                    <h4 className="text-2xl font-black text-gray-800 tracking-tight">{astrologer?.name || "Aryan Sharma"}</h4>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                            <div className="p-2 bg-white rounded-xl border border-gray-50 shadow-sm group-hover:text-[#fd6410] transition-colors"><Calendar className="w-4 h-4" /></div>
                                            <span>15 Oct 1992</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                            <div className="p-2 bg-white rounded-xl border border-gray-50 shadow-sm group-hover:text-[#fd6410] transition-colors"><MapPin className="w-4 h-4" /></div>
                                            <span>New Delhi, India</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="w-28 h-28 rounded-[2rem] overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.2)] border-8 border-white group-hover:scale-105 transition-transform duration-500">
                                    <Image
                                        src={astrologer?.image || "/images/astro-img1.png"}
                                        alt="User"
                                        width={112}
                                        height={112}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Relative Section with 3D Toggle */}
                        <div className="bg-white/80 backdrop-blur-xl rounded-[40px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.03)] border-[3px] border-[#fd6410] group">
                            <div className="flex items-center justify-between mb-2">
                                <div className="space-y-1">
                                    <h3 className="font-black text-[#800000] text-xl tracking-tight">Family Questions?</h3>
                                    <p className="text-sm font-medium text-gray-400">Ask for your loved ones</p>
                                </div>

                                {/* User Requested Toggle Design */}
                                <label className="inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="sr-only peer"
                                        checked={askSomeoneElse}
                                        onChange={() => setAskSomeoneElse(!askSomeoneElse)}
                                    />
                                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#fd6410] shadow-inner"></div>
                                </label>
                            </div>

                            {askSomeoneElse && (
                                <div className="mt-10 space-y-8 animate-in fade-in slide-in-from-top-6 duration-700 zoom-in-95">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        <div className="group/input">
                                            <label className="block text-[11px] font-black text-[#800000] uppercase tracking-[0.2em] mb-3 ml-1 opacity-70">Relative's Name</label>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    defaultValue="Priya Sharma"
                                                    className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:border-[#fd6410]/30 focus:bg-white outline-none text-gray-700 font-bold shadow-inner transition-all"
                                                />
                                                <div className="absolute inset-0 rounded-2xl border-b-2 border-black/5 pointer-events-none"></div>
                                            </div>
                                        </div>
                                        <div className="group/input">
                                            <label className="block text-[11px] font-black text-[#800000] uppercase tracking-[0.2em] mb-3 ml-1 opacity-70">Relation</label>
                                            <div className="relative">
                                                <select className="w-full px-6 py-4 bg-gray-50/50 border-2 border-transparent rounded-2xl focus:border-[#fd6410]/30 focus:bg-white outline-none text-gray-700 font-bold appearance-none transition-all shadow-inner">
                                                    <option>Sibling</option>
                                                    <option>Parent</option>
                                                    <option>Friend</option>
                                                    <option>Spouse</option>
                                                </select>
                                                <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                                    <ChevronLeft className="w-5 h-5 rotate-[270deg]" />
                                                </div>
                                                <div className="absolute inset-0 rounded-2xl border-b-2 border-black/5 pointer-events-none"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Big CTA with Hover Effects */}
                        <div className="pt-6 relative group">
                            {/* Glow Effect */}
                            <div className="absolute -inset-2 bg-gradient-to-r from-[#fd6410] to-orange-400 rounded-[45px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

                            <button
                                onClick={() => router.push(`/chat/room/${id}`)}
                                className="relative w-full py-6 bg-gradient-to-br from-orange-400 via-[#fd6410] to-[#fd6410] text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(253,100,16,0.25)] hover:shadow-[0_25px_60px_rgba(253,100,16,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.99] transition-all duration-300 border-b-8 border-[#fd6410]/80 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                                <MessageSquare className="w-7 h-7 fill-white/20" />
                                <span>START CONSULTATION</span>
                            </button>

                            <div className="flex flex-col items-center gap-4 mt-8">
                                <p className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                    <div className="w-10 h-[1px] bg-gray-200"></div>
                                    Privacy Protected
                                    <div className="w-10 h-[1px] bg-gray-200"></div>
                                </p>
                                <div className="flex gap-4 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all">
                                    <img src="https://img.icons8.com/color/48/000000/visa.png" className="h-6" alt="Visa" />
                                    <img src="https://img.icons8.com/color/48/000000/mastercard.png" className="h-6" alt="Mastercard" />
                                    <img src="https://img.icons8.com/color/48/000000/google-pay.png" className="h-6" alt="GPay" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
