import { Power, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatSessionStatus } from "../types";

interface ChatHeaderActionsProps {
  sessionStatus: ChatSessionStatus;
  isActivating: boolean;
  onActivate: () => Promise<void>;
  onEndChat: () => Promise<void>;
}

export function ChatHeaderActions({
  sessionStatus,
  isActivating,
  onActivate,
  onEndChat,
}: ChatHeaderActionsProps) {
  if (sessionStatus === "pending") {
    return (
      <Button
        onClick={onActivate}
        disabled={isActivating}
        isLoading={isActivating}
        size="sm"
        className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold shadow-xs"
      >
        <Power className="size-3.5" data-icon="inline-start" />
        <span>{isActivating ? "Starting..." : "Start Session"}</span>
      </Button>
    );
  }

  if (sessionStatus === "active") {
    return (
      <Button
        onClick={() => onEndChat()}
        variant="destructive"
        size="sm"
        className="font-semibold shadow-xs"
      >
        <AlertCircle className="size-3.5" data-icon="inline-start" />
        <span>End Session</span>
      </Button>
    );
  }

  return null;
}
