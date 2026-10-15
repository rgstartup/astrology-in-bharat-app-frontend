"use client";

import React, { Suspense } from "react";
import ProfileSidebar from "@/components/features/profile/ProfileSidebar";
import ProfileForm from "@/components/features/profile/ProfileForm.component";
import WishlistGrid from "@/components/features/profile/WishlistGrid";
import ReportIssueModal from "@/components/features/user/ReportIssueModal";
import OrdersTab from "@/components/features/profile/OrdersTab";
import WalletTab from "@/components/features/profile/WalletTab";
import RewardsTab from "@/components/features/profile/RewardsTab";
import HistoryTab from "@/components/features/profile/HistoryTab";
import NotificationsTab from "@/components/features/profile/NotificationsTab";
import ReportsTab from "@/components/features/profile/ReportsTab";
import SupportTab from "@/components/features/profile/SupportTab";
import ConsultationChatModal from "@/components/features/profile/ConsultationChatModal";
import UserDisputeChatModal from "@/components/features/user/UserDisputeChatModal";
import DisputesTab from "@/components/features/profile/DisputesTab";
import PujaBookingsTab from "@/components/features/profile/PujaBookingsTab";
import { useProfileLogic } from "@/components/features/profile/useProfileLogic";
import Skeleton from "@/components/ui/Skeleton";
import { Loading } from "@repo/ui";
import { useAuth } from "@/store/authStore";
import { useTranslations } from "next-intl";

function ProfileTabPanel({
  activeTab,
  profileLogic,
  user,
  loading,
  t,
}: {
  activeTab: string;
  profileLogic: any;
  user: any;
  loading: boolean;
  t: any;
}) {
  switch (activeTab) {
    case "profile":
      return (
        <ProfileForm
          profileData={profileLogic.profileData}
          user={user}
          editingSections={profileLogic.editingSections}
          setEditingSections={profileLogic.setEditingSections}
          savingSections={profileLogic.savingSections}
          handleInputChange={profileLogic.handleInputChange}
          handleAddressChange={profileLogic.handleAddressChange}
          handleSaveSection={profileLogic.handleSaveSection}
          refreshProfile={profileLogic.loadProfile}
          loading={loading}
        />
      );
    case "wishlist":
      return (
        <div className="bg-white border-0 shadow-sm rounded-2xl mb-6 overflow-hidden">
          <div className="bg-white px-6 pt-6 pb-2 mb-2 flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: "#ffebee", color: "#e53935" }}
            >
              <i className="fa-solid fa-heart"></i>
            </div>
            <h5 className="text-xl font-bold text-gray-900 m-0">
              {t("wishlist.title")}
            </h5>
          </div>
          <div className="px-6 pb-6 pt-0">
            <WishlistGrid />
          </div>
        </div>
      );
    case "wallet":
      return (
        <WalletTab
          walletBalance={profileLogic.balance || 0}
          walletView={profileLogic.walletView}
          setWalletView={profileLogic.setWalletView}
          rechargeAmount={profileLogic.rechargeAmount}
          setRechargeAmount={profileLogic.setRechargeAmount}
          handleRecharge={profileLogic.handleRecharge}
          isProcessing={profileLogic.isProcessing}
          rechargeOptions={profileLogic.rechargeOptions}
          transactions={profileLogic.walletTransactions}
          loadingTransactions={profileLogic.loadingTransactions}
          hasMore={profileLogic.transactionsHasMore}
          loadingMore={profileLogic.loadingMoreTransactions}
          onLoadMore={profileLogic.loadMoreTransactions}
          walletPurpose={profileLogic.walletPurpose}
          setWalletPurpose={profileLogic.setWalletPurpose}
        />
      );
    case "rewards":
      return (
        <RewardsTab
          loadingRewards={profileLogic.loadingRewards}
          rewards={profileLogic.rewards}
        />
      );
    case "history":
      return (
        <HistoryTab
          loadingHistory={profileLogic.loadingHistory}
          consultationHistory={profileLogic.consultationHistory}
          hasMore={profileLogic.hasMore}
          loadingMore={profileLogic.loadingMore}
          onLoadMore={profileLogic.loadMoreHistory}
          expandedSessions={profileLogic.expandedSessions}
          toggleSession={profileLogic.toggleSession}
          onViewDetails={profileLogic.handleViewChat}
          onReportIssue={(session) => {
            profileLogic.setReportItemType("consultation");
            profileLogic.setReportItemDetails(session);
            profileLogic.setReportModalOpen(true);
          }}
          consultationDisputes={profileLogic.consultationDisputes}
          onViewDispute={(dispute) => {
            profileLogic.setSelectedDispute(dispute);
            profileLogic.setShowDisputeChat(true);
          }}
        />
      );
    case "orders":
      return (
        <OrdersTab
          orders={profileLogic.orders}
          loadingOrders={profileLogic.loadingOrders}
          hasMore={profileLogic.ordersHasMore}
          loadingMore={profileLogic.loadingMoreOrders}
          onLoadMore={profileLogic.loadMoreOrders}
          expandedOrders={profileLogic.expandedOrders}
          toggleOrder={profileLogic.toggleOrder}
          orderDisputes={profileLogic.orderDisputes}
          onViewChat={(dispute) => {
            profileLogic.setSelectedDispute(dispute);
            profileLogic.setShowDisputeChat(true);
          }}
          onReportIssue={(order) => {
            profileLogic.setReportItemType("order");
            profileLogic.setReportItemDetails(order);
            profileLogic.setReportModalOpen(true);
          }}
          userPhone={user?.phone}
          userName={user?.name}
          reviewModalOpen={profileLogic.reviewModalOpen}
          onCloseReviewModal={() => profileLogic.setReviewModalOpen(false)}
          onOpenReviewModal={profileLogic.handleOpenReviewModal}
          onReviewSubmit={profileLogic.handleReviewSubmit}
        />
      );
    case "reports":
      return <ReportsTab />;
    case "disputes":
      return (
        <DisputesTab
          disputes={profileLogic.allDisputes}
          loading={profileLogic.loadingOrders}
          onViewChat={(dispute) => {
            profileLogic.setSelectedDispute(dispute);
            profileLogic.setShowDisputeChat(true);
          }}
        />
      );
    case "notifications":
      return (
        <NotificationsTab
          loadingNotifications={profileLogic.loadingNotifications}
          notifications={profileLogic.notifications}
          hasMore={profileLogic.notificationsHasMore}
          loadingMore={profileLogic.loadingMoreNotifications}
          onLoadMore={profileLogic.loadMoreNotifications}
          onMarkAsRead={(id) => profileLogic.handleMarkAsRead(String(id))}
          onClearAll={profileLogic.handleClearAllNotifs}
        />
      );
    case "pujas":
      return (
        <div className="bg-white border-0 shadow-sm rounded-2xl mb-6 overflow-hidden">
          <div className="bg-white px-6 pt-6 pb-2 mb-2 flex items-center">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
              style={{ backgroundColor: "#fff7ed", color: "#ea580c" }}
            >
              <i className="fa-solid fa-om"></i>
            </div>
            <h5 className="text-xl font-bold text-gray-900 m-0">
              {t("sidebar.tabs.pujas")}
            </h5>
          </div>
          <div className="px-4 sm:px-6 pb-6 pt-0">
            <PujaBookingsTab
              loading={profileLogic.loadingPuja}
              bookings={profileLogic.pujaBookings}
              onUpdateStatus={profileLogic.handleUpdatePujaStatus}
              onReportIssue={(booking) => {
                profileLogic.setReportItemType("puja");
                profileLogic.setReportItemDetails(booking);
                profileLogic.setReportModalOpen(true);
              }}
              pujaDisputes={profileLogic.pujaDisputes}
              onViewDispute={(dispute) => {
                profileLogic.setSelectedDispute(dispute);
                profileLogic.setShowDisputeChat(true);
              }}
            />
          </div>
        </div>
      );
    case "support":
      return <SupportTab supportSettings={profileLogic.supportSettings} />;
    default:
      return null;
  }
}

const ProfileContent: React.FC = () => {
  const t = useTranslations("Profile");
  const profileLogic = useProfileLogic();
  const { loading, user, isAuthenticated } = useAuth();

  const handleReportSuccess = (newDispute?: any) => {
    profileLogic.loadOrdersAndDisputes();
    if (newDispute) {
      profileLogic.setSelectedDispute(newDispute);
      profileLogic.setShowDisputeChat(true);
    }
  };

  if (loading || !isAuthenticated) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-center bg-fixed bg-no-repeat relative">
      <div className="relative z-10 font-outfit">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 md:pt-12 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <ProfileSidebar
                profileData={profileLogic.profileData}
                activeTab={profileLogic.activeTab}
                setActiveTab={profileLogic.setActiveTab}
                imagePreview={profileLogic.imagePreview}
                handleImageChange={profileLogic.handleImageChange}
                savingSections={profileLogic.savingSections}
                loading={loading}
              />
            </div>

            <div className="lg:col-span-3">
              {profileLogic.successMessage && (
                <div
                  className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm mb-6 flex items-center"
                  role="alert"
                >
                  <i className="fa-solid fa-check-circle mr-3"></i>
                  <span className="font-medium">{profileLogic.successMessage}</span>
                </div>
              )}
              {profileLogic.errorMessage && (
                <div
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-6 flex items-center"
                  role="alert"
                >
                  <i className="fa-solid fa-exclamation-circle mr-3"></i>
                  <span className="font-medium">{profileLogic.errorMessage}</span>
                </div>
              )}

              <ProfileTabPanel
                activeTab={profileLogic.activeTab}
                profileLogic={profileLogic}
                user={user}
                loading={loading}
                t={t}
              />
            </div>
          </div>

          <ConsultationChatModal
            isOpen={profileLogic.showChatModal}
            onClose={() => profileLogic.setShowChatModal(false)}
            selectedSession={profileLogic.selectedSession}
            chatMessages={profileLogic.chatMessages}
            userAvatar={profileLogic.profileData?.profile_picture || profileLogic.imagePreview}
          />

          <ReportIssueModal
            isOpen={profileLogic.reportModalOpen}
            onClose={() => {
              profileLogic.setReportModalOpen(false);
              profileLogic.setReportItemDetails(null);
            }}
            type={profileLogic.reportItemType}
            itemDetails={profileLogic.reportItemDetails}
            onSuccess={handleReportSuccess}
          />

          {profileLogic.showDisputeChat && profileLogic.selectedDispute && (
            <UserDisputeChatModal
              disputeId={profileLogic.selectedDispute.id}
              category={profileLogic.selectedDispute.reason || "Order Issue"}
              onClose={() => profileLogic.setShowDisputeChat(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default function ProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FFF9F4] pt-8 pb-4 md:pt-12 md:pb-6">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl p-6 shadow-premium">
                  <div className="flex items-center gap-4 mb-8">
                    <Skeleton variant="circular" width={64} height={64} />
                    <div className="space-y-2">
                      <Skeleton width={100} height={16} />
                      <Skeleton width={60} height={12} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Skeleton key={i} width="100%" height={40} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="lg:col-span-3 space-y-6">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl p-8 shadow-premium"
                  >
                    <Skeleton width={200} height={24} className="mb-6" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="space-y-2">
                          <Skeleton width={80} height={12} />
                          <Skeleton width="100%" height={24} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      }
    >
      <ProfileContent />
    </Suspense>
  );
}
