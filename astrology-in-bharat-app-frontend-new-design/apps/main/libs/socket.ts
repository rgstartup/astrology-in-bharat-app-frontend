import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:6543/api/v1";
const SOCKET_URL = API_URL.includes("/api/v1") ? API_URL.replace("/api/v1", "") : API_URL;

console.log("[Socket] Main App connecting to:", SOCKET_URL);

export const socket: Socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

socket.on("connect", () => {
    console.log("[Socket] ✅ Main App Connected! ID:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("[Socket] ❌ Main App Connection Error:", err.message);
});
