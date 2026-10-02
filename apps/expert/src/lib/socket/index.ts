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
  presenceSocket,
  presenceSocket as socket,
  connectExpertPresence,
  disconnectExpertPresence,
  emitPresenceHeartbeat,
} from "./presence.socket";
export { chatSocket } from "./chat.socket";
export { callSocket } from "./call.socket";
