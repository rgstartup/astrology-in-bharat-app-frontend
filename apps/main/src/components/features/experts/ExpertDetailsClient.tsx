"use client";

import React from "react";
import ReviewModal from "@/components/ui/modals/ReviewModal";
import ProductSection from "@/components/features/shop/ProductSection";
import ExpertProfileCard from "./ExpertProfileCard";
import ExpertContentSection from "./ExpertContentSection";
import ExpertMediaModals from "./ExpertMediaModals";
import { useExpertDetails } from "./useExpertDetails";
import { Expert, Product } from "@/lib/types";
import { Loading } from "@repo/ui";

export default function ExpertDetailsClient({
  expert,
  products = [],
}: {
  expert: Expert;
  products?: Product[];
}) {
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
    isNavigating,
  } = useExpertDetails(String(expert.id!), String(expert.userId || ''));

  // Initialize with the data from the server-side fetch
  React.useEffect(() => {
    if (expert.is_available !== undefined) {
      setIsAvailable(expert.is_available);
    }
  }, [expert.is_available, setIsAvailable]);

  return (
    <>
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16 mt-10">
        <div className="flex flex-col lg:flex-row gap-8">
          <ExpertProfileCard
            expert={expert}
            isAvailable={isAvailable}
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

      <ReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onSubmit={() => setIsReviewModalOpen(false)}
      />

      <section className="py-12 bg-white">
        <div className="max-w-[1320px] mx-auto px-4 md:px-8 lg:px-16">
          <ProductSection products={products} />
        </div>
      </section>

      <ExpertMediaModals
        expertName={expert.name}
        selectedVideo={selectedVideo}
        setSelectedVideo={setSelectedVideo}
        selectedImage={selectedImage}
        setSelectedImage={setSelectedImage}
      />

      {isNavigating && <Loading fullScreen />}
    </>
  );
}
