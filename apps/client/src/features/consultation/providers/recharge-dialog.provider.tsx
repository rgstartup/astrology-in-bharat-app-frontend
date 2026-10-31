"use client";

import React, { createContext, useContext, useMemo } from "react";
import type { ChatPausedPayload } from "@/realtime/types/chat";
import RoomPausedDialog from "../components/room/room-paused-dialog";
import { useRoomLifecycle } from "./room-lifecycle.provider";

export interface RechargeDialogContextValue {
  isRechargePause: boolean;
  rechargePaused: ChatPausedPayload | null;
  handleResume: () => void;
  handleExit: () => void;
}

const RechargeDialogContext = createContext<RechargeDialogContextValue | null>(
  null,
);

export interface RechargeDialogProviderProps {
  children: React.ReactNode;
}

/**
 * Provider managing balance exhaustion and recharge pauses.
 * Renders RoomPausedDialog when the balance runs out, distinguishing
 * it from disconnect pauses.
 *
 * @param props - Provider children
 */
export function RechargeDialogProvider({
  children,
}: RechargeDialogProviderProps) {
  const { pausedState, endedVerdict, resumeLiveChat, endLiveChat, roomMode } =
    useRoomLifecycle();

  const isRechargePause =
    pausedState !== null &&
    (pausedState.reason == null ||
      pausedState.reason === "insufficient_balance");

  const rechargePaused: ChatPausedPayload | null =
    !endedVerdict && isRechargePause ? pausedState : null;

  const handleResume = () => {
    resumeLiveChat(roomMode ?? "chat").catch(() => undefined);
  };

  const handleExit = () => {
    endLiveChat().catch(() => undefined);
  };

  const contextValue = useMemo<RechargeDialogContextValue>(
    () => ({
      isRechargePause,
      rechargePaused,
      handleResume,
      handleExit,
    }),
    [isRechargePause, rechargePaused],
  );

  return (
    <RechargeDialogContext.Provider value={contextValue}>
      <RoomPausedDialog
        paused={rechargePaused}
        onResume={handleResume}
        onExit={handleExit}
      />
      {children}
    </RechargeDialogContext.Provider>
  );
}

/**
 * Hook to access recharge dialog context.
 *
 * @returns RechargeDialogContextValue
 * @throws Error if used outside RechargeDialogProvider
 */
export function useRechargeDialog(): RechargeDialogContextValue {
  const context = useContext(RechargeDialogContext);
  if (!context) {
    throw new Error(
      "useRechargeDialog must be used within a RechargeDialogProvider",
    );
  }
  return context;
}
