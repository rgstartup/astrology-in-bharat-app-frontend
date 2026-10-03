export { getBaseSocketUrl, defaultSocketOptions } from "./config";
export {
  ExpertClientStatus,
  type AvailabilityMode,
  type PresenceChangedEventPayload,
  type LegacyPresenceEventPayload,
  type HeartbeatAck,
  type ExpertFullAvailabilityResponse,
} from "./types";
export {
  SOCKET_EMIT_EVENTS,
  SOCKET_LISTEN_EVENTS,
  type SocketEmitEvent,
  type SocketListenEvent,
} from "./events";
export {
  getRootSocket,
  connectRootSocket,
  disconnectRootSocket,
  isRootSocketConnected,
} from "./core";
export {
  getPresenceSocket,
  emitPresenceHeartbeat,
  startPresenceHeartbeat,
  stopPresenceHeartbeat,
} from "./presence.socket";
export {
  getNotificationSocket,
  connectNotificationSocket,
  disconnectNotificationSocket,
} from "./notification.socket";
export {
  chatSocket,
  connectChatSocket,
  disconnectChatSocket,
} from "./chat.socket";
export {
  callSocket,
  connectCallSocket,
  disconnectCallSocket,
} from "./call.socket";
