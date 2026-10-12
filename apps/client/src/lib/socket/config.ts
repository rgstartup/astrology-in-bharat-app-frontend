import type { ManagerOptions, SocketOptions } from "socket.io-client";

export const isBrowser = typeof window !== "undefined";

export const getBaseSocketUrl = (): string => {
  const rawUrl =
    process.env.NEXT_PUBLIC_SOCKET_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://localhost:6543";
  return rawUrl.replace(/\/+$/, "").replace(/\/api\/v1\/?$/i, "");
};

export const defaultSocketOptions: Partial<ManagerOptions & SocketOptions> = {
  autoConnect: true,
  reconnection: true,
  // Presence is long-lived: never give up retrying across backend restarts.
  // A capped count wedges the socket permanently dead (no resubscribe, no
  // broadcasts) until a full page reload.
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5 * 1000,
  timeout: 10 * 1000,
  withCredentials: true,
  transports: ["websocket", "polling"],
};
