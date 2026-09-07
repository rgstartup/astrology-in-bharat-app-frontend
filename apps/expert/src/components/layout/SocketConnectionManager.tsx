"use client";

import React from "react";
import { useExpertSocket } from "@/hooks/useSocket";

/**
 * Invisible component that initializes and maintains 
 * the WebSocket connection for the expert dashboard.
 */
export const SocketConnectionManager: React.FC = () => {
  useExpertSocket();
  return null;
};
