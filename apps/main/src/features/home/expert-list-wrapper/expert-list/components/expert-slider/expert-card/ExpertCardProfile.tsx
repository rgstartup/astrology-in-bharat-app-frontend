import Image from "next/image";
import type { MouseEventHandler } from "react";

interface ExpertCardProfileProps {
  avatar?: string;
  name: string;
  isLiked: boolean;
  currentLikes: number;
  isAvailable: boolean;
  isBusy: boolean;
  isNavigating: boolean;
  onlineLabel: string;
  offlineLabel: string;
  onLike: MouseEventHandler<HTMLButtonElement>;
  onOpenVideo: MouseEventHandler<HTMLButtonElement>;
}

function formatLikes(count: number) {
  if (count < 1000) return count;
  return `${(count / 1000).toFixed(1).replace(/\.0$/, "")}k`;
}

export default function ExpertCardProfile({
  avatar,
  name,
  isLiked,
  currentLikes,
  isAvailable,
  isBusy,
  isNavigating,
  onlineLabel,
  offlineLabel,
  onLike,
  onOpenVideo,
}: ExpertCardProfileProps) {
  return (
    <div className="relative flex justify-center pt-8">
      {isNavigating && (
        <div className="absolute inset-0 z-50 flex items-center justify-center rounded-xl bg-white/40 backdrop-blur-[1px]">
          <i className="fa-solid fa-spinner fa-spin text-3xl text-orange" />
        </div>
      )}

      <div className="absolute top-2 left-3 z-20 flex flex-col items-center gap-1">
        <button
          type="button"
          aria-label={isLiked ? `Unlike ${name}` : `Like ${name}`}
          onClick={onLike}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:scale-110"
        >
          <i
            className={`${isLiked ? "fa-solid" : "fa-regular"} fa-heart`}
            style={{ color: isLiked ? "#ff4d4d" : "#555" }}
          />
        </button>
        {currentLikes > 0 && (
          <span className="rounded-full bg-black/50 px-2 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
            {formatLikes(currentLikes)}
          </span>
        )}
      </div>

      <div
        className={`absolute top-2 right-3 z-20 flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium shadow-md ${
          isBusy
            ? "bg-amber-100 text-amber-700"
            : isAvailable
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
        }`}
      >
        <i
          className={`fa-solid fa-circle ${
            isBusy
              ? "text-amber-500"
              : isAvailable
                ? "text-green-500"
                : "text-gray-400"
          }`}
        />
        {isBusy ? "Busy" : isAvailable ? onlineLabel : offlineLabel}
      </div>

      <div className="relative mx-auto mt-1 mb-2 h-[120px] w-[120px]">
        <Image
          src={avatar || "/images/dummy-expert.jpg"}
          alt={name || "Expert Profile"}
          fill
          sizes="120px"
          className="rounded-full border border-[#daa23e] object-cover shadow-sm"
        />
        <button
          type="button"
          aria-label={`Play video of ${name}`}
          onClick={onOpenVideo}
          className="absolute top-[85%] left-1/2 z-10 -translate-x-1/2 -translate-y-1/2 cursor-pointer border-0 bg-transparent p-0 text-5xl text-white drop-shadow-lg transition-all duration-300 hover:scale-110 hover:text-primary"
        >
          <i className="fa-solid fa-circle-play" />
        </button>
      </div>
    </div>
  );
}
