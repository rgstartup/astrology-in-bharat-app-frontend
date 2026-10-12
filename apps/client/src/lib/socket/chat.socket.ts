/**
 * @deprecated Legacy `/chat` namespace socket. Use `@/realtime` (`/realtime`
 * namespace: `chat:join/send/typing/request/cancel/end`) instead. Kept until
 * the last legacy caller migrates, then delete.
 */
import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";

export const chatSocket: Socket = io(`${getBaseSocketUrl()}/chat`, {
  ...defaultSocketOptions,
  autoConnect: false,
});

chatSocket.on("connect", () => {
  console.log("[ChatSocket] Connected to /chat namespace:", chatSocket.id);
});

chatSocket.on("connect_error", (error) => {
  console.warn("[ChatSocket] Connection error:", (error as Error)?.message || error);
});
