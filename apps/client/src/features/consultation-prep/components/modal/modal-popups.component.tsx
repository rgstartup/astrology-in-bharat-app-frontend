"use client";

import { VerificationPopup } from "@repo/ui";
import { MessageCircle } from "@repo/design/lucide";
import { useTranslations } from "next-intl";
import { ConsultationWaitingModal } from "../consultation-waiting-modal.component";
import { useConsultationPrepController } from "./consultation-prep-controller.provider";
import {
  useConsultationPrepStore,
  type ConsultationMode,
} from "@/features/consultation-prep/stores/consultationPrepStore";

export interface ModalPopupsProps {
  mode?: ConsultationMode;
}

/**
 * Secondary overlays for consultation preparation: waiting modal
 * and existing active consultation notification. All state/actions
 * come from the prep controller context.
 *
 * @param props - Component properties.
 * @returns Dialog overlays fragment.
 */
const ModalPopups = ({ mode = "chat" }: ModalPopupsProps) => {
  const t = useTranslations("Chat.page");
  const {
    expert,
    waitStep,
    currentPrice,
    micGranted,
    onGrantMic,
    micDenied,
    onRetryMic,
    isWaitingForExpert,
    waitOutcome,
    cancelWaiting,
    clearWaiting,
    existingChatDetails,
    setExistingChatDetails,
    router,
  } = useConsultationPrepController();

  const expertName = expert?.name || "Consultation";
  const expertAvatar = expert?.avatar ?? undefined;

  return (
    <>
      <ConsultationWaitingModal
        open={
          isWaitingForExpert ||
          waitOutcome === "rejected" ||
          waitOutcome === "timeout" ||
          Boolean(micDenied)
        }
        mode={mode}
        step={waitStep}
        voiceRate={currentPrice}
        expertName={expertName}
        expertAvatar={expertAvatar}
        micGranted={micGranted}
        onGrantMic={onGrantMic}
        micDenied={micDenied}
        onRetryMic={onRetryMic}
        rejected={waitOutcome === "rejected"}
        timedOut={waitOutcome === "timeout"}
        onCancel={cancelWaiting}
        onClose={clearWaiting}
      />

      <VerificationPopup
        isOpen={!!existingChatDetails}
        onClose={() => setExistingChatDetails(null)}
        title={t("activeChatTitle")}
        buttonText={t("goToChatBtn")}
        onConfirm={() => {
          if (existingChatDetails) {
            useConsultationPrepStore.getState().closeConsultationPrep();
            router.push(
              `/consultation/${existingChatDetails.consultationId}?expertId=${existingChatDetails.expertId}`,
            );
          }
        }}
        icon={<MessageCircle className="w-10 h-10 text-[#FF5500]" />}
        description={<>{t("activeChatDesc")}</>}
      />
    </>
  );
};

export default ModalPopups;
