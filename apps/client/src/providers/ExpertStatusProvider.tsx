"use client";

import { useEffect } from "react";
import { presenceSocket } from "@/lib/socket/presence.socket";
import {
  ExpertClientStatus,
  type LegacyPresenceEventPayload,
  type PresenceChangedEventPayload,
} from "@/lib/socket/types";
import { usePresenceStore } from "@/store/presenceStore";
import { useExpertListStore } from "@/store/expertListStore";

export default function ExpertStatusProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // 1. Canonical backend broadcast listener ('expert.presence.changed')
    const handleCanonicalPresenceChanged = (payload: PresenceChangedEventPayload) => {
      if (!payload || !payload.expertId) return;

      const expertId = Number(payload.expertId);
      const status = payload.status || ExpertClientStatus.OFFLINE;

      // Update centralized presence store
      usePresenceStore
        .getState()
        .setExpertStatus(expertId, status, payload.timestamp);

      // Keep legacy list store availability in sync
      useExpertListStore
        .getState()
        .updateExpertAvailability(expertId, status === ExpertClientStatus.ONLINE);
    };

    // 2. Legacy fallback listener ('expert_status_changed')
    const handleLegacyStatusChanged = (payload: LegacyPresenceEventPayload) => {
      if (!payload) return;
      const rawId = payload.expert_id ?? payload.userId ?? payload.id;
      if (rawId === undefined || rawId === null) return;

      const expertId = Number(rawId);
      const isAvailable =
        payload.is_available !== undefined
          ? payload.is_available
          : payload.status === "online";
      const status = isAvailable
        ? ExpertClientStatus.ONLINE
        : payload.is_busy
          ? ExpertClientStatus.BUSY
          : ExpertClientStatus.OFFLINE;

      usePresenceStore
        .getState()
        .setExpertStatus(expertId, status, payload.timestamp);

      useExpertListStore
        .getState()
        .updateExpertAvailability(expertId, isAvailable);
    };

    // 3. Legacy busy changed listener ('expert_busy_changed')
    const handleLegacyBusyChanged = (payload: {
      expert_id?: number | string;
      id?: number | string;
      is_busy?: boolean;
    }) => {
      if (!payload) return;
      const rawId = payload.expert_id ?? payload.id;
      if (rawId === undefined || rawId === null) return;

      const expertId = Number(rawId);
      if (payload.is_busy) {
        usePresenceStore
          .getState()
          .setExpertStatus(expertId, ExpertClientStatus.BUSY);
      }
    };

    // 4. Socket reconnect handler: re-subscribe active room listeners
    const handleConnectOrReconnect = () => {
      usePresenceStore.getState().rehydrateSubscriptions();
    };

    if (!presenceSocket.connected) {
      presenceSocket.connect();
    }

    presenceSocket.on("expert.presence.changed", handleCanonicalPresenceChanged);
    presenceSocket.on("expert_status_changed", handleLegacyStatusChanged);
    presenceSocket.on("expert_busy_changed", handleLegacyBusyChanged);
    presenceSocket.on("connect", handleConnectOrReconnect);
    presenceSocket.on("reconnect", handleConnectOrReconnect);

    return () => {
      presenceSocket.off("expert.presence.changed", handleCanonicalPresenceChanged);
      presenceSocket.off("expert_status_changed", handleLegacyStatusChanged);
      presenceSocket.off("expert_busy_changed", handleLegacyBusyChanged);
      presenceSocket.off("connect", handleConnectOrReconnect);
      presenceSocket.off("reconnect", handleConnectOrReconnect);
    };
  }, []);

  return children;
}
