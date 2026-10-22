/**
 * Stable dedup key for live socket payloads. Anonymous structural input so
 * both apps' payload shapes fit without importing app types.
 */
export interface LiveMessageKeyInput {
  content: string;
  senderId: string | number;
  timestamp?: string;
  createdAt?: string;
}

export function liveMessageKey(message: LiveMessageKeyInput): string {
  return `${message.timestamp ?? message.createdAt ?? ""}|${message.senderId}|${message.content}`;
}
