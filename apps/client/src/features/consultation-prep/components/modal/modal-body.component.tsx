"use client";

import PrepSkeleton from "../prep-skeleton";
import NotFoundStep from "./not-found-step.component";
import RechargeStep from "./recharge-step.component";
import InsufficientFundsStep from "./insufficient-funds-step.component";
import DetailsStep from "./details-step.component";
import type { PrepExpert, ConsultationPrepController } from "./types";
import type { SomeoneElseData } from "@/actions/chat";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";

export interface ModalBodyProps {
  loading: boolean;
  expert: PrepExpert | null;
  mode?: ConsultationMode;
  step: "details" | "recharge";
  minBalanceRequired: number;
  isExpertAvailable: boolean;
  askSomeoneElse: ConsultationPrepController["askSomeoneElse"];
  setAskSomeoneElse: ConsultationPrepController["setAskSomeoneElse"];
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: ConsultationPrepController["setSomeoneElseData"];
  handleStartConsultation: ConsultationPrepController["handleStartConsultation"];
  actionLoading: boolean;
  balance: number | null;
  showLowBalance: boolean;
  deviceHint?: ConsultationPrepController["deviceHint"];
  onRetryDevices?: ConsultationPrepController["retryDeviceProbe"];
  rechargeDefaultAmount: number;
  isAuthenticated: boolean;
  onClose: () => void;
  onBackToDetails: () => void;
  onRecharge: () => void;
  onRechargeSuccess: () => Promise<void> | void;
}

/**
 * Body switcher component rendering appropriate step based on loading,
 * expert presence, step selection, and balance threshold.
 *
 * @param props - Component properties.
 * @returns Step body element.
 */
const ModalBody = ({
  loading,
  expert,
  mode = "chat",
  step,
  minBalanceRequired,
  isExpertAvailable,
  askSomeoneElse,
  setAskSomeoneElse,
  someoneElseData,
  setSomeoneElseData,
  handleStartConsultation,
  actionLoading,
  balance,
  showLowBalance,
  deviceHint,
  onRetryDevices,
  rechargeDefaultAmount,
  isAuthenticated,
  onClose,
  onBackToDetails,
  onRecharge,
  onRechargeSuccess,
}: ModalBodyProps) => {
  if (loading) return <PrepSkeleton />;

  if (!expert) return <NotFoundStep onClose={onClose} />;

  if (step === "recharge") {
    if (showLowBalance) {
      return (
        <InsufficientFundsStep
          currentBalance={balance ?? 0}
          requiredAmount={minBalanceRequired}
          defaultAmount={rechargeDefaultAmount}
          onClose={onClose}
          onSuccess={onRechargeSuccess}
        />
      );
    }
    return (
      <RechargeStep
        minBalanceRequired={minBalanceRequired}
        onBack={onBackToDetails}
        onClose={onClose}
        onSuccess={onRechargeSuccess}
      />
    );
  }

  return (
    <DetailsStep
      expert={expert}
      mode={mode}
      isExpertAvailable={isExpertAvailable}
      askSomeoneElse={askSomeoneElse}
      setAskSomeoneElse={setAskSomeoneElse}
      someoneElseData={someoneElseData}
      setSomeoneElseData={setSomeoneElseData}
      handleStartConsultation={handleStartConsultation}
      actionLoading={actionLoading}
      balance={balance}
      showLowBalance={showLowBalance}
      deviceHint={deviceHint}
      onRetryDevices={onRetryDevices}
      minBalanceRequired={minBalanceRequired}
      isAuthenticated={isAuthenticated}
      onClose={onClose}
      onRecharge={onRecharge}
    />
  );
};

export default ModalBody;
