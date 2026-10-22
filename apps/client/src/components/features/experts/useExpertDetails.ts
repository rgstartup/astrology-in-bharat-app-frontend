"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getExpertReviews, Review } from "@/libs/api-experts";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";
import { useConsultationPrepStore } from "@/store/consultationPrepStore";
import type { IExpert } from "@repo/lib";

export const useExpertDetails = (
  expertId: string,
  userId?: string,
  initialAvailable: boolean = false,
  initialBusy: boolean = false,
) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "about" | "experience" | "reviews" | "gallery" | "videos"
  >("about");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isNavigating, setIsNavigating] = useState(false);
  const openConsultationPrep = useConsultationPrepStore((s) => s.openConsultationPrep);
  const router = useRouter();

  // Real-time status sync via centralized presence hook with room subscription
  const { isAvailableForConsultation, isBusy } = useExpertPresence(Number(expertId), {
    initialStatus: toExpertStatus(initialAvailable),
    autoSubscribe: true,
  });

  const handleChatClick = () => {
    openConsultationPrep(String(expertId), "chat");
  };

  const handleCallClick = () => {
    openConsultationPrep(String(expertId), "voice");
  };

  const handleVideoCallClick = () => {
    openConsultationPrep(String(expertId), "video");
  };

  return {
    isReviewModalOpen,
    setIsReviewModalOpen,
    selectedVideo,
    setSelectedVideo,
    selectedImage,
    setSelectedImage,
    activeTab,
    setActiveTab,
    reviews,
    loadingReviews,
    totalReviews,
    handleChatClick,
    handleCallClick,
    handleVideoCallClick,
    isBusy,
    isNavigating,
    isAvailable: isAvailableForConsultation,
  };
};
