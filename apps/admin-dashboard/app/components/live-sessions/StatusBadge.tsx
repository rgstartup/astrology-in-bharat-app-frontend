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
    }
  };
  
  const { color, icon: Icon } = config[status];
  
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      <Icon className="w-3 h-3" />
      <span className="capitalize">{status.replace("-", " ")}</span>
    </div>
  );
}