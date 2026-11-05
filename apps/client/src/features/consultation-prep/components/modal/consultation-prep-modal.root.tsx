"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@repo/design/shadcn";
import { useTranslations } from "next-intl";
import { useAuthStore } from "@/store/authStore";
import {
  useConsultationPrepStore,
  type ConsultationMode,
} from "@/features/consultation-prep/stores/consultationPrepStore";
import { useConsultationPrep } from "../../hooks/use-consultation-prep";
import ModalBody from "./modal-body.component";
import ModalPopups from "./modal-popups.component";
import { ConsultationPrepControllerProvider } from "./consultation-prep-controller.provider";

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
 * Owns manual navigation step state and recharge orchestration; the
 * controller (state/actions) goes to consumers via context.
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
  const [detailsStep, setDetailsStep] = useState<"details" | "recharge">(
    "details",
  );

  const close = () => onOpenChange(false);

  const controller = useConsultationPrep(expertId, mode, consultationId, close, open);
  const {
    expert,
    needsRecharge,
    currentPrice,
    isAuthenticated,
    handleStartConsultation,
    setNeedsRecharge,
  } = controller;

  const balance = useAuthStore((s) => s.balance);
  const refreshBalance = useAuthStore((s) => s.refreshBalance);

  // Minimum balance from backend reservation_requirements; falls back to
  const reservationReq =
    expert?.reservation_requirements?.[mode as "chat" | "voice"];
  const minBalanceRequired =
    reservationReq?.min_balance_required ?? currentPrice * 5;
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
    <ConsultationPrepControllerProvider value={controller}>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent
          showCloseButton={false}
          className="sm:max-w-[440px] max-h-[90vh] overflow-y-auto overflow-x-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:hidden bg-white rounded-3xl border border-slate-200 shadow-2xl p-0 gap-0"
        >
          <DialogHeader className="sr-only">
            <DialogTitle>{expertDisplayName}</DialogTitle>
            <DialogDescription>
              {tm("rechargeDesc", { price: 0 })}
            </DialogDescription>
          </DialogHeader>

          <ModalBody
            mode={mode}
            step={step}
            minBalanceRequired={minBalanceRequired}
            rechargeDefaultAmount={rechargeDefaultAmount}
            balance={isAuthenticated ? balance : null}
            onClose={close}
            onBackToDetails={() => setDetailsStep("details")}
            onRecharge={() => setDetailsStep("recharge")}
            onRechargeSuccess={handleRechargeSuccess}
          />
        </DialogContent>
      </Dialog>

      <ModalPopups mode={mode} />
    </ConsultationPrepControllerProvider>
  );
}

export default ConsultationPrepModal;
