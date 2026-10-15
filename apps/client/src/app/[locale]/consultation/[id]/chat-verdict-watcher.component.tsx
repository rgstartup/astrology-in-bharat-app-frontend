"use client";

import { useEffect, useState } from "react";
import { useRouter } from "@/i18n/navigation";
import { realtimeSocket } from "@/realtime/socket";
import { joinChat } from "@/realtime/topics/chat";
import { useChatDecision } from "@/realtime/hooks/use-chat-decision";

function VerdictCard({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="w-full max-w-xs rounded-xl border border-[#d3cec6] bg-[#ffffff] px-6 py-6 text-center shadow-sm">
      <p className="font-sans text-sm font-semibold text-[#111111]">Expert declined</p>
      <p className="mt-1 font-sans text-xs text-[#626260]">
        The expert can&apos;t take your request right now. No charges were applied.
      </p>
      <button
        type="button"
        onClick={onDismiss}
        className="mt-4 cursor-pointer font-sans text-xs font-medium text-[#626260] transition-colors hover:text-[#111111]"
      >
        Back to home
      </button>
    </div>
  );
}

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

  const handleDismiss = () => {
    setDismissed(true);
    router.push("/");
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#111111]/40 p-4">
      <VerdictCard onDismiss={handleDismiss} />
    </div>
  );
}
