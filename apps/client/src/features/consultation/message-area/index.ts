// Feature: consultation/message-area
// Sub-domain barrel — explicit named exports, tree-shake friendly

/// Components
export { default as MessageArea } from "./components/message-area";
export { default as MessageRow } from "./components/message-row";
export { default as MessageAvatar } from "./components/message-avatar";
export { default as MessageAttachment } from "./components/message-attachment";
export { default as StatusPill } from "./components/status-pill";
export { default as IntroCard } from "./components/intro-card";
export { default as TypingIndicator } from "./components/typing-indicator";
export { default as DateMarker } from "./components/date-marker";
export { default as SessionBadge } from "./components/session-marker";
export { default as SessionEventCard } from "./components/session-event-card";
export { default as MessageList } from "./components/message-list";
export { default as ScrollButton } from "./components/scroll-button";

/// Types
export {
  toTimeline,
  dateLabel,
  isCallMode,
  sessionLabel,
} from "./types/timeline";
export type {
  TimelineItem,
  TimelineDateItem,
  TimelineSessionItem,
  TimelineMessageItem,
  TimelineSessionEventItem,
  SessionMeta,
} from "./types/timeline";
