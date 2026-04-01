"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
    Clock, MapPin, Monitor, Sparkles, Star, 
    ArrowLeft, CheckCircle2, ShieldCheck, 
    Calendar, Users, Info, Filter, Loader2,
    CalendarCheck, Image as LucideImage
} from "lucide-react";
import { api as http } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { ExpertPuja } from "@/lib/types/puja";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";

const PujaDetailPage = () => {
    const { id } = useParams();
    const router = useRouter();
    const [puja, setPuja] = useState<ExpertPuja | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedMode, setSelectedMode] = useState<'online' | 'home_visit_with' | 'home_visit_without' | null>(null);
    const [scheduledDate, setScheduledDate] = useState("");
    const [scheduledTime, setScheduledTime] = useState("");
    const [askExpertForDate, setAskExpertForDate] = useState(false);
    const [userMessage, setUserMessage] = useState("");
    const [isBooking, setIsBooking] = useState(false);
    const { isClientAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchPujaDetails = async () => {
            if (!id) return;
            setLoading(true);
            const route = API_ROUTES.EXPERT.GET_PUJA_BY_ID.replace(':id', id as string);
            const [res, error] = await http.get<ExpertPuja>(route);
            
            if (error) {
                console.error("Failed to fetch puja details:", error);
                router.push('/online-puja');
            } else if (res) {
                setPuja(res);
                // Set default mode
                if (res.is_online) setSelectedMode('online');
                else if (res.is_home_visit) setSelectedMode('home_visit_without');
            }
            setLoading(false);
        };
        fetchPujaDetails();
    }, [id, router]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#301118] flex flex-col items-center justify-center p-4">
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin mb-4" />
                <p className="text-orange-200/40 font-bold uppercase tracking-[0.2em] text-xs">Preparing Sacred Space</p>
            </div>
        );
    }

    if (!puja) return null;

    const getCurrentCost = () => {
        if (selectedMode === 'online') return puja.online_cost;
        if (selectedMode === 'home_visit_with') return puja.home_visit_with_samagri_cost;
        if (selectedMode === 'home_visit_without') return puja.home_visit_without_samagri_cost;
        return 0;
    };

    const handleBookingRequest = async () => {
        if (!isClientAuthenticated) {
            toast.error("Please login to send puja request");
            return;
        }

        if (!askExpertForDate && (!scheduledDate || !scheduledTime)) {
            toast.error("Please select a date and time OR ask astrologer for date");
            return;
        }

        setIsBooking(true);
        const bookingData = {
            puja_id: Number(id),
            scheduled_date: askExpertForDate ? null : scheduledDate,
            scheduled_time: askExpertForDate ? null : scheduledTime,
            ask_expert_for_date: askExpertForDate,
            mode: selectedMode,
            price: getCurrentCost(),
            user_message: userMessage
        };

        const [res, error] = await http.post(API_ROUTES.PUJA.BOOKING, bookingData);

        if (error) {
            toast.error(error.message || "Failed to send booking request");
        } else {
            toast.success("Puja request sent successfully! Wait for astrologer to confirm.");
            setScheduledDate("");
            setScheduledTime("");
            setAskExpertForDate(false);
            setUserMessage("");
        }
        setIsBooking(false);
    };

    return (
        <div className="min-h-screen bg-[#FDFCFB] selection:bg-orange-100 selection:text-orange-900">
            {/* Header / Hero Section */}
            <div className="relative h-[45vh] sm:h-[60vh] overflow-hidden group">
                {/* Hero Background */}
                <div className="absolute inset-0 bg-[#301118]">
                    {puja.puja_image_url ? (
                        <Image 
                            src={puja.puja_image_url} 
                            alt={puja.name} 
                            fill 
                            className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3s] ease-out"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center opacity-20">
                            <Sparkles className="w-48 h-48 text-orange-500" />
                        </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-[#FDFCFB]" />
                </div>

                {/* Top Actions */}
                <div className="absolute top-8 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between z-20">
                    <button 
                        onClick={() => router.back()}
                        className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/20 group/back flex items-center gap-2 pr-5"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover/back:-translate-x-1 transition-transform" />
                        <span className="text-sm font-bold">Return</span>
                    </button>
                    
                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-2xl text-white hover:bg-white/20 transition-all border border-white/20">
                        <Sparkles className="w-5 h-5" />
                    </button>
                </div>

                {/* Hero Content */}
                <div className="absolute inset-x-0 bottom-0 max-w-7xl mx-auto px-4 pb-12 z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500 text-white rounded-full text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 shadow-xl shadow-orange-900/20">
                        <Star className="w-3 h-3 fill-white" />
                        Vedic Certified Ritual
                    </div>
                    <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight drop-shadow-2xl">
                        {puja.name}
                    </h1>
                    <div className="flex flex-wrap items-center gap-4 mt-6 text-white/80">
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                            <Clock className="w-4 h-4 text-orange-400" />
                            <span className="text-sm font-bold">{puja.min_duration_hours}-{puja.max_duration_hours} Hours</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/10">
                            <Monitor className="w-4 h-4 text-blue-400" />
                            <span className="text-sm font-bold">Multiple Modes</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12">
                
                {/* Left Column: Details */}
                <div className="lg:col-span-8 space-y-12">
                    
                    {/* About the Puja */}
                    <section>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                <Info className="w-6 h-6 text-orange-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-gray-900 tracking-tight">Ritual Significance</h2>
                                <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 text-[10px]">What makes this ceremony divine</p>
                            </div>
                        </div>
                        <p className="text-lg text-gray-600 leading-relaxed font-medium">
                            {puja.description || "This sacred Vedic ceremony is performed by our highly experienced pandits following strict traditional protocols. It aims to invoke divine energy and blessings into your life, ensuring spiritual growth, protection, and prosperity for you and your family."}
                        </p>
                        
                        {/* Key Benefits / Points */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            {[
                                "Performed with pure Samagri",
                                "Traditional Vedic Mantras",
                                "Personalized Sankalp",
                                "Authentic Procedures"
                            ].map((point, idx) => (
                                <div key={idx} className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                                    <span className="font-bold text-gray-700">{point}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Pandit Profile Mini */}
                    <div className="p-8 bg-[#301118] rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-orange-500/20 transition-colors" />
                        
                        <div className="flex flex-col sm:flex-row items-center gap-8 relative z-10">
                            <div className="relative w-32 h-32 rounded-3xl overflow-hidden shadow-2xl ring-4 ring-white/10 ring-offset-4 ring-offset-[#301118]">
                                {puja.expert?.user?.avatar ? (
                                    <Image 
                                        src={puja.expert.user.avatar} 
                                        alt={puja.expert.user.name || puja.expert?.name || "Expert"} 
                                        fill 
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-800 text-3xl font-black">
                                        {(puja.expert?.user?.name || puja.expert?.name || "E").charAt(0)}
                                    </div>
                                )}
                            </div>
                            <div className="text-center sm:text-left grow">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest mb-3 border border-emerald-500/20">
                                    Top Rated Pandit
                                </div>
                                <h3 className="text-3xl font-black tracking-tight">{puja.expert?.user?.name || puja.expert?.name || "Pandit Ji"}</h3>
                                <div className="flex items-center justify-center sm:justify-start gap-4 mt-2">
                                    <div className="flex items-center gap-1.5">
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                        <span className="font-black">4.9/5</span>
                                    </div>
                                    <div className="h-4 w-px bg-white/20" />
                                    <span className="text-white/60 font-medium">10+ Years Exp.</span>
                                </div>
                                <Link 
                                    href={`/astrologer/${puja.expert_id}`}
                                    className="inline-flex items-center gap-2 mt-6 text-sm font-black text-orange-400 hover:text-orange-300 transition-colors group/link"
                                >
                                    View Full Profile
                                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover/link:translate-x-1 transition-transform" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Samagri List */}
                    {puja.samagri_list && puja.samagri_list.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
                                    <Filter className="w-6 h-6 text-orange-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Essential Samagri</h2>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 text-[10px]">What is required for the ritual</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {puja.samagri_list.map((item, idx) => (
                                    <div key={idx} className="flex justify-between items-center p-5 bg-white rounded-2xl border border-gray-100 shadow-sm group hover:border-orange-200 transition-all">
                                        <span className="font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item.name}</span>
                                        <span className="text-[11px] font-black text-orange-600 uppercase bg-orange-50 px-3 py-1 rounded-lg border border-orange-100">
                                            {item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Service Areas */}
                    {puja.is_home_visit && puja.districts && puja.districts.length > 0 && (
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center">
                                    <MapPin className="w-6 h-6 text-green-500" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900 tracking-tight">Available Districts</h2>
                                    <p className="text-sm text-gray-400 font-bold uppercase tracking-widest mt-1 text-[10px]">Locations where Pandit ji visits</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {puja.districts.map((district, idx) => (
                                    <div key={idx} className="px-6 py-3 bg-white text-gray-700 rounded-2xl border border-gray-100 shadow-sm font-black text-sm hover:scale-105 hover:bg-green-50 hover:text-green-700 transition-all cursor-default">
                                        {district}
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}
                </div>

                {/* Right Column: Booking Widget */}
                <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
                    <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl overflow-hidden p-8 space-y-8">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-2">Configure Ritual</h3>
                            <p className="text-sm text-gray-400 font-bold">Select your preferred mode</p>
                        </div>

                        {/* Mode Selection */}
                        <div className="space-y-3">
                            {puja.is_online && (
                                <button 
                                    onClick={() => setSelectedMode('online')}
                                    className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${selectedMode === 'online' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                >
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedMode === 'online' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                        <Monitor className="w-6 h-6" />
                                    </div>
                                    <div className="text-left">
                                        <p className={`font-black text-sm ${selectedMode === 'online' ? 'text-orange-900' : 'text-gray-900'}`}>Online / Video Call</p>
                                        <p className="text-xs font-bold text-gray-400 mt-0.5">Vedic Ritual via Digital Space</p>
                                    </div>
                                </button>
                            )}
                            
                            {puja.is_home_visit && (
                                <>
                                    <button 
                                        onClick={() => setSelectedMode('home_visit_without')}
                                        className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${selectedMode === 'home_visit_without' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedMode === 'home_visit_without' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <MapPin className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-black text-sm ${selectedMode === 'home_visit_without' ? 'text-emerald-900' : 'text-gray-900'}`}>Home Visit (Basic)</p>
                                            <p className="text-xs font-bold text-gray-400 mt-0.5">Excludes Samagri</p>
                                        </div>
                                    </button>
                                    <button 
                                        onClick={() => setSelectedMode('home_visit_with')}
                                        className={`w-full flex items-center gap-4 p-5 rounded-3xl border-2 transition-all ${selectedMode === 'home_visit_with' ? 'border-orange-500 bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${selectedMode === 'home_visit_with' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div className="text-left">
                                            <p className={`font-black text-sm ${selectedMode === 'home_visit_with' ? 'text-orange-900' : 'text-gray-900'}`}>Home Visit (Premium)</p>
                                            <p className="text-xs font-bold text-gray-400 mt-0.5">Includes Full Samagri Kit</p>
                                        </div>
                                    </button>
                                </>
                            )}
                        </div>

                        {/* Date & Time Selection */}
                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div>
                                <h3 className="text-sm font-black text-gray-900 mb-3">Preferred Schedule</h3>
                                <div className="flex items-center gap-2 mb-4">
                                    <input 
                                        type="checkbox" 
                                        id="askExpertForDate"
                                        checked={askExpertForDate}
                                        onChange={(e) => setAskExpertForDate(e.target.checked)}
                                        className="w-4 h-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                    />
                                    <label htmlFor="askExpertForDate" className="text-xs font-bold text-gray-600 cursor-pointer">
                                        Ask the astrologer for date and time
                                    </label>
                                </div>

                                {!askExpertForDate && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Date</label>
                                            <div className="relative">
                                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                                <input 
                                                    type="date" 
                                                    value={scheduledDate}
                                                    onChange={(e) => setScheduledDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Time</label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-orange-500" />
                                                <input 
                                                    type="time" 
                                                    value={scheduledTime}
                                                    onChange={(e) => setScheduledTime(e.target.value)}
                                                    className="w-full pl-9 pr-3 py-2.5 bg-gray-50 border border-gray-100 rounded-xl text-xs font-bold focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-1.5 pt-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Message for Pandit Ji (Optional)</label>
                                <textarea 
                                    placeholder="e.g. Special ritual requests or family details..."
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    rows={3}
                                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold focus:ring-2 focus:ring-orange-500/20 outline-none transition-all resize-none"
                                />
                            </div>
                        </div>

                        {/* Price Display */}
                        <div className="pt-6 border-t border-gray-100">
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Ritual Dakshina</p>
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-black text-gray-900">₹{getCurrentCost()}</span>
                                        <span className="text-xs font-bold text-gray-400">Total</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest mb-1 flex items-center justify-end gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Secure Price
                                    </p>
                                    <p className="text-xs font-bold text-gray-400">All Taxes Inc.</p>
                                </div>
                            </div>
                            
                            <button 
                                onClick={handleBookingRequest}
                                disabled={isBooking}
                                className="w-full py-5 bg-[#301118] text-white font-black rounded-3xl hover:bg-orange-600 transition-all shadow-xl shadow-orange-900/10 active:scale-[0.98] flex items-center justify-center gap-3 group/book disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isBooking ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        Send request to astrologer for pooja
                                        <Sparkles className="w-5 h-5 group-hover/book:animate-spin-slow" />
                                    </>
                                )}
                            </button>
                            
                            <p className="mt-4 text-[10px] text-center text-gray-400 font-bold leading-relaxed">
                                By proceeding, you agree to our spiritual service guidelines and traditional ritual protocols.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Placeholder for footer or bottom space */}
            <div className="pb-32" />
            
            <style jsx global>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in { animation: fade-in 0.6s ease-out forwards; }
                .animate-spin-slow { animation: spin 4s linear infinite; }
            `}</style>
        </div>
    );
};

export default PujaDetailPage;
