/**
 * Socket.io Emit & Listen Event Constants
 */

export const SOCKET_EMIT_EVENTS = {
  // Presence
  HEARTBEAT: "heartbeat",

  // Registration
  REGISTER_EXPERT: "register_expert",
  REGISTER_USER: "register_user",

  // Chat
  JOIN_ROOM: "join_room",
  LEAVE_ROOM: "leave_room",
  SEND_MESSAGE: "send_message",
  TYPING: "typing",
  END_CHAT: "end_chat",
  FORCE_END_ACTIVE_CHATS: "force_end_active_chats",

  // Call
  JOIN_CALL_ROOM: "join_call_room",
  CALL_OFFER: "call_offer",
  CALL_ANSWER: "call_answer",
  ICE_CANDIDATE: "ice_candidate",
  END_CALL: "end_call",
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

  // Notifications & Consultation Requests
  NEW_CHAT_REQUEST: "new_chat_request",
  NEW_CALL_REQUEST: "new_call_request",
  NEW_PUJA_REQUEST: "new_puja_request",
  NOTIFICATION: "notification",

  // Chat Lifecycle
  NEW_MESSAGE: "new_message",
  TYPING_STATUS: "typing_status",
  SESSION_ACTIVATED: "session_activated",
  SESSION_ENDED: "session_ended",

  // Call Lifecycle
  CALL_ACCEPTED: "call_accepted",
  CALL_ENDED: "call_ended",
} as const;

export type SocketEmitEvent =
  (typeof SOCKET_EMIT_EVENTS)[keyof typeof SOCKET_EMIT_EVENTS];
export type SocketListenEvent =
  (typeof SOCKET_LISTEN_EVENTS)[keyof typeof SOCKET_LISTEN_EVENTS];
