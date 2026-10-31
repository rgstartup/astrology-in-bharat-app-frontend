"use client";

import Image from "next/image";
import React, { useState } from "react";
import { createPortal } from "react-dom";
import { CloseButton } from "@repo/ui";
import { useRouter, usePathname, Link } from "@/i18n/navigation";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuthStore } from "@/store/__authStore";
import { toast } from "@repo/design/shadcn";
import { useWishlist } from "@/hooks/useWishlist";
import { ExpertCardProps } from "@/lib/types";
import { useHomeTranslations } from "@/i18n/useHomeTranslations";
import { useTranslations } from "next-intl";
import { getYoutubeId, getYoutubeEmbedUrl } from "@/utils/video-utils";
import { usePreloadExpertStore } from "@/store/preloadExpertStore";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { extractSpecializationNames } from "@/utils/expert-utils";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";
import { requestConsultationPrep } from "@/features/consultation-prep";

function formatLikesCount(count: number) {
  if (count >= 1000) {
    return (count / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  }
  return String(count);
}

function ExpertImageHeader({
  image,
  name,
  isLiked,
  currentLikes,
  isAvailable,
  isBusy,
  onLike,
  onPlayVideo,
  t,
}: {
  image?: string;
  name?: string;
  isLiked: boolean;
  currentLikes: number;
  isAvailable: boolean;
  isBusy: boolean;
  onLike: (e: React.MouseEvent) => void;
  onPlayVideo: (e: React.MouseEvent) => void;
  t: any;
}) {
  const statusBg = isBusy
    ? "bg-amber-100 text-amber-700"
    : isAvailable
      ? "bg-green-100 text-green-700"
      : "bg-gray-100 text-gray-600";
  const dotColor = isBusy
    ? "text-amber-500"
    : isAvailable
      ? "text-green-500"
      : "text-gray-400";
  const statusText = isBusy ? "Busy" : isAvailable ? t.expertCard.online : t.expertCard.offline;

  return (
    <div className="relative flex justify-center pt-8">
      <div className="absolute top-2 left-3 z-20 flex flex-col items-center gap-1">
        <button
          onClick={onLike}
          className="w-[36px] h-[36px] flex items-center justify-center rounded-full bg-white shadow-md hover:scale-110 transition"
        >
          <i
            className={`${isLiked ? "fa-solid" : "fa-regular"} fa-heart`}
            style={{ color: isLiked ? "#ff4d4d" : "#555" }}
          />
        </button>
        {currentLikes > 0 && (
          <span className="text-xs font-semibold text-white bg-black/50 px-2 py-0.5 rounded-full backdrop-blur-sm">
            {formatLikesCount(currentLikes)}
          </span>
        )}
      </div>

      <div className={`absolute top-2 right-3 z-20 px-3 py-1 rounded-full text-xs font-medium flex items-center gap-2 shadow-md ${statusBg}`}>
        <i className={`fa-solid fa-circle ${dotColor}`} />
        {statusText}
      </div>

      <div className="relative w-[120px] h-[120px] mx-auto mt-1 mb-2">
        <Image
          src={image || "/images/dummy-expert.jpg"}
          alt={name || "Expert Profile"}
          fill
          sizes="120px"
          className="object-cover rounded-full border border-[#daa23e] shadow-sm"
        />

        <button
          type="button"
          aria-label={`Play video of ${name}`}
          className="absolute top-[85%] left-[50%] -translate-x-1/2 -translate-y-1/2 text-white text-5xl cursor-pointer z-10 drop-shadow-lg transition-all duration-300 hover:text-primary hover:scale-110 bg-transparent border-0 p-0"
          onClick={onPlayVideo}
        >
          <i className="fa-solid fa-circle-play" />
        </button>
      </div>
    </div>
  );
}

function ExpertRatingStars({ ratings }: { ratings: number }) {
  if (ratings <= 0) {
    return (
      <div className="flex justify-center items-center text-center gap-1.5 pt-3 h-8">
        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
          <i className="fa-solid fa-star text-amber-500 text-[10px]" />
          New Expert
        </span>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center text-center gap-1.5 pt-3 h-8" style={{ fontSize: "1.05rem" }}>
      {Array.from({ length: 5 }).map((_, i) => {
        const starIndex = i + 1;
        if (ratings >= starIndex) {
          return <i key={i} className="fa-solid fa-star text-[#daa23e]" />;
        }
        if (ratings >= starIndex - 0.5) {
          return <i key={i} className="fa-solid fa-star-half-stroke text-[#daa23e]" />;
        }
        return <i key={i} className="fa-regular fa-star" style={{ color: "#ccc" }} />;
      })}
      <span className="text-gray-500 text-sm ml-2 font-medium">
        {ratings.toFixed(1)} / 5
      </span>
    </div>
  );
}

function ExpertActionButtons({
  name,
  chatPrice,
  callPrice,
  videoCallPrice,
  onChatClick,
  onCallClick,
  onVideoCallClick,
  t,
}: {
  name?: string;
  chatPrice: number;
  callPrice: number;
  videoCallPrice: number;
  onChatClick: (e: React.MouseEvent) => void;
  onCallClick: (e: React.MouseEvent) => void;
  onVideoCallClick: (e: React.MouseEvent) => void;
  t: any;
}) {
  return (
    <div className="px-2 pb-3 space-y-2 mt-auto">
      <div className="flex gap-1.5">
        <button
          onClick={onChatClick}
          aria-label={`Start chat consultation with ${name}`}
          className="flex-1 min-w-0 flex flex-col items-center justify-center py-2 min-h-[46px] bg-[#ff6b00] text-white rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 border-0 overflow-hidden cursor-pointer"
        >
          <div className="flex items-center gap-1 mb-0.5">
            <i className="fa-regular fa-comment-dots text-[10px] sm:text-sm" />
            <span className="text-[12px] sm:text-[14px] font-bold">{t.expertCard.chat}</span>
          </div>
          <span className="text-[9px] sm:text-[11px] font-semibold opacity-95 truncate w-full text-center px-1">
            {chatPrice > 0 ? `₹${chatPrice}${t.expertCard.perMin}` : "Free Chat"}
          </span>
        </button>

        <button
          onClick={onCallClick}
          aria-label={`Start audio call with ${name}`}
          className="flex-1 min-w-0 flex flex-col items-center justify-center py-2 min-h-[46px] bg-[#ff6b00] text-white rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 border-0 overflow-hidden cursor-pointer"
        >
          <div className="flex items-center gap-1 mb-0.5">
            <i className="fa-solid fa-phone-volume text-[10px] sm:text-sm" />
            <span className="text-[12px] sm:text-[14px] font-bold">{t.expertCard.call}</span>
          </div>
          <span className="text-[9px] sm:text-[11px] font-semibold opacity-95 truncate w-full text-center px-1">
            {callPrice > 0 ? `₹${callPrice}${t.expertCard.perMin}` : "Free Call"}
          </span>
        </button>
      </div>

      <button
        onClick={onVideoCallClick}
        aria-label={`Start video call with ${name}`}
        className="w-full flex items-center justify-center gap-1.5 py-2 min-h-[38px] bg-[#ff6b00] text-white rounded-xl shadow-[0_4px_10px_rgba(255,107,0,0.2)] hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 border-0 overflow-hidden cursor-pointer"
      >
        <i className="fa-solid fa-video text-[10px] sm:text-sm shrink-0" />
        <span className="text-[12px] sm:text-[14px] font-bold shrink-0">
          {t.expertCard.videoCall}
        </span>
        <span className="text-[9px] sm:text-[11px] font-semibold opacity-95 truncate">
          {videoCallPrice > 0 ? `₹${videoCallPrice}${t.expertCard.perMin}` : "(Online)"}
        </span>
      </button>
    </div>
  );
}

function ExpertVideoModal({
  video,
  name,
  onClose,
  t,
}: {
  video?: string;
  name?: string;
  onClose: () => void;
  t: any;
}) {
  if (typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
      aria-hidden="true"
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h5 className="font-bold text-gray-900 text-lg m-0">
            {t.expertCard.videoModalTitle.replace("{name}", name || "Expert")}
          </h5>
          <CloseButton onClick={onClose} />
        </div>

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
                  />
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
                Looks like <span className="font-bold text-orange-600">{name}</span> hasn't
                uploaded an introductory video yet. Don't worry, you can still connect
                instantly via chat or call!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expertData, cardClassName = "" }) => {
  const { t } = useHomeTranslations();
  const {
    id,
    image,
    name,
    expertise,
    experience,
    languages,
    price = 0,
    chat_price,
    call_price,
    video_call_price,
    report_price,
    horoscope_price,
    video,
    ratings = 0,
    total_likes = 0,
    custom_services = [],
  } = expertData;

  const [show, setShow] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const { setPreloadedExpert } = usePreloadExpertStore();

  React.useEffect(() => {
    return () => {
      document.body.style.cursor = "default";
    };
  }, []);

  const { isExpertInWishlist } = useWishlistStore();
  const { isAuthenticated } = useAuthStore();
  const { toggleLike } = useWishlist();
  const router = useRouter();
  const tChat = useTranslations("Chat.page");
  const pathname = usePathname();

  const [currentLikes, setCurrentLikes] = useState(total_likes);

  React.useEffect(() => {
    setCurrentLikes(total_likes);
  }, [total_likes]);

  const { isAvailableForConsultation, isBusy } = useExpertPresence(Number(id), {
    initialStatus: toExpertStatus(
      expertData.isAvailableForConsultation ?? expertData.status ?? expertData.is_available,
    ),
  });
  const isAvailable = isAvailableForConsultation;
  const expertProfileId = id;
  const isLiked = expertProfileId ? isExpertInWishlist(expertProfileId as any) : false;

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
          onClick: () =>
            router.push(
              withCallbackUrl(PATHS.LOGIN, pathname === "/" ? "/#our-experts" : pathname),
            ),
          style: { cursor: "pointer" },
        },
      );
      return;
    }

    const newIsLiked = !isLiked;
    setCurrentLikes((prev) => (newIsLiked ? prev + 1 : Math.max(0, prev - 1)));
    toggleLike({ id: expertProfileId as any, type: "expert", isLiked });
  };

  const handleChatClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!expertProfileId) {
      toast.error("Expert details not found. Please try again.");
      return;
    }

    requestConsultationPrep(
      String(expertProfileId),
      {
        isAuthenticated,
        pathname,
        push: (url) => router.push(url),
        loginTitle: tChat("toastLogin"),
        loginActionLabel: tChat("loginNow"),
      },
      "chat",
    );
  };

  const handleCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!expertProfileId) {
      toast.error("Expert details not found. Please try again.");
      return;
    }

    requestConsultationPrep(
      String(expertProfileId),
      {
        isAuthenticated,
        pathname,
        push: (url) => router.push(url),
        loginTitle: tChat("toastLogin"),
        loginActionLabel: tChat("loginNow"),
      },
      "voice",
    );
  };

  const handleVideoCallClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!expertProfileId) {
      toast.error("Expert details not found. Please try again.");
      return;
    }

    requestConsultationPrep(
      String(expertProfileId),
      {
        isAuthenticated,
        pathname,
        push: (url) => router.push(url),
        loginTitle: tChat("toastLogin"),
        loginActionLabel: tChat("loginNow"),
      },
      "video",
    );
  };

  const customServicesList = Array.isArray(custom_services)
    ? custom_services.map((s: any) => s.name || s.title || s)
    : [];
  const extractedSpecs = extractSpecializationNames(
    (expertData as any).specializations || (expertData as any).specialization || expertise,
  );
  const allServices = [...extractedSpecs, ...customServicesList].filter(Boolean);

  const effectiveChatPrice = chat_price && chat_price > 0 ? chat_price : price > 0 ? price : 0;
  const effectiveCallPrice = call_price && call_price > 0 ? call_price : price > 0 ? price : 0;
  const effectiveVideoPrice =
    video_call_price && video_call_price > 0 ? video_call_price : price > 0 ? price * 2 : 0;

  return (
    <div className="w-full h-full">
      <div
        className={`bg-white h-full flex flex-col rounded-xl shadow-sm border border-[#daa23e] p-3 text-center transition-transform duration-300 hover:-translate-y-1.5 ${cardClassName} ${
          isNavigating ? "opacity-70 pointer-events-none" : ""
        }`}
      >
        <Link
          href={id ? `/expert/${id}` : "#"}
          className="no-underline hover:no-underline flex flex-col flex-1 relative"
          onClick={() => {
            setIsNavigating(true);
            document.body.style.cursor = "wait";
            setPreloadedExpert({
              id,
              image: image || "/images/dummy-expert.jpg",
              name,
              expertise,
              experience,
              languages,
              price,
              chat_price,
              call_price,
              video_call_price,
              report_price,
              horoscope_price,
              video,
              ratings,
              isAvailableForConsultation: isAvailable,
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

          <ExpertImageHeader
            image={image}
            name={name}
            isLiked={isLiked}
            currentLikes={currentLikes}
            isAvailable={isAvailable}
            isBusy={isBusy}
            onLike={handleLike}
            onPlayVideo={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setShow(true);
            }}
            t={t}
          />

          <ExpertRatingStars ratings={ratings} />

          <div
            className="px-4 pt-2 pb-1 text-[18px] font-semibold text-[#301118] truncate text-center"
            title={name}
          >
            {name}
          </div>

          <div className="px-3 mt-1 mb-1 flex flex-wrap justify-center items-center gap-1 min-h-[28px]">
            {allServices.slice(0, 2).map((service, index) => (
              <span
                key={index}
                className="inline-block bg-orange text-white text-[10px] font-semibold px-2 py-0.5 rounded-full text-center max-w-[120px] truncate"
                title={service}
              >
                {service}
              </span>
            ))}
            {allServices.length > 2 && (
              <span className="inline-block bg-orange/20 text-orange text-[11px] font-semibold px-2 py-0.5 rounded-full">
                +{allServices.length - 2}
              </span>
            )}
          </div>

          <div className="px-2 my-1.5 text-[14px] text-[#1a1a1a] flex items-center justify-center gap-1.5">
            <strong>{t.expertCard.exp}</strong>
            <span className="font-semibold bg-orange/10 text-orange px-2 py-0.5 rounded text-[12px] shrink-0">
              {experience} {t.expertCard.years}
            </span>
          </div>

          <div className="px-2 my-1.5 text-[14px] text-[#1a1a1a] flex items-center justify-center gap-1.5 w-full">
            <strong>{t.expertCard.lang}</strong>
            <span
              className="font-medium bg-gray-100 text-gray-800 px-2 py-0.5 rounded-md text-[12px] inline-flex items-center gap-1 max-w-[160px]"
              title={languages}
              aria-label={`Languages: ${languages}`}
            >
              <span className="truncate">{languages}</span>
            </span>
          </div>
        </Link>

        <ExpertActionButtons
          name={name}
          chatPrice={effectiveChatPrice}
          callPrice={effectiveCallPrice}
          videoCallPrice={effectiveVideoPrice}
          onChatClick={handleChatClick}
          onCallClick={handleCallClick}
          onVideoCallClick={handleVideoCallClick}
          t={t}
        />
      </div>

      {show && (
        <ExpertVideoModal
          video={video}
          name={name}
          onClose={() => setShow(false)}
          t={t}
        />
      )}
    </div>
  );
};

export default ExpertCard;
