/**
 * Socket.io Emit & Listen Event Constants
 */

export const SOCKET_EMIT_EVENTS = {
  // Presence
  HEARTBEAT: "heartbeat",

  // Registration
  REGISTER_EXPERT: "register_expert",
  REGISTER_USER: "register_user",
} as const;

export const SOCKET_LISTEN_EVENTS = {
  // Lifecycle
  CONNECT: "connect",
  DISCONNECT: "disconnect",
  CONNECT_ERROR: "connect_error",
  RECONNECT: "reconnect",

  // Presence & Status Sync
  PRESENCE_CHANGED: "expert.presence.changed",
  LEGACY_STATUS_CHANGED: "expert_status_changed",
  KYC_STATUS_UPDATED: "kyc_status_updated",

  // Notifications
  NOTIFICATION: "notification",
} as const;

export type SocketEmitEvent =
  (typeof SOCKET_EMIT_EVENTS)[keyof typeof SOCKET_EMIT_EVENTS];
export type SocketListenEvent =
  (typeof SOCKET_LISTEN_EVENTS)[keyof typeof SOCKET_LISTEN_EVENTS];
