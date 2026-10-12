import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  onActivate: () => Promise<void>;
  onEndChat: () => Promise<void>;
}

export function ChatRoomHeader({
  clientName,
  clientAvatar,
  sessionStatus,
  elapsedTime,
  timeLeft,
  isActivating,
  onActivate,
  onEndChat,
}: ChatRoomHeaderProps) {
  const router = useRouter();

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3.5 flex items-center justify-between shadow-xs gap-3">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="size-8 p-0 rounded-full text-slate-500 hover:text-slate-900 shrink-0"
        >
          <ChevronLeft className="size-5" />
          <span className="sr-only">Go back</span>
        </Button>

        <Avatar className="size-9 sm:size-10 border border-slate-200 shrink-0">
          <AvatarImage src={clientAvatar || undefined} alt={clientName} />
          <AvatarFallback className="bg-orange-100 text-orange-700 font-bold text-xs">
            {clientName.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0 flex flex-col justify-center">
          <h2 className="font-semibold text-slate-900 leading-tight truncate text-sm sm:text-base">
            {clientName}
          </h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {sessionStatus === "active" ? (
              <Badge variant="secondary" className="gap-1 px-1.5 py-0 text-[10px] bg-emerald-50 text-emerald-700 border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Session
              </Badge>
            ) : sessionStatus === "completed" ? (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-slate-100 text-slate-600 border-slate-200">
                Ended
              </Badge>
            ) : (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px] bg-amber-50 text-amber-700 border-amber-200">
                Pending
              </Badge>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4 shrink-0">
        {sessionStatus === "active" && (
          <ChatSessionTimer elapsedTime={elapsedTime} timeLeft={timeLeft} />
        )}

        <ChatHeaderActions
          sessionStatus={sessionStatus}
          isActivating={isActivating}
          onActivate={onActivate}
          onEndChat={onEndChat}
        />
      </div>
    </header>
  );
}
