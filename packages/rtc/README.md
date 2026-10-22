# `@repo/rtc` — headless real-time communication

Framework-agnostic voice/video session core with swappable provider adapters.
Ships **no UI components**: apps render their own controls from snapshot data.

Both provider SDKs (`twilio-video`, `agora-rtc-sdk-ng`) are bundled
dependencies of this package with **top-level imports** — import the
`./twilio` / `./agora` entrypoints from client code only (`"use client"`
components, never Server Components).

## Entries

| Entry | Contents |
| --- | --- |
| `@repo/rtc` | Core types, `RtcError`, env validation, `RtcAdapter` interface, `createRtcSession` |
| `@repo/rtc/devices` | `DeviceProvider` interface + `BrowserDeviceProvider` (mic/camera) |
| `@repo/rtc/twilio` | `TwilioAdapter` (phase 1: env validation + stub) |
| `@repo/rtc/agora` | `AgoraAdapter` (phase 1: env validation + stub) |
| `@repo/rtc/react` | `useRtcSession` headless hook |

## Usage

```ts
import { createRtcSession } from "@repo/rtc";
import { TwilioAdapter } from "@repo/rtc/twilio";
import { BrowserDeviceProvider } from "@repo/rtc/devices";

const adapter = new TwilioAdapter();
adapter.configure({});

const agora = new AgoraAdapter();
agora.configure({ appId: "YOUR_AGORA_APP_ID" });

const devices = new BrowserDeviceProvider();
const { granted, stream } = await devices.requestMedia("mic");
devices.releaseMedia(stream);

const session = createRtcSession(adapter);
session.subscribe((snapshot) => console.log(snapshot.phase));
// Token is minted by the app (Server Action + apiV2), never by this package.
await session.join({ roomName: "consult-1", identity: "client-42", kind: "voice", token });
```

```tsx
"use client";
import { useRtcSession } from "@repo/rtc/react";

const { snapshot, join, leave, mute, unmute } = useRtcSession({
  adapter, tokenProvider: () => fetchTokenSomehow(), roomName, identity, kind: "voice",
});
```

## Init options (explicit, no env)

The package never reads env. The app passes exactly what each SDK needs
to initiate; secrets stay server-side where room tokens are minted.

- Twilio: `adapter.configure({ edge? })` — client SDK
  needs nothing else; the room token arrives per join.
- Agora: `adapter.configure({ appId, mode?, codec? })`.
- Room token: required on every join —
  `session.join({ roomName, identity, kind, token })`.
  The app mints it via its own Server Action + `apiV2` and injects it
  (or a `RtcTokenProvider` callback in the React hook).

## Boundaries

- Media only. Chat stays on socket.io; correlate via `roomName` = consultation id.
- Tokens: app-owned. Package accepts `RtcTokenProvider` callback.
- Adapters fully wired: join/leave, mute/unmute, camera publish/release,
  device switching, participant + network-quality events, reconnect signals.
  Remote audio auto-plays (no DOM element needed); video tracks surface on
  `RtcParticipant.videoTrack` for the app to attach to its own `<video>`.
- Mobile later: implement `DeviceProvider` with Expo/Capacitor, no core changes.
