import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";

export const chatSocket: Socket = io(`${getBaseSocketUrl()}/chat`, {
  ...defaultSocketOptions,
  reconnectionAttempts: 5,
});

chatSocket.on("connect", () => {
  console.log("[ChatSocket] Expert Connected! Socket ID:", chatSocket.id);
});

chatSocket.on("disconnect", (reason) => {
  console.warn("[ChatSocket] Expert Disconnected:", reason);
});

chatSocket.on("connect_error", (err) => {
  console.error("[ChatSocket] Connection Error:", err.message);
});
