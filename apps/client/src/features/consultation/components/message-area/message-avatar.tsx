"use client";

import { User } from "@repo/design/lucide";
import { Avatar, AvatarImage, AvatarFallback } from "@repo/design/shadcn";

type MessageAvatarProps = {
  senderType: string;
  userAvatar?: string;
  userName?: string;
  expertImage?: string;
  expertName?: string;
};

function getInitials(name?: string): string {
  if (!name) return "";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "";
  if (parts.length === 1) {
    const only = parts[0];
    if (!only) return "";
    return only.slice(0, 2).toUpperCase();
  }
  const first = parts[0];
  const last = parts[parts.length - 1];
  if (!first || !last) return "";
  return `${first[0]}${last[0]}`.toUpperCase();
}

function NoPhotoAvatar({ name }: { name: string }) {
  const initials = getInitials(name);
  if (!initials) {
    return (
      <Avatar className="size-8 shrink-0 rounded-full border border-[#d3cec6] bg-[#ffffff]">
        <AvatarFallback className="rounded-full bg-[#ffffff] text-[#626260]">
          <User className="size-4" />
        </AvatarFallback>
      </Avatar>
    );
  }
  return (
    <Avatar className="size-8 shrink-0 rounded-full border border-[#d3cec6] bg-[#ffffff]">
      <AvatarFallback className="rounded-full bg-[#ffffff] font-sans text-[11px] font-semibold text-[#111111]">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
}

function PhotoAvatar({ src, name }: { src: string; name: string }) {
  return (
    <Avatar className="size-8 shrink-0 rounded-full border border-[#d3cec6] bg-[#ffffff]">
      <AvatarImage src={src} alt={name} className="rounded-full object-cover" />
      <AvatarFallback className="rounded-full bg-[#ffffff] text-[#626260]">
        <User className="size-4" />
      </AvatarFallback>
    </Avatar>
  );
}

/** Waterfall: admin renders no avatar; missing photo falls back to initials/icon. */
export default function MessageAvatar({
  senderType,
  userAvatar,
  userName,
  expertImage,
  expertName,
}: MessageAvatarProps) {
  if (senderType === "admin") return null;

  if (senderType === "user") {
    const name = userName || "User";
    if (!userAvatar) return <NoPhotoAvatar name={name} />;
    return <PhotoAvatar src={userAvatar} name={name} />;
  }

  const expertDisplayName = expertName || "Expert";
  if (!expertImage) return <NoPhotoAvatar name={expertDisplayName} />;
  return <PhotoAvatar src={expertImage} name={expertDisplayName} />;
}
