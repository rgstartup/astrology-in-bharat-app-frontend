"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { listOfStores } from "@/components/features/services/storeData";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ShieldCheck,
  Star,
  ArrowLeft,
  ShoppingBag,
  Info,
  BadgeCheck,
  MessageSquare,
  Sparkles,
  Play,
  Heart,
  Video,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { merchantSocket } from "@/lib/socket";
import { ProductCard } from "@/components/features/shop/ProductCard";
import { Product } from "@/lib/types";
import { Store } from "@/lib/types/shop";
import ProductQuickView from "@/components/features/shop/ProductQuickView";
import Link from "next/link";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "@/lib/translations/home";
import StoreSkeleton from "./store.skeleton";

import { useMerchant } from "@/hooks/useMerchant";
import { useMerchantProducts } from "@/hooks/useMerchantProducts";
import { useMerchantReviews } from "@/hooks/useMerchantReviews";

// const StoreSkeleton = () => (
//     <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10 animate-pulse">
//         <div className="flex flex-col lg:flex-row gap-8 items-start">
//             <div className="w-full lg:w-[360px] xl:w-[400px] shrink-0 space-y-6">
//                 <div className="h-[500px] bg-[#1A1A1A] rounded-[40px] border border-slate-100 shadow-sm"></div>
//             </div>
//             <div className="w-full flex-1 space-y-6">
//                 <div className="h-20 bg-[#1A1A1A] rounded-[32px] border border-orange/10"></div>
//                 <div className="h-[600px] bg-[#1A1A1A] rounded-[32px] border border-orange/10"></div>
//             </div>
//         </div>
//     </div>
// );

const StoreDetailsPage = () => {
  const { lang } = useLanguageStore();
  const translationSet = (homeTranslations[
    lang as keyof typeof homeTranslations
  ] || homeTranslations.en) as any;
  const t = translationSet.storeDetail;
  const fontStyle =
    lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  const [activeTab, setActiveTab] = useState<
    "about" | "collection" | "reviews" | "gallery"
  >("collection");
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isOnline, setIsOnline] = useState(false);

  const {
    data: store,
    isLoading: isStoreLoading,
    error: storeError,
  } = useMerchant(id);
  const { data: storeProducts = [], isLoading: isProductsLoading } =
    useMerchantProducts(id);
  const { data: storeReviews = [] } = useMerchantReviews(id);

  // Initial status and socket listener
  useEffect(() => {
    if (store?.isOnline !== undefined) {
      setIsOnline(store.isOnline);
    }
  }, [store?.isOnline]);

  useEffect(() => {
    const handleStatusChange = (data: {
      merchant_id: string;
      is_online: boolean;
    }) => {
      if (String(data.merchant_id) === String(id)) {
        setIsOnline(data.is_online);
      }
    };

    merchantSocket.on("merchant_status_changed", handleStatusChange);
    return () => {
      merchantSocket.off("merchant_status_changed", handleStatusChange);
    };
  }, [id]);

  if (isStoreLoading) return <StoreSkeleton />;

  if (storeError || !store) {
    return (
      <div className="min-h-screen bg-[#301118] flex flex-col items-center justify-center p-6 text-center">
        <ShoppingBag className="w-20 h-20 text-orange-500/20 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4" style={fontStyle}>
          {t.notFound.title}
        </h1>
        <p className="text-gray-400 mb-8" style={fontStyle}>
          {t.notFound.desc}
        </p>
        <Link
          href="/"
          className="px-8 py-4 bg-orange text-white rounded-2xl font-bold uppercase tracking-widest hover:bg-orange/90 transition-all"
          style={fontStyle}
        >
          {t.notFound.btnBack}
        </Link>
      </div>
    );
  }

  // Narrowed store for UI
  const shop = store as Store;

  return (
    <div className="min-h-screen bg-[#FDF8F4] font-outfit pb-20">
      <div className="max-w-7xl mx-auto px-4 md:px-6 mt-10">
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* 👤 Left Column: Store Profile Card */}
          <aside className="w-full lg:w-[360px] xl:w-[400px] shrink-0 lg:sticky lg:top-32">
            <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[40px] overflow-hidden shadow-premium border border-slate-100 transition-all duration-500 hover:shadow-2xl hover:border-orange/30 group">
              <div className="relative pt-10 pb-4 flex flex-col items-center">
                {/* Top Badges */}
                <div className="absolute top-6 right-8 bg-orange/10 text-orange px-4 py-1.5 rounded-full flex items-center gap-2 border border-orange/20 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                  <span
                    className="text-[10px] font-black uppercase tracking-widest"
                    style={fontStyle}
                  >
                    {t.profile.verifiedSeller}
                  </span>
                </div>

                {/* Online/Offline Status (Top Left) */}
                <div className="absolute top-6 left-8">
                  {isOnline ? (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 backdrop-blur-md rounded-full border border-green-500/20 animate-in fade-in slide-in-from-left-4 duration-500">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]"></span>
                      </span>
                      <span
                        className="text-[9px] font-black text-green-600 uppercase tracking-widest leading-none"
                        style={fontStyle}
                      >
                        {t.profile.online}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-500/10 backdrop-blur-md rounded-full border border-slate-500/20">
                      <span className="inline-flex rounded-full h-2 w-2 bg-slate-400"></span>
                      <span
                        className="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none"
                        style={fontStyle}
                      >
                        {t.profile.offline}
                      </span>
                    </div>
                  )}
                </div>

                {/* Shop Image Frame */}
                <div className="relative">
                  <div className="w-36 h-36 rounded-full p-1.5 bg-gradient-to-tr from-orange via-orange/40 to-transparent animate-gradient-xy">
                    <div className="w-full h-full rounded-full overflow-hidden border-4 border-white relative shadow-2xl">
                      <img
                        src={
                          shop.image ||
                          "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80"
                        }
                        alt={shop.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </div>
                </div>

                {/* Shop Title & Status */}
                <div className="mt-6 text-center px-8 space-y-3">
                  <h2
                    className="text-3xl font-black text-slate-900 tracking-tighter uppercase leading-tight"
                    style={fontStyle}
                  >
                    {shop.name}
                  </h2>

                  <div className="flex items-center justify-center gap-1.5 text-orange font-black bg-orange/5 px-3 py-1 rounded-full text-[10px] uppercase tracking-widest border border-orange/10 mx-auto w-fit">
                    <MapPin className="w-3.5 h-3.5" />
                    <span style={fontStyle}>
                      {shop.city} {t.profile.marketplace}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Bar */}
              <div className="mx-6 p-4 bg-[#1A1A1A] rounded-3xl flex justify-between items-center border border-slate-100 shadow-premium group-hover:border-orange/10 transition-colors">
                <div className="text-center px-4">
                  <p
                    className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1"
                    style={fontStyle}
                  >
                    {t.profile.est}
                  </p>
                  <p
                    className="text-sm font-black text-slate-900"
                    style={fontStyle}
                  >
                    {shop.established || t.profile.na}
                  </p>
                </div>
                <div className="h-10 w-px bg-slate-100"></div>
                <div className="text-center px-4">
                  <p
                    className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1"
                    style={fontStyle}
                  >
                    {t.profile.rating}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className="text-sm font-black text-slate-900"
                      style={fontStyle}
                    >
                      {shop.rating || "0"}
                    </span>
                    <Star className="w-3.5 h-3.5 text-orange fill-orange" />
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-100"></div>
                <div className="text-center px-4">
                  <p
                    className="text-[9px] uppercase tracking-[0.2em] text-slate-400 font-black mb-1"
                    style={fontStyle}
                  >
                    {t.profile.products}
                  </p>
                  <div className="flex items-center justify-center gap-1">
                    <span
                      className="text-sm font-black text-slate-900"
                      style={fontStyle}
                    >
                      {shop.productsCount ||
                        (storeProducts as any[]).length ||
                        "0"}
                    </span>
                    <ShoppingBag className="w-3.5 h-3.5 text-orange" />
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="px-10 py-8 space-y-5">
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF8F4] flex items-center justify-center text-orange group-hover/item:bg-orange group-hover/item:text-white transition-all duration-300">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                      style={fontStyle}
                    >
                      {t.trustInfo.scoreLabel}
                    </span>
                    <span
                      className="text-sm font-black text-slate-800"
                      style={fontStyle}
                    >
                      {shop.trustScore ? `${shop.trustScore}%` : "99.8%"}{" "}
                      {t.trustInfo.reliability}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF8F4] flex items-center justify-center text-orange group-hover/item:bg-orange group-hover/item:text-white transition-all duration-300 border border-orange/5">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                      style={fontStyle}
                    >
                      {t.trustInfo.hoursLabel}
                    </span>
                    <span
                      className="text-sm font-black text-slate-800"
                      style={fontStyle}
                    >
                      {shop.operationalHours || "10:00 AM - 08:30 PM"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-2xl bg-[#FDF8F4] flex items-center justify-center text-orange group-hover/item:bg-orange group-hover/item:text-white transition-all duration-300 border border-orange/5">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest"
                      style={fontStyle}
                    >
                      {t.trustInfo.addressLabel}
                    </span>
                    <span
                      className="text-sm font-black text-slate-800 line-clamp-1"
                      style={fontStyle}
                    >
                      {shop.address}, {shop.city}
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-8 pb-8 pt-2 flex flex-col gap-4">
                <button
                  onClick={() => {
                    const query = encodeURIComponent(`${shop.address || ''} ${shop.city || ''}`);
                    if (query.trim()) {
                      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
                    }
                  }}
                  className="w-full flex items-center justify-center gap-3 bg-[#FDF8F4] text-orange border border-orange/10 py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:bg-orange hover:text-white transition-all active:scale-95 leading-none"
                  style={fontStyle}
                >
                  <MapPin className="w-5 h-5" />
                  {t.trustInfo.btnDirections}
                </button>
              </div>
            </div>
          </aside>

          {/* 📄 Right Column: Tabs & Content */}
          <main className="w-full flex-1">
            <div className="bg-gradient-to-b from-[#fff7f0] to-white rounded-[32px] border border-orange/10 p-4 md:p-6 lg:p-10 shadow-premium min-h-[400px] md:min-h-[800px] transition-all duration-500 hover:shadow-2xl">
              {/* Header Intro */}
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between border-b border-orange/10 pb-6 mb-8 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h4
                      className="text-xl md:text-3xl font-black text-slate-900 uppercase tracking-tight"
                      style={fontStyle}
                    >
                      {t.merchantDossier.title}
                    </h4>
                    <BadgeCheck className="w-6 h-6 text-orange fill-orange/10" />
                  </div>
                  <p
                    className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none"
                    style={fontStyle}
                  >
                    {t.merchantDossier.subtitle}
                  </p>
                </div>
                <div className="flex items-center gap-3 bg-[#1A1A1A]/50 backdrop-blur-md px-4 py-2 rounded-2xl border border-orange/5">
                  <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                  <span
                    className="text-sm font-black text-slate-800 tracking-tight"
                    style={fontStyle}
                  >
                    {shop.likesCount || "0"} {t.profile.likes}
                  </span>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="sticky top-[110px] z-40 bg-[#1A1A1A] py-3 md:py-6 mb-6 md:mb-10 border-b border-[#333333] overflow-x-auto no-scrollbar flex items-center gap-4 md:gap-10">
                {(["about", "collection", "reviews", "gallery"] as const).map(
                  (tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`font-black text-sm uppercase tracking-widest pb-4 px-1 transition-all relative whitespace-nowrap ${activeTab === tab ? "text-slate-900 border-b-2 border-orange" : "text-gray-400 hover:text-orange/70"}`}
                      style={fontStyle}
                    >
                      {tab === "about"
                        ? t.tabs.about
                        : tab === "collection"
                          ? t.tabs.products
                          : tab === "reviews"
                            ? t.tabs.reviews
                            : t.tabs.gallery}
                      {activeTab === tab && (
                        <div className="absolute -bottom-1 left-0 right-0 h-1 bg-orange rounded-full"></div>
                      )}
                    </button>
                  ),
                )}
              </div>

              {/* Tab Content Rendering */}
              <div className="min-h-[400px]">
                {activeTab === "about" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-12">
                    <div className="space-y-6">
                      <h3
                        className="text-xl font-black text-slate-900 uppercase italic border-l-4 border-orange pl-6"
                        style={fontStyle}
                      >
                        {t.about.vision}
                      </h3>
                      <p
                        className="text-gray-500 text-lg font-medium leading-relaxed italic pr-4"
                        style={fontStyle}
                      >
                        "{shop.description}"
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-8 rounded-[2.5rem] bg-[#1A1A1A] border border-orange/5 shadow-premium space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange">
                          <BadgeCheck className="w-7 h-7" />
                        </div>
                        <h4
                          className="text-lg font-black text-slate-900 uppercase leading-tight"
                          style={fontStyle}
                        >
                          {t.about.authenticityTitle}
                        </h4>
                        <p
                          className="text-xs text-gray-400 font-bold leading-relaxed"
                          style={fontStyle}
                        >
                          {t.about.authenticityDesc.replace(
                            "{city}",
                            shop.city,
                          )}
                        </p>
                      </div>
                      <div className="p-8 rounded-[2.5rem] bg-[#1A1A1A] border border-orange/5 shadow-premium space-y-4">
                        <div className="w-12 h-12 rounded-2xl bg-orange/10 flex items-center justify-center text-orange">
                          <Mail className="w-7 h-7" />
                        </div>
                        <h4
                          className="text-lg font-black text-slate-900 uppercase leading-tight"
                          style={fontStyle}
                        >
                          {t.about.digitalAssistanceTitle}
                        </h4>
                        <p
                          className="text-xs text-gray-400 font-bold leading-relaxed"
                          style={fontStyle}
                        >
                          {t.about.digitalAssistanceDesc.replace(
                            "{email}",
                            shop.email || "support@astrologyinbharat.com",
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3
                        className="text-xl font-black text-slate-900 uppercase tracking-tight"
                        style={fontStyle}
                      >
                        {t.about.specializations}
                      </h3>
                      <div className="flex flex-wrap gap-3">
                        {(shop.features || []).map((f: any, i: number) => (
                          <div
                            key={i}
                            className="px-6 py-3 bg-[#1A1A1A] rounded-2xl border border-orange/10 flex items-center gap-3 shadow-sm hover:border-orange transition-colors"
                          >
                            <div className="w-2 h-2 rounded-full bg-orange"></div>
                            <span
                              className="text-xs font-black text-slate-700 uppercase tracking-widest"
                              style={fontStyle}
                            >
                              {f}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "collection" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div
                      className="max-h-[650px] overflow-y-auto pr-4 custom-scrollbar"
                      data-lenis-prevent
                    >
                      {isProductsLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 animate-pulse">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                              key={i}
                              className="h-80 bg-slate-100 rounded-3xl"
                            ></div>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                          {(storeProducts as any[]).map((product) => (
                            <ProductCard
                              key={product.id || product._id}
                              product={product as any}
                              isCompact={true}
                              onView={(p: Product) => {
                                setSelectedProduct(p);
                                setIsQuickViewOpen(true);
                              }}
                            />
                          ))}

                          {(storeProducts as any[]).length === 0 && (
                            <div className="col-span-full py-20 text-center space-y-4">
                              <ShoppingBag className="w-12 h-12 text-gray-200 mx-auto" />
                              <p
                                className="text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                                style={fontStyle}
                              >
                                {t.emptyStates.noProducts}
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === "reviews" && (
                  <div
                    className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar"
                    data-lenis-prevent
                  >
                    {storeReviews.map((r) => (
                      <div
                        key={r.id}
                        className="p-8 rounded-[2.5rem] bg-[#1A1A1A] border border-orange/5 shadow-premium space-y-4 hover:shadow-xl transition-shadow group"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            {r.img ? (
                              <img
                                src={r.img}
                                alt={r.name}
                                className="w-12 h-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center text-orange font-black text-lg">
                                {r.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex flex-col">
                              <span className="text-sm font-black text-slate-900">
                                {r.name}
                              </span>
                              <span
                                className="text-[10px] font-bold text-gray-400"
                                style={fontStyle}
                              >
                                {t.emptyStates.verifiedJourney}
                              </span>
                            </div>
                          </div>
                          <div className="flex text-orange gap-0.5">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star
                                key={i}
                                className={`w-3 h-3 ${i < r.rating ? "fill-orange" : "text-gray-200"}`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-500 text-sm font-bold leading-relaxed italic group-hover:text-slate-700 transition-colors">
                          "{r.review}"
                        </p>
                      </div>
                    ))}

                    {storeReviews.length === 0 && (
                      <div className="py-20 text-center space-y-4">
                        <MessageSquare className="w-12 h-12 text-gray-200 mx-auto" />
                        <p
                          className="text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                          style={fontStyle}
                        >
                          {t.emptyStates.noReviews}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "gallery" && (
                  <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                      {(shop.gallery || []).map((img: any, i: number) => (
                        <div
                          key={i}
                          className="aspect-square rounded-[2rem] overflow-hidden group relative border-4 border-white shadow-xl"
                        >
                          <img
                            src={img}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            alt="Gallery"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-[#1A1A1A] flex items-center justify-center text-orange rotate-45 group-hover:rotate-0 transition-transform duration-500">
                              <ExternalLink className="w-5 h-5" />
                            </div>
                          </div>
                        </div>
                      ))}

                      {(shop.gallery || []).length === 0 && (
                        <div className="col-span-full py-20 text-center space-y-4">
                          <Video className="w-12 h-12 text-gray-200 mx-auto" />
                          <p
                            className="text-gray-400 font-bold uppercase tracking-widest text-[10px]"
                            style={fontStyle}
                          >
                            {t.emptyStates.noGallery}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 mb-10 text-center">
        <Link
          href="/"
          className="px-12 py-5 bg-orange text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] hover:bg-slate-900 transition-all shadow-2xl active:scale-95 inline-block"
          style={fontStyle}
        >
          {t.footer.btnExplore}
        </Link>
      </div>

      <ProductQuickView
        isOpen={isQuickViewOpen}
        onClose={() => setIsQuickViewOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default StoreDetailsPage;
