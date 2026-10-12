"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { realtimeSocket } from "@/realtime/socket";
import { joinChat } from "@/realtime/topics/chat";
import { useChatDecision } from "@/realtime/hooks/use-chat-decision";

/**
 * Safety net for a reject that lands after room entry.
 * (Re)joins `chat:{consultationId}` on mount and reconnect, then
 * routes the client out on reject.
 */
export function ChatVerdictWatcher({
  consultationId,
}: {
  consultationId: number | null;
}) {
  const router = useRouter();
  const { decision } = useChatDecision(consultationId);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (!consultationId) return;
    const socket = realtimeSocket();
    const join = () => {
      joinChat(consultationId).catch(() => undefined);
    };
    if (socket.connected) join();
    socket.on("connect", join);
    return () => {
      socket.off("connect", join);
    };
  }, [consultationId]);

  useEffect(() => {
    if (decision !== "rejected" || dismissed) return;
    const timer = setTimeout(() => {
      router.push("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [decision, dismissed, router]);

  if (!consultationId || decision !== "rejected" || dismissed) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xs rounded-2xl border border-stone-200 bg-white px-6 py-6 text-center shadow-lg">
        <p className="text-sm font-semibold text-stone-900">Expert declined</p>
        <p className="mt-1 text-xs text-stone-500">
          The expert can&apos;t take your request right now. No charges were applied.
        </p>
        <button
          type="button"
          onClick={() => {
            setDismissed(true);
            router.push("/");
          }}
          className="mt-4 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
        >
          Back to home
        </button>
      </div>
    </div>
  );
}
