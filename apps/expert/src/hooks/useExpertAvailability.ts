"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import api from "@/actions/api";
import {
  getRootSocket,
  chatSocket,
  ExpertClientStatus,
  SOCKET_LISTEN_EVENTS,
  SOCKET_EMIT_EVENTS,
  type PresenceChangedEventPayload,
  type LegacyPresenceEventPayload,
  type ExpertFullAvailabilityResponse,
} from "@/lib/socket";
import { useAuthStore } from "@/store/auth.store";
import { API_ROUTES } from "@/utils/api.routes";

export interface UseExpertAvailabilityResult {
  isOnline: boolean;
  loading: boolean;
  toggleAvailability: () => Promise<void>;
  setIsOnline: (value: boolean) => void;
}

export function useExpertAvailability(): UseExpertAvailabilityResult {
  const { user, isAuthenticated } = useAuthStore();
  const [isOnline, setIsOnline] = useState(false);
  const [loading, setLoading] = useState(false);

  // Sync initial online / availability mode from server
  useEffect(() => {
    if (!isAuthenticated || !user) {
      setIsOnline(false);
      return;
    }

    let isSubscribed = true;

    const fetchCurrentAvailability = async () => {
      const result = await api.get<ExpertFullAvailabilityResponse>(
        API_ROUTES.ACCOUNT.AVAILABILITY_ME,
      );

      if (!isSubscribed) return;

      if (result.ok && result.data) {
        setIsOnline(result.data.availabilityMode === "available");
      } else if (user.isAvailable !== undefined) {
        setIsOnline(Boolean(user.isAvailable));
      }
    };

    fetchCurrentAvailability();

    return () => {
      isSubscribed = false;
    };
  }, [isAuthenticated, user]);

  // Sync realtime presence events
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const currentExpertId = user?.userId || user?.id;
    const rootSocket = getRootSocket();

    const handlePresenceChanged = (payload: PresenceChangedEventPayload) => {
      if (String(payload.expertId) === String(currentExpertId)) {
        setIsOnline(payload.status === ExpertClientStatus.ONLINE);
      }
    };

    const handleLegacyStatusSync = (data: LegacyPresenceEventPayload) => {
      const expertId = data.expert_id || data.userId || data.id;
      if (String(currentExpertId) === String(expertId)) {
        const isAvailable =
          data.is_available !== undefined ? data.is_available : data.status === "online";
        setIsOnline(Boolean(isAvailable));
      }
    };

    rootSocket.on(SOCKET_LISTEN_EVENTS.PRESENCE_CHANGED, handlePresenceChanged);
    rootSocket.on(SOCKET_LISTEN_EVENTS.LEGACY_STATUS_CHANGED, handleLegacyStatusSync);

    return () => {
      rootSocket.off(SOCKET_LISTEN_EVENTS.PRESENCE_CHANGED, handlePresenceChanged);
      rootSocket.off(SOCKET_LISTEN_EVENTS.LEGACY_STATUS_CHANGED, handleLegacyStatusSync);
    };
  }, [isAuthenticated, user]);

  const toggleAvailability = useCallback(async () => {
    setLoading(true);
    const newStatus = !isOnline;
    const mode = newStatus ? "available" : "unavailable";

    const result = await api.patch<{ mode: string }>(API_ROUTES.ACCOUNT.AVAILABILITY, { mode });

    if (!result.ok) {
      toast.error(result.error?.message || "Failed to update availability");
      setLoading(false);
      return;
    }

    setIsOnline(newStatus);

    // End active chats if switching to offline mode
    if (!newStatus && user?.profileId) {
      chatSocket.emit(SOCKET_EMIT_EVENTS.FORCE_END_ACTIVE_CHATS, {
        expert_id: String(user.profileId),
      });
    }

    setLoading(false);
  }, [isOnline, user]);

  return {
    isOnline,
    loading,
    toggleAvailability,
    setIsOnline,
  };
}

export default useExpertAvailability;
