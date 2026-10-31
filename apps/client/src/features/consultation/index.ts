// Feature: consultation
//
// Organised per §13 Feature-Based Architecture with sub-domains:
//   room/          – room session components
//   voice/         – voice session components, hooks, types
//   sidebar/       – consultation sidebar components
//   header/        – page header components
//   session/       – session dock components, types
//   session-summary/ – post-session summary components
//   media-staging/ – media connection staging components, types
//   message-area/  – chat message area components, types
//   root/          – root-level components
//   stories/       – Storybook stories (not exported)

export { default as RoomContent } from "./components/root/content";
export { default as RoomBody } from "./components/room/room-body";
export { default as MainArea } from "./components/root/main-area";
export { default as RoomErrorState } from "./components/room/room-error-state";
export { default as RoomLoadingState } from "./components/room/room-loading-state";

// Providers – seed source and realtime lifecycle
export {
  RoomLifecycleProvider,
  useRoomLifecycle,
  RoomChatProvider,
  useRoomChat,
  RechargeDialogProvider,
  useRechargeDialog,
  SwitchToVoiceProvider,
  useSwitchToVoiceContext,
  DirectVoiceProvider,
  useDirectVoiceContext,
} from "./providers";
export type {
  RoomLifecycleContextValue,
  RoomLifecycleProviderProps,
  RoomChatContextValue,
  RoomChatProviderProps,
  RechargeDialogContextValue,
  RechargeDialogProviderProps,
  SwitchToVoiceContextValue,
  SwitchToVoiceProviderProps,
  DirectVoiceContextValue,
  DirectVoiceProviderProps,
} from "./providers";

// API
export {
  sendChatAttachment,
  getChatAttachmentError,
  toChatMessageFromAttachment,
  CHAT_ATTACHMENT_ALLOWED_MIME_TYPES,
  CHAT_ATTACHMENT_MAX_BYTES,
} from "./api/chat-attachments.api";

// Hooks
export { useDirectVoice } from "./hooks/use-direct-voice";
export { useRoomComposer } from "./hooks/use-room-composer";
export type { PendingAttachment } from "./hooks/use-room-composer";
export { useRoomRevision } from "../../realtime/hooks/use-room-revision";
export { useRoomSessionSummary } from "./hooks/use-room-session-summary";
export { useRoomTimer } from "./hooks/use-room-timer";
export type { RoomSessionStatus } from "./hooks/use-room-verdict";
export { useRoomVerdict } from "./hooks/use-room-verdict";

// Utils
export {
  liveMessageKey,
  toChatMessage,
  toRoomMessages,
} from "./utils/message-keys";
export { resolveRoomMode } from "./utils/session-mode";
export { formatTime } from "./utils/format-time";

// Voice domain – API functions and key components
export {
  checkVoiceEligibilityAction,
  initiateConsultationAction,
} from "./api/voice-api";
export { VoiceStage } from "./components/voice/voice-stage";
export { VoiceHero } from "./components/voice/voice-hero";
export { VoiceControls } from "./components/voice/voice-controls";
export { VoiceLobby } from "./components/voice/voice-lobby";
export { VoiceWaitingLobby } from "./components/voice/voice-waiting-lobby";
export type { VoicePhase } from "./types/voice-phase";
export { useVoiceSession } from "./hooks/use-voice-session";
export { useSwitchToVoice } from "./hooks/use-switch-to-voice";

// Session summary domain – API functions and key components
export { submitReview } from "./api/review-api";
export { default as SessionSummaryModal } from "./components/session-summary/session-summary-modal";
export { default as SessionThankYou } from "./components/session-summary/session-thank-you";
export { default as SummaryHeading } from "./components/session-summary/summary-heading";
export { default as TerminationNotice } from "./components/session-summary/termination-notice";

// Sidebar domain – explicit named exports (tree-shake friendly)
export { ConsultationSidebar } from "./components/sidebar/consultation-sidebar";
export { MobileSidebarDrawer } from "./components/sidebar/mobile-sidebar-drawer";
export type { MobileSidebarDrawerProps } from "./components/sidebar/mobile-sidebar-drawer";
export { SidebarHeader } from "./components/sidebar/sidebar-header";
export { ExpertProfileSection } from "./components/sidebar/expert-profile-section";
export { ConsultationModeSection } from "./components/sidebar/consultation-mode-section";
export { SessionTimersSection } from "./components/sidebar/session-timers-section";
export { UpgradeConsultationSection } from "./components/sidebar/upgrade-consultation-section";
export { VoiceSessionSection } from "./components/sidebar/voice-session-section";
export { EndConsultationAction } from "./components/sidebar/end-consultation-action";

// Header domain – explicit named exports (tree-shake friendly)
export type { HeaderProps } from "./components/header/header";
export { default as Header } from "./components/header/header";
export { BackAffordance } from "./components/header/back-affordance";
export { EndSessionButton } from "./components/header/end-session-button";
export { ExpertIdentity } from "./components/header/expert-identity";
export { SessionMetrics } from "./components/header/session-metrics";
export { SessionProgressBar } from "./components/header/session-progress-bar";
export { SessionStatusBadge } from "./components/header/session-status-badge";
export {
  SessionTimer,
  SessionTimerCompact,
} from "./components/header/session-timer";

// Session domain – explicit named exports (tree-shake friendly)
export { SessionDock } from "./components/session/session-dock";
export type { SessionDockProps } from "./components/session/session-dock";
export { VideoPanel } from "./components/video/video-panel";
export { VoiceCancelDialog } from "./components/voice/voice-cancel-dialog";
export type { VoiceCancelDialogProps } from "./components/voice/voice-cancel-dialog";
export type { SessionKind } from "./types/session-phase";
export type { SessionPhase } from "./types/session-phase";
export { getRoomModeLabel, getSessionPhaseLabel } from "./types/session-phase";

// Media-staging domain – explicit named exports (tree-shake friendly)
export { MediaConnectionStage } from "./components/media-staging/media-connection-stage";
export type { MediaConnectionStageProps } from "./components/media-staging/media-connection-stage";
export { MediaConnectionBadge } from "./components/media-staging/media-connection-badge";
export { MediaZeroChargeBanner } from "./components/media-staging/media-zero-charge-banner";
export { MediaControlsPreview } from "./components/media-staging/media-controls-preview";
export type {
  MediaConnectionStep,
  MediaKind,
} from "./types/media-connection-types";
export {
  getMediaStepSubtitle,
  getMediaStepTitle,
} from "./types/media-connection-types";

// Message-area domain – explicit named exports (tree-shake friendly)
export { default as MessageArea } from "./components/message-area/message-area";
export { default as MessageRow } from "./components/message-area/message-row";
export { default as MessageAvatar } from "./components/message-area/message-avatar";
export { default as MessageAttachment } from "./components/message-area/message-attachment";
export { default as StatusPill } from "./components/message-area/status-pill";
export { default as IntroCard } from "./components/message-area/intro-card";
export { default as TypingIndicator } from "./components/message-area/typing-indicator";
export { default as DateMarker } from "./components/message-area/date-marker";
export { default as SessionBadge } from "./components/message-area/session-marker";
export { default as SessionEventCard } from "./components/message-area/session-event-card";
export { default as MessageList } from "./components/message-area/message-list";
export { default as ScrollButton } from "./components/message-area/scroll-button";
export { toTimeline } from "./types/timeline";

export { ChatColumnHeader } from "./components/chat/chat-column-header";
export { default as ChatFooter } from "./components/chat/chat-footer";
export { ChatVerdictWatcher } from "./components/chat/chat-verdict-watcher";
export { default as WaitingCountdown } from "./components/session/waiting-countdown";
