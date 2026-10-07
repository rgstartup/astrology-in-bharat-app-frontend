"use client";

import { useChatIncoming } from "@/realtime/hooks/use-chat-incoming";
import { ChatIncomingCard } from "./chat-incoming-card";

/** Floating stack of incoming chat requests. Mount once inside RealtimeProvider. */
export function ChatIncomingStack() {
  const { pending, accept, reject, dismiss } = useChatIncoming();

  if (pending.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="fixed right-4 bottom-4 z-50 flex flex-col gap-2"
    >
      {pending.map((req) => (
        <ChatIncomingCard
          key={req.consultationId}
          request={req}
          onAccept={accept}
          onReject={reject}
          onExpire={dismiss}
        />
      ))}
    </div>
  );
}
