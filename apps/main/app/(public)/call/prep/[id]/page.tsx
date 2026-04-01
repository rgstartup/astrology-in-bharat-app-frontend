"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import NextImage from "next/image";
import * as LucideIcons from "lucide-react";
import { api as http } from "@/lib/api";
import { toast } from "react-toastify";
import { useAuthStore } from "@/store/useAuthStore";

const Image = NextImage as any;
const { ChevronLeft, Phone, Video, User, Calendar, MapPin, UserX, ShieldCheck } = LucideIcons as any;

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


function CallPrepContent() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const id = params.id as string;
    const type = searchParams.get('type') || 'audio';

    const [astrologer, setAstrologer] = useState<AstrologerData | null>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const [userBalance, setUserBalance] = useState<number>(0);
    const [showSecurityModal, setShowSecurityModal] = useState(false);
    const { isClientAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchAstro = async () => {
            const [res, fetchError] = await http.get<any>(`/expert/details/${id}`);
            
            if (fetchError) {
                console.error("Failed to fetch astrologer for call prep:", fetchError);
                setAstrologer(null);
            } else if (res && (res.id || res.user)) {
                const data = res?.data || res;
                setAstrologer({
                    id: data.id,
                    name: data.user?.name || "Astrologer",
                    image: data.user?.avatar || "/images/dummy-astrologer.jpg",
                    expertise: data.specialization || "",
                    experience: data.experience_in_years || 0,
                    price: data.price || 0,
                    chat_price: data.chat_price,
                    call_price: data.call_price,
                    video_call_price: data.video_call_price,
                    languages: data.languages || [],
                    rating: data.rating || 5,
                    is_available: data.isAvailable ?? data.is_available ?? false,
                });
            } else {
                setAstrologer(null);
            }
            setLoading(false);
        };
        if (id) fetchAstro();

        const fetchBalance = async () => {
            const [balance, error] = await http.get<number>('/wallet/balance');
            if (error) {
                console.error("Failed to fetch balance:", error);
            } else {
                setUserBalance(Number(balance));
            }
        };
        if (isClientAuthenticated) fetchBalance();
    }, [id, isClientAuthenticated]);

    const handleStartCall = async () => {
        if (!isClientAuthenticated) {
            toast.error("Please login to start call");
            return;
        }
        setShowSecurityModal(true);
    };

    const checkHardwareAndNetwork = async () => {
        // 1. Check Internet
        if (!navigator.onLine) {
            throw new Error("No internet connection. Please check your network.");
        }

        // 2. Check for Microphone
        try {
            const devices = await navigator.mediaDevices.enumerateDevices();
            const hasMic = devices.some(device => device.kind === 'audioinput');
            if (!hasMic) {
                throw new Error("No microphone detected. Please connect a mic to continue.");
            }

            // 3. Check/Request Permission
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            // Close stream immediately after check
            stream.getTracks().forEach(track => track.stop());
        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                throw new Error("Microphone permission denied. Please allow mic access in your browser settings.");
            }
            throw new Error(err.message || "Could not access microphone. Please check your hardware.");
        }
    };

    const proceedToCall = async () => {
        const checkbox = document.getElementById('agreeTerms') as HTMLInputElement;
        if (!checkbox?.checked) {
            toast.warning("Please agree to guidelines");
            return;
        }

        setShowSecurityModal(false);
        setActionLoading(true);

        // Run Pre-call checks
        toast.info("Checking hardware & connection...", { autoClose: 2000 });
        try {
            await checkHardwareAndNetwork();
        } catch (hardwareError: any) {
            toast.error(hardwareError.message);
            setActionLoading(false);
            return;
        }

        const [response, error] = await http.post<any>("/call/initiate", {
            expertId: parseInt(id),
            type: type
        });

        if (error) {
            console.error("[CallPrep] Initiation error details:", error);
            toast.error(error.message || "Failed to start call");
        } else if (response && response.session?.id) {
            toast.success("Connecting to expert...");
            // Redirect to call room
            router.push(`/call/room/${response.session.id}`);
        }
        setActionLoading(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
        </div>
    );

    if (!astrologer) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <UserX className="w-12 h-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Expert Not Found</h2>
            <button
                onClick={() => router.push("/")}
                className="px-8 py-3 bg-orange text-white rounded-full font-bold shadow-lg mt-4"
            >
                Go to Home
            </button>
        </div>
    );

    const callPrice = type === 'video'
        ? (astrologer.video_call_price || astrologer.price * 2 || 0)
        : (astrologer.call_price || astrologer.price || 0);

    return (
        <div className="min-h-screen bg-[#fafafa] pb-20">
            <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-4 py-4 md:px-10 flex items-center justify-between">
                <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-orange transition-colors">
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                        <ChevronLeft className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs uppercase tracking-widest">Back</span>
                </button>
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Secure Call Link</span>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-4 pt-10">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-7 space-y-8">
                        <div>
                            <span className="px-4 py-1.5 bg-orange/10 text-orange text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-orange/20 inline-block mb-4">
                                Preparing {type === 'video' ? 'Video' : 'Audio'} Call
                            </span>
                            <h1 className="text-4xl md:text-6xl font-black text-gray-900 leading-tight">
                                Consulting <br />
                                <span className="text-orange">{astrologer.name}</span>
                            </h1>
                            <p className="text-gray-500 text-lg font-medium mt-4">
                                Experience a personal {type} consultation for precise future predictions and remedies.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center mb-4">
                                    {type === 'video' ? <Video className="w-6 h-6 text-orange" /> : <Phone className="w-6 h-6 text-orange" />}
                                </div>
                                <h3 className="font-bold text-gray-900">{type === 'video' ? 'HD Video' : 'Crystal Clear Audio'}</h3>
                                <p className="text-xs text-gray-400 mt-1">High-quality connection for seamless talk.</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-white border border-gray-100 shadow-sm">
                                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                                </div>
                                <h3 className="font-bold text-gray-900">100% Private</h3>
                                <p className="text-xs text-gray-400 mt-1">Your identity and conversation are encrypted.</p>
                            </div>
                        </div>

                        <div className="p-8 rounded-[2.5rem] bg-gray-900 text-white">
                            <h3 className="text-lg font-bold mb-6 flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-orange flex items-center justify-center">
                                    <User className="w-5 h-5 text-white" />
                                </div>
                                Call Checklist
                            </h3>
                            <ul className="space-y-4">
                                {[
                                    "Ensure you have a stable internet connection",
                                    "Sit in a quiet room for better clarity",
                                    "Keep your basic birth details ready",
                                    "Maintain sufficient wallet balance for the session"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-sm font-bold opacity-80">
                                        <div className="w-5 h-5 rounded-full border border-white/20 flex items-center justify-center text-[10px]">{i + 1}</div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="lg:col-span-5">
                        <div className="bg-white p-3 rounded-[3.5rem] shadow-xl">
                            <div className="relative h-[400px] rounded-[3rem] overflow-hidden">
                                <Image src={astrologer.image} alt={astrologer.name} fill className="object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>

                                {/* Availability Badge */}
                                <div className={`absolute top-6 left-6 px-4 py-2 backdrop-blur-md rounded-full border shadow-sm flex items-center gap-2 ${astrologer.is_available ? 'bg-orange border-white/20' : 'bg-white border-gray-200'}`}>
                                    <div className={`w-2 h-2 rounded-full ${astrologer.is_available ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.8)]' : 'bg-gray-400'}`}></div>
                                    <span className={`${astrologer.is_available ? 'text-white' : 'text-gray-400'} text-[10px] font-black uppercase tracking-widest`}>
                                        {astrologer.is_available ? 'Available Now' : 'Offline'}
                                    </span>
                                </div>

                                <div className="absolute top-6 right-6 px-4 py-2 bg-orange rounded-full text-white font-black text-xs">
                                    ₹{callPrice} / MIN
                                </div>
                                <div className="absolute bottom-10 left-10 text-white">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Expert Astrologer</p>
                                    <h2 className="text-2xl font-black">{astrologer.name}</h2>
                                    <div className="flex items-center gap-2 mt-2 opacity-80 font-bold text-sm">
                                        <MapPin className="w-4 h-4" />
                                        <span>{astrologer.expertise} • {astrologer.experience} yrs</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 pt-10 space-y-4">
                                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                            <LucideIcons.Wallet className="w-4 h-4 text-green-600" />
                                        </div>
                                        <span className="text-sm font-bold text-gray-500">Your Balance</span>
                                    </div>
                                    <span className="text-xl font-black text-gray-900">₹{userBalance.toFixed(2)}</span>
                                </div>

                                {userBalance < callPrice * 5 ? (
                                    <div className="p-6 bg-red-50 rounded-3xl border border-red-100">
                                        <div className="flex items-start gap-4 mb-4">
                                            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                                                <LucideIcons.AlertCircle className="w-6 h-6 text-red-500" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-red-900 leading-none mb-1">Low Balance</h4>
                                                <p className="text-xs text-red-600 font-medium">You need at least ₹{callPrice * 5} for 5 mins.</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => router.push("/wallet")}
                                            className="w-full py-4 bg-red-500 text-white rounded-2xl font-black text-lg shadow-lg hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                        >
                                            <LucideIcons.CreditCard className="w-5 h-5" />
                                            <span>RECHARGE NOW</span>
                                        </button>
                                    </div>
                                ) : (
                                    <button
                                        onClick={handleStartCall}
                                        disabled={actionLoading}
                                        className="w-full py-5 bg-orange text-white rounded-3xl font-black text-xl shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all flex items-center justify-center gap-4 active:scale-95 disabled:opacity-70"
                                    >
                                        {type === 'video' ? <Video className="w-6 h-6" /> : <Phone className="w-6 h-6" />}
                                        <span>{actionLoading ? "STARTING..." : `START ${type.toUpperCase()} CALL`}</span>
                                    </button>
                                )}
                                
                                <p className="text-center text-[10px] text-gray-400 font-black uppercase tracking-widest mt-6">
                                    🔒 Secured by 256-Bit SSL Encryption
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {showSecurityModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                    <div className="bg-white w-full max-w-lg rounded-[2rem] overflow-hidden shadow-2xl flex flex-col">
                        <div className="p-6 bg-gradient-to-r from-orange to-orange-500 text-white">
                            <div className="flex items-center gap-3">
                                <ShieldCheck className="w-8 h-8" />
                                <div>
                                    <h2 className="text-xl font-black">Safety First</h2>
                                    <p className="text-white/80 text-xs font-medium">Please follow these call guidelines</p>
                                </div>
                            </div>
                        </div>
                        <div className="p-8 space-y-4">
                            <p className="text-sm text-gray-600 leading-relaxed font-bold">
                                1. Do not share your phone number or email address.<br />
                                2. Avoid making payments outside our website.<br />
                                3. If the expert asks for personal contact, report it immediately.
                            </p>
                            <label className="flex items-center gap-4 p-4 bg-orange-50 rounded-2xl border-2 border-orange-100 cursor-pointer">
                                <input type="checkbox" id="agreeTerms" className="w-5 h-5 accent-orange" />
                                <span className="text-xs font-bold text-gray-800">I agree to follow the safety guidelines.</span>
                            </label>
                            <div className="flex gap-4 pt-4">
                                <button onClick={() => setShowSecurityModal(false)} className="flex-1 py-4 rounded-2xl border-2 border-gray-100 font-bold text-gray-400">Cancel</button>
                                <button onClick={() => {
                                    const checkbox = document.getElementById('agreeTerms') as HTMLInputElement;
                                    if (!checkbox?.checked) {
                                        toast.warning("Please agree to guidelines");
                                        return;
                                    }
                                    proceedToCall();
                                }} className="flex-1 py-4 rounded-2xl bg-orange text-white font-black shadow-lg">Continue</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function CallPrepPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div></div>}>
            <CallPrepContent />
        </Suspense>
    );
}
