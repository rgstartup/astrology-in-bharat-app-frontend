import { io, Socket } from "socket.io-client";

const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || (process.env.NEXT_PUBLIC_API_URL ? process.env.NEXT_PUBLIC_API_URL.replace('/api/v1', '') : "http://localhost:6543");

console.log("[Socket] Admin Dashboard connecting to:", SOCKET_URL);

export const socket: Socket = io(SOCKET_URL, {
    autoConnect: true,
    transports: ['websocket'],
});

// Chat specific socket instance
export const chatSocket: Socket = io(`${SOCKET_URL}/chat`, {
    autoConnect: false,
    transports: ['websocket'],
});

socket.on("connect", () => {
    console.log("[Socket] ✅ Admin Connected! ID:", socket.id);
});

chatSocket.on("connect", () => {
    console.log("[ChatSocket] ✅ Admin Connected! ID:", chatSocket.id);
});
