import { io, Socket } from "socket.io-client";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543/api/v1";
const SOCKET_URL = API_URL.includes("/api/v1") ? API_URL.replace("/api/v1", "") : API_URL;

console.log("[Socket] Admin Dashboard connecting to:", SOCKET_URL);

export const socket: Socket = io(SOCKET_URL, {
    transports: ["websocket"],
    autoConnect: true,
});

// Chat specific socket instance
export const chatSocket: Socket = io(`${SOCKET_URL}/chat`, {
    transports: ["websocket"],
    autoConnect: false,
});

socket.on("connect", () => {
    console.log("[Socket] ✅ Admin Connected! ID:", socket.id);
});

chatSocket.on("connect", () => {
    console.log("[ChatSocket] ✅ Admin Connected! ID:", chatSocket.id);
});
