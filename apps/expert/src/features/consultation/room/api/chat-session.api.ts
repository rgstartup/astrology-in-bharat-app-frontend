"use client";

import api from "@/actions/api";
import type { ChatMessage, ChatSessionData } from "../types";

/** Fetch a legacy chat session (status, client info, timers). */
export async function getChatSession(sessionId: string) {
  return api.get<ChatSessionData>(`/chat/session/${sessionId}?_t=${Date.now()}`);
}

/** Fetch message history for a legacy chat session. */
export async function getChatHistory(sessionId: string) {
  return api.get<ChatMessage[]>(`/chat/history/${sessionId}`);
}

/** Activate a legacy chat session. */
export async function activateChatSession(sessionId: string) {
  return api.post(`/chat/activate/${sessionId}`);
}