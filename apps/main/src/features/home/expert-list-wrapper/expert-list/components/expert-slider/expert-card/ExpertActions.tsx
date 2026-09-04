import type { MouseEventHandler } from "react";

interface ExpertActionsProps {
  price: number;
  chatPrice?: number;
  callPrice?: number;
  videoCallPrice?: number;
  labels: {
    chat: string;
    call: string;
    videoCall: string;
    perMinute: string;
  };
  onChat: MouseEventHandler<HTMLButtonElement>;
  onCall: MouseEventHandler<HTMLButtonElement>;
  onVideoCall: MouseEventHandler<HTMLButtonElement>;
}

function Price({ value, suffix }: { value: number; suffix: string }) {
  if (value <= 0) return null;
  return (
    <span className="w-full truncate px-1 text-center text-[9px] font-semibold opacity-95 sm:text-[11px]">
      ₹{value}
      {suffix}
    </span>
  );
}

export default function ExpertActions({
  price,
  chatPrice,
  callPrice,
  videoCallPrice,
  labels,
  onChat,
  onCall,
  onVideoCall,
}: ExpertActionsProps) {
  const chat = chatPrice && chatPrice > 0 ? chatPrice : price;
  const call = callPrice && callPrice > 0 ? callPrice : price;
  const video =
    videoCallPrice && videoCallPrice > 0 ? videoCallPrice : price * 2;
  const buttonClass =
    "flex min-w-0 flex-1 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-0 bg-[#ff6b00] py-2 text-white shadow-[0_4px_10px_rgba(255,107,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)]";

  return (
    <div className="mt-auto space-y-2 px-2 pb-3">
      <div className="flex gap-1.5">
        <button onClick={onChat} className={buttonClass}>
          <div className="mb-0.5 flex items-center gap-1">
            <i className="fa-regular fa-comment-dots text-[10px] sm:text-sm" />
            <span className="text-[12px] font-bold sm:text-[14px]">
              {labels.chat}
            </span>
          </div>
          <Price value={chat} suffix={labels.perMinute} />
        </button>
        <button onClick={onCall} className={buttonClass}>
          <div className="mb-0.5 flex items-center gap-1">
            <i className="fa-solid fa-phone-volume text-[10px] sm:text-sm" />
            <span className="text-[12px] font-bold sm:text-[14px]">
              {labels.call}
            </span>
          </div>
          <Price value={call} suffix={labels.perMinute} />
        </button>
      </div>
      <button
        onClick={onVideoCall}
        className="flex w-full cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-xl border-0 bg-[#ff6b00] py-2 text-white shadow-[0_4px_10px_rgba(255,107,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_6px_15px_rgba(255,107,0,0.3)]"
      >
        <i className="fa-solid fa-video shrink-0 text-[10px] sm:text-sm" />
        <span className="shrink-0 text-[12px] font-bold sm:text-[14px]">
          {labels.videoCall}
        </span>
        <Price value={video} suffix={labels.perMinute} />
      </button>
    </div>
  );
}
