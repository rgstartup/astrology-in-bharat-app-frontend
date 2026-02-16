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
   <div className="flex items-center gap-2 min-w-0">
      <div
        className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors[quality]}`}
      />
     <span className="text-xs sm:text-sm capitalize truncate">{quality}</span>
    </div>
  );
}



