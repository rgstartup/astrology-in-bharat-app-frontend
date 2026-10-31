"use client";

import { VerificationPopup } from "@repo/ui";
import { MessageCircle } from "@repo/design/lucide";
import { useTranslations } from "next-intl";
import { ConsultationWaitingModal } from "../consultation-waiting-modal.component";
import type { ConsultationPrepController } from "./types";
import type { ConsultationMode } from "@/features/consultation-prep/stores/consultationPrepStore";

export interface ModalPopupsProps {
  expertName: string;
  expertAvatar?: string;
  mode?: ConsultationMode;
  step?: ConsultationPrepController["waitStep"];
  voiceRate?: number;
  micGranted?: boolean;
  onGrantMic?: () => void;
  micDenied?: boolean;
  onRetryMic?: () => void;
  isWaitingForExpert: boolean;
  waitOutcome: ConsultationPrepController["waitOutcome"];
  onCancelWaiting: () => void;
  onClearWaiting: () => void;
  /** @deprecated Offline alert is now displayed directly inline on the button and form. */
  showOfflinePopup?: boolean;
  /** @deprecated Offline alert is now displayed directly inline on the button and form. */
  onCloseOfflinePopup?: () => void;
  existingChatDetails: ConsultationPrepController["existingChatDetails"];
  onCloseExistingChat: () => void;
  onGoToExistingChat: (consultationId: number, expertId: string) => void;
}

/**
 * Secondary overlays for consultation preparation: waiting modal
 * and existing active consultation notification.
 *
 * @param props - Component properties.
 * @returns Dialog overlays fragment.
 */
const ModalPopups = ({
  expertName,
  expertAvatar,
  mode = "chat",
  step = "waiting_acceptance",
  voiceRate,
  micGranted,
  onGrantMic,
  micDenied,
  onRetryMic,
  isWaitingForExpert,
  waitOutcome,
  onCancelWaiting,
  onClearWaiting,
  existingChatDetails,
  onCloseExistingChat,
  onGoToExistingChat,
}: ModalPopupsProps) => {
  const t = useTranslations("Chat.page");

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
        step={step}
        voiceRate={voiceRate}
        expertName={expertName}
        expertAvatar={expertAvatar}
        micGranted={micGranted}
        onGrantMic={onGrantMic}
        micDenied={micDenied}
        onRetryMic={onRetryMic}
        rejected={waitOutcome === "rejected"}
        timedOut={waitOutcome === "timeout"}
        onCancel={onCancelWaiting}
        onClose={onClearWaiting}
      />

      <VerificationPopup
        isOpen={!!existingChatDetails}
        onClose={onCloseExistingChat}
        title={t("activeChatTitle")}
        buttonText={t("goToChatBtn")}
        onConfirm={() => {
          if (existingChatDetails) {
            onGoToExistingChat(
              existingChatDetails.consultationId,
              existingChatDetails.expertId,
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
