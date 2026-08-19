"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaComments, FaPhone, FaVideo, FaStar, FaArrowRight, FaCalendarTimes, FaCircle } from "react-icons/fa";
import { HiOutlineSparkles } from "react-icons/hi";
import { api } from "@/lib/api";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

const SessionHistory = () => {
    const [sessions, setSessions] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("All");
    const [offset, setOffset] = useState(0);
    const [totalRecords, setTotalRecords] = useState(0);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedSession, setSelectedSession] = useState<any>(null);
    const limit = 10;

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);
                const [result, error] = await api.get<any>(`/consultations/history?limit=${limit}&offset=${offset}`);
                
                if (error) {
                    toast.error(getErrorMessage(error) || "Failed to load session history");
                    return;
                }

                const items = Array.isArray(result) ? result : (result?.items || result?.data || []);
                setSessions(items);
                setTotalRecords(result?.meta?.totalCount || items.length);
            } catch (err) {
                console.error("Error fetching history:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [offset]);

    const filteredSessions =
        activeTab === "All"
            ? sessions
            : sessions.filter((session) => session.status?.toLowerCase() === activeTab.toLowerCase());

    const getTypeIcon = (type: string) => {
        const t = (type || "").toLowerCase();
        if (t.includes('chat')) return <FaComments />;
        if (t.includes('audio')) return <FaPhone />;
        if (t.includes('video')) return <FaVideo />;
        return <FaStar />;
    };

    const openDetails = (session: any) => {
        setSelectedSession(session);
        setShowDetailModal(true);
    };

    const formatDateTime = (dateStr: string) => {
        if (!dateStr) return { date: "N/A", time: "N/A" };
        const d = new Date(dateStr);
        return {
            date: d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
            time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
    };

    return (
        <div className="bg-[#fcfafc] min-h-screen font-display">
            {/* Header / Hero Section */}
            <section className="relative pt-32 pb-48 overflow-hidden bg-slate-950 text-white">
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none z-0 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none z-0 opacity-30"></div>
                
                <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-8">
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 shadow-2xl">
                        <HiOutlineSparkles className="text-orange-500 text-xs" />
                        <span className="text-[10px] font-black text-white/80 uppercase tracking-[.3em]">User Service History</span>
                    </div>
                    
                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-none uppercase">
                        My <span className="text-orange-500 italic underline underline-offset-[12px] decoration-orange-500/20">Sessions</span>
                    </h1>
                </div>
            </section>

            {/* Main Content Area */}
            <main className="max-w-7xl mx-auto px-4 -mt-24 pb-32 relative z-10">
                {/* Premium Tabs Navigation */}
                <div className="flex justify-center mb-12">
                    <div className="inline-flex flex-wrap items-center justify-center gap-2 bg-white/80 backdrop-blur-2xl p-2 rounded-[2.5rem] shadow-premium border border-white/50">
                        {["All", "Scheduled", "Completed", "Cancelled", "Rejected"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 ${
                                    activeTab === tab 
                                    ? "bg-slate-950 text-white shadow-2xl scale-105" 
                                    : "text-slate-400 hover:text-slate-950"
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Session List */}
                <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-[3rem] border border-gray-100 shadow-xl">
                            <div className="w-16 h-16 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                            <p className="text-gray-400 font-black uppercase tracking-[0.3em] text-xs">Accessing Astral Records...</p>
                        </div>
                    ) : filteredSessions.length > 0 ? (
                        filteredSessions.map((session, idx) => {
                            const { date, time } = formatDateTime(session.startTime || session.createdAt);
                            const status = (session.status || "Completed").toUpperCase();
                            
                            return (
                                <div 
                                    key={session.id} 
                                    onClick={() => openDetails(session)}
                                    className="group relative bg-white rounded-[2.5rem] border border-gray-100 p-8 md:p-12 shadow-premium hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 cursor-pointer"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-center">
                                        {/* Expert Info */}
                                        <div className="md:col-span-5 flex items-center gap-8">
                                            <div className="relative w-24 h-24 shrink-0 group-hover:scale-110 transition-transform duration-700">
                                                <div className="absolute -inset-1.5 bg-gradient-to-r from-orange-500 to-indigo-500 rounded-full blur-[5px] opacity-20 group-hover:opacity-40 transition-all"></div>
                                                <div className="relative w-full h-full rounded-full border-2 border-white overflow-hidden shadow-2xl bg-gray-50">
                                                    {session.expert_image ? (
                                                        <Image
                                                            src={session.expert_image}
                                                            alt={session.expert_name || "Expert"}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-orange-100 text-orange-600 font-black text-2xl">
                                                            {(session.expert_name || "E").charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="absolute -right-2 -bottom-2 w-10 h-10 bg-slate-950 text-white rounded-2xl flex items-center justify-center text-sm shadow-2xl border-2 border-white group-hover:bg-orange-600 transition-colors">
                                                    {getTypeIcon(session.type)}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="text-2xl font-black text-slate-950 mb-1 group-hover:text-orange-600 transition-colors uppercase tracking-tight">
                                                    {session.expert_name || "Expert"}
                                                </h3>
                                                <div className="flex items-center gap-3 mt-1">
                                                    <span className="w-1.5 h-1.5 bg-orange-500 rounded-full opacity-50"></span>
                                                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest">
                                                        {date} <span className="text-slate-200">|</span> {time}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Stats Middle */}
                                        <div className="md:col-span-4 grid grid-cols-2 gap-8 border-y border-gray-50 md:border-y-0 md:border-x py-8 md:py-0 text-center sm:text-left">
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Duration</p>
                                                <h6 className="text-lg font-black text-slate-950 tabular-nums uppercase">{session.durationString || "0s"}</h6>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest leading-none">Total Paid</p>
                                                <h6 className="text-lg font-black text-orange-600 tabular-nums uppercase">₹{session.total_cost || session.amount || 0}</h6>
                                            </div>
                                        </div>

                                        {/* Status & Action */}
                                        <div className="md:col-span-3 flex flex-col md:items-end gap-6">
                                            <div className={`inline-flex items-center gap-3 px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all duration-500 ${
                                                status === "COMPLETED" ? "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-500 group-hover:text-white" :
                                                status === "SCHEDULED" || status === "PENDING" || status === "ACTIVE" ? "bg-amber-50 text-amber-600 border-amber-100 group-hover:bg-amber-500 group-hover:text-white" :
                                                "bg-rose-50 text-rose-600 border-rose-100 group-hover:bg-rose-500 group-hover:text-white"
                                            }`}>
                                                <FaCircle className={`text-[6px] animate-pulse ${status === "COMPLETED" ? "text-emerald-500 group-hover:text-white" : (status === "SCHEDULED" || status === "ACTIVE") ? "text-amber-500 group-hover:text-white" : "text-rose-500 group-hover:text-white"}`} />
                                                {status}
                                            </div>

                                            <div className="w-full md:w-auto">
                                                {status === "COMPLETED" && (
                                                    <Link 
                                                        href={`/expert-details?id=${session.expertId || session.expert_id}`} 
                                                        className="group/btn relative w-full inline-flex items-center justify-center gap-4 bg-slate-950 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-orange-600 hover:-translate-y-1 active:scale-95 transition-all overflow-hidden"
                                                    >
                                                        <span className="relative z-10">Rebook Expert</span>
                                                        <FaArrowRight className="relative z-10 text-[10px] group-hover/btn:translate-x-1 transition-transform" />
                                                    </Link>
                                                )}
                                                {status === "ACTIVE" && (
                                                    <Link 
                                                        href={session.type === 'CHAT' ? `/chat/${session.id}` : session.type === 'VIDEO_CALL' ? `/video/${session.id}` : `/call/${session.id}`}
                                                        onClick={(e) => e.stopPropagation()}
                                                        className="group/btn relative w-full inline-flex items-center justify-center gap-4 bg-orange-600 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:-translate-y-1 active:scale-95 transition-all overflow-hidden shadow-orange-500/20"
                                                    >
                                                        <span className="relative z-10 font-black">Join Session</span>
                                                        <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-32 bg-white rounded-[4rem] border-2 border-dashed border-gray-100">
                            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-10 text-slate-200">
                                <FaCalendarTimes size={48} />
                            </div>
                            <h4 className="text-3xl font-black text-slate-950 uppercase tracking-tighter mb-4">No sessions found</h4>
                            <p className="text-lg text-slate-400 font-bold italic mb-12 max-w-sm mx-auto">You haven&apos;t booked any consultations in this category yet.</p>
                            <Link 
                                href="/our-experts" 
                                className="inline-flex items-center gap-6 bg-slate-950 text-white px-12 py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] shadow-2xl hover:bg-orange-600 hover:-translate-y-1 active:scale-95 transition-all"
                            >
                                Book a Consultation <FaArrowRight />
                            </Link>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalRecords > limit && (
                    <div className="mt-20 flex justify-center gap-6">
                        <button 
                            onClick={() => setOffset(Math.max(0, offset - limit))}
                            disabled={offset === 0}
                            className="bg-white border border-gray-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            Previous
                        </button>
                        <button 
                            onClick={() => setOffset(offset + limit)}
                            disabled={offset + limit >= totalRecords}
                            className="bg-white border border-gray-100 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-sm hover:shadow-md disabled:opacity-30 disabled:pointer-events-none transition-all"
                        >
                            Next
                        </button>
                    </div>
                )}
            </main>

            {/* Premium Detail Modal (User Version) */}
            {showDetailModal && selectedSession && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" onClick={() => setShowDetailModal(false)}></div>
                    
                    <div className="relative bg-white rounded-[3rem] shadow-2xl w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-300">
                        {/* Header Section */}
                        <div className="bg-gradient-to-br from-[#fd6410] to-[#ff8c4a] p-10 text-center relative border-b border-orange-100/20">
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                            <button 
                                onClick={() => setShowDetailModal(false)}
                                className="absolute top-6 right-6 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-all active:scale-90"
                            >
                                <FaCalendarTimes className="rotate-45" />
                            </button>

                            <div className="w-24 h-24 rounded-full border-4 border-white overflow-hidden mx-auto mb-6 shadow-2xl relative z-10 bg-white">
                                {selectedSession.expert_image ? (
                                    <Image src={selectedSession.expert_image} alt="Expert" fill className="object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-white text-orange-500 flex items-center justify-center text-3xl font-black">
                                        {(selectedSession.expert_name || "E").charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-3xl font-black text-white uppercase tracking-tight relative z-10 leading-none">{selectedSession.expert_name || "Expert"}</h3>
                            <p className="text-white/80 font-bold text-[10px] uppercase tracking-[0.4em] mt-3 relative z-10">Session Summary</p>
                        </div>

                        {/* Content */}
                        <div className="p-8 space-y-8">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="p-6 bg-slate-50 rounded-[2.5rem] border border-slate-100 space-y-1">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Total Duration</p>
                                    <h6 className="text-2xl font-black text-slate-950 tabular-nums">{selectedSession.durationString || "0s"}</h6>
                                </div>
                                <div className="p-6 bg-orange-50/50 rounded-[2.5rem] border border-orange-100/50 space-y-1 text-center sm:text-left">
                                    <p className="text-[9px] font-black text-orange-400 uppercase tracking-widest leading-none">Total Paid</p>
                                    <h6 className="text-2xl font-black text-[#fd6410] tabular-nums">₹{Number(selectedSession.total_cost || selectedSession.amount || 0).toFixed(2)}</h6>
                                </div>
                            </div>

                            <div className="p-8 bg-slate-900 rounded-[3rem] text-white flex justify-between items-center relative overflow-hidden group">
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <div>
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Status</p>
                                    <h5 className="text-xl font-black uppercase tracking-tighter text-orange-500">{(selectedSession.status || "Completed")}</h5>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-1">Date</p>
                                    <h5 className="text-sm font-black text-white/90">{formatDateTime(selectedSession.startTime || selectedSession.createdAt).date}</h5>
                                </div>
                            </div>

                            {selectedSession.terminatedBy && (
                                <div className="flex items-center justify-between px-8 py-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Session Ended By</p>
                                    <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest px-3 py-1 bg-white border border-slate-200 rounded-lg shadow-sm">
                                        {selectedSession.terminatedBy.toUpperCase() === 'USER' ? 'You (Client)' : 'Expert'}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col gap-4">
                                <Link 
                                    href={`/expert-details?id=${selectedSession.expertId || selectedSession.expert_id}`}
                                    className="w-full py-6 bg-[#fd6410] hover:bg-[#e85a0e] text-white rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] text-center shadow-xl shadow-orange-500/20 active:scale-[0.98] transition-all"
                                >
                                    Rebook Expert
                                </Link>
                                <button 
                                    onClick={() => setShowDetailModal(false)}
                                    className="w-full py-6 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[2rem] font-black text-xs uppercase tracking-[0.4em] active:scale-[0.98] transition-all"
                                >
                                    Close Records
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SessionHistory;
