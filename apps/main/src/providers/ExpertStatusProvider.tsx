"use client";

import { useEffect } from "react";
import socket from "@/lib/socket";
import { useExpertListStore } from "@/store/useExpertListStore";

export default function ExpertStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    const handleStatusUpdate = (data: {
      expert_id?: string | number;
      userId?: string | number;
      id?: string | number;
      is_available?: boolean;
      status?: string;
    }) => {
      const expertId = data.expert_id ?? data.userId ?? data.id;
      if (expertId === undefined || expertId === null) return;

      const isAvailable =
        data.is_available !== undefined
          ? data.is_available
          : data.status === "online";

      useExpertListStore
        .getState()
        .updateExpertAvailability(expertId, isAvailable);
    };

    if (!socket.connected) socket.connect();
    socket.on("expert_status_changed", handleStatusUpdate);

    return () => {
      socket.off("expert_status_changed", handleStatusUpdate);
    };
  }, []);

  return children;
}
