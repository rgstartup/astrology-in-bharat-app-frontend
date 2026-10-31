// Feature: consultation
//
// Organised per Feature-Based Architecture with sub-domains:
//   room/    – room session components, hooks, utils
//   voice/   – voice session components, hooks, types
//   session/ – session dock, intake drawer, call-waiting modal, types

export { ChatRoomContent } from "./room";
export type { ChatMessage, ChatSessionStatus, PendingAttachment, ChatSessionData, TypingStatus } from "./room";
export { sendChatAttachment, getChatAttachmentError, toChatMessageFromAttachment, CHAT_ATTACHMENT_ALLOWED_MIME_TYPES, getChatSession, getChatHistory, activateChatSession } from "./room";

export { ExpertVoiceHero } from "./voice";
export { ExpertVoiceControls } from "./voice";
export { ExpertVoiceStage, type ExpertVoiceStageProps } from "./voice";
export { ExpertVideoPanel, type ExpertVideoPanelProps } from "./voice";
export { ExpertVoiceWaitingLobby, type ExpertVoiceWaitingLobbyProps } from "./voice";

export { ExpertSessionDock, type ExpertSessionDockProps } from "./session";
export { ExpertClientIntakeDrawer } from "./session";
export { ExpertCallWaitingModal } from "./session";
export type {
  ExpertSessionKind,
  ExpertSessionPhase,
  ClientIntakeProfile,
  ExpertConsultationMetrics,
  ConsultationSummaryReport,
} from "./session";
export { getExpertPhaseLabel, getExpertPhaseHelper, formatDuration } from "./session";