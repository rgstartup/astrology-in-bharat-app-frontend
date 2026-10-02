# Frontend Realtime Presence & Availability Architecture

## 1. Overview & Objectives

This document specifies the architecture, data flow, WebSocket lifecycle, Zustand state management, and component integration for **Realtime Expert Presence & Availability Tracking** in the Astrology in Bharat frontend client application.

The presence tracking system provides sub-second synchronization of astrologer/expert availability (`online`, `busy`, `offline`) across marketplace cards, explore filters, search results, individual expert detail pages, and consultation prep rooms without N+1 socket listeners or UI flickering.

> For a non-technical conceptual explanation with analogies, see [presence-tracking-layman-guide.md](file:///home/rgstartup/AIB/project/frontend/docs/presence-tracking-layman-guide.md).

---

## 2. Domain Model & Authoritative Status Derivation

The client-facing status is derived by the backend presence system from three independent states:

1. **Realtime Presence (`'online' | 'offline'`):** Ephemeral WebSocket connectivity in Redis.
2. **Availability Mode (`'available' | 'unavailable'`):** Persistent manual preference in PostgreSQL.
3. **Consultation State (`'idle' | 'busy'`):** Authoritative session state managed by the consultation domain.

### Authoritative Derivation Truth Table

| Ephemeral Realtime | Persistent Mode | Consultation State | Derived Client Status | `isAvailableForConsultation` |
| :----------------- | :-------------- | :----------------- | :-------------------- | :--------------------------- |
| `offline`          | `available`     | `idle`             | `offline`             | `false`                      |
| `offline`          | `available`     | `busy`             | `offline`             | `false`                      |
| `offline`          | `unavailable`   | `idle`             | `offline`             | `false`                      |
| `offline`          | `unavailable`   | `busy`             | `offline`             | `false`                      |
| `online`           | `available`     | `idle`             | **`online`**          | **`true`**                   |
| `online`           | `available`     | `busy`             | **`busy`**            | `false`                      |
| `online`           | `unavailable`   | `idle`             | `offline`             | `false`                      |
| `online`           | `unavailable`   | `busy`             | `offline`             | `false`                      |

---

## 3. Frontend Architecture & Modular Organization

```
frontend/apps/client/src/
├── lib/
│   ├── socket/                        # Modular Socket Engine
│   │   ├── config.ts                  # URLs, transports, reconnect options
│   │   ├── types.ts                   # ExpertClientStatus, event payloads, ACK types
│   │   ├── presence.socket.ts         # Root namespace socket & presence helpers
│   │   ├── chat.socket.ts             # /chat namespace socket
│   │   ├── merchant.socket.ts         # /merchant namespace socket
│   │   └── index.ts                   # Explicit tree-shakeable named exports
│   ├── socket.ts                      # DEPRECATED monolithic file
│   └── api-routes.ts                  # API_ROUTES (EXPERTS.LIST = '/experts')
├── store/
│   ├── presenceStore.ts               # Centralized Zustand presence map & subscriptions
│   └── expertListStore.ts             # Marketplace filter & pagination store
├── hooks/
│   └── useExpertPresence.ts           # Reactive presence selector hook
└── providers/
    └── ExpertStatusProvider.tsx       # Singleton root listener & reconnect rehydration
```

---

## 4. End-to-End Component & Data Flows

### Flow 1: Expert Global Broadcast & Centralized Store Sync

```mermaid
sequenceDiagram
    autonumber
    actor Expert as Astrologer Device
    participant GW as Backend PresenceGateway
    participant RootSock as presenceSocket (Client)
    participant Provider as ExpertStatusProvider
    participant Store as usePresenceStore
    participant Hooks as useExpertPresence
    participant UI as Cards / Badges

    Expert->>GW: Connect / Toggle Availability / Start Call
    GW->>RootSock: Broadcast 'expert.presence.changed' { expertId: 42, status: 'busy' }
    RootSock->>Provider: Singleton Event Trigger
    Provider->>Store: setExpertStatus(42, 'busy', timestamp)
    Store-->>Hooks: Reactive State Selector Update
    Hooks-->>UI: Re-render: isBusy = true, isOnline = false, badge = Amber
```

---

### Flow 2: Marketplace Discovery & Listing Presence Flow

Public expert listings use the `/experts` endpoint (via `API_ROUTES.EXPERTS.LIST`), seed initial statuses into `usePresenceStore`, and react to live socket updates:

```mermaid
flowchart TD
    A["User Navigates to /explore/experts or Home Grid"] --> B["Fetch /experts via api.get(API_ROUTES.EXPERTS.LIST)"]
    B --> C["API Returns Experts Array with { id, status, is_available }"]
    C --> D["usePresenceStore.getState().batchSetExpertStatus(data)"]
    D --> E["Render Expert Cards"]
    E --> F["Each Card calls useExpertPresence(expert.id)"]
    F --> G["Live Socket Broadcasts Update Store Map"]
    G --> H["Cards Automatically Re-render Without Page Refresh"]
```

---

### Flow 3: Dedicated Detail & Prep Page Targeted Room Subscription

When a user views a specific expert (`/consultants/[id]`, `/chat/prep/[id]`, `/call/prep/[id]`), `useExpertPresence` enables `autoSubscribe: true`:

```mermaid
sequenceDiagram
    autonumber
    actor User as Client User
    participant Prep as Chat / Call Prep Page
    participant Hook as useExpertPresence(id, { autoSubscribe: true })
    participant Store as usePresenceStore
    participant Sock as presenceSocket
    participant GW as Backend Gateway

    User->>Prep: Open Prep Page (/chat/prep/42)
    Prep->>Hook: Mount Hook with autoSubscribe: true
    Hook->>Store: subscribeToExpert(42)
    Store->>Sock: emit('subscribe_expert_presence', { expertId: 42 })
    Sock->>GW: Join Room expert_presence_42
    GW-->>Sock: ACK { expertId: 42, status: 'online' }
    Sock-->>Store: setExpertStatus(42, 'online')
    Store-->>Hook: Return { isOnline: true, isAvailableForConsultation: true }
    Prep-->>User: Enable "Start Chat" Button

    Note over User,GW: Expert Goes Offline During Form Fill
    GW->>Sock: 'expert.presence.changed' { expertId: 42, status: 'offline' }
    Sock->>Store: setExpertStatus(42, 'offline')
    Store-->>Hook: Return { isOnline: false, isAvailableForConsultation: false }
    Prep->>Prep: Disable Start Button & Show "Expert Offline" Modal

    User->>Prep: Unmount / Leave Page
    Hook->>Store: unsubscribeFromExpert(42)
    Store->>Store: Remove 42 from subscribedExpertIds
```

---

### Flow 4: Consultation State Transitions

```mermaid
stateDiagram-v2
    [*] --> Offline: Device disconnected / mode=unavailable
    Offline --> Online: Device connected & mode=available & idle
    Online --> Busy: Consultation Initiated (Chat/Call session ACTIVE)
    Busy --> Online: Consultation Terminated & Settled
    Busy --> Offline: Device Disconnected / Crash (30s TTL expiry)
    Online --> Offline: Tab Closed / Disconnected
```

---

### Flow 5: Disconnection & Reconnection Rehydration

```mermaid
sequenceDiagram
    autonumber
    participant Client as Client Browser
    participant Sock as presenceSocket
    participant Provider as ExpertStatusProvider
    participant Store as usePresenceStore
    participant GW as Backend Gateway

    Note over Client,GW: Client Network Drop / Sleep
    Sock->>Sock: Disconnect Event
    Note over Client,GW: Client Regains Network
    Sock->>Sock: 'connect' / 'reconnect'
    Sock->>Provider: Trigger handleConnectOrReconnect
    Provider->>Store: rehydrateSubscriptions()
    loop For each expertId in subscribedExpertIds
        Store->>Sock: emit('subscribe_expert_presence', { expertId })
        Sock->>GW: Join Room & Sync Fresh Status
        GW-->>Store: ACK { expertId, status }
    end
```

---

## 5. Components & Integration Reference

| Component / Hook | Role | Presence Source |
| :--- | :--- | :--- |
| `ExpertStatusProvider` | Root layout provider (singleton listener) | Listens to `expert.presence.changed`, dispatches to `usePresenceStore` |
| `presenceStore` | Global Zustand state store | Maintains `presenceMap` and `subscribedExpertIds` |
| `useExpertPresence` | Custom React hook | Reads from `usePresenceStore`, manages optional room subscriptions |
| `ExpertCard` | Home & general listing card | `useExpertPresence(id, { initialStatus: is_available })` |
| `ExploreExpertCard` | Marketplace exploration card | `useExpertPresence(expert.id, { initialStatus: expert.is_available })` |
| `useExpertDetails` | Expert public detail page logic | `useExpertPresence(expertId, { autoSubscribe: true })` |
| `chat/prep/[id]/page` | Pre-chat form & readiness screen | `useExpertPresence(id, { autoSubscribe: true })` |
| `call/prep/[id]/page` | Pre-call audio/video device test | `useExpertPresence(id, { autoSubscribe: true })` |
| `RecommendedExperts` | Dashboard recommended widget | Seeds `usePresenceStore` on initial fetch |

---

## 6. API Route Standards

- **Discovery Endpoint:** `GET /api/v1/experts` (`API_ROUTES.EXPERTS.LIST`)
- **Single Expert Endpoint:** `GET /api/v1/experts/:id` (`API_ROUTES.EXPERTS.ACCOUNT`)
- **Presence Direct Lookup:** `GET /api/v1/expert/presence/:id`
- **Deprecated Endpoint:** `GET /api/v1/expert/account/list` (Do not use).
