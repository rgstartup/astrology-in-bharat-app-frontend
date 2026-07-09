"use client";

import React from "react";
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
import { useLanguageStore } from "@repo/store";
import { profileTranslations } from "@/lib/translations/profile";
import Skeleton from "@/components/ui/Skeleton";
import { Loading } from "@repo/ui";

const ProfileContent: React.FC = () => {
  const { lang } = useLanguageStore();
  const t = profileTranslations[lang as keyof typeof profileTranslations] || profileTranslations.en;
  const fontStyle = lang === "hi" ? { fontFamily: "'Noto Sans Devanagari', sans-serif" } : {};

  const {
    user, authLoading, profileLoading, balance, isAuthenticated,
    profileData,
    editingSections, setEditingSections,
    savingSections,
    successMessage, errorMessage,
    imagePreview, handleImageChange,
    handleInputChange, handleAddressChange, handleSaveSection, loadOrdersAndDisputes, loadProfile,

    // Wallet
    rechargeAmount, setRechargeAmount,
    isProcessing, rechargeOptions,
    walletTransactions, loadingTransactions, transactionsHasMore, loadingMoreTransactions, loadMoreTransactions,
    walletView, setWalletView,
    walletPurpose, setWalletPurpose,
    handleRecharge,

    // History
    consultationHistory, loadingHistory, hasMore, loadingMore, loadMoreHistory, expandedSessions, toggleSession,
    selectedSession, chatMessages, showChatModal, setShowChatModal,
    handleViewChat,

    // Orders
    orders, loadingOrders, ordersHasMore, loadingMoreOrders, loadMoreOrders, expandedOrders, toggleOrder,
    orderDisputes, consultationDisputes, pujaDisputes, allDisputes, selectedDispute, setSelectedDispute, showDisputeChat, setShowDisputeChat,

    // Notifications
    notifications, loadingNotifications, notificationsHasMore, loadingMoreNotifications, loadMoreNotifications,
    handleMarkAsRead, handleClearAllNotifs,

    // Rewards
    rewards, loadingRewards,

    // Support
    supportSettings,

    // Modals
    reportModalOpen, setReportModalOpen,
    reportItemType, setReportItemType,
    reportItemDetails, setReportItemDetails,

    // Tab
    activeTab, setActiveTab,

    // Puja
    pujaBookings, loadingPuja, handleUpdatePujaStatus,

    // Reviews
    reviewModalOpen, setReviewModalOpen, handleOpenReviewModal, handleReviewSubmit
  } = useProfileLogic();

  // Determine overall loading state for components
  const isInitialLoading = (authLoading || profileLoading) && !profileData?.id;

  // Handle report success and optionally open chat
  const handleReportSuccess = (newDispute?: any) => {
    loadOrdersAndDisputes();
    if (newDispute) {
      setSelectedDispute(newDispute);
      setShowDisputeChat(true);
    }
  };

  if (authLoading || !isAuthenticated) {
    return <Loading fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#FFF9F4] bg-[url('/images/white-background.png')] bg-cover bg-center bg-fixed bg-no-repeat relative">
      <div className="relative z-10 font-outfit">
        <div className="max-w-7xl mx-auto px-4 pt-8 pb-4 md:pt-12 md:pb-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Column */}
            <div className="lg:col-span-1">
              <ProfileSidebar
                profileData={profileData}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                imagePreview={imagePreview}
                handleImageChange={handleImageChange}
                savingSections={savingSections}
                loading={isInitialLoading}
              />
            </div>

            {/* Main Content Column */}
            <div className="lg:col-span-3">
              {/* Feedback Messages */}
              {successMessage && (
                <div
                  className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 rounded-lg shadow-sm mb-6 flex items-center"
                  role="alert"
                >
                  <i className="fa-solid fa-check-circle mr-3"></i>
                  <span className="font-medium">{successMessage}</span>
                </div>
              )}
              {errorMessage && (
                <div
                  className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-sm mb-6 flex items-center"
                  role="alert"
                >
                  <i className="fa-solid fa-exclamation-circle mr-3"></i>
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Tab Content */}
              {activeTab === "profile" && (
                <ProfileForm
                  profileData={profileData}
                  user={user}
                  editingSections={editingSections}
                  setEditingSections={setEditingSections}
                  savingSections={savingSections}
                  handleInputChange={handleInputChange}
                  handleAddressChange={handleAddressChange}
                  handleSaveSection={handleSaveSection}
                  refreshProfile={loadProfile}
                  loading={isInitialLoading}
                />
              )}

              {activeTab === "wishlist" && (
                <div className="bg-white border-0 shadow-sm rounded-2xl mb-6 overflow-hidden">
                  <div className="bg-white px-6 pt-6 pb-2 mb-2 flex items-center">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                      style={{ backgroundColor: "#ffebee", color: "#e53935" }}
                    >
                      <i className="fa-solid fa-heart"></i>
                    </div>
                    <h5 className="text-xl font-bold text-gray-900 m-0" style={fontStyle}>
                      {t.wishlist.title}
                    </h5>
                  </div>
                  <div className="px-6 pb-6 pt-0">
                    <WishlistGrid />
                  </div>
                </div>
              )}

              {activeTab === "wallet" && (
                <WalletTab
                  walletBalance={balance || 0}
                  walletView={walletView}
                  setWalletView={setWalletView}
                  rechargeAmount={rechargeAmount}
                  setRechargeAmount={setRechargeAmount}
                  handleRecharge={handleRecharge}
                  isProcessing={isProcessing}
                  rechargeOptions={rechargeOptions}
                  transactions={walletTransactions}
                  loadingTransactions={loadingTransactions}
                  hasMore={transactionsHasMore}
                  loadingMore={loadingMoreTransactions}
                  onLoadMore={loadMoreTransactions}
                  walletPurpose={walletPurpose}
                  setWalletPurpose={setWalletPurpose}
                />
              )}

              {activeTab === "rewards" && (
                <RewardsTab loadingRewards={loadingRewards} rewards={rewards} />
              )}

              {activeTab === "history" && (
                <HistoryTab
                  loadingHistory={loadingHistory}
                  consultationHistory={consultationHistory}
                  hasMore={hasMore}
                  loadingMore={loadingMore}
                  onLoadMore={loadMoreHistory}
                  expandedSessions={expandedSessions}
                  toggleSession={toggleSession}
                  onViewDetails={handleViewChat}
                  onReportIssue={(session) => {
                    setReportItemType("consultation");
                    setReportItemDetails(session);
                    setReportModalOpen(true);
                  }}
                  consultationDisputes={consultationDisputes}
                  onViewDispute={(dispute) => {
                    setSelectedDispute(dispute);
                    setShowDisputeChat(true);
                  }}
                />
              )}

              {activeTab === "orders" && (
                <OrdersTab
                  orders={orders}
                  loadingOrders={loadingOrders}
                  hasMore={ordersHasMore}
                  loadingMore={loadingMoreOrders}
                  onLoadMore={loadMoreOrders}
                  expandedOrders={expandedOrders}
                  toggleOrder={toggleOrder}
                  orderDisputes={orderDisputes}
                  onViewChat={(dispute) => {
                    setSelectedDispute(dispute);
                    setShowDisputeChat(true);
                  }}
                  onReportIssue={(order) => {
                    setReportItemType("order");
                    setReportItemDetails(order);
                    setReportModalOpen(true);
                  }}
                  userPhone={user?.phone}
                  userName={user?.name}
                  reviewModalOpen={reviewModalOpen}
                  onCloseReviewModal={() => setReviewModalOpen(false)}
                  onOpenReviewModal={handleOpenReviewModal}
                  onReviewSubmit={handleReviewSubmit}
                />
              )}

              {activeTab === "reports" && <ReportsTab />}

              {activeTab === "disputes" && (
                <DisputesTab
                  disputes={allDisputes}
                  loading={loadingOrders}
                  onViewChat={(dispute) => {
                    setSelectedDispute(dispute);
                    setShowDisputeChat(true);
                  }}
                />
              )}

              {activeTab === "notifications" && (
                <NotificationsTab
                  loadingNotifications={loadingNotifications}
                  notifications={notifications}
                  hasMore={notificationsHasMore}
                  loadingMore={loadingMoreNotifications}
                  onLoadMore={loadMoreNotifications}
                  onMarkAsRead={(id) => handleMarkAsRead(String(id))}
                  onClearAll={handleClearAllNotifs}
                />
              )}

              {activeTab === "pujas" && (
                 <div className="bg-white border-0 shadow-sm rounded-2xl mb-6 overflow-hidden">
                    <div className="bg-white px-6 pt-6 pb-2 mb-2 flex items-center">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
                        style={{ backgroundColor: "#fff7ed", color: "#ea580c" }}
                      >
                        <i className="fa-solid fa-om"></i>
                      </div>
                      <h5 className="text-xl font-bold text-gray-900 m-0" style={fontStyle}>
                        {t.sidebar.tabs.pujas}
                      </h5>
                    </div>
                    <div className="px-4 sm:px-6 pb-6 pt-0">
                      <PujaBookingsTab 
                        loading={loadingPuja} 
                        bookings={pujaBookings} 
                        onUpdateStatus={handleUpdatePujaStatus} 
                        onReportIssue={(booking) => {
                          setReportItemType("puja");
                          setReportItemDetails(booking);
                          setReportModalOpen(true);
                        }}
                        pujaDisputes={pujaDisputes}
                        onViewDispute={(dispute) => {
                          setSelectedDispute(dispute);
                          setShowDisputeChat(true);
                        }}
                      />
                    </div>
                  </div>
              )}

              {activeTab === "support" && <SupportTab supportSettings={supportSettings} />}
            </div>
          </div>

          {/* Chat History Modal */}
          <ConsultationChatModal
            isOpen={showChatModal}
            onClose={() => setShowChatModal(false)}
            selectedSession={selectedSession}
            chatMessages={chatMessages}
            userAvatar={profileData?.profile_picture || imagePreview}
          />

          {/* Report Issue Modal */}
          <ReportIssueModal
            isOpen={reportModalOpen}
            onClose={() => {
              setReportModalOpen(false);
              setReportItemDetails(null);
            }}
            type={reportItemType}
            itemDetails={reportItemDetails}
            onSuccess={handleReportSuccess}
          />

          {/* Dispute Chat Modal */}
          {showDisputeChat && selectedDispute && (
            <UserDisputeChatModal
              disputeId={selectedDispute.id}
              category={selectedDispute.reason || "Order Issue"}
              onClose={() => setShowDisputeChat(false)}
            />
          )}
        </div>
      </div>
    </div>
  );
};

import { Suspense } from "react";

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
                  <div key={i} className="bg-white rounded-2xl p-8 shadow-premium">
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

