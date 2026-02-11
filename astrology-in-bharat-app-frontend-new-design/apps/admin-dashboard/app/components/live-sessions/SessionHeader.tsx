// live-sessions/components/SessionHeader.tsx
import React from "react";
import { RefreshCw, Eye } from "lucide-react";
import { Button } from "../../../../shared/components/Button";

interface SessionHeaderProps {
  onRefresh: () => void;
  isRefreshing: boolean;
}

export function SessionHeader({ onRefresh, isRefreshing }: SessionHeaderProps) {
  return (
    <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      {/* Title */}
      <div className="min-w-0">
        <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
          Live Sessions Monitor
        </h1>
        <p className="text-sm sm:text-base text-gray-600 mt-1">
          Monitor and manage ongoing user-astrologer sessions in real-time
        </p>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
