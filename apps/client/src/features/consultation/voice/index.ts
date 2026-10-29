// Feature: consultation/voice
// Sub-domain barrel — explicit named exports, tree-shake friendly

/// Components
export { VoiceStage } from "./components/voice-stage";
export type { VoiceStageProps } from "./components/voice-stage";
export { VoiceHero } from "./components/voice-hero";
export { VoiceControls } from "./components/voice-controls";
export { VoiceLobby } from "./components/voice-lobby";
export { VoiceWaitingLobby } from "./components/voice-waiting-lobby";
export { VoiceTranscriptStrip } from "./components/voice-transcript-strip";
export { VoiceRateNote } from "./components/voice-rate-note";
/// API
export { checkVoiceEligibilityAction, initiateConsultationAction } from "./api/voice-api";

/// Hooks
export { useVoiceSession, toVoicePhase } from "./hooks/use-voice-session";
export type { VoiceRtcControls } from "./hooks/use-voice-session";
export { useVoiceUpgrade } from "./hooks/use-voice-upgrade";
export type { VoiceUpgradeControls, VoiceUpgradeOptions } from "./hooks/use-voice-upgrade";
export { useConsultationMedia } from "./hooks/use-consultation-media";

/// Types
export { getVoicePhaseHelper, getVoicePhaseLabel } from "./types/voice-phase";
export type { VoicePhase } from "./types/voice-phase";
