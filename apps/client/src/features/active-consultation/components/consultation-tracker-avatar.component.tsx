"use client";

type TrackerAvatarProps = {
  name: string;
  avatar?: string | null;
};

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
};

/**
 * Expert avatar with initials fallback.
 *
 * @param name - Expert display name used for alt text and initials.
 * @param avatar - Optional avatar image URL.
 */
export function ConsultationTrackerAvatar({ name, avatar }: TrackerAvatarProps) {
  if (!avatar) return <AvatarInitials name={name} />;
  return (
    <img
      src={avatar}
      alt={name}
      className="h-10 w-10 shrink-0 rounded-full border border-slate-200 object-cover"
    />
  );
}
