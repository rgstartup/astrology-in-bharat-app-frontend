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
  status: string;
  consultationId: number;
}

export interface SendChatMessageAck {
  status: string;
  message: ChatMessagePayload;
}
