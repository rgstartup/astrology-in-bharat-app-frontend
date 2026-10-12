"use client";

import { VerificationPopup } from "@repo/ui";
import { UserX, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { ChatWaitingModal } from "../chat-waiting-modal.component";
import type { ChatPrepController } from "./types";

type Props = {
  expertName: string;
  isWaitingForExpert: boolean;
  waitOutcome: ChatPrepController["waitOutcome"];
  waitLeft: number;
  waitTotal: number;
  onCancelWaiting: () => void;
  onClearWaiting: () => void;
  showOfflinePopup: boolean;
  onCloseOfflinePopup: () => void;
  existingChatDetails: ChatPrepController["existingChatDetails"];
  onCloseExistingChat: () => void;
  onGoToExistingChat: (expertId: string) => void;
};

const ModalPopups = ({
  expertName,
  isWaitingForExpert,
  waitOutcome,
  waitLeft,
  waitTotal,
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
        open={isWaitingForExpert || waitOutcome === "rejected"}
        expertName={expertName}
        rejected={waitOutcome === "rejected"}
        secondsLeft={waitLeft}
        totalSeconds={waitTotal}
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
            onGoToExistingChat(existingChatDetails.expertId);
          }
        }}
        icon={<MessageCircle className="w-10 h-10 text-[#FF5500]" />}
        description={<>{t("activeChatDesc")}</>}
      />
    </>
  );
};

export default ModalPopups;
