"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getExpertReviews, Review } from "@/libs/api-experts";
import { useExpertPresence } from "@/hooks/useExpertPresence";
import type { Expert } from "@repo/lib";

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
  const { isAvailableForConsultation, isBusy } = useExpertPresence(expertId, {
    initialStatus: initialAvailable,
    autoSubscribe: true,
  });
  const isAvailable = isAvailableForConsultation;

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
    isAvailable,
    setIsAvailable,
    isBusy,
    setIsBusy,
    isNavigating,
  };
};


