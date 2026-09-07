import { io, Socket } from "socket.io-client";
import { getErrorMessage } from "@repo/lib";

import { BACKEND_URL } from "./config";
const SOCKET_URL = BACKEND_URL;



export const socket: Socket = io(SOCKET_URL, {
    autoConnect: false,
    transports: ['websocket'],
});

// Expert specific chat socket
export const chatSocket: Socket = io(`${SOCKET_URL}/chat`, {
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    transports: ['websocket'],
});

// Expert specific call socket
export const callSocket: Socket = io(`${SOCKET_URL}/call`, {
    autoConnect: false,
    transports: ['websocket'],
});

socket.on("connect", () => {
});

socket.on("connect_error", (err) => {
    console.error("[Socket] ❌ Dashboard Connection Error:", getErrorMessage(err));
});

chatSocket.on("connect", () => {
    console.log("[ChatSocket] ✅ Expert Connected! Socket ID:", chatSocket.id);
});

chatSocket.on("disconnect", (reason) => {
    console.warn("[ChatSocket] ⚠️ Expert Disconnected:", reason);
});

chatSocket.on("connect_error", (err) => {
    console.error("[ChatSocket] ❌ Connection Error:", getErrorMessage(err));
});

callSocket.on("connect", () => {
});

callSocket.on("connect_error", (err) => {
    console.error("[CallSocket] ❌ Connection Error:", getErrorMessage(err));
});


