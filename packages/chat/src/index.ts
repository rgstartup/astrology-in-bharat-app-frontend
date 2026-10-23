export type {
  AttachmentType,
  ChatMessage,
  ChatSenderType,
  PendingAttachment,
  SessionMeta,
  TimelineDateItem,
  TimelineItem,
  TimelineMessageItem,
  TimelineSessionEventItem,
  TimelineSessionItem,
  TypingStatus,
} from "./types";

export { liveMessageKey } from "./utils/message-keys";
export type { LiveMessageKeyInput } from "./utils/message-keys";

export {
  attachmentTypeFromMime,
  hasAttachment,
  isAttachmentFallbackText,
  resolveAttachmentType,
  resolveAttachmentUrl,
} from "./utils/attachments";

export {
  formatClock,
  formatSessionDuration,
  formatSessionTime,
  formatSessionTimeRange,
  sessionDurationSeconds,
} from "./utils/format";

export { dateLabel, isCallMode, sessionLabel, toTimeline } from "./utils/timeline";

export { useChatMessages } from "./hooks/use-chat-messages";
export { useChatTypingDisplay } from "./hooks/use-chat-typing";
export { useChatScrollBottom } from "./hooks/use-chat-scroll-bottom";
export { useChatUnreadCount } from "./hooks/use-unread-count";
export { useChatSound } from "./hooks/use-chat-sound";
export { useChatTimeline } from "./hooks/use-chat-timeline";
export { useChatAttachments } from "./hooks/use-chat-attachments";
export type {
  AttachmentUploadResult,
  AttachmentUploader,
  UseChatAttachmentsOptions,
} from "./hooks/use-chat-attachments";
export { useChatComposer } from "./hooks/use-chat-composer";
export type {
  ChatComposerTransports,
  UseChatComposerOptions,
} from "./hooks/use-chat-composer";
