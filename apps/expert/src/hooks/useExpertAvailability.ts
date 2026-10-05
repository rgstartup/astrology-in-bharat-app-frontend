"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import api from "@/actions/api";
import { realtimeSocket } from "@/realtime/socket";
import { PRESENCE_EVENTS } from "@/realtime/topics/presence";
import {
  ExpertClientStatus,
  type PresenceChangedEventPayload,
} from "@/realtime/types/presence";
import type { ExpertFullAvailabilityResponse } from "@/lib/socket";
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

  // Sync own realtime presence (auto-joined `expert:{id}` room)
  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const currentExpertId = user?.userId || user?.id;
    const socket = realtimeSocket();

    const handlePresenceChanged = (payload: PresenceChangedEventPayload) => {
      if (payload && String(payload.expertId) === String(currentExpertId)) {
        setIsOnline(payload.status === ExpertClientStatus.ONLINE);
      }
    };

    socket.on(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);

    return () => {
      socket.off(PRESENCE_EVENTS.UPDATED, handlePresenceChanged);
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

    setLoading(false);
  }, [isOnline]);

  return {
    isOnline,
    loading,
    toggleAvailability,
    setIsOnline,
  };
}

export default useExpertAvailability;
