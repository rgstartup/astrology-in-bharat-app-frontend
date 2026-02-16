import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";
const SOCKET_URL = API_URL.includes("/api/v1") ? API_URL.replace("/api/v1", "") : API_URL;

console.log("[Socket] Dashboard connecting to:", SOCKET_URL);

export const socket: Socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

// Expert specific chat socket
export const chatSocket: Socket = io(`${SOCKET_URL}/chat`, {
    transports: ["websocket"],
    autoConnect: false,
});

socket.on("connect", () => {
    console.log("[Socket] ✅ Dashboard Connected! ID:", socket.id);
});

socket.on("connect_error", (err) => {
    console.error("[Socket] ❌ Dashboard Connection Error:", err.message);
});

chatSocket.on("connect", () => {
    console.log("[ChatSocket] ✅ Connected! ID:", chatSocket.id);
});

chatSocket.on("connect_error", (err) => {
    console.error("[ChatSocket] ❌ Connection Error:", err.message);
});


