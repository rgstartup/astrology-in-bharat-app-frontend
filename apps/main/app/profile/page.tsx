"use client";

import React from "react";
import ProfileSidebar from "@/components/features/profile/ProfileSidebar";
import ProfileForm from "@/components/features/profile/ProfileForm";
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
import { useProfileLogic } from "@/components/features/profile/useProfileLogic";

const ProfilePage: React.FC = () => {
  const {
    clientUser, clientLoading, clientBalance,
    profileData, loading,
    editingSections, setEditingSections,
    savingSections,
    successMessage, errorMessage,
    imagePreview, handleImageChange,
    handleInputChange, handleAddressChange, handleSaveSection, loadOrdersAndDisputes,

    // Wallet
    rechargeAmount, setRechargeAmount,
    isProcessing, rechargeOptions,
    walletTransactions, loadingTransactions,
    walletView, setWalletView,
    walletPurpose, setWalletPurpose,
    handleRecharge,

    // History
    consultationHistory, loadingHistory, expandedSessions, toggleSession,
    selectedSession, chatMessages, showChatModal, setShowChatModal,
    handleViewChat,

    // Orders
    orders, loadingOrders, expandedOrders, toggleOrder,
    orderDisputes, allDisputes, selectedDispute, setSelectedDispute, showDisputeChat, setShowDisputeChat,

    // Notifications
    notifications, loadingNotifications,
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
    activeTab, setActiveTab
  } = useProfileLogic();

  // Only show full-page loader if we are doing initial load and have no data yet
  if ((loading || clientLoading) && !profileData?.id) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading profile...</p>
        </div>
      </div>
    );
  }

  // Handle report success and optionally open chat
  const handleReportSuccess = (newDispute?: any) => {
    loadOrdersAndDisputes();
    if (newDispute) {
      setSelectedDispute(newDispute);
      setShowDisputeChat(true);
    }
  };

  return (
    <div className="min-vh-100" style={{ backgroundColor: "#f8f9fa" }}>
      {/* Breadcrumb & Title */}
      <div className="container py-4">
        <div className="row">
          <div className="col-12">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb mb-2">
                <li className="breadcrumb-item"><a href="/" className="text-muted text-decoration-none">Home</a></li>
                <li className="breadcrumb-item active" aria-current="page" style={{ color: "#fd6410" }}>Profile</li>
              </ol>
            </nav>
            <h1 className="h3 fw-bold mb-1">User Account</h1>
            <p className="text-muted">Manage your cosmic identity and preferences</p>
          </div>
        </div>
      </div>

      <div className="container pb-5">
        <div className="row g-4">
          {/* Sidebar Column */}
          <div className="col-lg-3">
            <ProfileSidebar
              profileData={profileData}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              imagePreview={imagePreview}
              handleImageChange={handleImageChange}
              savingSections={savingSections}
            />
          </div>

          {/* Main Content Column */}
          <div className="col-lg-9">
            {/* Feedback Messages */}
            {successMessage && (
              <div className="alert alert-success border-0 shadow-sm rounded-3 mb-4" role="alert">
                <i className="fa-solid fa-check-circle me-2"></i> {successMessage}
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-danger border-0 shadow-sm rounded-3 mb-4" role="alert">
                <i className="fa-solid fa-exclamation-circle me-2"></i> {errorMessage}
              </div>
            )}

            {/* Tab Content */}
            {activeTab === "profile" && (
              <ProfileForm
                profileData={profileData}
                clientUser={clientUser}
                editingSections={editingSections}
                setEditingSections={setEditingSections}
                savingSections={savingSections}
                handleInputChange={handleInputChange}
                handleAddressChange={handleAddressChange}
                handleSaveSection={handleSaveSection}
              />
            )}

            {activeTab === "wishlist" && (
              <div className="card border-0 shadow-sm rounded-4 mb-4">
                <div className="card-header bg-white border-0 pt-4 px-4 mb-3">
                  <h5 className="fw-bold mb-0">
                    <span className="me-2 p-2 rounded-circle" style={{ backgroundColor: "#ffebee", color: "#e53935" }}>
                      <i className="fa-solid fa-heart"></i>
                    </span>
                    My Wishlist
                  </h5>
                </div>
                <div className="card-body p-4 pt-0">
                  <WishlistGrid />
                </div>
              </div>
            )}

            {activeTab === "wallet" && (
              <WalletTab
                walletBalance={clientBalance || 0}
                walletView={walletView}
                setWalletView={setWalletView}
                rechargeAmount={rechargeAmount}
                setRechargeAmount={setRechargeAmount}
                handleRecharge={handleRecharge}
                isProcessing={isProcessing}
                rechargeOptions={rechargeOptions}
                transactions={walletTransactions}
                loadingTransactions={loadingTransactions}
                walletPurpose={walletPurpose}
                setWalletPurpose={setWalletPurpose}
              />
            )}

            {activeTab === "rewards" && (
              <RewardsTab
                loadingRewards={loadingRewards}
                rewards={rewards}
              />
            )}

            {activeTab === "history" && (
              <HistoryTab
                loadingHistory={loadingHistory}
                consultationHistory={consultationHistory}
                expandedSessions={expandedSessions}
                toggleSession={toggleSession}
                onViewDetails={handleViewChat}
                onReportIssue={(session) => {
                  setReportItemType('consultation');
                  setReportItemDetails(session);
                  setReportModalOpen(true);
                }}
              />
            )}


            {activeTab === "orders" && (
              <OrdersTab
                orders={orders}
                loadingOrders={loadingOrders}
                expandedOrders={expandedOrders}
                toggleOrder={toggleOrder}
                orderDisputes={orderDisputes}
                onViewChat={(dispute) => {
                  setSelectedDispute(dispute);
                  setShowDisputeChat(true);
                }}
                onReportIssue={(order) => {
                  setReportItemType('order');
                  setReportItemDetails(order);
                  setReportModalOpen(true);
                }}
                userPhone={clientUser?.phone}
                userName={clientUser?.name}
              />
            )}

            {activeTab === "reports" && (
              <ReportsTab />
            )}

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
                onMarkAsRead={handleMarkAsRead}
                onClearAll={handleClearAllNotifs}
              />
            )}

            {activeTab === "support" && (
              <SupportTab supportSettings={supportSettings} />
            )}

          </div>
        </div>

        {/* Chat History Modal */}
        <ConsultationChatModal
          isOpen={showChatModal}
          onClose={() => setShowChatModal(false)}
          selectedSession={selectedSession}
          chatMessages={chatMessages}
          userAvatar={profileData?.profile_picture}
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
    </div >
  );
};

export default ProfilePage;