import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ChatSessionTimer } from "./chat-session-timer.component";
import { ChatHeaderActions } from "./chat-header-actions.component";
import type { ChatSessionStatus } from "../types";

interface ChatRoomHeaderProps {
  clientName: string;
  clientAvatar: string | null;
  sessionStatus: ChatSessionStatus;
  elapsedTime: number;
  timeLeft: number;
  isActivating: boolean;
  /** New-flow rooms hide the legacy Start action. */
  isNewFlow?: boolean;
  onActivate: () => Promise<void>;
  onEndChat: () => Promise<void>;
}

const STATUS_PILL_CLASSES =
  "rounded-full border border-[#d3cec6] bg-white px-3 py-1 font-sans text-[11px] font-medium text-[#626260]";

/**
 * Live status pill for the expert header. Waterfall: one return per state.
 */
function SessionStatusPill({ sessionStatus }: { sessionStatus: ChatSessionStatus }) {
  if (sessionStatus === "active") {
    return (
      <Badge variant="outline" className={STATUS_PILL_CLASSES}>
        <span className="mr-1.5 inline-block size-1.5 rounded-full bg-emerald-500" aria-hidden />
        Live session
      </Badge>
    );
  }
  if (sessionStatus === "completed") {
    return (
      <Badge variant="outline" className={STATUS_PILL_CLASSES}>
        Session ended
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className={STATUS_PILL_CLASSES}>
      Pending start
    </Badge>
  );
}

/**
 * Session timer slot. Waterfall: timer only renders for a live session.
 */
function SessionTimerSlot({
  sessionStatus,
  elapsedTime,
  timeLeft,
}: Pick<ChatRoomHeaderProps, "sessionStatus" | "elapsedTime" | "timeLeft">) {
  if (sessionStatus !== "active") return null;
  return <ChatSessionTimer elapsedTime={elapsedTime} timeLeft={timeLeft} />;
}

/**
 * Expert chat room header: client identity, live status pill, session timer,
 * and start/end actions on a white hairline bar.
 */
export function ChatRoomHeader({
  clientName,
  clientAvatar,
  sessionStatus,
  elapsedTime,
  timeLeft,
  isActivating,
  isNewFlow,
  onActivate,
  onEndChat,
}: ChatRoomHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-3 border-b border-[#d3cec6] bg-white px-4 py-3.5 sm:px-6">
      <div className="flex min-w-0 items-center gap-2 sm:gap-3">
        <Avatar className="size-9 shrink-0 rounded-full border border-[#d3cec6] sm:size-10">
          <AvatarImage src={clientAvatar || undefined} alt={clientName} />
          <AvatarFallback className="bg-[#ebe7e1] text-xs font-semibold text-[#111111]">
            {clientName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex min-w-0 flex-col justify-center">
          <h2 className="truncate font-sans text-sm font-semibold leading-tight text-[#111111] sm:text-base">
            {clientName}
          </h2>
          <div className="mt-0.5 flex items-center gap-1.5">
            <SessionStatusPill sessionStatus={sessionStatus} />
          </div>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-4">
        <SessionTimerSlot sessionStatus={sessionStatus} elapsedTime={elapsedTime} timeLeft={timeLeft} />

        <ChatHeaderActions
          sessionStatus={sessionStatus}
          isActivating={isActivating}
          isNewFlow={isNewFlow}
          onActivate={onActivate}
          onEndChat={onEndChat}
        />
      </div>
    </header>
  );
}
