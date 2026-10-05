"use client";

import { useEffect } from "react";
import {
  joinConsultationRooms,
  leaveConsultationRooms,
} from "@/realtime/topics/consultation";

/** Own both rooms (chat + call) of a consultation for its lifetime. */
export const useConsultation = (consultationId?: number | string | null) => {
  const id = Number(consultationId);
  const isValidId = Boolean(id && !isNaN(id));

  useEffect(() => {
    if (!isValidId) return;
    joinConsultationRooms(id).catch(() => undefined);
    return () => {
      leaveConsultationRooms(id).catch(() => undefined);
    };
  }, [id, isValidId]);
};
