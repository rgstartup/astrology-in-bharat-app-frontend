"use client";

import { VerificationPopup } from "@repo/ui";
import { UserX, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChatWaitingModal } from "../chat-waiting-modal.component";
import type { ChatPrepController } from "./types";

type Props = {
  expertName: string;
  expertAvatar?: string;
  isWaitingForExpert: boolean;
  waitOutcome: ChatPrepController["waitOutcome"];
  onCancelWaiting: () => void;
  onClearWaiting: () => void;
  showOfflinePopup: boolean;
  onCloseOfflinePopup: () => void;
  existingChatDetails: ChatPrepController["existingChatDetails"];
  onCloseExistingChat: () => void;
  onGoToExistingChat: (consultationId: number, expertId: string) => void;
};

const ModalPopups = ({
  expertName,
  expertAvatar,
  isWaitingForExpert,
  waitOutcome,
  onCancelWaiting,
  onClearWaiting,
  showOfflinePopup,
  onCloseOfflinePopup,
  existingChatDetails,
  onCloseExistingChat,
  onGoToExistingChat,
}: Props) => {
  const t = useTranslations("Chat.page");

  return (
    <>
      <ChatWaitingModal
        open={isWaitingForExpert || waitOutcome === "rejected" || waitOutcome === "timeout"}
        expertName={expertName}
        expertAvatar={expertAvatar}
        rejected={waitOutcome === "rejected"}
        timedOut={waitOutcome === "timeout"}
        onCancel={onCancelWaiting}
        onClose={onClearWaiting}
      />

      <VerificationPopup
        isOpen={showOfflinePopup}
        onClose={onCloseOfflinePopup}
        title={t("expertOfflineTitle")}
        buttonText={t("understandBtn")}
        icon={<UserX className="w-10 h-10 text-orange-500" />}
        description={<>{t("expertOfflineDesc", { name: expertName })}</>}
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
