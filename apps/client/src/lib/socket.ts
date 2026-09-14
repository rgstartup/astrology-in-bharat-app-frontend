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

/** Socket.IO namespace for merchant availability updates. */
export const merchantSocket: Socket = io(`${socketUrl}/merchant`, socketOptions);

socket.on("connect", () => {
  console.log("[Socket] Connected to the root namespace:", socket.id);
});

merchantSocket.on("connect", () => {
  console.log(
    "[Socket] Connected to the merchant namespace:",
    merchantSocket.id,
  );
});

merchantSocket.on("connect_error", (error) => {
  console.warn(
    "[Socket] Merchant connection failed. Check NEXT_PUBLIC_SOCKET_URL, the backend /merchant namespace, and its CORS settings.",
    getErrorMessage(error),
  );
});

merchantSocket.on("merchant_status_changed", (data) => {
  console.log("[Socket] Received merchant status update:", data);
});

export default socket;
