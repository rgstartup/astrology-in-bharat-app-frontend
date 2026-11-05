"use client";

import PrepSkeleton from "../prep-skeleton";
import NotFoundStep from "./not-found-step.component";
import RechargeStep from "./recharge-step.component";
import InsufficientFundsStep from "./insufficient-funds-step.component";
import DetailsStep from "./details-step.component";
import { useConsultationPrepController } from "./consultation-prep-controller.provider";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";

export interface ModalBodyProps {
  mode?: ConsultationMode;
  /** Manual nav step owned by the root; forced recharge overrides it. */
  step: "details" | "recharge";
  minBalanceRequired: number;
  rechargeDefaultAmount: number;
  /** Auth-gated wallet balance; null when the user is signed out. */
  balance: number | null;
  onClose: () => void;
  onBackToDetails: () => void;
  onRecharge: () => void;
  onRechargeSuccess: () => Promise<void> | void;
}

/**
 * Body switcher component rendering appropriate step based on loading,
 * expert presence, step selection, and balance threshold.
 *
 * Controller state/actions (loading, expert, form state, device hint,
 * CTA actions) come from context; navigation and recharge values stay
 * as props since the root owns them.
 *
 * @param props - Component properties.
 * @returns Step body element.
 */
const ModalBody = ({
  mode = "chat",
  step,
  minBalanceRequired,
  rechargeDefaultAmount,
  balance,
  onClose,
  onBackToDetails,
  onRecharge,
  onRechargeSuccess,
}: ModalBodyProps) => {
  const {
    loading,
    expert,
    isExpertAvailable,
    isAuthenticated,
    askSomeoneElse,
    setAskSomeoneElse,
    someoneElseData,
    setSomeoneElseData,
    handleStartConsultation,
    actionLoading,
    deviceHint,
    retryDeviceProbe,
    needsRecharge,
  } = useConsultationPrepController();

  if (loading) return <PrepSkeleton />;

  if (!expert) return <NotFoundStep onClose={onClose} />;

  if (step === "recharge") {
    if (needsRecharge) {
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
      mode={mode}
      minBalanceRequired={minBalanceRequired}
      onClose={onClose}
      onRecharge={onRecharge}
    />
  );
};

export default ModalBody;
