/**
 * hooks/useSocket.ts
 * Centralized socket hook — use this instead of importing raw socket instances.
 * Handles connect, disconnect, and re-registration automatically.
 */

import { useEffect, useRef } from "react";
import { chatSocket, callSocket, socket } from "@/lib/socket";
import { useAuthStore } from "@/store/useAuthStore";

/** Register expert on chat + call namespaces and maintain connection */
export function useExpertSocket() {
  const { user, isAuthenticated } = useAuthStore();
  const registeredRef = useRef(false);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    const expertId = user.profileId || user.id;

    const registerOnChat = () => {
      chatSocket.emit("register_expert", { expert_id: expertId });
    };

    const registerOnCall = () => {
      callSocket.emit("register_expert", { expert_id: expertId });
    };

    // Connect if not already
    if (!chatSocket.connected) chatSocket.connect();
    else registerOnChat();

    if (!callSocket.connected) callSocket.connect();
    else registerOnCall();

    if (!socket.connected) socket.connect();

    // Re-register on reconnection
    chatSocket.on("connect", registerOnChat);
    callSocket.on("connect", registerOnCall);

    registeredRef.current = true;

    return () => {
      chatSocket.off("connect", registerOnChat);
      callSocket.off("connect", registerOnCall);
    };
  }, [isAuthenticated, user]);
}

/** Simple one-time socket event listener with auto-cleanup */
export function useSocketEvent<T = any>(
  socketType: "chat" | "call" | "main",
  event: string,
  handler: (data: T) => void
) {
  const socketMap = { chat: chatSocket, call: callSocket, main: socket };

  useEffect(() => {
    const sock = socketMap[socketType];
    sock.on(event, handler);
    return () => {
      sock.off(event, handler);
    };
  }, [event, handler, socketType]);
}
