// live-sessions/components/SessionHeader.tsx
import React from "react";
import { RefreshCw, Eye } from "lucide-react";
import { Button } from "@/app/components/admin/Button";

interface SessionHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function SessionHeader({ onRefresh, isRefreshing }: SessionHeaderProps) {
  return (
    <header className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Live Sessions Monitor</h1>
        <p className="text-gray-600 mt-1">
          Monitor and manage ongoing user-astrologer sessions in real-time
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="secondary"
          icon={RefreshCw}
          loading={isRefreshing}
          onClick={onRefresh}
        >
          Refresh
        </Button>
        
        <Button variant="primary" icon={Eye}>
          Join All Sessions
        </Button>
      </div>
    </header>
  );
}