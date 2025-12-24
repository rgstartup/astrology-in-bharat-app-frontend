// live-sessions/components/QualityIndicator.tsx
import React from "react";
import { ConnectionQuality } from "../live-sessions/session";

interface QualityIndicatorProps {
  quality: ConnectionQuality;
}

export function QualityIndicator({ quality }: QualityIndicatorProps) {
  const colors = {
    excellent: "bg-green-500",
    good: "bg-green-400",
    fair: "bg-yellow-500",
    poor: "bg-red-500"
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${colors[quality]}`} />
      <span className="text-sm capitalize">{quality}</span>
    </div>
  );
}