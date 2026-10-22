import { Power, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ChatSessionStatus } from "../types";

interface ChatHeaderActionsProps {
  sessionStatus: ChatSessionStatus;
  isActivating: boolean;
  /** New-flow rooms start via accept + join — the legacy Start button stays hidden. */
  isNewFlow?: boolean;
  onActivate: () => Promise<void>;
  onEndChat: () => Promise<void>;
}

function StartSessionAction({
  isActivating,
  onActivate,
}: Pick<ChatHeaderActionsProps, "isActivating" | "onActivate">) {
  return (
    <Button
      onClick={onActivate}
      disabled={isActivating}
      isLoading={isActivating}
      size="sm"
      className="rounded-full bg-[#111111] px-5 py-2.5 font-sans text-sm font-medium text-white hover:bg-black"
    >
      <Power className="size-3.5" data-icon="inline-start" />
      <span>{isActivating ? "Starting..." : "Start session"}</span>
    </Button>
  );
}

function EndSessionAction({
  onEndChat,
}: Pick<ChatHeaderActionsProps, "onEndChat">) {
  return (
    <Button
      onClick={() => onEndChat()}
      variant="outline"
      size="sm"
      className="group rounded-full border border-[#d3cec6] bg-white px-2.5 font-sans text-xs font-medium text-[#111111] hover:border-red-300 hover:bg-red-50 hover:text-red-600 md:text-sm"
    >
      <AlertCircle className="size-3.5 text-neutral-500 group-hover:text-red-600" data-icon="inline-start" />
      <span>End session</span>
    </Button>
  );
}

function NewFlowActions({
  sessionStatus,
  onEndChat,
}: Pick<ChatHeaderActionsProps, "sessionStatus" | "onEndChat">) {
  if (sessionStatus !== "active") return null;
  return <EndSessionAction onEndChat={onEndChat} />;
}

/**
 * Start/end session actions. Waterfall: one return per session state.
 * Start is a charcoal pill; end is a quiet outline that warms to red on hover.
 * New-flow rooms never show Start — billing starts on accept + join.
 */
export function ChatHeaderActions({
  sessionStatus,
  isActivating,
  isNewFlow,
  onActivate,
  onEndChat,
}: ChatHeaderActionsProps) {
  if (isNewFlow) {
    return <NewFlowActions sessionStatus={sessionStatus} onEndChat={onEndChat} />;
  }

  if (sessionStatus === "pending") {
    return <StartSessionAction isActivating={isActivating} onActivate={onActivate} />;
  }

  if (sessionStatus === "active") {
    return <EndSessionAction onEndChat={onEndChat} />;
  }

  return null;
}
