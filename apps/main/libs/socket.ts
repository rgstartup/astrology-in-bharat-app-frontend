import { io, Socket } from "socket.io-client";

// We use a dummy socket for SSR to avoid build-time crashes with socket.io-client
const createDummySocket = () => ({
    on: () => { },
    off: () => { },
    emit: () => { },
    connect: () => { },
    disconnect: () => { },
    connected: false,
} as unknown as Socket);

const isBrowser = typeof window !== "undefined";

const SOCKET_URL = isBrowser ? "http://localhost:6543" : "";

export const socket: Socket = isBrowser
    ? io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
    })
    : createDummySocket();

export const chatSocket: Socket = isBrowser
    ? io(`${SOCKET_URL}/chat`, {
        transports: ["websocket"],
        autoConnect: false,
    })
    : createDummySocket();

if (isBrowser) {
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
}
