"use client";

import NextLink from "next/link";
import Image from "next/image";
import React, { useState, useRef } from "react";
import { Button, CloseButton } from "@repo/ui";
import { useRouter, usePathname } from "next/navigation";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useAuthStore } from "@/store/__useAuthStore";
import { toast } from "react-toastify";
import { useWishlist } from "@/hooks/useWishlist";
import { ExpertCardProps } from "@/lib/types";
import { useLanguageStore } from "@repo/store";
import { homeTranslations } from "../../../lib/translations/home";
import { getYoutubeId, getYoutubeEmbedUrl } from "@/utils/video-utils";
import { usePreloadExpertStore } from "@/store/usePreloadExpertStore";

const ExpertCard: React.FC<ExpertCardProps> = ({
  expertData,
  cardClassName = "",
}) => {
  const { lang } = useLanguageStore();
  const t = homeTranslations[lang as keyof typeof homeTranslations] || homeTranslations.en;
  const {
    id,
    userId,
    image,
    name,
    expertise,
    experience,
    language,
    price,
    chat_price,
    call_price,
    video_call_price,
    report_price,
    horoscope_price,
    video,
    ratings = 0,
    is_available,
    total_likes = 0,
    custom_services = [],
  } = expertData;

  const [show, setShow] = useState(false);
  const [serviceIndex, setServiceIndex] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const { setPreloadedExpert } = usePreloadExpertStore();

  React.useEffect(() => {
    // Reset cursor when component unmounts (e.g. after successful navigation)
    return () => {
      document.body.style.cursor = 'default';
    };
  }, []);
  // Hooks
  const { isExpertInWishlist, toggleExpertWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleLike } = useWishlist();
  const router = useRouter();
  const pathname = usePathname();

  // Local state for optimistic updates
  const [currentLikes, setCurrentLikes] = useState(total_likes);
  const [isAvailable, setIsAvailable] = useState(is_available);
  const [isBusy, setIsBusy] = useState((expertData as any).is_busy || false);

  // Sync with prop if it changes
  React.useEffect(() => {
    setCurrentLikes(total_likes);
  }, [total_likes]);

  // Sync isAvailable with prop
  React.useEffect(() => {
    setIsAvailable(is_available);
  }, [is_available]);

  // Real-time status sync via Socket
  React.useEffect(() => {
    const { socket } = require("@/lib/socket");

    const handleStatusSync = (data: any) => {
      const expertIdFromEvent = data.expert_id || data.id || data.userId;

      // Match with either ID type (expert profile ID or user ID)
      if (String(expertIdFromEvent) === String(id) || String(expertIdFromEvent) === String(userId)) {
        console.log(`[Presence] Expert ${name} status changed to ${data.is_available ? 'Online' : 'Offline'}`);
        setIsAvailable(data.is_available);
        if (!data.is_available) setIsBusy(false); // offline expert can't be busy
      }
    };

    const handleBusySync = (data: any) => {
      const expertIdFromEvent = data.expert_id || data.id;
      if (String(expertIdFromEvent) === String(id) || String(expertIdFromEvent) === String(userId)) {
        setIsBusy(data.is_busy);
      }
    };

    socket.on("expert_status_changed", handleStatusSync);
    socket.on("expert_busy_changed", handleBusySync);

    return () => {
      socket.off("expert_status_changed", handleStatusSync);
      socket.off("expert_busy_changed", handleBusySync);
    };
  }, [id, userId, name]);

  // For chat/consultation, we use id (expert profile ID) - safe fallback check
  const expertProfileId = id || (expertData as any).expert_id || expertData.userId;

  // For wishlist, we use the expert profile ID (it matches what backend returns in getExpertWishlist)
  const wishlistTargetId = expertProfileId;
  const isLiked = wishlistTargetId ? isExpertInWishlist(wishlistTargetId as any) : false;

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error(
        <span>
          Please login to like this expert.{" "}
          <span className="underline font-black">Login now →</span>
        </span>,
        {
          onClick: () => router.push(`/sign-in?callbackUrl=${encodeURIComponent(pathname === '/' ? '/#our-experts' : pathname)}`),
          style: { cursor: "pointer" },
        }
      );
      return;
    }

    // Optimistic Update for the count locally
    const newIsLiked = !isLiked;
    setCurrentLikes((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));

    // TanStack Query handles the rest (optimistic UI for heart icon and data sync)
    toggleLike({ id: wishlistTargetId as any, type: "expert", isLiked });
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!expertProfileId) {
      console.error("[ExpertCard] Invalid ID:", expertData);
      toast.error("Expert details not found. Please try again.");
      return;
    }

    // Use expert profile ID for chat
    router.push(`/chat/prep/${expertProfileId}`);
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/call/prep/${expertProfileId}?type=audio`);
  };

  const handleVideoCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/call/prep/${expertProfileId}?type=video`);
  };

  const createDetailsUrl = () => (id ? `/expert/${id}` : "#");

  // Combine expertise and custom services for display
  const allServices = [
    expertise,
    ...custom_services.map(s => s.name)
  ].filter(Boolean);

  const displayServices = allServices.slice(0, 3);
  const remainingCount = allServices.length - 3;

  return (
    <div className="w-full h-full">
      <div className={`bg-white h-full flex flex-col rounded-xl shadow-sm border border-[#daa23e] p-3 text-center transition-transform duration-300 hover:-translate-y-1.5 ${cardClassName} ${isNavigating ? 'opacity-70 pointer-events-none' : ''}`}>
        <NextLink
          href={createDetailsUrl()}
          className="no-underline hover:no-underline flex flex-col flex-1 relative"
          onClick={() => {
            setIsNavigating(true);
            document.body.style.cursor = 'wait';
            // Preload basic expert data for instant rendering on details page
            setPreloadedExpert({
              id,
              userId,
              image: image || '/images/dummy-expert.jpg',
              name,
              expertise,
              experience,
              language,
              price,
              chat_price,
              call_price,
              video_call_price,
              report_price,
              horoscope_price,
              video,
              ratings,
              is_available: isAvailable,
              total_likes: currentLikes,
              custom_services,
            });
          }}
        >
          {isNavigating && (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/40 backdrop-blur-[1px] rounded-xl">
              <i className="fa-solid fa-spinner fa-spin text-3xl text-orange"></i>
            </div>
          )}
          {/* IMAGE SECTION */}
          <div className="relative flex justify-center pt-8">
            {/* ❤️ LIKE & COUNT — TOP LEFT (OUTSIDE IMAGE) */}
            <div className="absolute top-2 left-3 z-20 flex flex-col items-center gap-1">
              <button
                onClick={handleLike}
                className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition"
              >
                <i
                  className={`${isLiked ? "fa-solid" : "fa-regular"} fa-heart`}
                  style={{ color: isLiked ? "#ff4d4d" : "#555" }}
                />
              </button>
              {/* Total Likes Count */}
              {currentLikes > 0 && (
                <span className="text-xs font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {((count: number) => {
                    if (count >= 1000) {
                      return (count / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
                    }
                    return count;
                  })(currentLikes)}
                </span>
              )}
            </div>

            {/* 🟢 ONLINE / OFFLINE / BUSY — TOP RIGHT (OUTSIDE IMAGE) */}
            <div
              className={`absolute top-2 right-3 z-20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-md
              ${isBusy
                  ? "bg-amber-100 text-amber-700"
                  : isAvailable
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
            >
              <i
                className={`fa-solid fa-circle ${isBusy ? "text-amber-500" : isAvailable ? "text-green-500" : "text-gray-400"
                  }`}
              />
              {isBusy ? "Busy" : isAvailable ? t.expertCard.online : t.expertCard.offline}
            </div>

            {/* PROFILE IMAGE */}
            <div className="relative w-[120px] h-[120px] mx-auto mt-1 mb-2">
              <Image
                src={image || '/images/dummy-expert.jpg'}
                alt={name || 'Expert Profile'}
                fill
                sizes="120px"
                className="object-cover rounded-full border border-[#daa23e] shadow-sm"
              />

              {/* ▶ PLAY VIDEO */}
              <button
                type="button"
                aria-label={`Play video of ${name}`}
                className="
                  absolute 
                  top-[85%] 
                  left-[50%] 
                  -translate-x-1/2 
                  -translate-y-1/2 
                  text-white 
                  text-5xl 
                  cursor-pointer 
                  z-10 
                  drop-shadow-lg
                  transition-all
                  duration-300
                  hover:text-primary
                  hover:scale-110
                  bg-transparent
                  border-0
                  p-0
                "
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShow(true);
                }}
              >
                <i className="fa-solid fa-circle-play" />
              </button>


            </div>
          </div>

          {/* RATING */}
          <div
            className="flex justify-center items-center text-center gap-1.5 pt-3"
            style={{ fontSize: "1.05rem" }}
          >
            {Array.from({ length: 5 }).map((_, i) => {
              const starIndex = i + 1;
              if (ratings >= starIndex)
                return <i key={i} className="fa-solid fa-star text-[#daa23e]" />;
              if (ratings >= starIndex - 0.5)
                return (
                  <i
                    key={i}
                    className="fa-solid fa-star-half-stroke text-[#daa23e]"
                  />
                );
              return (
                <i
                  key={i}
                  className="fa-regular fa-star"
                  style={{ color: "#ccc" }}
                />
              );
            })}
            <span className="text-gray-500 text-sm ml-2">
              {ratings.toFixed(1)} / 5
            </span>
          </div>


          {/* DETAILS */}
          {/* Name */}
          <div className="px-4 pt-2 pb-1 text-[18px] font-semibold text-[#301118] truncate text-center" title={name}>
            {name}
          </div>

          {/* Expertise Tags — wrap properly */}
          <div className="px-3 mt-1 mb-1 flex flex-wrap justify-center items-center gap-1" style={{ minHeight: '28px' }}>
            {allServices.slice(0, 3).map((service, index) => (
              <span
                key={index}
                className="inline-block bg-orange text-white text-[10px] font-semibold px-2 py-0.5 rounded-full text-center"
                style={{ maxWidth: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                title={service}
              >
                {service}
              </span>
            ))}
            {allServices.length > 3 && (
              <span className="inline-block bg-orange/20 text-orange text-[11px] font-semibold px-2 py-0.5 rounded-full">
                +{allServices.length - 3}
              </span>
            )}
          </div>

          {/* Experience */}
          <div className="px-2 my-2 text-[14px] text-[#1a1a1a] flex items-center justify-center gap-1.5">
            <strong>{t.expertCard.exp}</strong>
            <span className="font-semibold bg-orange/10 text-orange px-2 py-0.5 rounded text-[12px] shrink-0">
              {experience} {t.expertCard.years}
            </span>
          </div>

          {/* Language */}
          <div className="px-2 my-1.5 text-[14px] text-[#1a1a1a] flex items-center justify-center gap-1.5 w-full">
            <strong>{t.expertCard.lang}</strong>
            <span className="font-semibold bg-gray-100 px-2 py-0.5 rounded text-[12px] truncate max-w-[130px] inline-block" title={language}>
              {language}
            </span>
          </div>
        </NextLink>

        {/* ACTION BUTTONS WITH PRICES POINTER */}
        <div className="px-2 pb-3 space-y-2 mt-auto">
          <div className="flex gap-1.5">
            {/* Chat Button */}
            <button
              onClick={handleChatClick}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-2 bg-[#ff6b00] text-white rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 border-0 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-1 mb-0.5">
                <i className="fa-regular fa-comment-dots text-[10px] sm:text-sm" />
                <span className="text-[12px] sm:text-[14px] font-bold">{t.expertCard.chat}</span>
              </div>
              {(() => {
                const p = chat_price && chat_price > 0 ? chat_price : (price > 0 ? price : 0);
                return p > 0 ? <span className="text-[9px] sm:text-[11px] font-semibold opacity-95 truncate w-full text-center px-1">₹{p}{t.expertCard.perMin}</span> : null;
              })()}
            </button>

            {/* Call Button */}
            <button
              onClick={handleCallClick}
              className="flex-1 min-w-0 flex flex-col items-center justify-center py-2 bg-[#ff6b00] text-white rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 border-0 overflow-hidden cursor-pointer"
            >
              <div className="flex items-center gap-1 mb-0.5">
                <i className="fa-solid fa-phone-volume text-[10px] sm:text-sm" />
                <span className="text-[12px] sm:text-[14px] font-bold">{t.expertCard.call}</span>
              </div>
              {(() => {
                const p = call_price && call_price > 0 ? call_price : (price > 0 ? price : 0);
                return p > 0 ? <span className="text-[9px] sm:text-[11px] font-semibold opacity-95 truncate w-full text-center px-1">₹{p}{t.expertCard.perMin}</span> : null;
              })()}
            </button>
          </div>

          {/* Video Call Button */}
          <button
            onClick={handleVideoCallClick}
            className="w-full flex items-center justify-center gap-1.5 py-2 bg-[#ff6b00] text-white rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 border-0 overflow-hidden cursor-pointer"
          >
            <i className="fa-solid fa-video text-[10px] sm:text-sm shrink-0" />
            <span className="text-[12px] sm:text-[14px] font-bold shrink-0">{t.expertCard.videoCall}</span>
            {(() => {
              const p = video_call_price && video_call_price > 0 ? video_call_price : (price > 0 ? price * 2 : 0);
              return p > 0 ? <span className="text-[9px] sm:text-[11px] font-semibold opacity-95 truncate">₹{p}{t.expertCard.perMin}</span> : null;
            })()}
          </button>
        </div>
      </div>

      {/* VIDEO MODAL — custom Tailwind */}
      {show && typeof document !== 'undefined' && require("react-dom").createPortal(
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={(e) => {
            e.stopPropagation();
            setShow(false);
          }}
          aria-hidden="true"
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h5 className="font-bold text-gray-900 text-lg m-0">
                {t.expertCard.videoModalTitle.replace('{name}', name)}
              </h5>
              <CloseButton
                onClick={(e) => {
                  e.stopPropagation();
                  setShow(false);
                }}
              />
            </div>
            {/* Body */}
            {/* Body */}
            <div className="p-4">
              {video ? (
                (() => {
                  const ytId = getYoutubeId(video);
                  if (ytId) {
                    const embedUrl = getYoutubeEmbedUrl(video);
                    return (
                      <iframe
                        src={`${embedUrl}?autoplay=1`}
                        width="100%"
                        height="500"
                        className="bg-black rounded-xl w-full max-h-[60vh] shadow-inner"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    );
                  }
                  return (
                    <video
                      src={video}
                      width="100%"
                      height="500"
                      controls
                      autoPlay
                      className="bg-black rounded-xl w-full max-h-[60vh] shadow-inner"
                    />
                  );
                })()
              ) : (
                <div className="h-[350px] flex flex-col items-center justify-center bg-gradient-to-b from-orange-50/50 to-orange-100/30 rounded-2xl border-2 border-dashed border-orange-200 m-2">
                  <div className="w-20 h-20 bg-white shadow-sm rounded-full flex items-center justify-center mb-5 relative group">
                    <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-20"></div>
                    <i className="fa-solid fa-video-slash text-3xl text-orange-400" />
                  </div>
                  <h4 className="text-xl md:text-2xl font-black text-gray-800 mb-2">
                    Intro Video Unavailable
                  </h4>
                  <p className="text-gray-500 font-medium text-center max-w-sm px-6 leading-relaxed">
                    Looks like <span className="font-bold text-orange-600">{name}</span> hasn't uploaded an introductory video yet. Don't worry, you can still connect instantly via chat or call!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default ExpertCard;


