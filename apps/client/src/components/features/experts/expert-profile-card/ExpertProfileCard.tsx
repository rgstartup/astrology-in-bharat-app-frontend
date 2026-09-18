"use client";

import React from "react";
import {
  extractSpecializationNames,
  extractPrimaryProfession,
} from "@/utils/expert-utils";
import { getProfileImageUrl } from "@/utils/image-utils";
import { ExpertProfileCardProps } from "./types";
import { ProfileHeroBanner } from "./ProfileHeroBanner";
import { ProfileStatsStrip } from "./ProfileStatsStrip";
import { MobileConsultationActions } from "./MobileConsultationActions";
import { ExpertiseOverview } from "./ExpertiseOverview";
import { DesktopConsultationActions } from "./DesktopConsultationActions";
import { ProfileTrustFooter } from "./ProfileTrustFooter";

export const ExpertProfileCard: React.FC<ExpertProfileCardProps> = ({
  expert,
  isAvailable,
  isBusy,
  onChatClick,
  onCallClick,
  onVideoCallClick,
  onVideoClick,
}) => {
  const name = expert.name || "Astrologer";
  const avatar = getProfileImageUrl(expert.avatar, expert.name);

  const ratingValue = Number(expert.rating ?? expert.ratings ?? 4.9).toFixed(1);
  const totalLikes = expert.total_likes ?? 0;

  const currentLikesFormatted =
    totalLikes >= 1000
      ? `${(totalLikes / 1000).toFixed(1).replace(/\.0$/, "")}k`
      : `${totalLikes}`;

  const consultCount = expert.consultation_count ?? 0;
  const consultFormatted =
    consultCount >= 1000
      ? `${(consultCount / 1000).toFixed(1).replace(/\.0$/, "")}k+`
      : consultCount > 0
        ? `${consultCount}+`
        : "500+";

  const expYears = expert.experience_in_years ?? expert.experience ?? 5;
  const defaultPrice = Number(expert.price ?? 0);

  const chatPrice =
    expert.pricing?.chat_price ??
    (expert.chat_price && expert.chat_price > 0
      ? expert.chat_price
      : defaultPrice > 0
        ? defaultPrice
        : 0);

  const callPrice =
    expert.pricing?.call_price ??
    (expert.call_price && expert.call_price > 0
      ? expert.call_price
      : defaultPrice > 0
        ? defaultPrice
        : 0);

  const videoCallPrice =
    expert.pricing?.video_call_price ??
    (expert.video_call_price && expert.video_call_price > 0
      ? expert.video_call_price
      : defaultPrice > 0
        ? defaultPrice * 2
        : 0);

  const languagesList = Array.isArray(expert.languages)
    ? expert.languages.join(", ")
    : expert.languages || expert.language || "Hindi, English";

  const specializations = extractSpecializationNames(
    expert.specializations || expert.specialization || expert.expertise,
  );

  const primaryProfession = extractPrimaryProfession(expert, "Astrologer");

  const isOnline =
    isAvailable !== undefined
      ? Boolean(isAvailable)
      : Boolean(expert.is_available);
  const currentBusy =
    isBusy !== undefined ? Boolean(isBusy) : Boolean(expert.is_busy);

  return (
    <div className="w-full flex flex-col lg:flex-row items-stretch gap-5 lg:gap-6">
      {/* ── Section 1: Left Profile Card (Primary Identity: Avatar, Name, Stats & Mobile CTAs) ── */}
      <div className="w-full lg:w-[320px] xl:w-[340px] shrink-0 overflow-hidden border border-slate-200/60 bg-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between gap-4 shadow-2xs">
        {/* Top Upper Section: Single Orange Wave Banner + Avatar + Identity */}
        <ProfileHeroBanner
          name={name}
          avatar={avatar}
          primaryProfession={primaryProfession}
          isOnline={isOnline}
          currentBusy={currentBusy}
          videoUrl={expert.video}
          onVideoClick={onVideoClick}
        />

        {/* Lower Actions Area: Number-First Stats Strip & Mobile Instant CTAs */}
        <div className="flex flex-col gap-3">
          <ProfileStatsStrip
            expYears={expYears}
            ratingValue={ratingValue}
            currentLikesFormatted={currentLikesFormatted}
          />

          <MobileConsultationActions
            chatPrice={chatPrice}
            callPrice={callPrice}
            videoCallPrice={videoCallPrice}
            onChatClick={onChatClick}
            onCallClick={onCallClick}
            onVideoCallClick={onVideoCallClick}
          />
        </div>
      </div>

      {/* ── Section 2: Right / Mid Info & Consultation Actions Card ── */}
      <div className="flex-1 min-w-0 overflow-hidden border border-slate-200/60 bg-white rounded-2xl p-5 sm:p-6 lg:p-7 flex flex-col justify-between gap-5 shadow-2xs">
        <ExpertiseOverview
          specializations={specializations}
          consultFormatted={consultFormatted}
          languagesList={languagesList}
        />

        <DesktopConsultationActions
          chatPrice={chatPrice}
          callPrice={callPrice}
          videoCallPrice={videoCallPrice}
          onChatClick={onChatClick}
          onCallClick={onCallClick}
          onVideoCallClick={onVideoCallClick}
        />

        <ProfileTrustFooter
          reportPrice={expert.report_price}
          horoscopePrice={expert.horoscope_price}
        />
      </div>
    </div>
  );
};

export default ExpertProfileCard;
