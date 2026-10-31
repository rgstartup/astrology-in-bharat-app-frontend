import type { ReactNode } from "react";
import type { IExpert } from "@repo/lib";
import type { ChatMessage } from "@/lib/types";
import type { VoicePhase } from "@/features/consultation/types/voice-phase";
import { VoiceStage } from "../voice/voice-stage";
import VoiceReturnBanner from "../voice/voice-return-banner";
import {
  MobileSidebarDrawer,
  type MobileSidebarDrawerProps,
} from "../sidebar/mobile-sidebar-drawer";

type VoiceControls = {
  phase: VoicePhase;
  muted: boolean;
  onToggleMute: () => void;
  speakerMuted: boolean;
  onToggleSpeaker: () => void;
  onEndVoice: () => void;
  onCancelRequest: () => void;
};

export type MainAreaProps = {
  expertData: IExpert;
  banner: {
    visible: boolean;
    elapsedText: string;
    onReturn: () => void;
  };
  /** Stage facts shared by switch to voice flow. */
  stage: {
    elapsedText: string;
    chatRate: number;
    voiceRate: number;
    messages: ChatMessage[];
    onBackToChat: () => void;
    onExpandChat: () => void;
  };
  /** Chat-to-switch to voice controls; null unless the upgrade stage is open. */
  upgrade: VoiceControls | null;
  drawer: MobileSidebarDrawerProps;
  /** Chat body, rendered for chat and docked voice sessions. */
  children: ReactNode;
};

/**
 * Stage content renderer with strict waterfall early returns (no ternaries).
 *
 * @param props - Subcomponent properties.
 * @returns Voice stage when upgrading, or room children.
 */
function MainStageContent({
  expertData,
  stage,
  upgrade,
  children,
}: {
  expertData: IExpert;
  stage: MainAreaProps["stage"];
  upgrade: VoiceControls | null;
  children: ReactNode;
}) {
  if (upgrade) {
    return (
      <VoiceStage
        phase={upgrade.phase}
        entry="upgrade"
        expertName={expertData.name}
        expertAvatar={expertData.avatar}
        elapsedText={stage.elapsedText}
        chatRate={stage.chatRate}
        voiceRate={stage.voiceRate}
        messages={stage.messages}
        onBackToChat={stage.onBackToChat}
        onExpandChat={stage.onExpandChat}
        muted={upgrade.muted}
        onToggleMute={upgrade.onToggleMute}
        speakerMuted={upgrade.speakerMuted}
        onToggleSpeaker={upgrade.onToggleSpeaker}
        onEndVoice={upgrade.onEndVoice}
        onCancelRequest={upgrade.onCancelRequest}
      />
    );
  }

  return <>{children}</>;
}

/**
 * Main-column area composing the return banner, mobile drawer, and main body.
 * Direct voice is docked directly inside the room body above the message area,
 * leaving messages and composer 100% interactive.
 *
 * @param props - MainAreaProps.
 * @returns Main column element.
 */
export default function MainArea({
  expertData,
  banner,
  stage,
  upgrade,
  drawer,
  children,
}: MainAreaProps) {
  return (
    <>
      <VoiceReturnBanner {...banner} />
      <MobileSidebarDrawer {...drawer} />
      <MainStageContent expertData={expertData} stage={stage} upgrade={upgrade}>
        {children}
      </MainStageContent>
    </>
  );
}
