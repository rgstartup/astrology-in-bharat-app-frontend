# Expert Realtime Presence & Availability — Flows and Scenarios

This document outlines the complete architectural flows, state lifecycle, and edge-case scenarios for Experts on **Astrology in Bharat**.

---

## 1. Core State Model & Truth Table

An expert's client-facing status (`online`, `busy`, `offline`) is dynamically derived on the backend using three independent inputs:

1. **Realtime Presence** (`connected` | `disconnected`): Active WebSocket connection + valid 10s heartbeat in Redis (30s TTL).
2. **Availability Mode** (`available` | `unavailable`): Expert's manual toggle switch persisted in Postgres DB & cached in Redis.
3. **Consultation State** (`idle` | `busy`): Live chat or call session status in consultation domain.

### Status Derivation Matrix

| Realtime Presence | Availability Mode | Consultation State | Derived Client Status | Can Receive New Consultations? |
| :--- | :--- | :--- | :--- | :--- |
| **`connected`** | **`available`** | **`idle`** | 🟢 **`online`** | ✅ Yes |
| **`connected`** | **`available`** | **`busy`** | 🟡 **`busy`** | ❌ No (in active session) |
| **`connected`** | **`unavailable`** | **`busy`** | 🟡 **`busy`** | ❌ No (finishing active session) |
| **`connected`** | **`unavailable`** | **`idle`** | 🔴 **`offline`** | ❌ No (manual toggle OFF) |
| **`disconnected`** | *any* | *any* | 🔴 **`offline`** | ❌ No (no active socket/heartbeat) |

---

## 2. End-to-End Scenarios & Flow Diagrams

### Scenario A: Login & Socket Session Handshake

When an expert logs into the Expert App:

```mermaid
sequenceDiagram
    autonumber
    actor Expert
    participant App as Expert App (Frontend)
    participant Auth as Auth Store / Action
    participant GW as Backend PresenceGateway
    participant PS as PresenceService
    participant Redis as Redis Cache (TTL 30s)

    Expert->>App: Logs in with credentials / OTP / Google
    App->>Auth: expertLoginAction() -> HttpOnly Cookie set
    App->>App: Mounts ExpertPresenceProvider
    App->>Auth: getSocketTokenAction() -> retrieves JWT token
    App->>GW: WebSocket Handshake (auth: { token: JWT })
    GW->>GW: Verifies JWT payload (sub: expertId)
    GW->>GW: Joins socket to expert_${expertId}
    GW->>PS: presenceService.connect(expertId, socketId)
    PS->>Redis: Set presence:expert:${expertId}:presence = 'connected' (TTL 30s)
    PS->>GW: Broadcast 'expert.presence.changed'
    GW-->>App: Presence connected & acknowledged
    App->>GW: emit('heartbeat') every 10s
```

---

### Scenario B: Manual Availability Mode Toggle (ON / OFF)

When the expert clicks the status toggle switch in the dashboard header:

```mermaid
sequenceDiagram
    autonumber
    actor Expert
    participant Hook as useExpertAvailability Hook
    participant API as /api/v1/expert/availability (REST)
    participant PS as PresenceService
    participant PG as PostgreSQL DB
    participant Redis as Redis Cache
    participant GW as Backend PresenceGateway
    participant Clients as Client App Listeners

    Expert->>Hook: Clicks toggle switch (e.g. Go Online)
    Hook->>API: PATCH /expert/availability { mode: 'available' }
    API->>PS: setAvailability(expertId, 'available')
    PS->>PG: UPDATE expert_accounts SET availability_mode = 'available'
    PS->>Redis: SET presence:expert:${expertId}:availability = 'available'
    PS->>PS: deriveExpertClientStatus(...) => 'online'
    PS->>GW: Emit 'expert.presence.changed' { expertId, status: 'online' }
    GW-->>Clients: Broadcast to expert_${expertId} & expert_presence_${expertId}
    API-->>Hook: 200 OK { mode: 'available', status: 'online' }
    Hook->>Hook: Updates local UI state to Online (Green)
```

---

### Scenario C: Live Consultation Lifecycle (Idle $\rightarrow$ Busy $\rightarrow$ Idle)

When an expert accepts a consultation call or chat:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client
    actor Expert as Expert
    participant CS as Consultation Service
    participant PS as PresenceService
    participant GW as PresenceGateway

    User->>CS: Starts Call / Chat session
    CS->>PS: setBusy(expertId)
    PS->>PS: Updates Redis consultation state = 'busy'
    PS->>PS: deriveExpertClientStatus(...) => 'busy'
    PS->>GW: Broadcast 'expert.presence.changed' { status: 'busy' }
    GW-->>User: Expert badge updates to BUSY 🟡
    GW-->>Expert: Header status updates to BUSY

    Note over User,Expert: Live Consultation In Progress...

    User->>CS: Ends Call / Chat session
    CS->>PS: setIdle(expertId)
    PS->>PS: Updates Redis consultation state = 'idle'
    PS->>PS: deriveExpertClientStatus(...) => 'online' (if available)
    PS->>GW: Broadcast 'expert.presence.changed' { status: 'online' }
    GW-->>User: Expert badge updates to ONLINE 🟢
```

---

### Scenario D: Toggling Offline Mid-Consultation

If an expert finishes their shift and toggles their switch to **Offline** while in an active call:

1. **DB/Redis Updated:** `availability_mode` is updated to `'unavailable'`.
2. **Consultation Continues:** Active call/chat does **not** get interrupted or terminated.
3. **Status Stays `busy`:** While consultation is active, derived status remains `busy` (users see they are occupied).
4. **Session Ends:** When the call concludes, `consultationState` becomes `'idle'`. Since `availabilityMode` is `'unavailable'`, status drops directly to **`offline`** 🔴 without ever reverting to `online`.

---

### Scenario E: Tab Backgrounding, Sleep & Wakeup (Visibility Sync)

When mobile or desktop browsers suspend background tabs:

```mermaid
sequenceDiagram
    autonumber
    actor Expert
    participant App as Expert App
    participant GW as Backend PresenceGateway
    participant Redis as Redis Cache (TTL 30s)

    Note over App: Expert minimizes browser / locks device
    Note over Redis: 10s Heartbeat loop may pause in sleep mode
    Expert->>App: Unlocks device / Switches back to tab
    App->>App: 'visibilitychange' or 'focus' event fires
    App->>GW: Immediate emit('heartbeat')
    GW->>Redis: Refreshes TTL to 30s
    Note over Redis: Session stays active without dropping
```

---

### Scenario F: Browser Crash, Network Loss & Auto-Recovery

What happens if an expert loses internet connection or forcefully kills the app:

#### 1. Graceful Close (Tab / Window Closed)
- Browser closes WebSocket connection.
- Backend `PresenceGateway.handleDisconnect(client)` fires immediately.
- Calls `presenceService.disconnect(expertId, socket.id)`.
- Redis presence set to `'disconnected'` $\rightarrow$ Status immediately broadcasted as **`offline`** 🔴.

#### 2. Ungraceful Crash (Device Dies / Connection Drops Silently)
- Socket cannot send a disconnect packet.
- Redis key `presence:expert:${expertId}:presence` has a strict **30-second TTL**.
- Because no heartbeat was received in 10–20 seconds, Redis key naturally expires.
- Client queries and discovery APIs evaluate missing Redis presence as `disconnected` $\rightarrow$ Status becomes **`offline`** 🔴 within $\le 30$ seconds.

#### 3. Automatic Recovery
- Network restores $\rightarrow$ Socket automatically reconnects with auth token.
- Socket `connect` listener immediately emits `heartbeat`.
- Redis key recreated $\rightarrow$ Status automatically restored to **`online`** 🟢.

---

## 3. Frontend Architecture Summary (Expert App)

| Component / Hook | File | Responsibility |
| :--- | :--- | :--- |
| **Socket Suite** | [`src/lib/socket/`](file:///home/rgstartup/AIB/project/frontend/apps/expert/src/lib/socket/) | Authenticated root socket instance, event typings, named exports. |
| **Token Action** | [`src/actions/auth.ts`](file:///home/rgstartup/AIB/project/frontend/apps/expert/src/actions/auth.ts) | Reads HttpOnly cookie to supply token for socket handshake. |
| **Presence Provider** | [`src/providers/ExpertPresenceProvider.tsx`](file:///home/rgstartup/AIB/project/frontend/apps/expert/src/providers/ExpertPresenceProvider.tsx) | Global 10s heartbeat cycle, tab visibility and focus listeners. |
| **Availability Hook** | [`src/hooks/useExpertAvailability.ts`](file:///home/rgstartup/AIB/project/frontend/apps/expert/src/hooks/useExpertAvailability.ts) | State management for toggle, REST API integration, realtime presence listeners. |
| **API Client** | [`src/actions/api.ts`](file:///home/rgstartup/AIB/project/frontend/apps/expert/src/actions/api.ts) | Standardized `Result<T>` fetch client for expert application. |
