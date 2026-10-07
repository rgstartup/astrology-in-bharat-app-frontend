"use client";

import { useEffect, useRef } from "react";
import ChatPrepModal from "./chat-prep-modal.component";
import { useChatPrepStore } from "@/store/chatPrepStore";
import { useAuthStore } from "@repo/store";

export default function ChatPrepHost() {
  const expertId = useChatPrepStore((s) => s.expertId);
  const isOpen = useChatPrepStore((s) => s.isOpen);
  const setChatPrepOpen = useChatPrepStore((s) => s.setChatPrepOpen);
  const pendingExpertId = useChatPrepStore((s) => s.pendingExpertId);
  const { isAuthenticated } = useAuthStore();
  const wasAuthenticated = useRef(isAuthenticated);

  useEffect(() => {
    if (!wasAuthenticated.current && isAuthenticated && pendingExpertId) {
      useChatPrepStore.getState().openChatPrep(pendingExpertId);
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, pendingExpertId]);

  if (!expertId) return null;
  return (
    <ChatPrepModal
      expertId={expertId}
      open={isOpen}
      onOpenChange={setChatPrepOpen}
    />
  );
}
