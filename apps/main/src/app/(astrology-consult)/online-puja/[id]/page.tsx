"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    Clock, MapPin, Monitor, Sparkles, Star, Heart,
    ArrowLeft, ArrowRight, ShieldCheck,
    Calendar, Info, Loader2, MessageCircle, Send,
    Package, Users, ChevronRight, Video, CheckCircle2
} from "lucide-react";
import { api as http } from "@/lib/api";
import { API_ROUTES } from "@/lib/api-routes";
import { ExpertPuja } from "@/lib/types/puja";
import Image from "next/image";
import Link from "next/link";
import { Loading } from "@repo/ui";
import { useAuthStore } from "@/store/useAuthStore";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";

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
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [relatedPujas, setRelatedPujas] = useState<ExpertPuja[]>([]);
    const [relatedLoading, setRelatedLoading] = useState(true);
    const { isAuthenticated } = useAuthStore();

    useEffect(() => {
        const fetchPujaDetails = async () => {
            if (!id) return;
            setLoading(true);
            const route = API_ROUTES.EXPERT.GET_PUJA_BY_ID.replace(':id', id as string);
            const [res, error] = await http.get<ExpertPuja>(route) as any;
            if (error) {
                router.push('/online-puja');
            } else if (res) {
                setPuja(res);
                setLikesCount(res.total_likes || 0);
                
                if (res.is_online) setSelectedMode('online');
                else if (res.is_home_visit) setSelectedMode('home_visit_without');
            }
            setLoading(false);
        };
        fetchPujaDetails();

        // Fetch related pujas
        const fetchRelatedPujas = async () => {
            setRelatedLoading(true);
            const [res] = await http.get<ExpertPuja[]>(API_ROUTES.EXPERT.GET_ALL_PUJAS);
            if (res && Array.isArray(res)) {
                setRelatedPujas(res.filter((p) => p.id !== id).slice(0, 5));
            }
            setRelatedLoading(false);
        };
        fetchRelatedPujas();
    }, [id, router]);

    useEffect(() => {
        const fetchUserWishlist = async () => {
            if (!isAuthenticated) return;
            const [res] = await http.get<any[]>('/puja-like');
            if (res && Array.isArray(res)) {
                const isLiked = res.some((item) => item.puja_id === id || item.puja?.id === id);
                setLiked(isLiked);
            }
        };
        fetchUserWishlist();
    }, [id, isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FDF6F0] flex flex-col items-center justify-center">
                <Loading size="lg" text="Loading Puja Details..." />
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

    const handleLikeToggle = async () => {
        if (!isAuthenticated) {
            toast.error("Please login to like this puja");
            return;
        }
        
        // Optimistic update
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikesCount(prev => newLikedState ? prev + 1 : prev - 1);
        
        if (newLikedState) {
            const [, error] = await http.post('/puja-like/add', { pujaId: id });
            if (error) {
                setLiked(!newLikedState);
                setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
                toast.error(getErrorMessage(error) || "Failed to add to wishlist");
            }
        } else {
            const [, error] = await http.delete(`/puja-like/remove/${id}`);
            if (error) {
                setLiked(!newLikedState);
                setLikesCount(prev => !newLikedState ? prev + 1 : prev - 1);
                toast.error(getErrorMessage(error) || "Failed to remove from wishlist");
            }
        }
    };

    const handleBookingRequest = async () => {
        if (!isAuthenticated) { toast.error("Please login to send puja request"); return; }
        if (!askExpertForDate && (!scheduledDate || !scheduledTime)) {
            toast.error("Please select a date and time OR ask expert for date"); return;
        }
        setIsBooking(true);
        const [, error] = await http.post(API_ROUTES.PUJA.BOOKING, {
            puja_id: id as string,
            scheduled_date: askExpertForDate ? null : scheduledDate,
            scheduled_time: askExpertForDate ? null : scheduledTime,
            ask_expert_for_date: askExpertForDate,
            mode: selectedMode,
            price: getCurrentCost(),
            user_message: userMessage
        }) as any;
        if (error) toast.error(getErrorMessage(error) || "Failed to send booking request");
        else { toast.success("Puja request sent!"); setScheduledDate(""); setScheduledTime(""); setAskExpertForDate(false); setUserMessage(""); }
        setIsBooking(false);
    };

    return (
        <div className="min-h-screen bg-[#FDF6F0]" style={{ fontFamily: "'Inter', sans-serif" }}>

            {/* Breadcrumb */}
            <div className="max-w-7xl mx-auto px-4 py-3">
                <p className="text-sm text-gray-500">
                    <Link href="/" className="hover:text-[#FF5500]">Home</Link>
                    <span className="mx-2 text-gray-300">›</span>
                    <Link href="/online-puja" className="text-[#FF5500] font-semibold">Online Puja</Link>
                    <span className="mx-2 text-gray-300">›</span>
                    <span className="text-gray-700">{puja.name}</span>
                </p>
            </div>

            {/* ── TOP: Image (left) + Booking Widget (right) ── */}
            <div className="max-w-7xl mx-auto px-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* LEFT: Hero Image */}
                <div className="lg:col-span-8">
                    <div className="relative rounded-3xl overflow-hidden h-[280px] sm:h-[360px] bg-[#1a0b0b]">
                        {puja.puja_image_url ? (
                            <Image
                                src={puja.puja_image_url}
                                alt={puja.name}
                                fill
                                className="object-cover opacity-80"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center">
                                <Sparkles className="w-24 h-24 text-orange-500 opacity-20" />
                            </div>
                        )}
                        {/* Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Buttons */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
                            <button
                                onClick={() => router.back()}
                                className="flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-xl text-white text-sm font-bold border border-white/20 hover:bg-white/30 transition-all"
                            >
                                <ArrowLeft className="w-4 h-4" /> Return
                            </button>
                            <button
                                onClick={handleLikeToggle}
                                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${liked ? 'bg-white text-gray-900 border-white' : 'bg-white/20 backdrop-blur-sm text-white border-white/20 hover:bg-white/30'}`}
                            >
                                <Heart className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`} />
                                {likesCount > 0 ? likesCount : (liked ? "1" : "Like")}
                            </button>
                        </div>

                        {/* Bottom Content */}
                        <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                            <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-xl">{puja.name}</h1>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                                    <Clock className="w-3.5 h-3.5 text-orange-300" />
                                    <span className="text-xs font-bold text-white">{puja.min_duration_hours} - {puja.max_duration_hours} Hours (Approx.)</span>
                                </div>
                                {puja.is_online && (
                                    <span className="px-3 py-1.5 bg-[#FF5500] text-white text-xs font-black rounded-xl">Online</span>
                                )}
                                {puja.is_home_visit && (
                                    <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-black rounded-xl">Home Visit</span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* ── BELOW IMAGE: All Content Sections ── */}
                    <div className="mt-6 space-y-5">

                        {/* About */}
                        <div className="bg-white rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">🕉️</div>
                                <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">About {puja.name}</h2>
                            </div>
                            <p className="text-gray-600 leading-relaxed text-sm font-medium">
                                {puja.description || "This sacred Vedic ceremony is performed by our highly experienced pandits following strict traditional protocols. It aims to invoke divine energy and blessings into your life, ensuring spiritual growth, protection, and prosperity."}
                            </p>
                        </div>

                        {/* Key Benefits */}
                        <div className="bg-white rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                    <Star className="w-5 h-5 text-[#FF5500]" />
                                </div>
                                <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">Key Benefits</h2>
                            </div>
                            <div className="flex flex-wrap gap-x-8 gap-y-4">
                                {[
                                    { icon: "🙏", label: "Brings Peace", sub: "& Prosperity" },
                                    { icon: "🌿", label: "Removes Negative", sub: "Energy" },
                                    { icon: "❤️", label: "Good Health", sub: "& Longevity" },
                                    { icon: "💼", label: "Success in Career", sub: "& Business" },
                                    { icon: "⭐", label: "Spiritual Growth", sub: "& Protection" },
                                ].map((b, i) => (
                                    <div key={i} className="flex items-center gap-3 min-w-[140px]">
                                        <div className="w-12 h-12 bg-[#FFF0E6] border border-[#F5D5C0] rounded-full flex items-center justify-center text-xl shrink-0">
                                            {b.icon}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#333] leading-tight">{b.label}</p>
                                            <p className="text-xs text-gray-500 leading-tight">{b.sub}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Pandit */}
                        <div className="bg-white rounded-3xl p-4 sm:p-6 border border-[#F0E0D0] shadow-sm">
                            <div className="flex items-center gap-3 mb-5">
                                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                    <Users className="w-5 h-5 text-[#FF5500]" />
                                </div>
                                <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">Pandit Performing this Puja</h2>
                            </div>
                            <div className="flex flex-col lg:flex-row gap-5 items-start">
                                <div className="flex-1 w-full">
                                    <div className="flex gap-3 sm:gap-5 items-start w-full mb-3">
                                    <div className="w-24 h-32 sm:w-32 sm:h-40 rounded-2xl overflow-hidden shrink-0 border-2 border-[#F0E0D0] relative">
                                        {puja.expert?.user?.avatar ? (
                                            <Image src={puja.expert.user.avatar} alt="Pandit" fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full bg-[#FFF0E6] flex items-center justify-center text-3xl font-black text-[#FF5500]">
                                                {(puja.expert?.user?.name || "P").charAt(0)}
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            <h3 className="text-lg font-black text-[#1A1A1A]">{puja.expert?.user?.name || puja.expert?.name || "Pandit Ji"}</h3>
                                            <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-black rounded-lg uppercase flex items-center gap-1">
                                                <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" /> Top Rated Pandit
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} className={`w-4 h-4 ${s <= (puja.expert?.rating || 0) ? 'fill-yellow-400 text-yellow-400' : 'fill-gray-200 text-gray-200'}`} />
                                            ))}
                                            <span className="text-sm font-bold text-gray-700 ml-1">{puja.expert?.rating || "0"}</span>
                                            <span className="text-xs text-gray-500">({puja.expert?.total_reviews || 0} Reviews)</span>
                                        </div>
                                        <p className="text-sm font-bold text-[#1A1A1A] mb-1">{puja.expert?.experience_in_years || "0"} Yrs Experience <span className="text-gray-300 mx-1">|</span> Vedic Expert</p>
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-600 mb-3 leading-relaxed">{puja.expert?.specialization || "Specialized in Shiva Puja, Rudra Abhishek, Mahamrityunjaya Jaap and other Vedic Rituals."}</p>
                                    <Link href={`/expert/${puja.expert_id}`} className="inline-flex items-center gap-1 text-[#FF5500] text-[15px] font-black hover:underline">
                                        View Full Profile <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                                
                                <div className="bg-[#FCF9F7] rounded-3xl p-5 shrink-0 w-full lg:w-auto lg:min-w-[180px] flex flex-row lg:flex-col justify-around lg:justify-start gap-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 text-[#FF5500] bg-white rounded-[10px] flex items-center justify-center border border-[#FFD9BF] text-sm shrink-0 shadow-sm">📜</div>
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-600 leading-tight mb-1">Pujas Performed</p>
                                            <p className="text-sm font-black text-[#1A1A1A] leading-tight">{puja.expert?.consultation_count ? `${puja.expert.consultation_count}+` : "0"}</p>
                                        </div>
                                    </div>
                                    <div className="w-px h-auto lg:h-px lg:w-full bg-[#F0E0D0]" />
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 text-[#FF5500] bg-white rounded-[10px] flex items-center justify-center border border-[#FFD9BF] text-sm shrink-0 shadow-sm">🗣️</div>
                                        <div>
                                            <p className="text-[11px] font-bold text-gray-600 leading-tight mb-1">Languages</p>
                                            <p className="text-sm font-black text-[#1A1A1A] leading-tight capitalize">{puja.expert?.languages?.length ? puja.expert.languages.join(", ") : "Hindi, Sanskrit"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Samagri */}
                        {puja.samagri_list && puja.samagri_list.length > 0 && (
                            <div className="bg-white rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
                                <div className="flex items-center gap-3 mb-5">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                                        <Package className="w-5 h-5 text-[#FF5500]" />
                                    </div>
                                    <div>
                                        <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">Essential Samagri</h2>
                                        <p className="text-xs text-gray-400">(Provided by Pandit for Home Visit - Premium)</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-6">
                                    {puja.samagri_list.map((item, idx) => (
                                        <div key={idx} className="flex items-center gap-3">
                                            <div className="w-10 h-10 flex items-center justify-center text-2xl shrink-0">
                                                🌿
                                            </div>
                                            <div>
                                                <p className="text-sm font-black text-[#1A1A1A] leading-tight">{item.name}</p>
                                                <p className="text-xs text-gray-500 leading-tight">{item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-xs text-gray-500 mt-3 italic">Note: Samagri may vary slightly based on availability and local customs.</p>
                            </div>
                        )}

                        {/* Districts */}
                        {puja.is_home_visit && puja.districts && puja.districts.length > 0 && (
                            <div className="bg-white rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                        <MapPin className="w-5 h-5 text-green-500" />
                                    </div>
                                    <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">Available Districts for Home Visit</h2>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {puja.districts.map((district, idx) => (
                                        <span key={idx} className="px-3 py-1.5 bg-[#F5FFF8] border border-green-100 text-green-700 rounded-xl text-xs font-bold">
                                            {district}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            {[
                                { icon: "📜", title: "Vedic Certified Ritual", sub: "Performed as per Vedic scriptures and tradition" },
                                { icon: "✅", title: "Verified Pandit", sub: "Experienced & background verified pandits" },
                                { icon: "🌺", title: "Pure & Authentic", sub: "Pure Samagri & authentic rituals" },
                                { icon: "🔒", title: "Secure & Trusted", sub: "Your booking is safe and secure with us" },
                            ].map((b, i) => (
                                <div key={i} className="bg-white rounded-2xl p-4 border border-[#F0E0D0] flex items-center gap-4">
                                    <div className="text-4xl shrink-0 text-[#FF5500] opacity-80">{b.icon}</div>
                                    <div>
                                        <p className="text-[15px] sm:text-base font-black text-[#1A1A1A] leading-tight mb-1">{b.title}</p>
                                        <p className="text-sm text-gray-600 leading-tight">{b.sub}</p>
                                    </div>
                                </div>
                            ))}
                        </div>


                    </div>
                </div>

                {/* RIGHT: Sticky Booking Widget */}
                <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
                    <div className="bg-white rounded-3xl border border-[#F0E0D0] shadow-lg overflow-hidden">
                        {/* Header */}
                        <div className="px-6 py-5 border-b border-[#F0E0D0]">
                            <h3 className="text-lg font-black text-[#1A1A1A]">Book Your Puja</h3>
                            <p className="text-gray-500 text-sm font-medium mt-0.5">Send request to our expert pandit</p>
                        </div>

                        <div className="p-5 space-y-5">
                            {/* Mode Selection */}
                            <div>
                                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">1. Select Puja Mode</p>
                                <div className="space-y-2">
                                    {puja.is_online && (
                                        <button
                                            onClick={() => setSelectedMode('online')}
                                            className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${selectedMode === 'online' ? 'border-[#FF5500] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedMode === 'online' ? 'border-[#FF5500]' : 'border-gray-300'}`}>
                                                {selectedMode === 'online' && <div className="w-2 h-2 rounded-full bg-[#FF5500]" />}
                                            </div>
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedMode === 'online' ? 'bg-[#FF5500]/10 text-[#FF5500]' : 'bg-gray-50 text-gray-400'}`}>
                                                <Video className="w-5 h-5" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-black ${selectedMode === 'online' ? 'text-[#FF5500]' : 'text-gray-800'}`}>Online / Video Call</p>
                                                <p className="text-xs text-gray-500 leading-tight">Participate from the comfort of your home</p>
                                            </div>
                                        </button>
                                    )}
                                    {puja.is_home_visit && (
                                        <>
                                            <button
                                                onClick={() => setSelectedMode('home_visit_without')}
                                                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${selectedMode === 'home_visit_without' ? 'border-[#FF5500] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedMode === 'home_visit_without' ? 'border-[#FF5500]' : 'border-gray-300'}`}>
                                                    {selectedMode === 'home_visit_without' && <div className="w-2 h-2 rounded-full bg-[#FF5500]" />}
                                                </div>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedMode === 'home_visit_without' ? 'bg-[#FF5500]/10 text-[#FF5500]' : 'bg-gray-50 text-gray-400'}`}>
                                                    <MapPin className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-black ${selectedMode === 'home_visit_without' ? 'text-[#FF5500]' : 'text-gray-800'}`}>Home Visit (Basic)</p>
                                                    <p className="text-xs text-gray-500 leading-tight">Pandit ji will come to your home (Without Samagri)</p>
                                                </div>
                                            </button>
                                            <button
                                                onClick={() => setSelectedMode('home_visit_with')}
                                                className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${selectedMode === 'home_visit_with' ? 'border-[#FF5500] bg-orange-50' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <div className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedMode === 'home_visit_with' ? 'border-[#FF5500]' : 'border-gray-300'}`}>
                                                    {selectedMode === 'home_visit_with' && <div className="w-2 h-2 rounded-full bg-[#FF5500]" />}
                                                </div>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedMode === 'home_visit_with' ? 'bg-[#FF5500]/10 text-[#FF5500]' : 'bg-gray-50 text-gray-400'}`}>
                                                    <Package className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className={`text-sm font-black ${selectedMode === 'home_visit_with' ? 'text-[#FF5500]' : 'text-gray-800'}`}>Home Visit (Premium)</p>
                                                    <p className="text-xs text-gray-500 leading-tight">Pandit ji will come with Full Samagri Kit</p>
                                                </div>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">2. Select Date & Time</p>
                                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={askExpertForDate}
                                        onChange={(e) => setAskExpertForDate(e.target.checked)}
                                        className="w-4 h-4 accent-[#FF5500]"
                                    />
                                    <span className="text-sm font-bold text-gray-700">Ask the expert for date and time</span>
                                    <Info className="w-3.5 h-3.5 text-gray-400" />
                                </label>
                                {!askExpertForDate && (
                                    <div className="space-y-2">
                                        <p className="text-xs text-gray-500 font-bold uppercase">OR Choose your preferred date & time</p>
                                        <div className="relative">
                                            <input type="text" placeholder="Select Date" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => !e.target.value && (e.target.type = 'text')} value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} min={new Date().toISOString().split('T')[0]}
                                                className="w-full px-4 pr-10 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#FF5500] outline-none transition-all text-gray-700" />
                                            <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                        <div className="relative">
                                            <input type="text" placeholder="Select Time" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => !e.target.value && (e.target.type = 'text')} value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)}
                                                className="w-full px-4 pr-10 py-3 border border-gray-200 rounded-xl text-sm font-medium focus:border-[#FF5500] outline-none transition-all text-gray-700" />
                                            <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Message */}
                            <div className="border-t border-gray-100 pt-4">
                                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">3. Add a Message <span className="text-gray-400 normal-case font-medium">(Optional)</span></p>
                                <textarea
                                    placeholder="Enter any special request or family details..."
                                    value={userMessage}
                                    onChange={(e) => setUserMessage(e.target.value)}
                                    rows={3}
                                    maxLength={250}
                                    className="w-full p-3 border-2 border-gray-100 rounded-2xl text-sm focus:border-[#FF5500] outline-none resize-none text-gray-700 placeholder-gray-400"
                                />
                                <p className="text-right text-xs text-gray-400">{userMessage.length}/250</p>
                            </div>

                            {/* Price Summary */}
                            <div className="border-t border-gray-100 pt-4">
                                <div className="flex items-center justify-between mb-3">
                                    <p className="text-base font-black text-gray-700">Price Summary</p>
                                    <div className="flex items-center gap-1 text-emerald-500 text-xs font-black">
                                        <ShieldCheck className="w-3.5 h-3.5" /> Secure Price
                                    </div>
                                </div>
                                <div className="space-y-2 mb-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Puja Price (Online)</span>
                                        <span className="font-black text-[#1A1A1A]">₹ {getCurrentCost()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500 font-medium">Taxes & Charges</span>
                                        <span className="font-black text-emerald-500">₹ 0</span>
                                    </div>
                                    <div className="h-px bg-[#F0E0D0]" />
                                    <div className="flex justify-between">
                                        <span className="text-base font-black text-[#1A1A1A]">Total (All Taxes Inc.)</span>
                                        <span className="text-lg font-black text-[#FF5500]">₹ {getCurrentCost()}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleBookingRequest}
                                    disabled={isBooking}
                                    className="w-full py-4 bg-[#FF5500] hover:bg-[#E64D00] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-[13px] sm:text-base whitespace-nowrap shadow-lg shadow-orange-200 active:scale-[0.98] transition-all disabled:opacity-50"
                                >
                                    {isBooking ? <><Loader2 className="w-5 h-5 animate-spin" /> Processing...</> : <><Send className="w-4 h-4 sm:w-5 sm:h-5" /> Send Booking Request</>}
                                </button>

                                <p className="mt-3 text-xs text-center text-gray-500 flex items-start justify-center gap-1.5">
                                    <Info className="w-4 h-4 shrink-0 mt-0.5" />
                                    You will not be charged at this stage. Your request will be sent to the pandit for confirmation.
                                </p>

                                <div className="flex items-center justify-around pt-4 border-t border-gray-100 mt-3">
                                    {[{ icon: "🔒", label: "Secure\nBooking" }, { icon: "✅", label: "Verified\nPandits" }, { icon: "💯", label: "100%\nAuthentic" }].map((b, i) => (
                                        <div key={i} className="flex flex-col items-center gap-1.5">
                                            <span className="text-2xl">{b.icon}</span>
                                            <p className="text-[11px] text-gray-500 font-bold text-center whitespace-pre-line leading-tight">{b.label}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* You May Also Like (Full Width Bottom) */}
            <div className="max-w-7xl mx-auto px-4 pb-12 mt-8 border-t border-[#F0E0D0] pt-8">
                <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">You May Also Like</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                    {relatedLoading ? (
                        // Skeleton Loader — 4 dummy cards
                        Array.from({ length: 4 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border border-[#F0E0D0] overflow-hidden shadow-sm animate-pulse">
                                <div className="h-32 bg-gradient-to-br from-[#F5E6D8] to-[#EDD5BD]" />
                                <div className="p-4 space-y-2">
                                    <div className="h-3.5 bg-gray-200 rounded-full w-4/5" />
                                    <div className="h-3 bg-gray-100 rounded-full w-2/5" />
                                    <div className="h-4 bg-orange-100 rounded-full w-3/5" />
                                </div>
                            </div>
                        ))
                    ) : relatedPujas.length > 0 ? (
                        relatedPujas.map((p) => (
                            <div
                                key={p.id}
                                onClick={() => router.push(`/online-puja/${p.id}`)}
                                className="bg-white rounded-2xl border border-[#F0E0D0] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                            >
                                <div className="h-32 relative overflow-hidden">
                                    {p.puja_image_url ? (
                                        <Image src={p.puja_image_url} alt={p.name || 'Puja'} fill className="object-cover" />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#FFF0E6] to-[#FFD9BF]" />
                                    )}
                                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                                        {p.is_online && <span className="bg-[#FF5500] text-white text-[10px] font-black px-2 py-0.5 rounded-md">Online</span>}
                                        {p.is_home_visit && <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">Home Visit</span>}
                                    </div>
                                </div>
                                <div className="p-4">
                                    <p className="text-base font-black text-[#1A1A1A] leading-tight mb-2 group-hover:text-[#FF5500] transition-colors">{p.name}</p>
                                    <p className="text-xs text-gray-500">Starting from</p>
                                    <p className="text-lg font-black text-[#FF5500]">₹ {Math.min(...[p.online_cost, p.home_visit_without_samagri_cost, p.home_visit_with_samagri_cost].filter(Boolean))}</p>
                                </div>
                            </div>
                        ))
                    ) : null}
                </div>
            </div>

            {isBooking && <Loading fullScreen />}
        </div>
    );
};

export default PujaDetailPage;
