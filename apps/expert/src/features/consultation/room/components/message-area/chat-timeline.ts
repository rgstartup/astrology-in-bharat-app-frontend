/**
 * Expert timeline: canonical implementation lives in `@repo/chat`
 * (grouped mode — no explicit session buckets). This module re-exports it
 * so existing import sites keep working.
 *
 * Note vs the previous local copy: undated messages label "Earlier"
 * (shared wording) and day dividers gain Yesterday/year support.
 */
export type {
  TimelineDateItem,
  TimelineItem,
  TimelineMessageItem,
  TimelineSessionItem,
} from "@repo/chat";
export { dateLabel, toTimeline } from "@repo/chat";
