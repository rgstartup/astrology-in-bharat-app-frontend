"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { toast } from "@/hooks/use-toast";
import type { IExpert } from "@repo/lib";
import { useAuthStore } from "@/store/authStore";
import { usePreloadExpertStore } from "@/store/preloadExpertStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useWishlist } from "@/hooks/useWishlist";
import { useHomeTranslations } from "@/i18n/useHomeTranslations";
import { PATHS } from "@repo/routes";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { extractSpecializationNames } from "@/utils/expert-utils";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";
import ExpertActions from "./ExpertActions";
import ExpertCardProfile from "./ExpertCardProfile";
import ExpertDetails from "./ExpertDetails";
import ExpertRating from "./ExpertRating";
import ExpertVideoModal from "./ExpertVideoModal";

export interface ExpertCardProps {
  expertData: IExpert;
  cardClassName?: string;
}

const ExpertCard: React.FC<ExpertCardProps> = ({ expertData, cardClassName = "" }) => {
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
    experience_in_years = 0,
    languages,
    video,
    rating = 0,
    is_available = true,
    total_likes = 0,
  } = expertData;

  const chat_price =
    expertData.pricing?.chat_price ?? expertData.chat_price ?? expertData.price ?? 0;
  const call_price =
    expertData.pricing?.call_price ?? expertData.call_price ?? expertData.price ?? 0;
  const video_call_price =
    expertData.pricing?.video_call_price ??
    expertData.video_call_price ??
    (chat_price ? chat_price * 2 : 0);
  const price = expertData.price ?? chat_price ?? call_price ?? 0;

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const [currentLikes, setCurrentLikes] = useState<number>(total_likes);

  useEffect(
    () => () => {
      document.body.style.cursor = "default";
    },
    [],
  );
  useEffect(() => setCurrentLikes(total_likes), [total_likes]);

  const { isAvailableForConsultation, isBusy } = useExpertPresence(Number(id), {
    initialStatus: toExpertStatus(
      expertData.isAvailableForConsultation ??
      expertData.status ??
      expertData.is_available,
    ),
  });
  const isAvailable = isAvailableForConsultation;

  const expertProfileId = id || (expertData as any).expert_id;
  const isLiked = expertProfileId ? isExpertInWishlist(expertProfileId as any) : false;

  const specializationsList = extractSpecializationNames(
    expertData.specializations || expertData.specialization || (expertData as any).expertise,
  );

  const customServicesList = Array.isArray(expertData.custom_services)
    ? expertData.custom_services.map((service) => service.name)
    : [];

  const services = [...specializationsList, ...customServicesList].filter(
    (service): service is string => Boolean(service),
  );

  const displayedLanguages = Array.isArray(languages) ? languages.join(", ") : languages || "";

  const stopNavigation = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const handleLike = (event: React.MouseEvent<HTMLButtonElement>) => {
    stopNavigation(event);
    if (!isAuthenticated) {
      toast.error("Please login to like this expert. Login now →", {
        onClick: () =>
          router.push(withCallbackUrl(PATHS.LOGIN, pathname === "/" ? "/#our-experts" : pathname)),
        style: { cursor: "pointer" },
      });
      return;
    }
    setCurrentLikes((current: number) => (isLiked ? Math.max(0, current - 1) : current + 1));
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
          href={id ? `/consultants/${id}` : "#"}
          className="relative flex flex-1 flex-col no-underline hover:no-underline"
          onClick={() => {
            setIsNavigating(true);
            document.body.style.cursor = "wait";
            setPreloadedExpert({
              ...expertData,
              isAvailableForConsultation: isAvailable,
              is_available: isAvailable,
              total_likes: currentLikes,
            });
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
