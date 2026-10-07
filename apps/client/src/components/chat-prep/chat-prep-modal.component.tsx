"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { VerificationPopup } from "@repo/ui";
import { UserX, MessageCircle, ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@repo/store";
import { api } from "@/actions";
import { WalletRechargeForm } from "@/features/dashboard";
import ExpertPreview from "./expert-preview.component";
import PrepSkeleton from "./components/prep-skeleton";
import SecurityTipsModal from "./security-modal.component";
import { useChatPrep } from "./use-chat-prep";

type Props = {
  expertId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const ChatPrepModal = ({ expertId, open, onOpenChange }: Props) => {
  const tm = useTranslations("Chat.modal");
  const [step, setStep] = useState<"details" | "recharge">("details");
  const {
    t,
    router,
    expert,
    loading,
    actionLoading,
    askSomeoneElse,
    setAskSomeoneElse,
    someoneElseData,
    setSomeoneElseData,
    showSecurityModal,
    setShowSecurityModal,
    showOfflinePopup,
    setShowOfflinePopup,
    existingChatDetails,
    setExistingChatDetails,
    needsRecharge,
    setNeedsRecharge,
    isAuthenticated,
    isExpertAvailable,
    handleStartConsultation,
    proceedToChat,
  } = useChatPrep(expertId);
  const balance = useAuthStore((s) => s.balance);
  const refreshBalance = useAuthStore((s) => s.refreshBalance);

  // Backend holds 5 minutes upfront: min top-up = 5 × per-minute price.
  const minBalanceRequired = (expert?.chat_price || expert?.price || 0) * 5;

  useEffect(() => {
    if (needsRecharge) setStep("recharge");
  }, [needsRecharge]);

  const close = () => onOpenChange(false);

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white rounded-3xl border border-slate-200 shadow-2xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>{expert?.name || "Chat"}</DialogTitle>
            <DialogDescription>{tm("rechargeDesc", { price: 0 })}</DialogDescription>
          </DialogHeader>

          {loading ? (
            <PrepSkeleton />
          ) : !expert ? (
            <div className="flex flex-col items-center justify-center text-center px-6 py-12">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <UserX className="w-10 h-10 text-red-500" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                {t("notFoundTitle")}
              </h2>
              <p className="text-gray-500 max-w-sm mb-6 text-sm">
                {t("notFoundDesc")}
              </p>
              <button
                onClick={close}
                className="px-8 py-3 bg-[#FF5500] text-white rounded-full font-bold shadow-lg hover:bg-[#E64D00] transition-all cursor-pointer"
              >
                {t("goHome")}
              </button>
            </div>
          ) : step === "recharge" ? (
            <div className="p-5">
              <div className="flex items-center gap-2.5 pb-2.5 border-b border-slate-100 mb-2">
                <button
                  onClick={() => setStep("details")}
                  aria-label={tm("back")}
                  className="w-8 h-8 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0 border border-slate-200 hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 font-outfit">
                    {tm("rechargeTitle")}
                  </h2>
                  <p className="text-[11px] text-slate-500">
                    {tm("rechargeDesc", {
                      price: minBalanceRequired || 0,
                    })}
                  </p>
                </div>
              </div>

              <WalletRechargeForm
                defaultAmount={minBalanceRequired || 500}
                onSuccess={async () => {
                  await refreshBalance(api);
                  setNeedsRecharge(false);
                  setStep("details");
                }}
              />

              <div className="flex gap-3 pt-3">
                <button
                  onClick={() => setStep("details")}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {tm("back")}
                </button>
                <button
                  onClick={close}
                  className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 font-bold text-xs hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  {tm("cancel")}
                </button>
              </div>
            </div>
          ) : (
            <ExpertPreview
              expert={
                expert
                  ? { ...expert, is_available: isExpertAvailable }
                  : null
              }
                askSomeoneElse={askSomeoneElse}
                setAskSomeoneElse={setAskSomeoneElse}
                someoneElseData={someoneElseData}
                setSomeoneElseData={setSomeoneElseData}
                handleStartConsultation={handleStartConsultation}
                actionLoading={actionLoading}
                balance={isAuthenticated ? balance : null}
                showLowBalance={needsRecharge}
                minBalanceRequired={minBalanceRequired}
                isAuthenticated={isAuthenticated}
                onRecharge={() => setStep("recharge")}
              />
          )}
        </DialogContent>
      </Dialog>

      <SecurityTipsModal
        showSecurityModal={showSecurityModal}
        setShowSecurityModal={setShowSecurityModal}
        proceedToChat={proceedToChat}
      />

      <VerificationPopup
        isOpen={showOfflinePopup}
        onClose={() => setShowOfflinePopup(false)}
        title={t("expertOfflineTitle")}
        buttonText={t("understandBtn")}
        icon={<UserX className="w-10 h-10 text-orange-500" />}
        description={
          <>{t("expertOfflineDesc", { name: expert?.name || "Expert" })}</>
        }
      />

      <VerificationPopup
        isOpen={!!existingChatDetails}
        onClose={() => setExistingChatDetails(null)}
        title={t("activeChatTitle")}
        buttonText={t("goToChatBtn")}
        onConfirm={() => {
          if (existingChatDetails) {
            router.push(`/chat/room/${existingChatDetails.expertId}`);
          }
        }}
        icon={<MessageCircle className="w-10 h-10 text-[#FF5500]" />}
        description={<>{t("activeChatDesc")}</>}
      />
    </>
  );
};

export default ChatPrepModal;
