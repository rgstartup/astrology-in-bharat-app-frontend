"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "@/i18n/navigation";
import { toast } from "@repo/design/shadcn";
import { PATHS } from "@repo/routes";
import { useTranslations } from "next-intl";
import type { ConsultationMode } from "@/store/consultationPrepStore";
import { withCallbackUrl } from "@/utils/getPathnameOrDefault";
import { resolveModePrice } from "@/lib/pricing";
import { usePrepExpert } from "./use-prep-expert";
import { useDevicePreflight } from "./use-device-preflight";
import { useBalanceGate } from "./use-balance-gate";
import { useSomeoneElseForm } from "./use-someone-else-form";
import { useConsultationRequest } from "./use-consultation-request";

/**
 * Composition root for the consultation prep modal: gates (auth, presence,
 * balance, devices) and the request lifecycle, assembled from focused hooks.
 *
 * @param expertId - Expert identifier.
 * @param mode - Consultation mode ('chat' | 'voice' | 'video'). Defaults to 'chat'.
 * @returns State and event handlers for the consultation prep modal.
 */
export function useConsultationPrep(
  expertId: string,
  mode: ConsultationMode = "chat",
  consultationId?: number | null,
  /** Prep-dialog close; called when the expert verdict lands. */
  close?: () => void,
  /** Whether the prep dialog is visible; data fetches only run while open. */
  isOpen: boolean = false,
) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations("Chat.page");

  const {
    expert,
    loading,
    isExpertAvailable,
    fetchExpert,
  } = usePrepExpert(expertId);
  const {
    isAuthenticated,
    needsRecharge,
    setNeedsRecharge,
    refreshBalanceNow,
  } = useBalanceGate();
  const { deviceHint, clearDeviceHint, runPreflight, resetDevices } =
    useDevicePreflight();
  const {
    askSomeoneElse,
    setAskSomeoneElse,
    someoneElseData,
    setSomeoneElseData,
  } = useSomeoneElseForm();
  const [showOfflinePopup, setShowOfflinePopup] = useState(false);

  // On modal open: latest expert data + wallet balance, fetched in parallel
  // so the rate and the recharge gate reflect both before the CTA is used.
  // Effect is the single fetch site — usePrepExpert no longer fetches on
  // mount, so a closed + still-mounted dialog (lingering expertId in the
  // prep store) fires nothing.
  useEffect(() => {
    if (!isOpen) return;
    void Promise.all([fetchExpert(), refreshBalanceNow()]);
  }, [isOpen, fetchExpert, refreshBalanceNow]);

  const currentPrice = resolveModePrice(expert, mode);

  const request = useConsultationRequest({
    expertId,
    mode,
    expert,
    onInsufficientBalance: () => setNeedsRecharge(true),
    consultationId,
    onVerdictResolved: close,
  });

  const proceedToConsultation = async () => {
    if (!isAuthenticated) {
      const id = toast.warning(t("toastLogin"), {
        action: {
          label: t("loginNow"),
          onClick: () => {
            toast.dismiss(id);
            router.push(withCallbackUrl(PATHS.LOGIN, pathname));
          },
        },
      });
      return;
    }
    // Refresh the wallet first: the recharge gate and initiate both act on
    // the current server-side balance, not the stale store snapshot.
    await refreshBalanceNow();
    if (expert && !isExpertAvailable) {
      return;
    }
    if (!(await runPreflight(mode))) {
      return;
    }
    setNeedsRecharge(false);
    await request.initiate(!askSomeoneElse ? someoneElseData : null);
  };

  const handleStartConsultation = () => {
    if (!isAuthenticated) {
      const id = toast.warning(t("toastLogin"), {
        action: {
          label: t("loginNow"),
          onClick: () => {
            toast.dismiss(id);
            router.push(withCallbackUrl(PATHS.LOGIN, pathname));
          },
        },
      });
      return;
    }
    void proceedToConsultation();
  };

  const retryDeviceProbe = () => {
    resetDevices();
    void proceedToConsultation();
  };

  return {
    t,
    router,
    expert,
    loading,
    actionLoading: request.actionLoading,
    isWaitingForExpert: request.isWaitingForExpert,
    cancelWaiting: request.cancelWaiting,
    waitOutcome: request.waitOutcome,
    clearWaiting: request.clearWaiting,
    waitStep: request.waitStep,
    micGranted: request.micGranted,
    micDenied: request.micDenied,
    onGrantMic: request.onGrantMic,
    onRetryMic: request.onRetryMic,
    askSomeoneElse,
    setAskSomeoneElse,
    someoneElseData,
    setSomeoneElseData,
    showOfflinePopup,
    setShowOfflinePopup,
    existingChatDetails: request.existingChatDetails,
    setExistingChatDetails: request.setExistingChatDetails,
    needsRecharge,
    setNeedsRecharge,
    deviceHint,
    clearDeviceHint,
    retryDeviceProbe,
    isAuthenticated,
    isExpertAvailable,
    currentPrice,
    handleStartConsultation,
    proceedToConsultation,
    proceedToChat: proceedToConsultation,
  };
}
