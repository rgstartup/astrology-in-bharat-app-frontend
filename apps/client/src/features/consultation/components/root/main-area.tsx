import type { ReactNode } from "react";
import { VoiceStage } from "../voice/voice-stage";
import VoiceReturnBanner from "../voice/voice-return-banner";
import { MobileSidebarDrawer } from "../sidebar/mobile-sidebar-drawer";
import { formatTime } from "../../utils/format-time";
import { useRoomSession } from "../../providers/room-lifecycle.provider";
import { useSwitchToVoiceContext } from "../../providers/switch-to-voice.provider";
import { useDirectVoiceContext } from "../../providers/direct-voice.provider";

type DrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export type MainAreaProps = {
  drawer: DrawerProps;
  /** Chat body, rendered for chat and docked voice sessions. */
  children: ReactNode;
};

function MainStageContent({
  showVoiceStage,
  children,
}: {
  showVoiceStage: boolean;
  children: ReactNode;
}) {
  if (showVoiceStage) {
    return <VoiceStage />;
  }
  return <>{children}</>;
}

export default function MainArea({ drawer, children }: MainAreaProps) {
  const { elapsedTime, isSessionEnded } = useRoomSession();
  const { voice } = useSwitchToVoiceContext();
  const { showVoiceStage } = useDirectVoiceContext();

  const banner = {
    visible: !isSessionEnded && voice.voiceActive && voice.minimized,
    elapsedText: formatTime(elapsedTime),
    onReturn: voice.returnToVoice,
  };

  return (
    <>
      <VoiceReturnBanner {...banner} />
      <MobileSidebarDrawer {...drawer} />
      <MainStageContent showVoiceStage={showVoiceStage}>
        {children}
      </MainStageContent>
    </>
  );
}
