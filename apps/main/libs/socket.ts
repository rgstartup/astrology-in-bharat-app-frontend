import { io, Socket } from "socket.io-client";

import { getBasePath } from "@/utils/api-config";

const SOCKET_URL = getBasePath();

console.log("[Socket] Main App connecting to:", SOCKET_URL);

export const socket: Socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

// Chat specific socket instance
export const chatSocket: Socket = io(`${SOCKET_URL}/chat`, {
    transports: ["websocket"],
    autoConnect: false, // We'll connect manually when entering chat room
});

socket.on("connect", () => {
    console.log("[Socket] ✅ Main App Connected! ID:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("[Socket] ❌ Main App Connection Error:", err.message);
});

chatSocket.on("connect", () => {
    console.log("[ChatSocket] ✅ Connected! ID:", chatSocket.id);
});

chatSocket.on("connect_error", (err) => {
    console.error("[ChatSocket] ❌ Connection Error:", err.message);
});


