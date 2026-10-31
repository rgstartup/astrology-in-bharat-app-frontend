"use client";

import { useConsultationRoomStore } from "@/features/consultation/stores/consultation-room.store";

function AvatarInitials({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
  return (
    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-sm font-semibold text-white">
      {initials || "EX"}
    </div>
  );
}

/**
 * Expert avatar with initials fallback.
 * Reads expert name and avatar from the global consultation room store.
 */
export function ConsultationTrackerAvatar() {
  const expertName = useConsultationRoomStore((s) => s.expertName) ?? "Expert";
  const expertAvatar = useConsultationRoomStore((s) => s.expertAvatar);
  if (!expertAvatar) return <AvatarInitials name={expertName} />;
  return (
    <img
      src={expertAvatar}
      alt={expertName}
      className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
    />
  );
}
