/**
 * @deprecated This monolithic socket file is deprecated.
 * Use modular socket instances and utilities from `@/lib/socket` instead.
 */
import { io, type Socket } from "socket.io-client";
import { getErrorMessage } from "@repo/lib";

const apiUrl =
  process.env.NEXT_PUBLIC_SOCKET_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:6543";
const socketUrl = apiUrl.replace(/\/api\/v1\/?$/i, "");

const socketOptions = {
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  withCredentials: true,
};

export const socket: Socket = io(socketUrl, socketOptions);

export const socket: Socket = io(socketUrl, socketOptions);

socket.on("connect", () => {
  console.log("[Socket] Connected to the root namespace:", socket.id);
});

export default socket;
