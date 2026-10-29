// Feature: consultation
//
// Organised per §13 Feature-Based Architecture with sub-domains:
//   room/          – room session components, hooks, utils
//   voice/         – voice session components, hooks, types
//   sidebar/       – consultation sidebar components
//   header/        – page header components
//   session/       – session dock components, types
//   session-summary/ – post-session summary components
//   media-staging/ – media connection staging components, types
//   message-area/  – chat message area components, types
//   root/          – root-level components
//   stories/       – Storybook stories (not exported)

// Room domain – API functions and key components (tree-shake friendly)
export { sendChatAttachment, getChatAttachmentError, toChatMessageFromAttachment } from "./room";
export type { RoomSeed } from "./room";
export { ChatRoomContent, RoomBody, MainArea, RoomErrorState, RoomLoadingState } from "./room";
export { useDirectVoice, useRoomComposer, useRoomSeed, useRoomSessionSummary } from "./room";
export { liveMessageKey, resolveRoomMode } from "./room";

// Voice domain – API functions and key components (tree-shake friendly)
export { checkVoiceEligibilityAction, initiateConsultationAction } from "./voice";
export { VoiceStage, VoiceHero, VoiceControls, VoiceLobby, VoiceWaitingLobby } from "./voice";
export { useVoiceSession, useVoiceUpgrade } from "./voice";
export type { VoicePhase } from "./voice";

// Session summary domain – API functions and key components (tree-shake friendly)
export { submitReview } from "./session-summary";
export { SessionSummaryModal, SessionThankYou, SummaryHeading, TerminationNotice } from "./session-summary";

// Sidebar domain – explicit named exports (tree-shake friendly)
export { ConsultationSidebar } from "./sidebar/components/consultation-sidebar";
export { MobileSidebarDrawer } from "./sidebar/components/mobile-sidebar-drawer";
export type { MobileSidebarDrawerProps } from "./sidebar/components/mobile-sidebar-drawer";
export { SidebarHeader } from "./sidebar/components/sidebar-header";
export { ExpertProfileSection } from "./sidebar/components/expert-profile-section";
export { ConsultationModeSection } from "./sidebar/components/consultation-mode-section";
export { SessionTimersSection } from "./sidebar/components/session-timers-section";
export { UpgradeConsultationSection } from "./sidebar/components/upgrade-consultation-section";
export { VoiceSessionSection } from "./sidebar/components/voice-session-section";
export { EndConsultationAction } from "./sidebar/components/end-consultation-action";

// Header domain – explicit named exports (tree-shake friendly)
export type { HeaderProps } from "./header/components/header";
export { default as Header } from "./header/components/header";
export { BackAffordance } from "./header/components/back-affordance";
export { EndSessionButton } from "./header/components/end-session-button";
export { ExpertIdentity } from "./header/components/expert-identity";
export { SessionMetrics } from "./header/components/session-metrics";
export { SessionProgressBar } from "./header/components/session-progress-bar";
export { SessionStatusBadge } from "./header/components/session-status-badge";
export { SessionTimer, SessionTimerCompact } from "./header/components/session-timer";

// Session domain – explicit named exports (tree-shake friendly)
export { SessionDock } from "./session/components/session-dock";
export type { SessionDockProps } from "./session/components/session-dock";
export { VideoPanel } from "./session/components/video-panel";
export { VoiceCancelDialog } from "./session/components/voice-cancel-dialog";
export type { VoiceCancelDialogProps } from "./session/components/voice-cancel-dialog";
export type { SessionKind } from "./session/types/session-phase";
export type { SessionPhase } from "./session/types/session-phase";
export { getRoomModeLabel, getSessionPhaseLabel } from "./session/types/session-phase";

// Media-staging domain – explicit named exports (tree-shake friendly)
export { MediaConnectionStage } from "./media-staging/components/media-connection-stage";
export type { MediaConnectionStageProps } from "./media-staging/components/media-connection-stage";
export { MediaConnectionBadge } from "./media-staging/components/media-connection-badge";
export { MediaZeroChargeBanner } from "./media-staging/components/media-zero-charge-banner";
export { MediaControlsPreview } from "./media-staging/components/media-controls-preview";
export type { MediaConnectionStep, MediaKind } from "./media-staging/types/media-connection-types";
export { getMediaStepSubtitle, getMediaStepTitle } from "./media-staging/types/media-connection-types";

// Message-area domain – explicit named exports (tree-shake friendly)
export { default as MessageArea } from "./message-area/components/message-area";
export { default as MessageRow } from "./message-area/components/message-row";
export { default as MessageAvatar } from "./message-area/components/message-avatar";
export { default as MessageAttachment } from "./message-area/components/message-attachment";
export { default as StatusPill } from "./message-area/components/status-pill";
export { default as IntroCard } from "./message-area/components/intro-card";
export { default as TypingIndicator } from "./message-area/components/typing-indicator";
export { default as DateMarker } from "./message-area/components/date-marker";
export { default as SessionBadge } from "./message-area/components/session-marker";
export { default as SessionEventCard } from "./message-area/components/session-event-card";
export { default as MessageList } from "./message-area/components/message-list";
export { default as ScrollButton } from "./message-area/components/scroll-button";
export { toTimeline } from "./message-area";

// Root domain – explicit named exports (tree-shake friendly)
export { ChatColumnHeader } from "./root/components/chat-column-header";
export { default as ChatFooter } from "./root/components/chat-footer";
export { ChatVerdictWatcher } from "./root/components/chat-verdict-watcher";
export { default as WaitingCountdown } from "./root/components/waiting-countdown";