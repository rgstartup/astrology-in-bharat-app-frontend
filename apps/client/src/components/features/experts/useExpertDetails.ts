"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getExpertReviews, Review } from "@/libs/api-experts";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import { toExpertStatus } from "@/realtime/types/presence";
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
  const router = useRouter();

  // Real-time status sync via centralized presence hook with room subscription
  const { isAvailableForConsultation, isBusy } = useExpertPresence(Number(expertId), {
    initialStatus: toExpertStatus(initialAvailable),
    autoSubscribe: true,
  });

  const handleChatClick = () => {
    setIsNavigating(true);
    router.push(`/chat/prep/${expertId}`);
  };

  const handleCallClick = () => {
    setIsNavigating(true);
    router.push(`/call/prep/${expertId}?type=audio`);
  };

  const handleVideoCallClick = () => {
    setIsNavigating(true);
    router.push(`/call/prep/${expertId}?type=video`);
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
