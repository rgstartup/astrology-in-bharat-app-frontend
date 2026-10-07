export interface ChatMessagePayload {
  consultationId: number;
  senderId: number | string;
  senderType: string;
  content: string;
  attachmentUrl?: string;
  attachmentType?: string;
  timestamp: string;
}

export interface ChatTypingPayload {
  consultationId: number;
  senderId: number | string;
  senderType: string;
  isTyping: boolean;
}

export interface JoinChatAck {
  status: ChatStatus;
  consultationId: number;
}

export interface SendChatMessageAck {
  status: ChatStatus;
  message: ChatMessagePayload;
}

/** Mirror of backend CHAT_ACK_STATUS (socket wire values). */
export const CHAT_STATUS = {
  JOINED: "joined",
  LEFT: "left",
  SENT: "sent",
  REQUESTED: "requested",
  ACCEPTED: "accepted",
  REJECTED: "rejected",
  IGNORED: "ignored",
} as const;

export type ChatStatus = (typeof CHAT_STATUS)[keyof typeof CHAT_STATUS];

export interface ChatIncomingPayload {
  consultationId: number;
  expertId: number;
  clientId: number | string;
  senderType: string;
  timestamp: string;
}

export interface ChatDecisionPayload {
  consultationId: number;
  expertId: number | string;
  timestamp: string;
}
