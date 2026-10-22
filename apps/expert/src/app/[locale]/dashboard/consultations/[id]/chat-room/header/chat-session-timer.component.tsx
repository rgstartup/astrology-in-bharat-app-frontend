interface ChatSessionTimerProps {
  elapsedTime: number;
  timeLeft: number;
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
};

function ElapsedBlock({ elapsedTime }: { elapsedTime: number }) {
  return (
    <div className="hidden flex-col items-end md:flex">
      <span className="font-sans text-[13px] font-medium text-[#7b7b78]">
        Elapsed
      </span>
      <span className="font-mono text-xs font-semibold text-[#111111]">
        {formatTime(elapsedTime)}
      </span>
    </div>
  );
}

function RemainingBlock({ timeLeft }: { timeLeft: number }) {
  return (
    <div className="flex flex-col items-end">
      <span className="font-sans text-[13px] font-medium text-[#7b7b78]">
        Left
      </span>
      <span className="font-mono text-xs font-semibold text-[#111111]">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}

function CompactRemaining({ timeLeft }: { timeLeft: number }) {
  return (
    <span className="font-mono text-xs font-semibold text-[#111111]">
      Left {formatTime(timeLeft)}
    </span>
  );
}

/**
 * Elapsed / remaining session timer. Both blocks share the same plain
 * charcoal-mono treatment: no pill, no icon, no tinted background.
 */
export function ChatSessionTimer({ elapsedTime, timeLeft }: ChatSessionTimerProps) {
  return (
    <>
      <div className="hidden items-center gap-3 sm:flex">
        <ElapsedBlock elapsedTime={elapsedTime} />
        <div className="hidden h-6 w-px bg-[#d3cec6] md:block" />
        <RemainingBlock timeLeft={timeLeft} />
      </div>

      <div className="flex items-center sm:hidden">
        <CompactRemaining timeLeft={timeLeft} />
      </div>
    </>
  );
}
