import { io, type Socket } from "socket.io-client";
import { defaultSocketOptions, getBaseSocketUrl } from "./config";

export const merchantSocket: Socket = io(`${getBaseSocketUrl()}/merchant`, {
  ...defaultSocketOptions,
});

merchantSocket.on("connect", () => {
  console.log("[MerchantSocket] Connected to /merchant namespace:", merchantSocket.id);
});

merchantSocket.on("connect_error", (error) => {
  console.warn("[MerchantSocket] Connection error:", (error as Error)?.message || error);
});
