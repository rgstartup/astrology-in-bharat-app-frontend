"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getApiUrl } from "@/utils/api-config";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";
import apiClient from "@/libs/api-profile";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore"; // Changed import

const Image = NextImage as any;
const { ChevronLeft, MessageSquare, User, Calendar, MapPin, UserX } = LucideIcons as any;

interface AstrologerData {
    id: string | number;
    name: string;
    image: string;
    expertise: string;
    experience: number;
    price: number;
    chat_price?: number;
    call_price?: number;
    video_call_price?: number;
    languages: string[];
    rating: number;
    is_available: boolean;
}

const API_BASE_URL = getApiUrl();

export default function ConsultationPrep() {
    const params = useParams();
    const router = useRouter();
    const id = params.id as string;

    const [astrologer, setAstrologer] = useState<AstrologerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [askSomeoneElse, setAskSomeoneElse] = useState(true);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const { isClientAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchAstro = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/expert/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setAstrologer({
                        id: data.id,
                        name: data.user?.name || "Astrologer",
                        image: data.user?.avatar || "/images/dummy-astrologer.jpg",
                        expertise: data.specialization || "Vedic Astrology",
                        experience: data.experience_in_years || 0,
                        price: data.price || 0,
                        chat_price: data.chat_price,
                        call_price: data.call_price,
                        video_call_price: data.video_call_price,
                        languages: data.languages || [],
                        rating: data.rating || 5,
                        is_available: data.is_available || false,
                    });
                } else {
                    setAstrologer(null);
                }
            } catch (error) {
                console.error("Failed to fetch astrologer for prep:", error);
                setAstrologer(null);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchAstro();
    }, [id]);

    const handleStartConsultation = async () => {
        if (!isClientAuthenticated) {
            toast.error("Please login to start consultation");
            return;
        }

        // Show security modal first
        setShowSecurityModal(true);
    };

    const proceedToChat = async () => {
        setShowSecurityModal(false);
        setActionLoading(true);
        try {
            const response = await apiClient.post<any>("/chat/initiate", { expertId: parseInt(id) });
            if (response.data && response.data.id) {
                // Save to localStorage for the global floating button
                localStorage.setItem('activeChatSession', JSON.stringify({
                    id: response.data.id,
                    expertId: id,
                    status: 'pending',
                    timestamp: Date.now()
                }));

                toast.success("Connecting to expert...");
                router.push(`/chat/room/${id}?sessionId=${response.data.id}`);
            }
        } catch (error: any) {
            console.error("Initiation error:", error);
            const msg = error.response?.data?.message || "Failed to start consultation";
            toast.error(msg);
        } finally {
            setActionLoading(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!astrologer) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <UserX className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Expert Not Found</h2>
            <p className="text-gray-500 max-w-sm mb-8">
                The astrologer you are looking for might be unavailable or does not exist.
            </p>
            <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-primary text-white rounded-full font-bold shadow-lg hover:bg-primary-hover transition-all"
            >
                Go to Home
            </button>
        </div>
    );

    return (
        <div
            className="min-h-screen bg-cover bg-center bg-fixed pb-20 relative"
            style={{ backgroundImage: "url('/images/white-background.png')" }}
        >
            {/* Premium Glassmorphic Styles */}
            <style>
                {`
                @keyframes float {
                    0%, 100% { transform: translateY(0) scale(1.05); }
                    50% { transform: translateY(-10px) scale(1.08); }
                }
                .astro-card-glow {
                    background: radial-gradient(circle at 50% 50%, rgba(253,100,16,0.15), transparent 70%);
                }
                `}
            </style>

            {/* Top Navigation */}
            <nav className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-gray-100 px-4 py-4 md:px-10 flex items-center justify-between">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 group text-gray-400 hover:text-primary transition-colors"
                >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest">Back</span>
                </button>

                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Astro-Secure Link</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 pt-10 md:pt-16">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">

                    {/* Left: Interactive Onboarding Card */}
                    <div className="lg:col-span-7 space-y-8 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="space-y-4">
                            <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20 inline-block">
                                Preparing Connection
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-[1.1] tracking-tight">
                                Talk to <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400">
                                    {astrologer?.name}
                                </span>
                            </h1>
                            <p className="text-gray-500 text-lg md:text-xl font-medium max-w-lg leading-relaxed">
                                Get deep cosmic insights about your career, marriage, and future. Your session is 100% private.
                            </p>
                        </div>

                        {/* Feature Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4 group-hover:bg-primary transition-colors">
                                    <MessageSquare className="w-6 h-6 text-primary group-hover:text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Live Chat</h3>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">Real-time answers from verified experts.</p>
                            </div>
                            <div className="p-6 rounded-[2.5rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:translate-y-[-5px] transition-all duration-500 group">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
                                    <Calendar className="w-6 h-6 text-blue-500 group-hover:text-white" />
                                </div>
                                <h3 className="font-bold text-gray-900 mb-1">Instant Access</h3>
                                <p className="text-xs text-gray-400 leading-relaxed font-medium">No appointments needed. Connect now.</p>
                            </div>
                        </div>

                        {/* Consultation Checklist */}
                        <div className="p-8 rounded-[3rem] bg-[#1a1a1a] text-white overflow-hidden relative group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary opacity-10 blur-[80px] -mr-32 -mt-32"></div>
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                Session Checklist
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Keep your Birth Date & Time ready",
                                    "Ask specific questions for clearer answers",
                                    "Your session is 256-bit encrypted",
                                    "Expert is live and awaiting your message"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-bold opacity-70 hover:opacity-100 transition-opacity">
                                        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px]">
                                            {i + 1}
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Right: Expert Preview & CTA */}
                    <div className="lg:col-span-5 relative">
                        <div className="sticky top-28">
                            <div className="p-2 bg-white rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.08)] relative overflow-hidden">
                                {/* Expert Image Section */}
                                <div className="relative h-[480px] rounded-[3rem] overflow-hidden group">
                                    <Image
                                        src={astrologer?.image || "/images/dummy-astrologer.jpg"}
                                        alt={astrologer?.name || "Astrologer"}
                                        fill
                                        className="object-cover transition-transform duration-1000 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

                                    {/* Availability Badge */}
                                    <div className={`absolute top-6 left-6 px-4 py-2 backdrop-blur-md rounded-full border flex items-center gap-2 ${astrologer?.is_available
                                        ? 'bg-white/10 border-white/20'
                                        : 'bg-gray-900/30 border-gray-500/30'
                                        }`}>
                                        <div className={`w-2 h-2 rounded-full ${astrologer?.is_available
                                            ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]'
                                            : 'bg-gray-400'
                                            }`}></div>
                                        <span className="text-white text-[10px] font-black uppercase tracking-widest">
                                            {astrologer?.is_available ? 'Available Now' : 'Offline'}
                                        </span>
                                    </div>

                                    {/* Price Badge */}
                                    <div className="absolute top-6 right-6 px-4 py-2 bg-[#fd6410] rounded-full shadow-lg flex items-center gap-2">
                                        <span className="text-white text-xs font-black uppercase tracking-widest">
                                            ₹{astrologer?.chat_price || astrologer?.price || 0} / min
                                        </span>
                                    </div>

                                    {/* Bottom Info Overlay */}
                                    <div className="absolute bottom-10 left-10 right-10">
                                        <div className="flex items-center gap-6 mb-4">
                                            <div className="flex flex-col">
                                                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Experience</span>
                                                <span className="text-white font-bold">{astrologer?.experience}+ Years</span>
                                            </div>
                                            <div className="w-[1px] h-8 bg-white/20"></div>
                                            <div className="flex flex-col">
                                                <span className="text-white/60 text-[10px] font-black uppercase tracking-widest mb-1">Expertise</span>
                                                <span className="text-white font-bold">{astrologer?.expertise}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4 text-orange-400" />
                                            <span className="text-white/80 text-xs font-medium">Verified Astro Expert • Bharat</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8 space-y-6">
                                    {/* Option to toggle who is asking */}
                                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                        <div className="flex flex-col">
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consulting for</span>
                                            <span className="text-sm font-bold text-gray-900">{askSomeoneElse ? "Myself" : "Someone Else"}</span>
                                        </div>
                                        <button
                                            onClick={() => setAskSomeoneElse(!askSomeoneElse)}
                                            className="px-4 py-2 text-[10px] font-black text-[#fd6410] uppercase tracking-widest hover:bg-[#fd6410]/5 rounded-xl transition-colors"
                                        >
                                            Change
                                        </button>
                                    </div>

                                    {/* Big CTA with Hover Effects */}
                                    <div className="pt-6 relative group">
                                        {/* Glow Effect */}
                                        <div className="absolute -inset-2 bg-gradient-to-r from-[#fd6410] to-orange-400 rounded-[45px] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>

                                        <button
                                            onClick={handleStartConsultation}
                                            disabled={actionLoading}
                                            className={`relative w-full py-6 bg-gradient-to-br from-orange-400 via-[#fd6410] to-[#fd6410] text-white rounded-[2.5rem] font-black text-xl flex items-center justify-center gap-4 shadow-[0_20px_40px_rgba(253,100,16,0.25)] hover:shadow-[0_25px_60px_rgba(253,100,16,0.35)] hover:-translate-y-1 active:translate-y-0.5 active:scale-[0.99] transition-all duration-300 border-b-8 border-[#fd6410]/80 overflow-hidden ${actionLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent pointer-events-none"></div>
                                            <MessageSquare className="w-7 h-7 fill-white/20" />
                                            <span>{actionLoading ? "CONNECTING..." : "START CONSULTATION"}</span>
                                        </button>

                                        <div className="flex flex-col items-center gap-4 mt-8">
                                            <div className="text-[10px] text-gray-400 font-black uppercase tracking-[0.4em] flex items-center gap-3">
                                                <div className="w-10 h-[1px] bg-gray-200"></div>
                                                Privacy Protected
                                                <div className="w-10 h-[1px] bg-gray-200"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Pill */}
                            <div className="mt-8 flex items-center justify-center gap-4">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-2 h-2 bg-orange-400/20 rounded-full"></div>
                                ))}
                                <span className="text-[9px] font-black text-gray-300 uppercase tracking-[0.5em]">Trust & Integrity</span>
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="w-2 h-2 bg-orange-400/20 rounded-full"></div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Security Tips Modal */}
            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg max-h-[95vh] rounded-[2rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300 flex flex-col">
                        {/* Header - Fixed */}
                        <div className="p-3 md:p-4 bg-gradient-to-br from-red-500 to-orange-500 text-white relative overflow-hidden flex-shrink-0">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                            <div className="relative z-10 flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur-sm flex-shrink-0">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <div>
                                    <h2 className="text-base md:text-lg font-black leading-tight">Important Safety Guidelines</h2>
                                    <p className="text-white/80 text-[10px] md:text-[11px] font-medium leading-tight">Please read carefully before starting</p>
                                </div>
                            </div>
                        </div>

                        {/* Content - Scrollable */}
                        <div className="p-4 md:p-6 space-y-4 overflow-y-auto flex-1">
                            <div className="space-y-3">
                                {[
                                    {
                                        icon: "🔒",
                                        title: "Never Share OTPs or Passwords",
                                        desc: "Our experts will NEVER ask for OTPs, passwords, bank PINs, or CVV numbers. If anyone asks, report immediately."
                                    },
                                    {
                                        icon: "🚫",
                                        title: "Beware of External Links",
                                        desc: "Do not click on any suspicious links shared during the chat. All payments are processed securely within our platform only."
                                    },
                                    {
                                        icon: "💳",
                                        title: "Payment Security",
                                        desc: "Never make payments outside our official platform. All transactions are encrypted and protected by our secure payment gateway."
                                    },
                                    {
                                        icon: "📱",
                                        title: "Personal Information",
                                        desc: "Avoid sharing sensitive personal details like Aadhaar, PAN, or credit card numbers. Only share astrological information."
                                    },
                                    {
                                        icon: "📵",
                                        title: "Do Not Share Contact Details",
                                        desc: "NEVER share your mobile number, email, WhatsApp, or any social media handles with the astrologer. All communication must happen only on our platform."
                                    },
                                    {
                                        icon: "⛔",
                                        title: "No Direct Contact Outside Platform",
                                        desc: "Do NOT contact astrologers directly outside this platform. If you do so and face any issues, Astrology in Bharat will NOT be responsible or liable."
                                    },
                                    {
                                        icon: "⚠️",
                                        title: "Report Suspicious Activity",
                                        desc: "If you notice any unusual behavior or requests, immediately end the session and contact our support team."
                                    },
                                    {
                                        icon: "✅",
                                        title: "Verified Experts Only",
                                        desc: "All our astrologers are verified professionals. However, use your judgment and stay alert during consultations."
                                    }
                                ].map((tip, index) => (
                                    <div key={index} className="flex gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-orange-200 transition-colors">
                                        <div className="text-3xl flex-shrink-0">{tip.icon}</div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 mb-1 text-sm">{tip.title}</h3>
                                            <p className="text-xs text-gray-600 leading-relaxed">{tip.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Disclaimer Box */}
                            <div className="p-5 bg-red-50 rounded-2xl border-2 border-red-200">
                                <div className="flex gap-3">
                                    <div className="text-2xl flex-shrink-0">⚖️</div>
                                    <div>
                                        <h3 className="font-black text-red-700 mb-2 text-sm">Important Disclaimer</h3>
                                        <p className="text-xs text-red-600 leading-relaxed font-semibold">
                                            By proceeding, you acknowledge that any communication or transaction outside the Astrology in Bharat platform is strictly at your own risk.
                                            <span className="font-black"> We will NOT be held responsible or liable for any issues, fraud, or losses</span> arising from direct contact with astrologers outside our official platform.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Checkbox Agreement */}
                            <div className="p-4 bg-orange-50 rounded-2xl border-2 border-orange-200">
                                <label className="flex items-start gap-5 cursor-pointer group">
                                    <input
                                        type="checkbox"
                                        id="agreeTerms"
                                        className="m-2 w-5 h-5 rounded border-2 border-orange-400 text-orange-500 focus:ring-2 focus:ring-orange-500 cursor-pointer flex-shrink-0"
                                    />
                                    <span className="text-xs md:text-sm font-bold text-gray-800transition-colors leading-relaxed">
                                        I have read and understood all the safety guidelines and disclaimer. I agree to follow these precautions during my consultation and will not share any contact details.
                                    </span>
                                </label>
                            </div>
                        </div>

                        {/* Footer Actions - Fixed */}
                        <div className="p-4 md:p-5 bg-gray-50 border-t border-gray-100 flex gap-3 flex-shrink-0">
                            <button
                                onClick={() => setShowSecurityModal(false)}
                                className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl border-2 border-gray-200 text-gray-600 font-bold text-xs md:text-sm hover:bg-gray-100 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={() => {
                                    const checkbox = document.getElementById('agreeTerms') as HTMLInputElement;
                                    if (!checkbox?.checked) {
                                        toast.warning("⚠️ Please agree to the safety guidelines to continue");
                                        // Shake animation for checkbox
                                        const checkboxContainer = checkbox?.parentElement;
                                        if (checkboxContainer) {
                                            checkboxContainer.classList.add('animate-shake');
                                            setTimeout(() => checkboxContainer.classList.remove('animate-shake'), 500);
                                        }
                                        return;
                                    }
                                    proceedToChat();
                                }}
                                className="flex-1 py-3 md:py-4 rounded-xl md:rounded-2xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-black text-xs md:text-sm hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
                            >
                                I Agree & Continue
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
