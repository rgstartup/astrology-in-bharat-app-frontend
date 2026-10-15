"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import { useChatPrepStore } from "@/store/chatPrepStore";
import { useChatPrep } from "../../hooks/use-chat-prep";
import ModalBody from "./modal-body.component";
import ModalPopups from "./modal-popups.component";

type Props = {
  expertId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ChatPrepModal = ({ expertId, open, onOpenChange }: Props) => {
  const tm = useTranslations("Chat.modal");
  const [step, setStep] = useState<"details" | "recharge">("details");
  const {
    router,
    expert,
    loading,
    actionLoading,
    isWaitingForExpert,
    cancelWaiting,
    waitOutcome,
    clearWaiting,
    askSomeoneElse,
    setAskSomeoneElse,
    someoneElseData,
    setSomeoneElseData,
    showOfflinePopup,
    setShowOfflinePopup,
    existingChatDetails,
    setExistingChatDetails,
    needsRecharge,
    setNeedsRecharge,
    isAuthenticated,
    isExpertAvailable,
    handleStartConsultation,
  } = useChatPrep(expertId);
  const balance = useAuthStore((s) => s.balance);
  const refreshBalance = useAuthStore((s) => s.refreshBalance);

  // Backend holds 5 minutes upfront: min top-up = 5 × per-minute price.
  const minBalanceRequired = (expert?.pricing?.chat_price || 0) * 5;
  const shortfall = Math.max(minBalanceRequired - (balance ?? 0), 0);
  const rechargeDefaultAmount = needsRecharge
    ? Math.max(Math.ceil(shortfall), 50)
    : minBalanceRequired || 500;

  useEffect(() => {
    if (needsRecharge) setStep("recharge");
  }, [needsRecharge]);

  const close = () => onOpenChange(false);

  const handleRechargeSuccess = async () => {
    await refreshBalance();
    if (needsRecharge) {
      setNeedsRecharge(false);
      handleStartConsultation();
      return;
    }
    setStep("details");
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-white rounded-3xl border border-slate-200 shadow-2xl p-0 gap-0"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{expert?.name || "Chat"}</DialogTitle>
            <DialogDescription>{tm("rechargeDesc", { price: 0 })}</DialogDescription>
          </DialogHeader>

          <ModalBody
            loading={loading}
            expert={expert}
            step={step}
            minBalanceRequired={minBalanceRequired}
            isExpertAvailable={isExpertAvailable}
            askSomeoneElse={askSomeoneElse}
            setAskSomeoneElse={setAskSomeoneElse}
            someoneElseData={someoneElseData}
            setSomeoneElseData={setSomeoneElseData}
            handleStartConsultation={handleStartConsultation}
            actionLoading={actionLoading}
            balance={isAuthenticated ? balance : null}
            showLowBalance={needsRecharge}
            rechargeDefaultAmount={rechargeDefaultAmount}
            isAuthenticated={isAuthenticated}
            onClose={close}
            onBackToDetails={() => setStep("details")}
            onRecharge={() => setStep("recharge")}
            onRechargeSuccess={handleRechargeSuccess}
          />
        </DialogContent>
      </Dialog>

      <ModalPopups
        expertName={expert?.name || "the expert"}
        expertAvatar={expert?.avatar || expert?.avatar_url || undefined}
        isWaitingForExpert={isWaitingForExpert}
        waitOutcome={waitOutcome}
        onCancelWaiting={cancelWaiting}
        onClearWaiting={clearWaiting}
        showOfflinePopup={showOfflinePopup}
        onCloseOfflinePopup={() => setShowOfflinePopup(false)}
        existingChatDetails={existingChatDetails}
        onCloseExistingChat={() => setExistingChatDetails(null)}
        onGoToExistingChat={(consultationId, expertId) => {
          useChatPrepStore.getState().closeChatPrep();
          router.push(`/consultation/${consultationId}?expertId=${expertId}`);
        }}
      />
    </>
  );
};

export default ChatPrepModal;
