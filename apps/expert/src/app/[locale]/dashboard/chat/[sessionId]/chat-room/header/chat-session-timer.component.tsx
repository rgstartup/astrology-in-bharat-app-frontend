import { Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ChatSessionTimerProps {
  elapsedTime: number;
  timeLeft: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

export function ChatSessionTimer({ elapsedTime, timeLeft }: ChatSessionTimerProps) {
  return (
    <>
      <div className="hidden sm:flex items-center gap-3">
        <div className="hidden md:flex flex-col items-end">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            Elapsed
          </span>
          <span className="text-xs font-mono font-bold text-slate-700">
            {formatTime(elapsedTime)}
          </span>
        </div>
        <div className="w-px h-6 bg-slate-200 hidden md:block" />
        <Badge variant="outline" className="gap-1.5 px-2.5 py-1 bg-slate-50 border-slate-200">
          <Clock className="size-3.5 text-orange-600" />
          <div className="flex items-center gap-1">
            <span className="text-[10px] font-semibold uppercase text-slate-500">Left:</span>
            <span className="text-xs font-mono font-bold text-slate-900">{formatTime(timeLeft)}</span>
          </div>
        </Badge>
      </div>

      <div className="flex sm:hidden items-center">
        <Badge variant="outline" className="gap-1 px-2 py-0.5 bg-slate-50 border-slate-200">
          <Clock className="size-3 text-orange-600" />
          <span className="text-xs font-mono font-bold text-slate-900">{formatTime(timeLeft)}</span>
        </Badge>
      </div>
    </>
  );
}
