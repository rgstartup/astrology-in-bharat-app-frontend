"use client";

import { io, type Socket } from "socket.io-client";

import { defaultSocketOptions, getBaseSocketUrl } from "@/lib/socket/config";

let socket: Socket | null = null;

const REALTIME_NAMESPACE = "/realtime";

const isBrowser = typeof window !== "undefined";

/** Singleton for the unified `/realtime` namespace. Presence, chat, call and notifications are topics on it. */
export const realtimeSocket = (): Socket => {
  if (!isBrowser) {
    throw new Error("realtimeSocket is only available in the browser");
  }

  if (!socket) {
    socket = io(`${getBaseSocketUrl()}${REALTIME_NAMESPACE}`, {
      ...defaultSocketOptions,
      autoConnect: false,
    });
  }

  return socket;
};

export const isRealtimeSocketConnected = (): boolean => socket?.connected ?? false;

/** Connect with optional JWT (`socket.auth`). Anonymous when omitted — presence subscribe works either way. */
export const connectRealtimeSocket = (token?: string | null): Socket => {
  const active = realtimeSocket();
  if (token) {
    active.auth = { token, actorType: "client" };
  }
  if (!active.connected) {
    active.connect();
  }
  return active;
};

export const disconnectRealtimeSocket = (): void => {
  if (socket?.connected) {
    socket.disconnect();
  }
};

/** Emit with ack; rejects when disconnected or after 10s without ack. */
export const emitWithAck = <T>(event: string, payload: Record<string, unknown>): Promise<T> => {
  const active = realtimeSocket();
  return new Promise((resolve, reject) => {
    if (!active.connected) {
      reject(new Error(`Cannot emit ${event}: socket not connected`));
      return;
    }
    const timer = setTimeout(() => {
      reject(new Error(`No ack for ${event}`));
    }, 10_000);
    active.emit(event, payload, (ack: T) => {
      clearTimeout(timer);
      if (ack) {
        resolve(ack);
      } else {
        reject(new Error(`No ack for ${event}`));
      }
    });
  });
};
