import { io, Socket } from "socket.io-client";

import { BACKEND_URL } from "./config";
const SOCKET_URL = BACKEND_URL;

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

// Expert specific call socket
export const callSocket: Socket = io(`${SOCKET_URL}/call`, {
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

callSocket.on("connect", () => {
    console.log("[CallSocket] ✅ Connected! ID:", callSocket.id);
});

callSocket.on("connect_error", (err) => {
    console.error("[CallSocket] ❌ Connection Error:", err.message);
});


