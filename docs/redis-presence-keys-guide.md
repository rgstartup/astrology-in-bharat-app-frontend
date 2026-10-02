# Redis Presence Keys & Data Structures Reference

This document provides an in-depth reference for all Redis keys, data structures, TTL lifecycles, and operational significance used by the **Presence System** on **Astrology in Bharat**.

---

## 1. Summary of Redis Presence Keys

```typescript
export const PRESENCE_KEYS = {
  expertConnections: (expertId: number | string) =>
    `presence:expert:${expertId}:connections`,
  connection: (connectionId: string) =>
    `presence:connection:${connectionId}`,
  expertConsultation: (expertId: number | string) =>
    `presence:expert:${expertId}:consultation`,
  expertAvailability: (expertId: number | string) =>
    `presence:expert:${expertId}:availability`,
  expertLastStatus: (expertId: number | string) =>
    `presence:expert:${expertId}:last_status`,
} as const;
```

---

## 2. In-Depth Key Breakdown

### 1. `presence:expert:${expertId}:connections`
- **Redis Data Type:** `Sorted Set (ZSET)`
- **Member:** Socket Connection ID (e.g. `"s_abc123"`)
- **Score:** Expiration timestamp in milliseconds (`now + 30,000ms`)
- **TTL on Key:** 30 seconds (extended on each heartbeat)

#### Purpose & Significance:
- **Multi-Tab / Multi-Device Support**: Experts may open multiple browser tabs or log in via both desktop and mobile web.
- **Graceful Multi-Connection Tracking**:
  - When Tab 1 opens $\rightarrow$ adds `s_tab1` (active connections = 1, status = `online`).
  - When Tab 2 opens $\rightarrow$ adds `s_tab2` (active connections = 2).
  - When Tab 1 closes $\rightarrow$ removes `s_tab1` (active connections = 1, expert **remains online**).
  - When Tab 2 closes $\rightarrow$ removes `s_tab2` (active connections = 0 $\rightarrow$ status becomes `offline`).
- **Self-Cleaning Stale Entries**: Lua scripts query `ZREMRANGEBYSCORE` to remove dead connection IDs whose score is older than current server timestamp.

---

### 2. `presence:connection:${connectionId}`
- **Redis Data Type:** `String`
- **Value:** `expertId` string (e.g. `"105"`)
- **TTL on Key:** 30 seconds (`PRESENCE_TTL`)

#### Purpose & Significance:
- **Reverse Lookup & Fast Routing**: When a socket disconnects or sends a heartbeat, backend uses this key to instantly map the raw Socket ID back to the `expertId` in $O(1)$ time without searching sets.
- **Crash Detection & Auto-Expiry**:
  - The 10s heartbeat from the frontend refreshes this key's 30s TTL.
  - If a device abruptly loses power or crashes without sending a `disconnect` packet, this key automatically expires in 30 seconds, allowing the system to drop the dead socket connection automatically.

---

### 3. `presence:expert:${expertId}:consultation`
- **Redis Data Type:** `String` (JSON serialized object)
- **Value Structure:**
  ```json
  {
    "state": "busy",
    "consultationId": "cs_98412",
    "updatedAt": 1727878800000
  }
  ```
- **Lifecycle:** Created when a call/chat starts; deleted (`DEL`) when the session terminates.

#### Purpose & Significance:
- **Consultation Lock & Busy State**:
  - Forces the derived status to **`busy` 🟡** during an active session.
  - Prevents race conditions where multiple clients attempt to initiate simultaneous consultations with the same expert.
  - Discovery queries filter out busy experts from immediate availability pools.

---

### 4. `presence:expert:${expertId}:availability`
- **Redis Data Type:** `String`
- **Allowed Values:** `"available"` | `"unavailable"`
- **Lifecycle:** Populated on first read or update from PostgreSQL column `expert_accounts.availability_mode`.

#### Purpose & Significance:
- **High-Performance Toggle Cache**:
  - Reflects the expert's manual toggle switch (Online/Offline switch).
  - Serves millions of discovery and listing queries directly from Redis in sub-millisecond time without querying the PostgreSQL database.
  - Updated atomically via `PATCH /api/v1/expert/availability`.

---

### 5. `presence:expert:${expertId}:last_status`
- **Redis Data Type:** `String`
- **Allowed Values:** `"online"` | `"busy"` | `"offline"`
- **Lifecycle:** Updated every time `PresenceService` recomputes the derived status.

#### Purpose & Significance:
- **Event De-duplication & Broadcast Shield**:
  - When heartbeats tick every 10 seconds, `PresenceService` evaluates the status.
  - If the newly derived status is identical to `last_status` (e.g. `online` $\rightarrow$ `online`), the system suppresses duplicate WebSocket broadcasts and Redis Pub/Sub events.
  - Only when status transitions (e.g. `online` $\rightarrow$ `busy` or `online` $\rightarrow$ `offline`) does it publish `expert.presence.changed` to the network.

---

## 3. Summary Lifecycle Table

| Key Pattern | Redis Type | Write Trigger | Read Trigger | Expiration / Cleanup |
| :--- | :--- | :--- | :--- | :--- |
| `presence:expert:${id}:connections` | `ZSET` | Socket Connect / Heartbeat | Status evaluation / Disconnect | 30s TTL / `ZREMRANGEBYSCORE` |
| `presence:connection:${connId}` | `String` | Socket Connect / Heartbeat | Heartbeat / Disconnect | 30s TTL auto-expiry |
| `presence:expert:${id}:consultation` | `String` (JSON) | Call/Chat Start | Status evaluation / Discovery | `DEL` on Call/Chat End |
| `presence:expert:${id}:availability` | `String` | Toggle availability / DB Sync | Status evaluation / Discovery | Persistent (updated via REST) |
| `presence:expert:${id}:last_status` | `String` | Status transition | De-duplication check | Persistent |
