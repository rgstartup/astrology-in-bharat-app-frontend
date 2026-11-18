"use client";

import { useEffect, useRef } from "react";
import { useRealtime } from "@/realtime/socket-provider";

/**
 * Subscribes to a realtime socket event without initiating or touching socket connection lifecycle.
 * - Safely attaches listener when `enabled` is true.
 * - Uses `handlerRef` to keep handler references stable and prevent unnecessary listener churn on re-renders.
 * - If `event === "connect"` and socket is already connected when mounting, invokes handler immediately.
 * - Automatically unregisters listener on unmount or when `enabled` flips to false.
 */
export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void,
  enabled: boolean = true,
): void {
  const { socket } = useRealtime();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  useEffect(() => {
    if (!socket || !enabled) return;

    const listener = (data: T) => {
      handlerRef.current(data);
    };

    socket.on(event, listener);

    // If subscribing to "connect" and socket is already connected, trigger immediately.
    if (event === "connect" && socket.connected) {
      listener({} as T);
    }

    return () => {
      socket.off(event, listener);
    };
  }, [socket, event, enabled]);
}

/**
 * Subscribes to multiple socket events in a single declarative call.
 * Uses a ref for the events map so inline handler objects don't cause re-registration churn.
 */
export function useSocketEvents(
  events: Record<string, (data: any) => void>,
  enabled: boolean = true,
): void {
  const { socket } = useRealtime();
  const eventsRef = useRef(events);
  eventsRef.current = events;

  useEffect(() => {
    if (!socket || !enabled) return;

    const registered: Array<[string, (data: any) => void]> = [];
    const eventKeys = Object.keys(eventsRef.current);

    for (const event of eventKeys) {
      const listener = (data: any) => {
        eventsRef.current[event]?.(data);
      };
      socket.on(event, listener);
      registered.push([event, listener]);

      if (event === "connect" && socket.connected) {
        listener({});
      }
    }

    return () => {
      for (const [event, listener] of registered) {
        socket.off(event, listener);
      }
    };
  }, [socket, enabled]);
}

export default useSocketEvent;
