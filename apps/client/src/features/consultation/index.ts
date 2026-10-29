// Feature: consultation
//
// Organised per §13 Feature-Based Architecture with sub-domains:
//   room/          – room session components, hooks, utils
//   voice/         – voice session components, hooks, types
//   sidebar/       – consultation sidebar components
//   header/        – page header components
//   session/       – session dock components, types
//   session-summary/ – post-session summary components
//   media-staging/ – media connection staging components, types
//   message-area/  – chat message area components, types
//   root/          – root-level components
//   stories/       – Storybook stories (not exported)
//   index.ts       – feature public API (explicit named exports, tree-shake friendly)

/// Sub-domains
export * as Room from "./room";
export * as Voice from "./voice";
export * as Sidebar from "./sidebar";
export * as Header from "./header";
export * as Session from "./session";
export * as SessionSummary from "./session-summary";
export * as MediaStaging from "./media-staging";
export * as MessageArea from "./message-area";
export * as Root from "./root";
