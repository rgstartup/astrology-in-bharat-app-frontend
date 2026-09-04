"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import type { Expert } from "@repo/lib";
import { useAuthStore } from "@/store/useAuthStore";
import { usePreloadExpertStore } from "@/store/usePreloadExpertStore";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useHomeTranslations } from "@/i18n/useHomeTranslations";
import socket from "@/lib/socket";
import ExpertActions from "./ExpertActions";
import ExpertCardProfile from "./ExpertCardProfile";
import ExpertDetails from "./ExpertDetails";
import ExpertRating from "./ExpertRating";
import ExpertVideoModal from "./ExpertVideoModal";

export interface ExpertCardProps {
  expertData: Expert;
  cardClassName?: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({
  expertData,
  cardClassName = "",
}) => {
  const { t } = useHomeTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated } = useAuthStore();
  const { isExpertInWishlist } = useWishlistStore();
  const { toggleLike } = useWishlist();
  const { setPreloadedExpert } = usePreloadExpertStore();
  const {
    id,
    avatar,
    name = "Expert",
    specialization,
    experience_in_years,
    languages,
    price,
    chat_price,
    call_price,
    video_call_price,
    video,
    rating = 0,
    is_available,
    total_likes = 0,
    custom_services = [],
  } = expertData;
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLikes, setCurrentLikes] = useState(total_likes);
  const [isAvailable, setIsAvailable] = useState(is_available);
  const [isBusy, setIsBusy] = useState(Boolean((expertData as any).is_busy));

  useEffect(
    () => () => {
      document.body.style.cursor = "default";
    },
    [],
  );
  useEffect(() => setCurrentLikes(total_likes), [total_likes]);
  useEffect(() => setIsAvailable(is_available), [is_available]);
  useEffect(() => {
    const status = (data: any) => {
      const eventId = data.expert_id || data.id || data.userId;
      if (String(eventId) !== String(id)) return;
      setIsAvailable(data.is_available);
      if (!data.is_available) setIsBusy(false);
    };
    const busy = (data: any) => {
      if (String(data.expert_id || data.id) === String(id))
        setIsBusy(data.is_busy);
    };
    socket.on("expert_status_changed", status);
    socket.on("expert_busy_changed", busy);
    return () => {
      socket.off("expert_status_changed", status);
      socket.off("expert_busy_changed", busy);
    };
  }, [id]);

  const expertProfileId = id || (expertData as any).expert_id;
  const isLiked = expertProfileId
    ? isExpertInWishlist(expertProfileId as any)
    : false;
  const services = [
    specialization,
    ...(Array.isArray(custom_services)
      ? custom_services.map((service) => service.name)
      : []),
  ].filter((service): service is string => Boolean(service));
  const displayedLanguages = Array.isArray(languages)
    ? languages.join(", ")
    : languages || "";
  const stopNavigation = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };
  const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopNavigation(event);
    if (!isAuthenticated) {
      toast.error("Please login to like this expert. Login now →", {
        onClick: () =>
          router.push(
            `/sign-in?callbackUrl=${encodeURIComponent(pathname === "/" ? "/#our-experts" : pathname)}`,
          ),
        style: { cursor: "pointer" },
      });
      return;
    }
    setCurrentLikes((current) =>
      isLiked ? Math.max(0, current - 1) : current + 1,
    );
    toggleLike({ id: expertProfileId as any, type: "expert", isLiked });
  };
  const consult = (
    event: React.MouseEvent<HTMLButtonElement>,
    type: "chat" | "audio" | "video",
  ) => {
    stopNavigation(event);
    if (!expertProfileId) {
      toast.error("Expert details not found. Please try again.");
      return;
    }
    router.push(
      type === "chat"
        ? `/chat/prep/${expertProfileId}`
        : `/call/prep/${expertProfileId}?type=${type}`,
    );
  };

  return (
    <div className="h-full w-full">
      <div
        className={`flex h-full flex-col rounded-xl border border-[#daa23e] bg-white p-3 text-center shadow-sm transition-transform duration-300 hover:-translate-y-1.5 ${cardClassName} ${isNavigating ? "pointer-events-none opacity-70" : ""}`}
      >
        <NextLink
          href={id ? `/expert/${id}` : "#"}
          className="relative flex flex-1 flex-col no-underline hover:no-underline"
          onClick={() => {
            setIsNavigating(true);
            document.body.style.cursor = "wait";
            setPreloadedExpert({
              ...expertData,
              is_available: isAvailable,
              total_likes: currentLikes,
            } as any);
          }}
        >
          <ExpertCardProfile
            avatar={avatar}
            name={name}
            isLiked={isLiked}
            currentLikes={currentLikes}
            isAvailable={isAvailable}
            isBusy={isBusy}
            isNavigating={isNavigating}
            onlineLabel={t.expertCard.online}
            offlineLabel={t.expertCard.offline}
            onLike={handleLike}
            onOpenVideo={(event) => {
              stopNavigation(event);
              setIsVideoOpen(true);
            }}
          />
          <ExpertRating rating={rating} />
          <ExpertDetails
            name={name}
            services={services}
            experience={experience_in_years}
            languages={displayedLanguages}
            labels={{
              experience: t.expertCard.exp,
              years: t.expertCard.years,
              languages: t.expertCard.lang,
            }}
          />
        </NextLink>
        <ExpertActions
          price={price}
          chatPrice={chat_price}
          callPrice={call_price}
          videoCallPrice={video_call_price}
          labels={{
            chat: t.expertCard.chat,
            call: t.expertCard.call,
            videoCall: t.expertCard.videoCall,
            perMinute: t.expertCard.perMin,
          }}
          onChat={(event) => consult(event, "chat")}
          onCall={(event) => consult(event, "audio")}
          onVideoCall={(event) => consult(event, "video")}
        />
      </div>
      {isVideoOpen && (
        <ExpertVideoModal
          name={name}
          video={video}
          title={t.expertCard.videoModalTitle.replace("{name}", name)}
          onClose={() => setIsVideoOpen(false)}
        />
      )}
    </div>
  );
};

export default ExpertCard;
