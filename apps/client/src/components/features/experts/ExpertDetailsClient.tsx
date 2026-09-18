"use client";

import React from "react";
import ReviewModal from "@/components/ui/modals/ReviewModal";
import ExpertProfileCard from "./ExpertProfileCard";
import ExpertContentSection from "./ExpertContentSection";
import ExpertMediaModals from "./ExpertMediaModals";
import { useExpertDetails } from "./useExpertDetails";
import type { Expert } from "@repo/lib";
import { Loading } from "@repo/ui";
import { useConsultantBreadcrumbStore } from "@/store/useConsultantBreadcrumbStore";

export default function ExpertDetailsClient({ expert }: { expert: Expert }) {
  const setConsultantName = useConsultantBreadcrumbStore(
    (s) => s.setConsultantName,
  );

  const expertName = expert.name || "Astrologer";

  // Synchronize consultant name to the root breadcrumb
  React.useEffect(() => {
    if (expertName) {
      setConsultantName(expertName);
    }
    return () => {
      setConsultantName(null);
    };
  }, [expertName, setConsultantName]);

  const expertUserId =
    (expert as any).userId ||
    (expert as any).user_id ||
    (expert as any).user?.id ||
    "";

  const {
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
  } = useExpertDetails(
    String(expert.id!),
    String(expertUserId),
    Boolean(expert.is_available),
    Boolean(expert.is_busy),
  );

  // Initialize presence state from SSR
  React.useEffect(() => {
    if (expert.is_available !== undefined) {
      setIsAvailable(Boolean(expert.is_available));
    }
    if (expert.is_busy !== undefined) {
      setIsBusy(Boolean(expert.is_busy));
    }
  }, [expert.is_available, expert.is_busy, setIsAvailable, setIsBusy]);

  return (
    <>
      <div className="bg-slate-50/70 min-h-screen pb-12">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 pt-6">
          {/* Main Layout: Top Horizontal Profile Card + Bottom Rich Content Section */}
          <div className="flex flex-col gap-8">
            <ExpertProfileCard
              expert={expert}
              isAvailable={isAvailable}
              isBusy={isBusy}
              onChatClick={handleChatClick}
              onCallClick={handleCallClick}
              onVideoCallClick={handleVideoCallClick}
              onVideoClick={(url) => setSelectedVideo(url)}
            />

            <ExpertContentSection
              expert={expert}
              isAvailable={isAvailable}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              reviews={reviews}
              loadingReviews={loadingReviews}
              totalReviews={totalReviews}
              onImageClick={(url) => setSelectedImage(url)}
              onVideoClick={(url) => setSelectedVideo(url)}
            />
          </div>
        </div>
      </div>

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={() => setIsReviewModalOpen(false)}
      />

      <ExpertMediaModals
        expertName={expertName}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      {isNavigating && <Loading fullScreen />}
    </>
  );
}
