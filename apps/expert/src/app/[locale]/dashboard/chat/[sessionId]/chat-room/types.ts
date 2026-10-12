import type { ChatMessage, ChatSessionStatus, PendingAttachment } from "@/types/chat";

export interface ChatSessionData {
  status: ChatSessionStatus;
  startedAt?: string;
  expiresAt?: string;
  remainingSeconds?: number;
  elapsedSeconds?: number;
  client?: {
    profile_picture?: string;
    user?: {
      name?: string;
      avatar?: string;
    };
  };
  user?: {
    name?: string;
    profile_picture?: string;
    avatar?: string;
  };
}

export interface TypingStatus {
  senderName: string;
  isTyping: boolean;
}

export type { ChatMessage, ChatSessionStatus, PendingAttachment };
