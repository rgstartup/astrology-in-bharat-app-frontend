"use client";

import PrepSkeleton from "../prep-skeleton";
import NotFoundStep from "./not-found-step.component";
import RechargeStep from "./recharge-step.component";
import InsufficientFundsStep from "./insufficient-funds-step.component";
import DetailsStep from "./details-step.component";
import type { PrepExpert, ChatPrepController } from "./types";
import type { SomeoneElseData } from "@/actions/chat";

type Props = {
  loading: boolean;
  expert: PrepExpert | null;
  step: "details" | "recharge";
  minBalanceRequired: number;
  isExpertAvailable: boolean;
  askSomeoneElse: ChatPrepController["askSomeoneElse"];
  setAskSomeoneElse: ChatPrepController["setAskSomeoneElse"];
  someoneElseData: SomeoneElseData;
  setSomeoneElseData: ChatPrepController["setSomeoneElseData"];
  handleStartConsultation: ChatPrepController["handleStartConsultation"];
  actionLoading: boolean;
  balance: number | null;
  showLowBalance: boolean;
  rechargeDefaultAmount: number;
  isAuthenticated: boolean;
  onClose: () => void;
  onBackToDetails: () => void;
  onRecharge: () => void;
  onRechargeSuccess: () => Promise<void> | void;
};

const ModalBody = ({
  loading,
  expert,
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
  rechargeDefaultAmount,
  isAuthenticated,
  onClose,
  onBackToDetails,
  onRecharge,
  onRechargeSuccess,
}: Props) => {
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
      isExpertAvailable={isExpertAvailable}
      askSomeoneElse={askSomeoneElse}
      setAskSomeoneElse={setAskSomeoneElse}
      someoneElseData={someoneElseData}
      setSomeoneElseData={setSomeoneElseData}
      handleStartConsultation={handleStartConsultation}
      actionLoading={actionLoading}
      balance={balance}
      showLowBalance={showLowBalance}
      minBalanceRequired={minBalanceRequired}
      isAuthenticated={isAuthenticated}
      onClose={onClose}
      onRecharge={onRecharge}
    />
  );
};

export default ModalBody;
