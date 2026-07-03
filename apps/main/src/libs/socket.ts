import { io, Socket } from "socket.io-client";
import { getErrorMessage } from "@repo/lib";

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

const RAW_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:6543";
const SOCKET_URL = isBrowser ? RAW_URL.replace(/\/api\/v1\/?$/i, "") : "";

export const socket: Socket = isBrowser
    ? io(SOCKET_URL, {
        transports: ["websocket"],
        autoConnect: true,
    })
    : createDummySocket();

export const chatSocket: Socket = isBrowser
    ? io(`${SOCKET_URL}/chat`, {
        transports: ["websocket", "polling"],
        autoConnect: false,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
    })
    : createDummySocket();

if (isBrowser) {
    socket.on("connect", () => { });

    socket.on("connect_error", (err) => {
        console.error("[Socket] ❌ Main App Connection Error:", getErrorMessage(err));
    });

    chatSocket.on("connect", () => {
        console.log("[ChatSocket] ✅ Connected! Socket ID:", chatSocket.id);
    });

    chatSocket.on("disconnect", (reason) => {
        console.warn("[ChatSocket] ⚠️ Disconnected:", reason);
    });

    chatSocket.on("connect_error", (err) => {
        console.error("[ChatSocket] ❌ Connection Error:", getErrorMessage(err));
    });
}
