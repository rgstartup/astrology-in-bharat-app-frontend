"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getExpertReviews, Review } from "@/libs/api-experts";
import { Expert } from "@/lib/types";

export const useExpertDetails = (expertId: string, userId?: string) => {
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'about' | 'experience' | 'reviews' | 'gallery' | 'videos'>('about');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [isAvailable, setIsAvailable] = useState<boolean>(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (activeTab === 'reviews') {
      const fetchReviews = async () => {
        setLoadingReviews(true);
        try {
          const res = await getExpertReviews(expertId);
          setReviews(res.data);
          setTotalReviews(res.total);
        } catch (error) {
          console.error("Failed to load reviews", error);
        } finally {
          setLoadingReviews(false);
        }
      };
      fetchReviews();
    }
  }, [activeTab, expertId]);

  // Real-time status sync via Socket
  useEffect(() => {
    const { socket } = require("@/lib/socket");

    const handleStatusSync = (data: any) => {
      const expertIdFromEvent = data.expert_id || data.id || data.userId;
      
      // Check both IDs for a match (expert profile id and user id)
      const isMatch = String(expertIdFromEvent) === String(expertId) || 
                      (userId && String(expertIdFromEvent) === String(userId));

      if (isMatch) {
        console.log(`[Presence] Expert Detail Page: Expert ${expertId} status changed to ${data.is_available ? 'Online' : 'Offline'}`);
        setIsAvailable(data.is_available);
      }
    };

    socket.on("expert_status_changed", handleStatusSync);

    return () => {
      socket.off("expert_status_changed", handleStatusSync);
    };
  }, [expertId, userId]);

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
    isReviewModalOpen, setIsReviewModalOpen,
    selectedVideo, setSelectedVideo,
    selectedImage, setSelectedImage,
    activeTab, setActiveTab,
    reviews, loadingReviews, totalReviews,
    handleChatClick, handleCallClick, handleVideoCallClick,
    isAvailable, setIsAvailable,
    isNavigating
  };
};


