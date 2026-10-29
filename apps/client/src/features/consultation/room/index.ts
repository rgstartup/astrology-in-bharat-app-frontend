// Feature: consultation/room
// Sub-domain barrel — explicit named exports, tree-shake friendly

/// Components
export { default as ChatRoomContent } from "./components/content";
export { default as RoomBody } from "./components/room-body";
export { default as MainArea } from "./components/main-area";
export { default as RoomErrorState } from "./components/room-error-state";
export { default as RoomLoadingState } from "./components/room-loading-state";
export { default as RoomPendingBanner } from "./components/room-pending-banner";
export { default as RoomSecureStrip } from "./components/room-secure-strip";
export { RoomSeedProvider, useRoomSeedContext } from "./components/room-seed-provider";
export type { RoomSeed } from "./components/room-seed-provider";
export { default as VoiceReturnBanner } from "./components/voice-return-banner";
export { default as SessionStateLabel } from "./components/session-state-label";

/// Hooks
export { useDirectVoice } from "./hooks/use-direct-voice";
export { useRoomBudget } from "./hooks/use-room-budget";
export { useRoomComposer } from "./hooks/use-room-composer";
export type { PendingAttachment } from "./hooks/use-room-composer";
export { useRoomRevision } from "./hooks/use-room-revision";
export { useRoomSeed } from "./hooks/use-room-seed";
export { useRoomSessionSummary } from "./hooks/use-room-session-summary";
export { useRoomTimer } from "./hooks/use-room-timer";
export type { RoomSessionStatus } from "./hooks/use-room-verdict";
export { useRoomVerdict } from "./hooks/use-room-verdict";

/// Utils
export { liveMessageKey, toChatMessage } from "./utils/message-keys";
export { resolveRoomMode } from "./utils/session-mode";
