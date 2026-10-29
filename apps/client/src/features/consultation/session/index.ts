// Feature: consultation/session
// Sub-domain barrel — explicit named exports, tree-shake friendly

/// Components
export { SessionDock } from "./components/session-dock";
export type { SessionDockProps } from "./components/session-dock";
export { VideoPanel } from "./components/video-panel";
export { VoiceCancelDialog } from "./components/voice-cancel-dialog";
export type { VoiceCancelDialogProps } from "./components/voice-cancel-dialog";


/// Types
export type { SessionKind, SessionPhase } from "./types/session-phase";
export { getRoomModeLabel, getSessionPhaseLabel } from "./types/session-phase";
