/**
 * Client timeline: canonical implementation lives in `@repo/chat`.
 * This module re-exports it so existing import sites keep working.
 * `ChatHistorySessionDto` (numeric `sessionId`) is assignable to the
 * shared `SessionMeta` (`string | number`) without mapping.
 */
export type {
  SessionMeta,
  TimelineDateItem,
  TimelineItem,
  TimelineMessageItem,
  TimelineSessionEventItem,
  TimelineSessionItem,
} from "@repo/chat";
export {
  dateLabel,
  formatSessionDuration,
  formatSessionTime,
  formatSessionTimeRange,
  isCallMode,
  sessionDurationSeconds,
  sessionLabel,
  toTimeline,
} from "@repo/chat";
