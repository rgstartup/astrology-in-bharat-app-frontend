import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";

export const callSocket: Socket = io(`${getBaseSocketUrl()}/call`, {
  ...defaultSocketOptions,
});

callSocket.on("connect", () => {
  console.log("[CallSocket] Connected to call namespace:", callSocket.id);
});

callSocket.on("connect_error", (err) => {
  console.error("[CallSocket] Connection Error:", err.message);
});

callSocket.on("disconnect", (reason) => {
  console.warn("[CallSocket] Disconnected:", reason);
});
