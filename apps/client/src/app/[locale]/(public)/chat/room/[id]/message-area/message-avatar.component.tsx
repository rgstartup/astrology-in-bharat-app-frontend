"use client";

import React from "react";
import { User } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

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
  const first = parts[0] ?? "";
  const last = parts[parts.length - 1] ?? "";
  if (parts.length === 1) return first.slice(0, 2).toUpperCase();
  return ((first[0] ?? "") + (last[0] ?? "")).toUpperCase();
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

  const isUser = senderType === "user";
  const src = isUser ? userAvatar : expertImage;
  const name = isUser ? userName || "User" : expertName || "Expert";

  if (!src) {
    return (
      <Avatar className="size-8 shrink-0">
        <AvatarFallback>
          <User />
        </AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className="size-8 shrink-0">
      <AvatarImage src={src} alt={name} />
      <AvatarFallback>{getInitials(name) || <User />}</AvatarFallback>
    </Avatar>
  );
}
