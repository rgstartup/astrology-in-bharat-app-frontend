import { io, Socket } from "socket.io-client";
import { getErrorMessage } from "@repo/lib";

console.log("🔥 [Socket] merchantSocket script is LOADING!");

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:6543";
console.log(`🔥 [Socket] Connecting to: ${SOCKET_URL}/merchant`);

/**
 * Socket Client for Merchant Real-time updates
 * Namespace: /merchant
 */
export const socket: Socket = io(SOCKET_URL, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
});

socket.on("connect", () => {
    console.log("🟢 [Socket] Connected to Root WebSocket namespace:", socket.id);
});

export const merchantSocket: Socket = io(`${SOCKET_URL}/merchant`, {
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    withCredentials: true,
});

merchantSocket.on("connect", () => {
    console.log("🟢 [Socket] Connected to Merchant WebSocket namespace:", merchantSocket.id);
});

merchantSocket.on("connect_error", (error) => {
    console.error("🔴 [Socket] Merchant WebSocket connection error:", getErrorMessage(error));
});

merchantSocket.on("merchant_status_changed", (data) => {
    console.log("📡 [Socket] Received global status update:", data);
});

export default socket;
