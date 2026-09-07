"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Clock,
  MapPin,
  Monitor,
  Sparkles,
  Star,
  Heart,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Calendar,
  Info,
  Loader2,
  MessageCircle,
  Send,
  Package,
  Users,
  ChevronRight,
  Video,
  CheckCircle2,
} from "lucide-react";
import { api, API_ROUTES } from "@/actions";
import { ExpertPuja } from "@/lib/types/puja";
import Image from "next/image";
// import LoginModal from "@/components/features/auth/LoginModal";
import PujaDetailSeoContent from "./puja-detail-seo.component";
import { Loading } from "@repo/ui";
import { useAuthStore } from "@/store/__useAuthStore";
import { useLanguageStore } from "@repo/store";
import { toast } from "react-toastify";
import { getErrorMessage } from "@repo/lib";
import Link from "next/link";

const PujaDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [puja, setPuja] = useState<ExpertPuja | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedMode, setSelectedMode] = useState<
    "online" | "home_visit_with" | "home_visit_without" | null
  >(null);
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
  const { lang } = useLanguageStore();

  const t = {
    en: {
      bookTitle: "Book Your Puja",
      bookSub: "Send request to our expert pandit",
      step1: "1. Select Puja Mode",
      onlineTitle: "Online / Video Call",
      onlineSub: "Participate from the comfort of your home",
      homeBasicTitle: "Home Visit (Basic)",
      homeBasicSub: "Pandit ji will come to your home (Without Samagri)",
      homePremiumTitle: "Home Visit (Premium)",
      homePremiumSub: "Pandit ji will come with Full Samagri Kit",
      step2: "2. Select Date & Time",
      askExpert: "Ask the expert for date and time",
      orChoose: "OR Choose your preferred date & time",
      selDate: "Select Date",
      selTime: "Select Time",
      step3: "3. Add a Message",
      optional: "(Optional)",
      msgPlaceholder: "Enter any special request or family details...",
      priceSummary: "Price Summary",
      securePrice: "Secure Price",
      pujaPrice: "Puja Price",
      taxes: "Taxes & Charges",
      total: "Total (All Taxes Inc.)",
      sendReq: "Send Booking Request",
      processing: "Processing...",
      notCharged:
        "You will not be charged at this stage. Your request will be sent to the pandit for confirmation.",
      secureBooking: "Secure\nBooking",
      verifiedPandits: "Verified\nPandits",
      authentic: "100%\nAuthentic",
    },
    hi: {
      bookTitle: "अपनी पूजा बुक करें",
      bookSub: "हमारे विशेषज्ञ पंडित को अनुरोध भेजें",
      step1: "1. पूजा मोड चुनें",
      onlineTitle: "ऑनलाइन / वीडियो कॉल",
      onlineSub: "अपने घर के आराम से भाग लें",
      homeBasicTitle: "घर पर आएं (बेसिक)",
      homeBasicSub: "पंडित जी आपके घर आएंगे (बिना सामग्री के)",
      homePremiumTitle: "घर पर आएं (प्रीमियम)",
      homePremiumSub: "पंडित जी पूरी सामग्री किट के साथ आएंगे",
      step2: "2. दिनांक और समय चुनें",
      askExpert: "तारीख और समय के लिए विशेषज्ञ से पूछें",
      orChoose: "या अपनी पसंदीदा तारीख और समय चुनें",
      selDate: "तारीख चुनें",
      selTime: "समय चुनें",
      step3: "3. एक संदेश जोड़ें",
      optional: "(वैकल्पिक)",
      msgPlaceholder: "कोई विशेष अनुरोध या पारिवारिक विवरण दर्ज करें...",
      priceSummary: "मूल्य सारांश",
      securePrice: "सुरक्षित मूल्य",
      pujaPrice: "पूजा मूल्य",
      taxes: "कर और शुल्क",
      total: "कुल (सभी कर सहित)",
      sendReq: "बुकिंग अनुरोध भेजें",
      processing: "प्रसंस्करण...",
      notCharged:
        "इस स्तर पर आपसे कोई शुल्क नहीं लिया जाएगा। आपका अनुरोध पुष्टि के लिए पंडित को भेजा जाएगा।",
      secureBooking: "सुरक्षित\nबुकिंग",
      verifiedPandits: "सत्यापित\nपंडित",
      authentic: "100%\nप्रामाणिक",
    },
  }[lang] || {
    bookTitle: "Book Your Puja",
    bookSub: "Send request to our expert pandit",
    step1: "1. Select Puja Mode",
    onlineTitle: "Online / Video Call",
    onlineSub: "Participate from the comfort of your home",
    homeBasicTitle: "Home Visit (Basic)",
    homeBasicSub: "Pandit ji will come to your home (Without Samagri)",
    homePremiumTitle: "Home Visit (Premium)",
    homePremiumSub: "Pandit ji will come with Full Samagri Kit",
    step2: "2. Select Date & Time",
    askExpert: "Ask the expert for date and time",
    orChoose: "OR Choose your preferred date & time",
    selDate: "Select Date",
    selTime: "Select Time",
    step3: "3. Add a Message",
    optional: "(Optional)",
    msgPlaceholder: "Enter any special request or family details...",
    priceSummary: "Price Summary",
    securePrice: "Secure Price",
    pujaPrice: "Puja Price",
    taxes: "Taxes & Charges",
    total: "Total (All Taxes Inc.)",
    sendReq: "Send Booking Request",
    processing: "Processing...",
    notCharged:
      "You will not be charged at this stage. Your request will be sent to the pandit for confirmation.",
    secureBooking: "Secure\nBooking",
    verifiedPandits: "Verified\nPandits",
    authentic: "100%\nAuthentic",
  };

  useEffect(() => {
    const fetchPujaDetails = async () => {
      if (!id) return;
      setLoading(true);
      const route = API_ROUTES.EXPERT.GET_PUJA_BY_ID.replace(
        ":id",
        id as string,
      );
      const [res, error] = await api.get<ExpertPuja>(route);
      if (error) {
        router.push("/online-puja");
      } else if (res) {
        setPuja(res);
        setLikesCount(res.total_likes || 0);

        if (res.is_online) setSelectedMode("online");
        else if (res.is_home_visit) setSelectedMode("home_visit_without");
      }
      setLoading(false);
    };
    fetchPujaDetails();

    // Fetch related pujas
    const fetchRelatedPujas = async () => {
      setRelatedLoading(true);
      const [res] = await api.get<ExpertPuja[]>(
        API_ROUTES.EXPERT.GET_ALL_PUJAS,
      );
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
      const [res] = await api.get<any>("/puja-like");
      if (res) {
        const items = Array.isArray(res)
          ? res
          : res.data || res.items || res.wishlist || [];
        const isLiked = items.some(
          (item: any) =>
            String(item.puja_id) === String(id) ||
            String(item.puja?.id) === String(id),
        );
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
    if (selectedMode === "online") return puja.online_cost;
    if (selectedMode === "home_visit_with")
      return puja.home_visit_with_samagri_cost;
    if (selectedMode === "home_visit_without")
      return puja.home_visit_without_samagri_cost;
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
    setLikesCount((prev) => (newLikedState ? prev + 1 : prev - 1));

    if (newLikedState) {
      const [_, error] = await api.post("/puja-like/add", {
        pujaId: id,
      });
      if (error) {
        const status = error.status || error?.response?.status;
        if (status !== 409) {
          setLiked(!newLikedState);
          setLikesCount((prev) => (!newLikedState ? prev + 1 : prev - 1));
          toast.error(getErrorMessage(error) || "Failed to add to wishlist");
        }
      }
    } else {
      const [_, error] = (await api.delete(`/puja-like/remove/${id}`)) as any;
      if (error) {
        const status = error.status || error?.response?.status;
        if (status !== 404 && status !== 400) {
          setLiked(!newLikedState);
          setLikesCount((prev) => (!newLikedState ? prev + 1 : prev - 1));
          toast.error(
            getErrorMessage(error) || "Failed to remove from wishlist",
          );
        }
      }
    }
  };

  const handleBookingRequest = async () => {
    if (!isAuthenticated) {
      toast.error(
        <span>
          Please login to book this puja.{" "}
          <span className="underline font-black">Login now →</span>
        </span>,
        {
          onClick: () => router.push(`/sign-in?callbackUrl=/online-puja/${id}`),
          style: { cursor: "pointer" },
        },
      );
      return;
    }
    if (!askExpertForDate && (!scheduledDate || !scheduledTime)) {
      toast.error("Please select a date and time OR ask expert for date");
      return;
    }
    setIsBooking(true);
    const [, error] = (await api.post(API_ROUTES.PUJA.BOOKING, {
      puja_id: id as string,
      scheduled_date: askExpertForDate ? null : scheduledDate,
      scheduled_time: askExpertForDate ? null : scheduledTime,
      ask_expert_for_date: askExpertForDate,
      mode: selectedMode,
      price: getCurrentCost(),
      user_message: userMessage,
    })) as any;
    if (error)
      toast.error(getErrorMessage(error) || "Failed to send booking request");
    else {
      toast.success("Puja request sent!");
      setScheduledDate("");
      setScheduledTime("");
      setAskExpertForDate(false);
      setUserMessage("");
    }
    setIsBooking(false);
  };

  return (
    <div
      className="min-h-screen bg-[#FDF6F0]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-4 py-3">
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-[#FF5500]">
            Home
          </Link>
          <span className="mx-2 text-gray-300">›</span>
          <Link href="/online-puja" className="text-[#FF5500] font-semibold">
            Online Puja
          </Link>
          <span className="mx-2 text-gray-300">›</span>
          <span className="text-gray-300">{puja.name}</span>
        </p>
      </div>

      {/* ── TOP: Image (left) + Booking Widget (right) ── */}
      <div className="max-w-7xl mx-auto px-4 pb-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT: Hero Image */}
        <div className="lg:col-span-8">
          <div className="relative rounded-3xl overflow-hidden aspect-video bg-[#1a0b0b]">
            {puja.puja_image_url ? (
              <>
                {/* Blurred background to fill empty sides */}
                <Image
                  src={puja.puja_image_url}
                  alt=""
                  fill
                  className="object-cover blur-2xl opacity-60"
                  aria-hidden="true"
                />
                {/* Main image fully visible */}
                <Image
                  src={puja.puja_image_url}
                  alt={puja.name}
                  fill
                  className="object-contain relative z-10 transition-transform duration-500 hover:scale-105"
                />
              </>
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
                className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A]/20 backdrop-blur-sm rounded-xl text-white text-sm font-bold border border-white/20 hover:bg-[#1A1A1A]/30 transition-all"
              >
                <ArrowLeft className="w-4 h-4" /> Return
              </button>
              <button
                onClick={handleLikeToggle}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border transition-all ${liked ? "bg-[#1A1A1A] text-gray-100 border-white" : "bg-[#1A1A1A]/20 backdrop-blur-sm text-white border-white/20 hover:bg-[#1A1A1A]/30"}`}
              >
                <Heart
                  className={`w-4 h-4 ${liked ? "fill-red-500 text-red-500" : ""}`}
                />
                {likesCount > 0 ? likesCount : liked ? "1" : "Like"}
              </button>
            </div>

            {/* Bottom Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-xl">
                {puja.name}
              </h1>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-2 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10">
                  <Clock className="w-3.5 h-3.5 text-orange-300" />
                  <span className="text-xs font-bold text-white">
                    {puja.min_duration_hours} - {puja.max_duration_hours} Hours
                    (Approx.)
                  </span>
                </div>
                {puja.is_online && (
                  <span className="px-3 py-1.5 bg-[#FF5500] text-white text-xs font-black rounded-xl">
                    Online
                  </span>
                )}
                {puja.is_home_visit && (
                  <span className="px-3 py-1.5 bg-emerald-500 text-white text-xs font-black rounded-xl">
                    Home Visit
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── BELOW IMAGE: All Content Sections ── */}
          <div className="mt-6 space-y-5">
            {/* About */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-xl">
                  🕉️
                </div>
                <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">
                  About {puja.name}
                </h2>
              </div>
              <p className="text-slate-500 leading-relaxed text-sm font-medium">
                {puja.description ||
                  "This sacred Vedic ceremony is performed by our highly experienced pandits following strict traditional protocols. It aims to invoke divine energy and blessings into your life, ensuring spiritual growth, protection, and prosperity."}
              </p>
            </div>

            {/* Key Benefits */}
            <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Star className="w-5 h-5 text-[#FF5500]" />
                </div>
                <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">
                  Key Benefits
                </h2>
              </div>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {[
                  { icon: "🙏", label: "Brings Peace", sub: "& Prosperity" },
                  { icon: "🌿", label: "Removes Negative", sub: "Energy" },
                  { icon: "❤️", label: "Good Health", sub: "& Longevity" },
                  { icon: "💼", label: "Success in Career", sub: "& Business" },
                  {
                    icon: "⭐",
                    label: "Spiritual Growth",
                    sub: "& Protection",
                  },
                ].map((b, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 min-w-[140px]"
                  >
                    <div className="w-12 h-12 bg-[#FFF0E6] border border-[#F5D5C0] rounded-full flex items-center justify-center text-xl shrink-0">
                      {b.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#333] leading-tight">
                        {b.label}
                      </p>
                      <p className="text-xs text-gray-500 leading-tight">
                        {b.sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pandit */}
            <div className="bg-[#FFFDF9] rounded-3xl p-4 sm:p-6 border border-[#F0E0D0] shadow-sm">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#FF5500]" />
                </div>
                <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">
                  Pandit Performing this Puja
                </h2>
              </div>
              <div className="flex flex-col lg:flex-row gap-5 items-start">
                <div className="flex-1 w-full">
                  <div className="flex gap-3 sm:gap-5 items-start w-full mb-3">
                    <div className="w-24 h-32 sm:w-32 sm:h-40 rounded-2xl overflow-hidden shrink-0 border-2 border-[#F0E0D0] relative">
                      {puja.expert?.user?.avatar ? (
                        <Image
                          src={puja.expert.user.avatar}
                          alt="Pandit"
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-[#FFF0E6] flex items-center justify-center text-3xl font-black text-[#FF5500]">
                          {(puja.expert?.user?.name || "P").charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="text-lg font-black text-[#1A1A1A]">
                          {puja.expert?.user?.name ||
                            puja.expert?.name ||
                            "Pandit Ji"}
                        </h3>
                        <span className="px-2 py-0.5 bg-yellow-50 border border-yellow-200 text-yellow-700 text-[10px] font-black rounded-lg uppercase flex items-center gap-1">
                          <Star className="w-2.5 h-2.5 fill-yellow-500 text-yellow-500" />{" "}
                          Top Rated Pandit
                        </span>
                      </div>
                      <div className="flex items-center gap-1 mb-2">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star
                            key={s}
                            className={`w-4 h-4 ${s <= (puja.expert?.rating || 0) ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"}`}
                          />
                        ))}
                        <span className="text-sm font-bold text-slate-600 ml-1">
                          {puja.expert?.rating || "0"}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({puja.expert?.total_reviews || 0} Reviews)
                        </span>
                      </div>
                      <p className="text-sm font-bold text-[#1A1A1A] mb-1">
                        {puja.expert?.experience_in_years || "0"} Yrs Experience{" "}
                        <span className="text-slate-600 mx-1">|</span> Vedic
                        Expert
                      </p>
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mb-3 leading-relaxed">
                    {puja.expert?.specialization ||
                      "Specialized in Shiva Puja, Rudra Abhishek, Mahamrityunjaya Jaap and other Vedic Rituals."}
                  </p>
                  <Link
                    href={`/expert/${puja.expert_id}`}
                    className="inline-flex items-center gap-1 text-[#FF5500] text-[15px] font-black hover:underline"
                  >
                    View Full Profile <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="bg-[#FCF9F7] rounded-3xl p-5 shrink-0 w-full lg:w-auto lg:min-w-[180px] flex flex-row lg:flex-col justify-around lg:justify-start gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 text-[#FF5500] bg-[#FFFDF9] rounded-[10px] flex items-center justify-center border border-[#FFD9BF] text-sm shrink-0 shadow-sm">
                      📜
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 leading-tight mb-1">
                        Pujas Performed
                      </p>
                      <p className="text-sm font-black text-[#1A1A1A] leading-tight">
                        {puja.expert?.consultation_count
                          ? `${puja.expert.consultation_count}+`
                          : "0"}
                      </p>
                    </div>
                  </div>
                  <div className="w-px h-auto lg:h-px lg:w-full bg-[#F0E0D0]" />
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 text-[#FF5500] bg-[#FFFDF9] rounded-[10px] flex items-center justify-center border border-[#FFD9BF] text-sm shrink-0 shadow-sm">
                      🗣️
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-500 leading-tight mb-1">
                        Languages
                      </p>
                      <p className="text-sm font-black text-[#1A1A1A] leading-tight capitalize">
                        {Array.isArray(puja.expert?.languages)
                          ? puja.expert.languages.join(", ")
                          : puja.expert?.languages || "Hindi, Sanskrit"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Samagri */}
            {puja.samagri_list && puja.samagri_list.length > 0 && (
              <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                    <Package className="w-5 h-5 text-[#FF5500]" />
                  </div>
                  <div>
                    <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">
                      Essential Samagri
                    </h2>
                    <p className="text-xs text-slate-500">
                      (Provided by Pandit for Home Visit - Premium)
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-6">
                  {puja.samagri_list.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-[#FDF6F0]/50 border border-[#F0E0D0] p-4 rounded-xl transition-colors hover:bg-[#FFF0E6]"
                    >
                      <div className="w-8 h-8 rounded-full bg-[#FFF0E6] text-[#FF5500] font-black text-sm flex items-center justify-center shrink-0 border border-[#FFD9BF]">
                        {idx + 1}
                      </div>
                      <div className="text-left">
                        <p className="text-[15px] font-black text-[#1A1A1A] leading-tight">
                          {item.name}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight mt-0.5">
                          {item.quantity}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-3 italic">
                  Note: Samagri may vary slightly based on availability and
                  local customs.
                </p>
              </div>
            )}

            {/* Districts */}
            {puja.is_home_visit &&
              puja.districts &&
              puja.districts.length > 0 && (
                <div className="bg-[#FFFDF9] rounded-3xl p-6 border border-[#F0E0D0] shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-green-500" />
                    </div>
                    <h2 className="text-[15px] sm:text-lg font-black text-[#1A1A1A]">
                      Available Districts for Home Visit
                    </h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {puja.districts.map((district, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-[#F5FFF8] border border-green-100 text-green-700 rounded-xl text-xs font-bold"
                      >
                        {district}
                      </span>
                    ))}
                  </div>
                </div>
              )}

            {/* Trust Badges */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {[
                {
                  icon: "📜",
                  title: "Vedic Certified Ritual",
                  sub: "Performed as per Vedic scriptures and tradition",
                },
                {
                  icon: "✅",
                  title: "Verified Pandit",
                  sub: "Experienced & background verified pandits",
                },
                {
                  icon: "🌺",
                  title: "Pure & Authentic",
                  sub: "Pure Samagri & authentic rituals",
                },
                {
                  icon: "🔒",
                  title: "Secure & Trusted",
                  sub: "Your booking is safe and secure with us",
                },
              ].map((b, i) => (
                <div
                  key={i}
                  className="bg-[#FFFDF9] rounded-2xl p-4 border border-[#F0E0D0] flex items-center gap-4"
                >
                  <div className="text-4xl shrink-0 text-[#FF5500] opacity-80">
                    {b.icon}
                  </div>
                  <div>
                    <p className="text-[15px] sm:text-base font-black text-[#1A1A1A] leading-tight mb-1">
                      {b.title}
                    </p>
                    <p className="text-sm text-slate-500 leading-tight">
                      {b.sub}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RIGHT: Sticky Booking Widget */}
        <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit">
          <div className="bg-[#FFFDF9] rounded-3xl border border-[#F0E0D0] shadow-lg overflow-hidden">
            {/* Header */}
            <div className="px-6 py-5 border-b border-[#F0E0D0]">
              <h3 className="text-lg font-black text-[#1A1A1A]">
                {t.bookTitle}
              </h3>
              <p className="text-gray-500 text-sm font-medium mt-0.5">
                {t.bookSub}
              </p>
            </div>

            <div className="p-5 space-y-5">
              {/* Mode Selection */}
              <div>
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                  {t.step1}
                </p>
                <div className="space-y-2">
                  {puja.is_online && (
                    <button
                      onClick={() => setSelectedMode("online")}
                      className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${selectedMode === "online" ? "border-[#FF5500] bg-orange-50" : "border-[#E8D5C0] hover:border-orange-200"}`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedMode === "online" ? "border-[#FF5500]" : "border-gray-700"}`}
                      >
                        {selectedMode === "online" && (
                          <div className="w-2 h-2 rounded-full bg-[#FF5500]" />
                        )}
                      </div>
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedMode === "online" ? "bg-[#FF5500]/10 text-[#FF5500]" : "bg-white text-slate-500"}`}
                      >
                        <Video className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-black ${selectedMode === "online" ? "text-[#FF5500]" : "text-[#3D1A0B]"}`}
                        >
                          {t.onlineTitle}
                        </p>
                        <p className="text-xs text-gray-500 leading-tight">
                          {t.onlineSub}
                        </p>
                      </div>
                    </button>
                  )}
                  {puja.is_home_visit && (
                    <>
                      <button
                        onClick={() => setSelectedMode("home_visit_without")}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${selectedMode === "home_visit_without" ? "border-[#FF5500] bg-orange-50" : "border-[#E8D5C0] hover:border-orange-200"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedMode === "home_visit_without" ? "border-[#FF5500]" : "border-gray-700"}`}
                        >
                          {selectedMode === "home_visit_without" && (
                            <div className="w-2 h-2 rounded-full bg-[#FF5500]" />
                          )}
                        </div>
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedMode === "home_visit_without" ? "bg-[#FF5500]/10 text-[#FF5500]" : "bg-white text-slate-500"}`}
                        >
                          <MapPin className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-black ${selectedMode === "home_visit_without" ? "text-[#FF5500]" : "text-[#3D1A0B]"}`}
                          >
                            {t.homeBasicTitle}
                          </p>
                          <p className="text-xs text-gray-500 leading-tight">
                            {t.homeBasicSub}
                          </p>
                        </div>
                      </button>
                      <button
                        onClick={() => setSelectedMode("home_visit_with")}
                        className={`w-full flex items-center gap-3 p-3.5 rounded-2xl border-2 transition-all text-left ${selectedMode === "home_visit_with" ? "border-[#FF5500] bg-orange-50" : "border-[#E8D5C0] hover:border-orange-200"}`}
                      >
                        <div
                          className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center ${selectedMode === "home_visit_with" ? "border-[#FF5500]" : "border-gray-700"}`}
                        >
                          {selectedMode === "home_visit_with" && (
                            <div className="w-2 h-2 rounded-full bg-[#FF5500]" />
                          )}
                        </div>
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${selectedMode === "home_visit_with" ? "bg-[#FF5500]/10 text-[#FF5500]" : "bg-white text-slate-500"}`}
                        >
                          <Package className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-black ${selectedMode === "home_visit_with" ? "text-[#FF5500]" : "text-[#3D1A0B]"}`}
                          >
                            {t.homePremiumTitle}
                          </p>
                          <p className="text-xs text-gray-500 leading-tight">
                            {t.homePremiumSub}
                          </p>
                        </div>
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Date & Time */}
              <div className="border-t border-[#E8D5C0] pt-4">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-3">
                  {t.step2}
                </p>
                <label className="flex items-center gap-2 mb-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={askExpertForDate}
                    onChange={(e) => setAskExpertForDate(e.target.checked)}
                    className="w-4 h-4 accent-[#FF5500]"
                  />
                  <span className="text-sm font-bold text-slate-600">
                    {t.askExpert}
                  </span>
                  <Info className="w-3.5 h-3.5 text-slate-500" />
                </label>
                {!askExpertForDate && (
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-bold uppercase">
                      {t.orChoose}
                    </p>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t.selDate}
                        onFocus={(e) => (e.target.type = "date")}
                        onBlur={(e) =>
                          !e.target.value && (e.target.type = "text")
                        }
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full px-4 pr-10 py-3 border border-[#E8D5C0] rounded-xl text-sm font-medium focus:border-[#FF5500] outline-none transition-all text-slate-600"
                      />
                      <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder={t.selTime}
                        onFocus={(e) => (e.target.type = "time")}
                        onBlur={(e) =>
                          !e.target.value && (e.target.type = "text")
                        }
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-4 pr-10 py-3 border border-[#E8D5C0] rounded-xl text-sm font-medium focus:border-[#FF5500] outline-none transition-all text-slate-600"
                      />
                      <Clock className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                    </div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="border-t border-[#E8D5C0] pt-4">
                <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">
                  {t.step3}{" "}
                  <span className="text-slate-500 normal-case font-medium">
                    {t.optional}
                  </span>
                </p>
                <textarea
                  placeholder={t.msgPlaceholder}
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  rows={3}
                  maxLength={250}
                  className="w-full p-3 border-2 border-[#E8D5C0] rounded-2xl text-sm focus:border-[#FF5500] outline-none resize-none text-slate-600 placeholder-gray-400"
                />
                <p className="text-right text-xs text-slate-500">
                  {userMessage.length}/250
                </p>
              </div>

              {/* Price Summary */}
              <div className="border-t border-[#E8D5C0] pt-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-base font-black text-slate-600">
                    {t.priceSummary}
                  </p>
                  <div className="flex items-center gap-1 text-emerald-500 text-xs font-black">
                    <ShieldCheck className="w-3.5 h-3.5" /> {t.securePrice}
                  </div>
                </div>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">
                      {t.pujaPrice}{" "}
                      {selectedMode === "online"
                        ? lang === "hi"
                          ? "(ऑनलाइन)"
                          : "(Online)"
                        : lang === "hi"
                          ? "(घर पर)"
                          : "(Home Visit)"}
                    </span>
                    <span className="font-black text-[#1A1A1A]">
                      ₹ {getCurrentCost()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium">{t.taxes}</span>
                    <span className="font-black text-emerald-500">₹ 0</span>
                  </div>
                  <div className="h-px bg-[#F0E0D0]" />
                  <div className="flex justify-between">
                    <span className="text-base font-black text-[#1A1A1A]">
                      {t.total}
                    </span>
                    <span className="text-lg font-black text-[#FF5500]">
                      ₹ {getCurrentCost()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBookingRequest}
                  disabled={isBooking}
                  className="w-full py-4 bg-[#FF5500] hover:bg-[#E64D00] text-white font-black rounded-2xl flex items-center justify-center gap-2 text-[13px] sm:text-base whitespace-nowrap shadow-lg shadow-orange-200 active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  {isBooking ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />{" "}
                      {t.processing}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 sm:w-5 sm:h-5" /> {t.sendReq}
                    </>
                  )}
                </button>

                <p className="mt-3 text-xs text-center text-gray-500 flex items-start justify-center gap-1.5">
                  <Info className="w-4 h-4 shrink-0 mt-0.5" />
                  {t.notCharged}
                </p>

                <div className="flex items-center justify-around pt-4 border-t border-[#E8D5C0] mt-3">
                  {[
                    { icon: "🔒", label: t.secureBooking },
                    { icon: "✅", label: t.verifiedPandits },
                    { icon: "💯", label: t.authentic },
                  ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-1.5">
                      <span className="text-2xl">{b.icon}</span>
                      <p className="text-[11px] text-gray-500 font-bold text-center whitespace-pre-line leading-tight">
                        {b.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* You May Also Like (Full Width Bottom) */}
      <div className="max-w-7xl mx-auto px-4 pb-4 mt-8 border-t border-[#F0E0D0] pt-8">
        <h2 className="text-2xl font-black text-[#1A1A1A] mb-6">
          You May Also Like
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {relatedLoading
            ? // Skeleton Loader — 4 dummy cards
            Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-[#FFFDF9] rounded-2xl border border-[#F0E0D0] overflow-hidden shadow-sm animate-pulse"
              >
                <div className="h-32 bg-gradient-to-br from-[#F5E6D8] to-[#EDD5BD]" />
                <div className="p-4 space-y-2">
                  <div className="h-3.5 bg-gray-200 rounded-full w-4/5" />
                  <div className="h-3 bg-[#2A2A2A] rounded-full w-2/5" />
                  <div className="h-4 bg-orange-100 rounded-full w-3/5" />
                </div>
              </div>
            ))
            : relatedPujas.length > 0
              ? relatedPujas.map((p) => (
                <div
                  key={p.id}
                  onClick={() => router.push(`/online-puja/${p.id}`)}
                  className="bg-[#FFFDF9] rounded-2xl border border-[#F0E0D0] overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                >
                  <div className="h-32 relative overflow-hidden">
                    {p.puja_image_url ? (
                      <Image
                        src={p.puja_image_url}
                        alt={p.name || "Puja"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-[#FFF0E6] to-[#FFD9BF]" />
                    )}
                    <div className="absolute top-2 left-2 flex gap-1 flex-wrap">
                      {p.is_online && (
                        <span className="bg-[#FF5500] text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          Online
                        </span>
                      )}
                      {p.is_home_visit && (
                        <span className="bg-emerald-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md">
                          Home Visit
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-base font-black text-[#1A1A1A] leading-tight mb-2 group-hover:text-[#FF5500] transition-colors">
                      {p.name}
                    </p>
                    <p className="text-xs text-gray-500">Starting from</p>
                    <p className="text-lg font-black text-[#FF5500]">
                      ₹{" "}
                      {Math.min(
                        ...[
                          p.online_cost,
                          p.home_visit_without_samagri_cost,
                          p.home_visit_with_samagri_cost,
                        ].filter(Boolean),
                      )}
                    </p>
                  </div>
                </div>
              ))
              : null}
        </div>
      </div>

      {/* Dynamic SEO Content */}
      <PujaDetailSeoContent pujaName={puja.name} />

      {isBooking && <Loading fullScreen />}
    </div>
  );
};

export default PujaDetailPage;
