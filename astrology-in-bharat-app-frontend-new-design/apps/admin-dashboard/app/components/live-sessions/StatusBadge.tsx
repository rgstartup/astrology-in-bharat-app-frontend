// live-sessions/components/StatusBadge.tsx
import React from "react";
import { Activity, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { SessionStatus } from "../live-sessions/session";

interface StatusBadgeProps {
  status: SessionStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = {
    live: {
      color: "bg-green-100 text-green-800",
      icon: Activity
    },
    pending: {
      color: "bg-yellow-100 text-yellow-800",
      icon: Clock
    },
    ended: {
      color: "bg-gray-100 text-gray-800",
      icon: CheckCircle
    },
    "technical-issue": {
      color: "bg-red-100 text-red-800",
      icon: AlertCircle
    },
    expired: {
      color: "bg-orange-100 text-orange-800",
      icon: Clock
    },
    "admin-terminated": {
      color: "bg-red-600 text-white shadow-sm",
      icon: AlertCircle
    }
  };

  const { color, icon: Icon } = config[status] as any;

  return (
    <div
      className={`inline-flex items-center gap-1 px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-medium whitespace-nowrap ${color}`}
    >
      {Icon && <Icon className="w-3 h-3 flex-shrink-0" />}
      <span className="capitalize truncate">
        {status.replace("-", " ")}
      </span>
    </div>
  );
}
