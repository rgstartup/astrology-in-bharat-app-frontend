"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import {
  useConsultationPrepStore,
  type ConsultationMode,
} from "@/store/consultationPrepStore";
import { useConsultationPrep } from "../../hooks/use-consultation-prep";
import ModalBody from "./modal-body.component";
import ModalPopups from "./modal-popups.component";

export interface ConsultationPrepModalProps {
  expertId: string;
  mode?: ConsultationMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Existing consultation to re-initiate into (e.g. continue chat). */
  consultationId: number | null;
}

/**
 * Root orchestrator dialog component for preparing a consultation across
 * chat, voice, and video modes.
 *
 * @param props - Component properties.
 * @returns Dialog tree element.
 */
export function ConsultationPrepModal({
  expertId,
  mode = "chat",
  open,
  onOpenChange,
  consultationId,
}: ConsultationPrepModalProps) {
  const tm = useTranslations("Chat.modal");
  // Manual nav between details/recharge; needsRecharge (below) overrides it.
  const [detailsStep, setDetailsStep] = useState<"details" | "recharge">("details");

  const close = () => onOpenChange(false);

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
    deviceHint,
    retryDeviceProbe,
    isAuthenticated,
    isExpertAvailable,
    currentPrice,
    handleStartConsultation,
    waitStep,
    countdown,
    micGranted,
    micDenied,
    mediaFailed,
    mediaError,
    onGrantMic,
    onRetryMic,
    onRetryMedia,
  } = useConsultationPrep(expertId, mode, consultationId, close, open);



  const balance = useAuthStore((s) => s.balance);
  const refreshBalance = useAuthStore((s) => s.refreshBalance);

  // Upfront minimum balance calculation: 5 minutes × mode rate
  const minBalanceRequired = currentPrice * 5;
  const shortfall = Math.max(minBalanceRequired - (balance ?? 0), 0);
  const rechargeDefaultAmount = needsRecharge
    ? Math.max(Math.ceil(shortfall), 50)
    : minBalanceRequired || 500;

  // Forced recharge wins over manual nav — derived, not synced via effect.
  const step = needsRecharge ? "recharge" : detailsStep;

  const handleRechargeSuccess = async () => {
    await refreshBalance();
    if (needsRecharge) {
      setNeedsRecharge(false);
      handleStartConsultation();
      return;
    }
    setDetailsStep("details");
  };

  const expertDisplayName = expert?.name || "Consultation";

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-white rounded-3xl border border-slate-200 shadow-2xl p-0 gap-0"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{expertDisplayName}</DialogTitle>
            <DialogDescription>{tm("rechargeDesc", { price: 0 })}</DialogDescription>
          </DialogHeader>

          <ModalBody
            loading={loading}
            expert={expert}
            mode={mode}
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
            deviceHint={deviceHint}
            onRetryDevices={retryDeviceProbe}
            rechargeDefaultAmount={rechargeDefaultAmount}
            isAuthenticated={isAuthenticated}
            onClose={close}
            onBackToDetails={() => setDetailsStep("details")}
            onRecharge={() => setDetailsStep("recharge")}
            onRechargeSuccess={handleRechargeSuccess}
          />
        </DialogContent>
      </Dialog>

      <ModalPopups
        expertName={expertDisplayName}
        expertAvatar={expert?.avatar || (expert as any)?.avatar_url || undefined}
        mode={mode}
        step={waitStep}
        countdown={countdown}
        voiceRate={currentPrice}
        micGranted={micGranted}
        onGrantMic={onGrantMic}
        micDenied={micDenied}
        onRetryMic={onRetryMic}
        mediaFailed={mediaFailed}
        mediaError={mediaError}
        onRetryMedia={onRetryMedia}
        isWaitingForExpert={isWaitingForExpert}
        waitOutcome={waitOutcome}
        onCancelWaiting={cancelWaiting}
        onClearWaiting={clearWaiting}
        showOfflinePopup={showOfflinePopup}
        onCloseOfflinePopup={() => setShowOfflinePopup(false)}
        existingChatDetails={existingChatDetails}
        onCloseExistingChat={() => setExistingChatDetails(null)}
        onGoToExistingChat={(consultationId, targetExpertId) => {
          useConsultationPrepStore.getState().closeConsultationPrep();
          router.push(`/consultation/${consultationId}?expertId=${targetExpertId}`);
        }}
      />
    </>
  );
}

export default ConsultationPrepModal;
